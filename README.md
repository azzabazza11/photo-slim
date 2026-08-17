# Photo Slim

Shrink gallery photos on your phone so they’re actually sendable: smaller **pixels** and smaller **files**.

Nothing is uploaded. Encoding happens in the browser.

## Live

**https://azzabazza11.github.io/photo-slim/**

## Local

```bash
cd photo-slim
python3 -m http.server 8080
```

Open **http://localhost:8080/** in Chrome.

## What the knobs mean

- **Pixels / image size** — width × height. A 12 MP phone photo is often ~4000×3000. Scaling the long edge down is the big win for sending.
- **File size** — bytes on disk (JPEG quality). Same pixels can be 400 KB or 4 MB.

Presets: **Chat** (1600 px), **Email** (2048 px), **Screen** (1080 px), **File only** (keep pixels, tighter JPEG), **Custom**.

Tap a photo for a wipe before/after. Share the smaller copies, or download / share a zip. Drive is available from the Android share sheet — there is no Google login in the app.

## PWA / share into the app

Photo Slim **is** a PWA. Install it from Chrome (**Install** / Add to Home screen).

**Android:** after install, Photos / Files → Share → **Photo Slim** drops those images into the app. This uses the Web Share Target API. It does **not** work from a normal Chrome tab, and **iOS does not support** receiving shares into a PWA.

**Share out** (the smaller photos or a zip) works from the installed app via the system share sheet.

## Android

1. Open the Pages URL in **Chrome**
2. Tap **Install** (or menu → Add to Home screen)
3. Stuck on an old build? tap **Reload**

Version: **1.1.2**
