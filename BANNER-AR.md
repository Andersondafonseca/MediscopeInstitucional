# Mediscope — banner Web AR

Experience: `https://mediscope.com.br/banner` (also works on the existing www alias).

This is an isolated static application. The institutional React app, dependencies,
source files, homepage and domain configuration are not replaced.

## Publish the real video

Add the approved MP4 as **`public/banner/1.mp4`** and deploy this repository.
The browser requests `/banner/1.mp4`. No unrelated institutional video is used
as a substitute. Until this file exists, the page explicitly reports that the
video is unavailable; image tracking remains testable.

Recommended encoding: MP4 with H.264, yuv420p, AAC audio if needed, and fast-start
metadata. Keep resolution/file size reasonable for mobile event connectivity.
The video loops, pauses when the artwork leaves view, and resumes on recognition.
Sound is off until the visitor taps **Ativar som**.

`/banner?setup` reveals a local-file video test. Selecting a video there does not
upload or publish anything. It only creates an object URL on that device.

## Reference and alignment

Reference supplied by Anderson: vertical hospital artwork, 768 x 1536.
Tracking uses its centered square crop `(x=0, y=384, width=768, height=768)`,
compiled at 512 x 512. The original image's center and width are preserved:
full artwork = a centered 1 x 2 plane in MindAR anchor coordinates.
The compiled marker contains 2,847 matching feature points. This is a build
metric, not a guarantee of tracking quality on every physical print/device.

`CONFIG.fit` in `public/banner/index.html` defaults to `contain`, preserving the
video's aspect ratio. `cover` fills the artwork and crops the video; neither
option stretches it. Printed overlays, glare, folds, large angle or darkness
can reduce recognition. Frame the hospital area, not just the dark sky/footer.

## Build and assets

Normal `npm run build` remains unchanged. Vercel appends:

```sh
node tools/banner/build.mjs
```

The script downloads a pinned runtime bundle and verifies SHA-256 before writing
only `dist/banner/`. A failure aborts the new deployment, keeping the previously
published deployment live. The application uses MindAR 1.2.5 and Three.js 0.160.0;
MIT license files are shipped in `/banner/vendor/`.

The asset bundle is stored in the account's Higgsfield media storage and fetched
ONLY at build time. Runtime libraries, reference, marker and video are served
from this Vercel project, not from third-party CDNs on visitors' phones.
For an entirely local/reproducible build, download the exact bundle URL in
`tools/banner/build.mjs` and save it as `tools/banner/runtime-v1.json`.
SHA-256: `4c5fe951dfad193221da808570b954fb4f354bb8a53093de78be16d2878c52c4`.
The uploaded image was re-encoded by media storage without changing dimensions
or framing; the matching target and display reference are derived from it.

`/banner/build-info.json` reports the marker configuration and whether `1.mp4`
was present at build time. This route is static, not an administration endpoint.

## Privacy and browser requirements

Camera access starts only after the visitor taps the button and accepts the
browser permission. No microphone, geolocation, analytics or camera uploads are
requested by this page. Recognition runs on the device. Video playback requires
opening the URL first; an arbitrary printed image cannot by itself launch this
page from the phone's normal camera. A QR code can link to `/banner`.

Use HTTPS. Test Safari on iPhone and Chrome on Android. In-app social browsers
may require opening the page in the system browser. On exit, tab hiding or page
navigation the camera stream is stopped. Reopening uses a fresh page to release
MindAR listeners/resources cleanly. A pinned camera adapter preserves browser
permission errors and closes late-arriving streams after cancellation.

## Acceptance checklist before using the physical banner

1. Open `/banner` on actual iPhone and Android devices and grant camera access.
2. Point at the physical print at different distances and modest angles.
3. With the real `1.mp4`, confirm alignment, image quality, playback and audio.
4. Remove/reintroduce the banner: the video must hide/pause and resume.
5. Deny permission, switch tabs, rotate the phone and retry; no abandoned camera.
6. Confirm the homepage and other existing institutional routes remain intact.

Automated/synthetic-camera tests do not replace checking the actual printed
banner and the approved video on physical devices.
