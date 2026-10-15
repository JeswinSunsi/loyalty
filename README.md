# M Souq Rewards design preview

This is a Vue 3 and Vite design preview of the M Souq loyalty experience, written with TypeScript and Vue single-file components. Vue Router handles navigation, Tailwind CSS handles styling, and Lucide supplies the icons. It has a landing page, join and customer sign-in screens, a customer card, staff sign-in, and a staff checkout screen. The name preview stays only in the current browser tab. Staff marks work only in browser memory. No account, database, login code, camera access, or real reward is created.

Routes: `/`, `/join/`, `/login/`, `/card/`, `/staff/login/`, `/staff/`.

The shared rewards card has a foil finish that responds to mouse or touch movement. On touch devices, **Enable phone tilt** starts device-orientation effects and requests motion permission where required. Phone tilt requires a supported browser and a secure context (HTTPS or localhost). If motion access is denied or no sensor data arrives, touch interaction remains available. Reduced-motion preferences disable animated effects. Check the tilt interaction on a physical phone before release; desktop previews cannot validate real sensor behavior.

## Run locally

Use Node.js 22.13 or newer. From this directory:

```sh
npm install
npm run dev
```

Open the local address printed by Vite (usually `http://127.0.0.1:5173`).

```sh
npm run typecheck # Check TypeScript and Vue templates
npm run lint      # Check TypeScript and Vue source
npm run build     # Type-check and generate dist/
npm run preview   # Serve the production build locally
```

## Later Netlify deployment

The production build is a static single-page app. Set the site base directory to `site`, build command to `npm run build`, and publish directory to `dist`. The included `public/_redirects` file is copied to the build and provides Netlify's SPA fallback so opening or refreshing `/card/` and `/staff/` works. On other hosts, configure an equivalent fallback to `index.html` for application routes, while serving assets normally. Deployment is not connected here.

Vite's default base is `/`. If hosting in a subdirectory, set `base` in `vite.config.ts`; navigation and the demo QR target use that base automatically. Browser-visible environment variables must use the `VITE_` prefix and must never contain secrets.

Before using this as a real loyalty system, add a secure customer identity flow, staff authentication, persistent storage, and real QR scanning. The demo QR code only opens the staff preview.
