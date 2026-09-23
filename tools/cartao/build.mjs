/** Install the isolated business-card experience after the existing banner build. */
import {readFile,writeFile,mkdir,cp,copyFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const output=resolve(root,'dist/cartao');
const url='https://d2ol7oe51mr4n9.cloudfront.net/user_3IqOaaNu4mtsp2EPjuknEeNjvbj/a96ad10a-1465-458d-90c5-7ea15d429fb7.json';
const expected='dac1a3894de6282b6de1e3d23deace17de1973f05546a6a05188a6f9a57a00c2';
const required=new Set(['assets/avatar.glb','assets/card.jpg','assets/card.mind','assets/model-info.json','assets/tracking-info.json','assets/model-source.txt','vendor/three/examples/jsm/loaders/GLTFLoader.js','vendor/three/examples/jsm/utils/BufferGeometryUtils.js','vendor/three/examples/jsm/controls/OrbitControls.js','source/make-avatar.mjs']);
let bytes;
try{bytes=await readFile(resolve(root,'tools/cartao/runtime-v1.json'));}catch(error){
  if(error.code!=='ENOENT')throw error;
  let failure;
  for(let i=0;i<3;i++){
    try{const res=await fetch(url,{signal:AbortSignal.timeout(45000)});if(!res.ok)throw new Error(`Card assets HTTP ${res.status}`);bytes=Buffer.from(await res.arrayBuffer());break;}
    catch(e){failure=e;await new Promise(r=>setTimeout(r,1000*(i+1)));}
  }
  if(!bytes)throw failure;
}
if(createHash('sha256').update(bytes).digest('hex')!==expected)throw new Error('Card asset integrity check failed. Deployment aborted.');
const bundle=JSON.parse(bytes.toString('utf8'));
if(bundle.version!==1||Object.keys(bundle.files||{}).length!==required.size)throw new Error('Invalid card asset manifest.');
await mkdir(output,{recursive:true});
await cp(resolve(root,'public/cartao'),output,{recursive:true});
await cp(resolve(root,'dist/banner/vendor'),resolve(output,'vendor'),{recursive:true});
await copyFile(resolve(root,'dist/banner/logo.png'),resolve(output,'logo.png'));
for(const name of required){
  if(typeof bundle.files[name]!=='string')throw new Error(`Missing card asset: ${name}`);
  const dest=resolve(output,name);await mkdir(dirname(dest),{recursive:true});await writeFile(dest,Buffer.from(bundle.files[name],'base64'));
}
const model=await readFile(resolve(output,'assets/avatar.glb'));
if(model.toString('utf8',0,4)!=='glTF'||model.readUInt32LE(4)!==2||model.readUInt32LE(8)!==model.length)throw new Error('Invalid card GLB.');
const tracking=JSON.parse(await readFile(resolve(output,'assets/tracking-info.json'),'utf8'));
const info={application:'Mediscope Card AR',version:'1.0.0',route:'/cartao',modelBytes:model.length,modelSha256:createHash('sha256').update(model).digest('hex'),assetBundleSha256:expected,tracking,simulatedDataOnly:true,physicalDeviceAcceptance:'Pending testing against the printed card on real iPhone and Android devices.'};
await writeFile(resolve(output,'build-info.json'),JSON.stringify(info,null,2)+'\n');
console.log('[cartao] READY',JSON.stringify(info));
