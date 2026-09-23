const $=id=>document.getElementById(id);
const debug={version:'1.0.0',state:'idle',foundCount:0,tracked:false,renderedFrames:0};
window.__MEDISCOPE_CARTAO__=debug;
let state='idle',generation=0,runtime=null,tracked=false,frontal=false,focused=false;
const setState=s=>{state=s;debug.state=s;};
function stopRuntime(){
  const r=runtime;runtime=null;tracked=false;debug.tracked=false;
  if(r){
    try{r.renderer?.setAnimationLoop(null);}catch{}
    try{r.ar?.stop();}catch{}
    for(const v of $('stage').querySelectorAll('video')){v.srcObject?.getTracks().forEach(t=>t.stop());v.srcObject=null;}
    r.stream?.getTracks().forEach(t=>t.stop());
    r.controls?.dispose();r.hologram?.dispose();
    if(r.card){r.card.geometry.dispose();r.card.material.map?.dispose();r.card.material.dispose();}
    r.resize && window.removeEventListener('resize',r.resize);
    try{r.renderer?.dispose();r.renderer?.forceContextLoss();}catch{}
    if(r.targetUrl)URL.revokeObjectURL(r.targetUrl);
  }
  $('stage').replaceChildren();
}
function errorMessage(error){
  if(error?.name==='NotAllowedError'||error?.name==='PermissionDeniedError')return 'A câmera não foi autorizada. Você pode liberar a permissão nas configurações do navegador ou explorar o avatar em 3D, sem câmera.';
  if(error?.name==='NotFoundError')return 'Não encontramos uma câmera disponível. A visualização 3D funciona sem câmera.';
  if(error?.name==='NotReadableError')return 'A câmera está em uso ou indisponível. Feche outro aplicativo que esteja usando a câmera e reabra esta página.';
  if(error?.name==='SecurityError')return 'Abra o endereço diretamente no Safari ou no Chrome do celular, usando HTTPS.';
  return error?.message||'Não foi possível iniciar. Confira sua conexão e reabra a página.';
}
function showError(message,title='Vamos tentar de outro jeito.'){
  generation++;stopRuntime();setState('error');$('busy').hidden=true;$('hud').hidden=true;
  $('error-title').textContent=title;$('error-text').textContent=message;$('error').hidden=false;
  $('error').querySelector('a').focus();
}
function status(){
  if(state==='preview'){$('status').textContent='EXPLORAR EM 3D';$('scanner').hidden=true;$('hint').textContent='Arraste para girar. Use dois dedos para aproximar. A anatomia é ilustrativa.';return;}
  $('status').textContent=tracked?'CARTÃO RECONHECIDO':'ENQUADRE O CARTÃO INTEIRO';$('scanner').hidden=tracked;
  $('hint').textContent=tracked?'Mova o celular suavemente ao redor do cartão. O holograma acompanha a arte.':'Mantenha o cartão inteiro no enquadramento, bem iluminado e sem reflexos. Depois incline-o suavemente.';
}
function beginUI(mode){
  document.body.classList.add('mode-active');document.body.classList.toggle('mode-ar',mode==='ar');
  $('stage').hidden=false;$('hud').hidden=false;$('orientation').hidden=mode!=='ar';
  $('busy').hidden=true;$('exit').focus();
}
async function start(mode){
  if(state!=='idle')return;
  if(mode==='ar'&&!window.isSecureContext)return showError('Use o endereço HTTPS: www.mediscope.com.br/cartao.');
  if(mode==='ar'&&!navigator.mediaDevices?.getUserMedia)return showError('A câmera não está disponível neste navegador. Abra o endereço no Safari ou Chrome do celular. Você também pode usar o modo 3D.');
  setState('loading');const session=++generation;$('busy').hidden=false;
  $('start-ar').disabled=$('start-3d').disabled=true;
  const alive=()=>generation===session;
  const r={};runtime=r;let timer;
  try{
    const initialize=async()=>{
      const [THREE,{createHologram}]=await Promise.all([import('three'),import('/cartao/scene.js')]);
      if(!alive())return;
      r.hologram=await createHologram();if(!alive()){r.hologram.dispose();return;}
      $('stage').hidden=false;
      if(mode==='preview'){
        const {OrbitControls}=await import('three/addons/controls/OrbitControls.js');if(!alive())return;
        r.renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
        r.renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.6));r.renderer.outputColorSpace=THREE.SRGBColorSpace;
        r.renderer.setClearColor(0x000000,0);$('stage').appendChild(r.renderer.domElement);
        r.scene=new THREE.Scene();r.scene.add(r.hologram.root);
        r.camera=new THREE.PerspectiveCamera(36,innerWidth/innerHeight,.01,100);
        r.controls=new OrbitControls(r.camera,r.renderer.domElement);r.controls.target.set(0,.93,0);r.controls.enableDamping=true;r.controls.enablePan=false;r.controls.minDistance=1.7;r.controls.maxDistance=9;r.controls.minPolarAngle=.25;r.controls.maxPolarAngle=1.68;
        r.resize=()=>{const w=$('stage').clientWidth,h=$('stage').clientHeight;r.camera.aspect=w/h;r.camera.updateProjectionMatrix();r.renderer.setSize(w,h);};
        r.resize();window.addEventListener('resize',r.resize);
        const d=Math.max(2.35/(2*Math.tan(Math.PI/10)),1.85/(2*Math.tan(Math.PI/10)*r.camera.aspect));r.camera.position.set(0,1.27,d);r.controls.update();
        const tex=await new THREE.TextureLoader().loadAsync('/cartao/assets/card.jpg');if(!alive()){tex.dispose();return;}
        tex.colorSpace=THREE.SRGBColorSpace;r.card=new THREE.Mesh(new THREE.PlaneGeometry(1.28,.8),new THREE.MeshBasicMaterial({map:tex,side:THREE.DoubleSide}));r.card.rotation.x=-Math.PI/2;r.card.position.y=-.003;r.scene.add(r.card);
        setState('preview');beginUI(mode);status();
      }else{
        $('busy-text').textContent='Preparando o reconhecimento. A câmera será solicitada em instantes.';
        const [{MindARThree},response]=await Promise.all([import('mindar-image-three'),fetch('/cartao/assets/card.mind')]);
        if(!alive())return;
        if(!response.ok||response.headers.get('content-type')?.includes('text/html'))throw new Error('O reconhecimento do cartão não carregou. Confira a conexão e reabra a página.');
        const bytes=await response.arrayBuffer();if(bytes.byteLength<1000)throw new Error('O arquivo de reconhecimento está incompleto.');
        const engine=window.MINDAR?.IMAGE?.tf;
        if(!engine||!await engine.setBackend('webgl'))throw new Error('A aceleração gráfica não está disponível. Tente o navegador atualizado do celular.');
        await engine.ready();if(!alive())return;
        r.targetUrl=URL.createObjectURL(new Blob([bytes],{type:'application/octet-stream'}));
        class CardAR extends MindARThree{
          async _startVideo(){
            const stream=await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:{ideal:'environment'},width:{ideal:1280},height:{ideal:720}}});
            if(!alive()){stream.getTracks().forEach(t=>t.stop());throw new DOMException('Cancelado','AbortError');}
            r.stream=stream;const video=document.createElement('video');this.video=video;video.autoplay=true;video.muted=true;video.playsInline=true;video.setAttribute('playsinline','');video.setAttribute('webkit-playsinline','');video.style.position='absolute';video.style.top='0';video.style.left='0';this.container.appendChild(video);
            await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(new Error('A câmera não enviou imagens. Reabra a experiência.')),18000);video.addEventListener('loadedmetadata',()=>{clearTimeout(timeout);video.width=video.videoWidth;video.height=video.videoHeight;resolve();},{once:true});video.addEventListener('error',()=>{clearTimeout(timeout);reject(new Error('Não foi possível ler a câmera.'));},{once:true});video.srcObject=stream;});
            if(!alive()){stream.getTracks().forEach(t=>t.stop());throw new DOMException('Cancelado','AbortError');}await video.play();
          }
        }
        r.ar=new CardAR({container:$('stage'),imageTargetSrc:r.targetUrl,maxTrack:1,uiLoading:'no',uiScanning:'no',uiError:'no',filterMinCF:.001,filterBeta:.01,warmupTolerance:5,missTolerance:8});
        r.renderer=r.ar.renderer;r.scene=r.ar.scene;r.camera=r.ar.camera;
        r.renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.6));r.renderer.outputColorSpace=THREE.SRGBColorSpace;r.renderer.setClearColor(0x000000,0);
        r.hologram.root.scale.setScalar(.62);r.hologram.root.rotation.x=Math.PI/2;r.hologram.root.position.z=.012;
        const anchor=r.ar.addAnchor(0);anchor.group.add(r.hologram.root);
        anchor.onTargetFound=()=>{if(!alive()||document.hidden)return;tracked=true;debug.tracked=true;debug.foundCount++;r.hologram.reveal(performance.now()/1000);status();};
        anchor.onTargetLost=()=>{if(!alive())return;tracked=false;debug.tracked=false;status();};
        $('busy-text').textContent='Permita a câmera e aponte para o cartão inteiro.';
        await r.ar.start();if(!alive()){try{r.ar.stop();}catch{}r.stream?.getTracks().forEach(t=>t.stop());return;}
        setState('ar');beginUI(mode);status();
      }
      const canvas=r.renderer.domElement;canvas.setAttribute('aria-label','Avatar holográfico médico ilustrativo');canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();if(alive())showError('O navegador interrompeu a visualização 3D. Reabra a experiência para liberar a memória.');},{once:true});
      let last=performance.now()/1000;r.hologram.reveal(last);
      r.renderer.setAnimationLoop(()=>{if(!alive())return;const t=performance.now()/1000;const dt=t-last;last=t;r.controls?.update();r.hologram.update(dt,t);r.renderer.render(r.scene,r.camera);debug.renderedFrames++;});
    };
    await Promise.race([initialize(),new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('O carregamento demorou mais que o esperado. Confira a conexão e a permissão da câmera.')),60000);})]);
  }catch(error){if(alive())showError(errorMessage(error));}
  finally{clearTimeout(timer);}
}
$('start-ar').addEventListener('click',()=>void start('ar'));
$('start-3d').addEventListener('click',()=>void start('preview'));
$('cancel').addEventListener('click',()=>{generation++;stopRuntime();location.replace('/cartao');});
$('exit').addEventListener('click',()=>{generation++;stopRuntime();location.replace('/cartao');});
$('heart-focus').addEventListener('click',()=>{focused=!focused;runtime?.hologram?.focusHeart(focused);$('heart-focus').setAttribute('aria-pressed',String(focused));$('heart-focus').textContent=focused?'Mostrar todos os sistemas':'Destacar coração';});
$('orientation').addEventListener('click',()=>{frontal=!frontal;if(runtime?.hologram){runtime.hologram.root.rotation.x=frontal?0:Math.PI/2;runtime.hologram.root.position.y=frontal?-.26:0;}$('orientation').textContent=frontal?'Avatar sobre o cartão':'Avatar frontal';});
window.addEventListener('pagehide',()=>{generation++;stopRuntime();setState('stopped');});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&(state==='ar'||state==='loading'||state==='preview'))showError('A experiência foi pausada ao sair desta tela. A câmera foi desligada. Reabra para continuar.','Experiência pausada');});
if(new URLSearchParams(location.search).get('modo')==='3d')void start('preview');
