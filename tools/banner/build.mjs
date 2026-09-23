/**
 * Add a self-contained /banner directory AFTER the normal Vite build.
 * No third-party network requests are made by visitors: the runtime, marker,
 * reference and video are served by the existing Vercel deployment.
 * A SHA-256-pinned asset bundle is fetched only at build time. For an offline
 * build, put that exact bundle at tools/banner/runtime-v1.json.
 */
import { readFile, writeFile, mkdir, copyFile, stat, cp } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const output = resolve(root, 'dist/banner');
const bundleUrl = 'https://d2ol7oe51mr4n9.cloudfront.net/user_3IqOaaNu4mtsp2EPjuknEeNjvbj/8b027da1-0ba4-479f-9418-bc5644995cc1.json';
const expectedSha256 = '4c5fe951dfad193221da808570b954fb4f354bb8a53093de78be16d2878c52c4';
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
const videoPresent = await stat(resolve(output, '1.mp4')).then(s => s.size > 0).catch(() => false);
const marker = JSON.parse(await readFile(resolve(output, 'runtime-info.json'), 'utf8'));
const status = {
  application: 'Mediscope Banner AR', version: '1.0.0',
  route: '/banner', videoPath: '/banner/1.mp4', videoPresent,
  matchingPoints: marker.matchingPoints,
  trackingReference: marker.reference,
  assetBundleSha256: actual,
};
await writeFile(resolve(output, 'build-info.json'), JSON.stringify(status, null, 2) + '\n');
console.log('[banner] READY', JSON.stringify(status));
if (!videoPresent) console.warn('[banner] 1.mp4 is not provided yet. Image tracking works; video playback is pending.');
