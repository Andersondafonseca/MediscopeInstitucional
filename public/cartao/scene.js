import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Rendering-only demonstration. Nothing in this module reads patient data.
export async function createHologram() {
  const gltf = await new GLTFLoader().loadAsync('/cartao/assets/avatar.glb');
  const root = new THREE.Group(); root.name = 'MediscopeHologram';
  const anatomy = gltf.scene; root.add(anatomy);
  const surface = anatomy.getObjectByName('BodySurface');
  const skeleton = anatomy.getObjectByName('Skeleton');
  const heart = anatomy.getObjectByName('Heart');
  const lungs = anatomy.getObjectByName('Lungs');
  if (!surface || !skeleton || !heart) throw new Error('O modelo 3D está incompleto.');
  const resources = new Set();
  const uniforms = { uTime: {value:0}, uReveal: {value:1.9}, uDim: {value:1} };
  surface.material.dispose();
  surface.material = new THREE.ShaderMaterial({
    uniforms, transparent:true, depthWrite:false, side:THREE.DoubleSide,
    blending:THREE.AdditiveBlending,
    vertexShader:`varying vec3 vN; varying vec3 vV; varying vec3 vP;
      void main(){ vec4 mv=modelViewMatrix*vec4(position,1.0); vN=normalize(normalMatrix*normal); vV=-mv.xyz; vP=position; gl_Position=projectionMatrix*mv; }`,
    fragmentShader:`uniform float uTime; uniform float uReveal; uniform float uDim; varying vec3 vN; varying vec3 vV; varying vec3 vP;
      void main(){ float rim=pow(1.0-abs(dot(normalize(vN),normalize(vV))),2.1);
      float scan=pow(max(0.0,sin(vP.y*245.0-uTime*2.0)),14.0);
      float sweep=exp(-pow((vP.y-mod(uTime*.23,2.05))/.036,2.0));
      float reveal=1.0-smoothstep(uReveal-.025,uReveal+.025,vP.y);
      float a=(.024+rim*.43+scan*.07+sweep*.16)*reveal*uDim;
      gl_FragColor=vec4(mix(vec3(.025,.48,.95),vec3(.46,.98,1.0),rim+scan*.15),a); }`
  });
  const wire = new THREE.Mesh(surface.geometry,new THREE.MeshBasicMaterial({color:0x34cafa,wireframe:true,transparent:true,opacity:.042,depthWrite:false,blending:THREE.AdditiveBlending}));
  wire.name='SurfaceTopology'; anatomy.add(wire);
  skeleton.material = new THREE.MeshStandardMaterial({color:0xc5f7ff,emissive:0x24647a,emissiveIntensity:.9,roughness:.5,transparent:true,opacity:.78});
  if(lungs){ lungs.material.transparent=true; lungs.material.opacity=.11; lungs.material.depthWrite=false; }
  const mixer = new THREE.AnimationMixer(anatomy);
  for(const clip of gltf.animations) mixer.clipAction(clip).play();
  root.add(new THREE.HemisphereLight(0xc7f5ff,0x103756,2.1));
  const key=new THREE.DirectionalLight(0xa9f8ff,2.6); key.position.set(-1,2,3);root.add(key);
  const fill=new THREE.PointLight(0x047df9,5,5);fill.position.set(.8,1.4,-.5);root.add(fill);

  function glowTexture(){
    const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');
    const g=x.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(135,249,255,.8)');g.addColorStop(.17,'rgba(26,190,255,.45)');g.addColorStop(.5,'rgba(10,125,255,.12)');g.addColorStop(1,'rgba(0,90,240,0)');x.fillStyle=g;x.fillRect(0,0,128,128);
    const t=new THREE.CanvasTexture(c);resources.add(t);return t;
  }
  const glow=glowTexture();
  const base=new THREE.Mesh(new THREE.PlaneGeometry(1.08,1.08),new THREE.MeshBasicMaterial({map:glow,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide}));base.rotation.x=-Math.PI/2;base.position.y=.004;root.add(base);
  const rings=[];
  for(let i=0;i<4;i++){
    const r=new THREE.Mesh(new THREE.TorusGeometry(.26+i*.049,.0018+(i===0?.001:0),6,100,i===2?Math.PI*1.65:Math.PI*2),new THREE.MeshBasicMaterial({color:i===0?0xb8fcff:0x29cff7,transparent:true,opacity:.8,blending:THREE.AdditiveBlending,depthWrite:false}));
    r.rotation.x=Math.PI/2;r.position.y=.009+i*.002;root.add(r);rings.push(r);
  }
  const halo=new THREE.Sprite(new THREE.SpriteMaterial({map:glow,color:0xff386d,transparent:true,opacity:.46,depthWrite:false,blending:THREE.AdditiveBlending}));halo.position.copy(heart.position);halo.position.z+=.035;halo.scale.set(.23,.23,.23);root.add(halo);
  const count=140,positions=new Float32Array(count*3),seeds=[];
  for(let i=0;i<count;i++){const angle=i*2.399963,r=.08+.32*((i*37%139)/139);seeds.push([Math.cos(angle)*r,Math.sin(angle)*r,(i*19%137)/137]);}
  const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(positions,3));
  const particles=new THREE.Points(pg,new THREE.PointsMaterial({color:0x66eaff,size:.008,transparent:true,opacity:.52,depthWrite:false,blending:THREE.AdditiveBlending}));root.add(particles);

  function rounded(ctx,x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r);}
  function panel(x,y,w,h,kind){
    const canvas=document.createElement('canvas');canvas.width=640;canvas.height=Math.round(640*h/w);const ctx=canvas.getContext('2d');
    const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=2;resources.add(texture);
    const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,side:THREE.DoubleSide,toneMapped:false}));
    mesh.position.set(x,y,.045);root.add(mesh);return{canvas,ctx,texture,mesh,kind};
  }
  const panels=[panel(-.56,1.33,.43,.36,'fc'),panel(-.56,.87,.43,.29,'spo2'),panel(.56,1.34,.45,.46,'heart')];
  const enlarged=heart.clone(true);enlarged.name='HeartDetail';enlarged.position.set(.56,1.34,.1);enlarged.scale.setScalar(1.6);root.add(enlarged);
  const connectorMat=new THREE.LineBasicMaterial({color:0x52dcf7,transparent:true,opacity:.53});
  const lines=[[[.06,1.32,.05],[.28,1.48,.05],[.34,1.48,.045]],[[-.07,1.3,.05],[-.26,1.4,.045],[-.34,1.4,.045]],[[-.06,1.13,.05],[-.27,.91,.045],[-.34,.91,.045]]];
  for(const p of lines)root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(p.map(v=>new THREE.Vector3(...v))),connectorMat));
  function paint(p,t){
    const {ctx:x,canvas:c,kind}=p,W=c.width,H=c.height;x.clearRect(0,0,W,H);
    const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,'rgba(7,31,47,.94)');g.addColorStop(1,'rgba(3,15,29,.85)');rounded(x,5,5,W-10,H-10,28);x.fillStyle=g;x.fill();x.strokeStyle='rgba(106,227,255,.65)';x.lineWidth=3;x.stroke();
    x.textAlign='left';x.fillStyle='#95ddeb';x.font='500 30px system-ui,sans-serif';
    if(kind==='fc'){
      x.fillText('FREQUÊNCIA CARDÍACA',38,65);x.fillStyle='#f5fdff';x.font='600 123px system-ui,sans-serif';x.fillText('72',35,211);x.fillStyle='#70dce9';x.font='30px system-ui,sans-serif';x.fillText('bpm',218,205);
      const y=H*.68;x.strokeStyle='rgba(56,148,175,.23)';x.lineWidth=1;for(let a=38;a<W-30;a+=34){x.beginPath();x.moveTo(a,y-65);x.lineTo(a,y+50);x.stroke();}
      x.beginPath();x.strokeStyle='#54f0ff';x.lineWidth=4;
      for(let a=38;a<W-32;a++){const phase=((a/165+t*1.2)%1);const e=Math.exp(-Math.pow((phase-.18)/.035,2))*.12-Math.exp(-Math.pow((phase-.39)/.016,2))*.25+Math.exp(-Math.pow((phase-.43)/.016,2))*1.05-Math.exp(-Math.pow((phase-.48)/.02,2))*.4+Math.exp(-Math.pow((phase-.72)/.065,2))*.21;const b=y-e*66;a===38?x.moveTo(a,b):x.lineTo(a,b);}x.stroke();
    }else if(kind==='spo2'){
      x.fillText('SATURAÇÃO · SpO₂',38,65);x.fillStyle='#f5fdff';x.font='600 120px system-ui,sans-serif';x.fillText('98',35,204);x.font='46px system-ui,sans-serif';x.fillText('%',219,200);
      rounded(x,38,H-95,W-76,13,6);x.fillStyle='#173c51';x.fill();rounded(x,38,H-95,(W-76)*.98,13,6);x.fillStyle='#36e3f3';x.fill();
    }else{
      x.fillText('CORAÇÃO',38,67);x.font='25px system-ui,sans-serif';x.fillStyle='#75baca';x.fillText('SISTEMAS CONECTADOS',38,112);x.font='26px system-ui,sans-serif';x.fillStyle='#b8e6ef';x.fillText('Visualização ilustrativa',38,H-89);
    }
    x.font='21px system-ui,sans-serif';x.fillStyle='#73aabc';x.fillText('DADOS SIMULADOS',38,H-35);p.texture.needsUpdate=true;
  }
  panels.forEach(p=>paint(p,0));
  let start=0,lastPaint=-1,focus=false;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  return {
    root,
    reveal(t){start=t;},
    focusHeart(value){focus=value;},
    update(dt,t){
      const age=Math.max(0,t-start),fade=reduced?1:THREE.MathUtils.smoothstep(age,.05,1.8);
      uniforms.uTime.value=reduced?3:t;uniforms.uReveal.value=reduced?1.9:Math.min(1.9,age*.67);uniforms.uDim.value=focus?.32:1;
      skeleton.material.opacity=fade*(focus?.22:.78);wire.material.opacity=fade*(focus?.018:.042);
      if(!reduced)mixer.update(Math.min(dt,.05));
      const pulse=reduced?1:1+.11*Math.pow(Math.max(0,Math.sin(t*Math.PI*2*1.2)),9);enlarged.scale.setScalar(1.6*pulse);halo.material.opacity=fade*(focus?.65:.4)*pulse;
      rings.forEach((r,i)=>{if(!reduced)r.rotation.z=t*(i%2?-.13:.1);r.material.opacity=fade*.8;});
      for(let i=0;i<count;i++){const s=seeds[i];positions[i*3]=s[0];positions[i*3+1]=reduced?s[2]*1.75:((s[2]+t*.075)%1)*1.75;positions[i*3+2]=s[1];}pg.attributes.position.needsUpdate=true;
      for(const p of panels)p.mesh.material.opacity=fade;
      if(t-lastPaint>.12){panels.forEach(p=>paint(p,reduced?0:t));lastPaint=t;}
    },
    dispose(){
      mixer.stopAllAction();mixer.uncacheRoot(anatomy);
      root.traverse(o=>{if(o.geometry)resources.add(o.geometry);if(o.material)for(const m of Array.isArray(o.material)?o.material:[o.material]){resources.add(m);if(m.map)resources.add(m.map);}});
      resources.forEach(r=>r.dispose?.());root.clear();
    }
  };
}
