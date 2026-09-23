# Mediscope — cartão WebAR

Route: https://www.mediscope.com.br/cartao (the destination already printed in the QR).

This is an isolated static application in public/cartao. The institutional React
application, homepage, dependencies and public/banner remain unchanged.

## Experience

- Image tracking recognizes the entire supplied business card, not the QR alone.
- A real GLB human avatar with internal stylized structures and an animated heart.
- Cyan rim/scanline shading, holographic platform, particles and three clinical HUD panels.
- All indicators explicitly display simulated demonstration data (72 bpm / 98%).
- Heart highlight and a frontal/standing orientation toggle.
- Orbit/zoom 3D viewing without camera; useful when permission is denied.
- vCard and WhatsApp actions using the contact details printed on the supplied card.
- Camera starts only after the AR button and browser permission; no microphone,
  geolocation, analytics, patient records or camera uploads. Tracks are stopped
  on cancellation, navigation, tab hiding or errors. Re-entry uses a fresh page.

This is a marketing visualization, not a patient-specific digital twin or medical
monitor. Internal structures are stylized and must not be used for anatomy
instruction, diagnosis, clinical measurements or interpretation.

## Build

The Vercel build runs the existing npm run build and tools/banner/build.mjs,
then tools/cartao/build.mjs. The card build writes only dist/cartao. Its pinned
asset bundle is fetched at build time, verified with SHA-256 and decoded using a
fixed filename allowlist. Missing/modified assets abort the new deployment.
All runtime files are served by the existing Vercel project; visitors do not
fetch libraries or models from Higgsfield/CDNs.

Bundle: https://d2ol7oe51mr4n9.cloudfront.net/user_3IqOaaNu4mtsp2EPjuknEeNjvbj/a96ad10a-1465-458d-90c5-7ea15d429fb7.json
SHA-256: dac1a3894de6282b6de1e3d23deace17de1973f05546a6a05188a6f9a57a00c2
A byte-identical tools/cartao/runtime-v1.json is supported for an offline build
(the banner has its own documented offline bundle).

The compiled target has 1,959 matching points. This build metric is NOT a
promise of tracking stability on physical devices. The full card is normalized
to 960 x 600 for tracking. The model is 2,537,596 bytes and contains approximately
140,486 triangles. Limit pixel ratio to 1.6; no post-processing bloom is used.

MindAR 1.2.5 and Three.js 0.160.0 are reused from the existing pinned banner
runtime. MIT notices are included in /cartao/vendor. The human exterior uses
MakeHuman hm08, whose source explicitly releases the mesh as CC0 (September
2020). The original notice and source URL are retained in assets/model-source.txt.
The body pose, internal illustrative structures and heart animation are prepared
by source/make-avatar.mjs in the asset bundle. That generator expects the original
MakeHuman OBJ at assets/body-source.obj and Three.js 0.160.0. Node FileReader
polyfill is included for GLB export. No paid 3D model is required.

## Physical acceptance (not replaced by synthetic-camera tests)

1. Open /cartao in Safari on iPhone and Chrome on Android.
2. Grant camera access, frame the entire physical card in good light and tilt it
   gently; test distance, moderate angles, glare and recognition after loss.
3. Check the hologram origin, standing/frontal toggle, pulse and panel readability.
4. Deny camera permission and use the 3D fallback. Test touch orbit and pinch zoom.
5. Hide/reopen the tab, exit and retry. Confirm the camera indicator switches off.
6. Verify saved contact and WhatsApp destination before distributing widely.
7. Confirm the homepage and /banner are unaffected.

The page's read-only __MEDISCOPE_CARTAO__ object provides state, tracked flag,
foundCount and renderedFrames for browser tests. It does not contain imagery,
patient data, credentials or a privileged command interface.
