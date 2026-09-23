/** Install the approved, immutable /cartao release after the existing Vite/banner build.
 * Runtime assets are served by this Vercel deployment, never a third-party CDN.
 * An offline mirror can be placed at tools/cartao/runtime-v1.json.
 */
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const release=JSON.parse(await readFile(resolve(root,'tools/cartao/release.json'),'utf8'));
const output=resolve(root,'dist/cartao');
let bytes;
try {bytes=await readFile(resolve(root,'tools/cartao/runtime-v1.json'));}
catch(error) {
 if(error.code!=='ENOENT')throw error;
 let failure;
 for(let attempt=0;attempt<3;attempt++){
  try {
   const response=await fetch(release.url,{signal:AbortSignal.timeout(45000)});
   if(!response.ok)throw new Error(`Cartao asset request returned HTTP ${response.status}`);
   bytes=Buffer.from(await response.arrayBuffer());break;
  }catch(error){failure=error;await new Promise(r=>setTimeout(r,1000*(attempt+1)));}
 }
 if(!bytes)throw failure;
}
if(bytes.length!==release.bytes || createHash('sha256').update(bytes).digest('hex')!==release.sha256){
 throw new Error('Cartao release integrity check failed. Production deployment aborted.');
}
const bundle=JSON.parse(bytes.toString('utf8'));
if(bundle.version!==1 || bundle.application!=='mediscope-cartao' || !bundle.files){
 throw new Error('Invalid Cartao release manifest.');
}
const files=Object.entries(bundle.files);
if(files.length!==release.files)throw new Error('Unexpected Cartao file count.');
const required=['index.html','app.js','engine.js','tracker.js','glb.js','math.js','config.js','style.css','assets/avatar.glb','assets/card.jpg','assets/target.jpg','assets/target.json','assets/cartao.mind','vendor/mindar-image.prod.js','vendor/manifest.json','build-info.json'];
for(const name of required)if(typeof bundle.files[name]!=='string')throw new Error(`Missing Cartao asset: ${name}`);
const marker=JSON.parse(Buffer.from(bundle.files['assets/target.json'],'base64').toString('utf8'));
if(marker.compiled!==true || marker.bytes!==Buffer.from(bundle.files['assets/cartao.mind'],'base64').length){
 throw new Error('Cartao image target has not been compiled.');
}
const vendor=JSON.parse(Buffer.from(bundle.files['vendor/manifest.json'],'base64').toString('utf8'));
if(vendor.selfHosted!==true)throw new Error('Cartao runtime must be self-hosted.');
const avatar=Buffer.from(bundle.files['assets/avatar.glb'],'base64');
if(avatar.toString('utf8',0,4)!=='glTF' || createHash('sha256').update(avatar).digest('hex')!==release.avatarSha256){
 throw new Error('The approved avatar has changed.');
}
await mkdir(output,{recursive:true});
for(const [name,encoded] of files){
 if(!/^[a-zA-Z0-9_./-]+$/.test(name) || name.split('/').some(p=>p==='..'||p==='.'))throw new Error('Unsafe Cartao asset path.');
 const dest=resolve(output,name);
 if(!dest.startsWith(output+sep) || typeof encoded!=='string')throw new Error('Invalid Cartao asset.');
 await mkdir(dirname(dest),{recursive:true});
 await writeFile(dest,Buffer.from(encoded,'base64'));
}
const status=JSON.parse(await readFile(resolve(output,'build-info.json'),'utf8'));
status.releaseSha256=release.sha256;
status.gitCommit=process.env.VERCEL_GIT_COMMIT_SHA||null;
await writeFile(resolve(output,'build-info.json'),JSON.stringify(status,null,2)+'\n');
console.log('[cartao] READY',JSON.stringify({route:'/cartao',compiledMarker:marker.compiled,matchingPoints:marker.matchingPoints,avatarBytes:avatar.length,selfHosted:true,files:files.length,gitCommit:status.gitCommit}));
