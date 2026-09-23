/**
 * Add a self-contained /banner directory AFTER the normal Vite build.
 * No third-party network requests are made by visitors: the runtime, marker,
 * reference and video are served by the existing Vercel deployment.
 * SHA-256-pinned assets are fetched only at build time. For an offline build,
 * provide tools/banner/runtime-v1.json and public/banner/1.mp4 locally.
 */
import { readFile, writeFile, mkdir, copyFile, stat, cp } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const output = resolve(root, 'dist/banner');
const bundleUrl = 'https://d2ol7oe51mr4n9.cloudfront.net/user_3IqOaaNu4mtsp2EPjuknEeNjvbj/8b027da1-0ba4-479f-9418-bc5644995cc1.json';
const expectedSha256 = '4c5fe951dfad193221da808570b954fb4f354bb8a53093de78be16d2878c52c4';
// Anderson's 1.mp4, supplied on 2026-09-23. The upload mirror remuxes the
// container only; decoded video frames and encoded audio were verified equal.
// A future public/banner/1.mp4 takes precedence over this build-time mirror.
const approvedVideo = Object.freeze({
  url: 'https://d2ol7oe51mr4n9.cloudfront.net/user_3IqOaaNu4mtsp2EPjuknEeNjvbj/35a655af-0249-42c4-9707-e8cb33e0fddf.mp4',
  sha256: 'e33b6abeb8f68849f9cba4506fd0c29775d4360b1a8c88076f2c34361d2f0a0e',
  bytes: 6187715,
});
const required = new Set([
  'vendor/mindar/mindar-image-three.prod.js',
  'vendor/mindar/controller-mGt1s8dJ.js',
  'vendor/mindar/ui-fBadYuor.js',
  'vendor/three/build/three.module.js',
  'vendor/three/examples/jsm/renderers/CSS3DRenderer.js',
  'vendor/MINDAR-LICENSE.txt', 'vendor/THREE-LICENSE.txt',
  'target.jpg', 'target.mind', 'reference-original.jpg', 'runtime-info.json',
]);

let bytes;
try {
  bytes = await readFile(resolve(root, 'tools/banner/runtime-v1.json'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
  let failure;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(bundleUrl, { signal: AbortSignal.timeout(45000) });
      if (!response.ok) throw new Error(`AR asset request returned HTTP ${response.status}`);
      bytes = Buffer.from(await response.arrayBuffer());
      break;
    } catch (error) {
      failure = error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }
  if (!bytes) throw failure;
}
const actual = createHash('sha256').update(bytes).digest('hex');
if (actual !== expectedSha256) throw new Error('AR asset integrity check failed. Deployment aborted.');
const bundle = JSON.parse(bytes.toString('utf8'));
if (bundle.version !== 1 || Object.keys(bundle.files || {}).length !== required.size) {
  throw new Error('Unexpected AR asset manifest.');
}
await mkdir(output, { recursive: true });
await cp(resolve(root, 'public/banner'), output, { recursive: true });
for (const name of required) {
  const encoded = bundle.files[name];
  if (typeof encoded !== 'string') throw new Error(`Missing AR asset: ${name}`);
  const destination = resolve(output, name);
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, Buffer.from(encoded, 'base64'));
}
await copyFile(resolve(root, 'src/assets/medislogo-white.png'), resolve(output, 'logo.png'));

const videoPath = resolve(output, '1.mp4');
const localVideoPresent = await stat(videoPath).then(s => s.isFile() && s.size > 0).catch(error => {
  if (error.code === 'ENOENT') return false;
  throw error;
});
if (!localVideoPresent) {
  let videoBytes;
  let failure;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(approvedVideo.url, { signal: AbortSignal.timeout(45000) });
      if (!response.ok) throw new Error(`Banner video request returned HTTP ${response.status}`);
      const downloaded = Buffer.from(await response.arrayBuffer());
      const hash = createHash('sha256').update(downloaded).digest('hex');
      if (downloaded.length !== approvedVideo.bytes || hash !== approvedVideo.sha256) {
        throw new Error('Banner video integrity check failed. Deployment aborted.');
      }
      videoBytes = downloaded;
      break;
    } catch (error) {
      failure = error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }
  if (!videoBytes) throw failure;
  await writeFile(videoPath, videoBytes);
}
const publishedVideo = await readFile(videoPath);
const videoPresent = publishedVideo.length > 0;
if (!videoPresent) throw new Error('Banner video is empty. Deployment aborted.');
const marker = JSON.parse(await readFile(resolve(output, 'runtime-info.json'), 'utf8'));
const status = {
  application: 'Mediscope Banner AR', version: '1.0.1',
  route: '/banner', videoPath: '/banner/1.mp4', videoPresent,
  videoBytes: publishedVideo.length,
  videoSha256: createHash('sha256').update(publishedVideo).digest('hex'),
  matchingPoints: marker.matchingPoints,
  trackingReference: marker.reference,
  assetBundleSha256: actual,
};
await writeFile(resolve(output, 'build-info.json'), JSON.stringify(status, null, 2) + '\n');
console.log('[banner] READY', JSON.stringify(status));
