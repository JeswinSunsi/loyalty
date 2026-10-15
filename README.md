# M Souq Rewards

A Vue 3 / TypeScript / Vite interactive demo. Collect **3 stamps for a free gift**: cleaning pens, smart bands, earbuds, and more. Purchase eligibility and the current gift selection are confirmed in store.

The experience includes a rewards introduction, name-only card creation, a returning-card screen, a customer card with an enlarged checkout code and activity history, and staff checkout. Staff can add one stamp per checkout action, undo their last change, and confirm gift redemption. Redeeming uses all three stamps and starts the next card at zero.

## Demo boundaries

The customer card, stamp balance, and recent activity share a reactive store and persist in `sessionStorage` in the current browser tab. Refreshing retains progress; closing the tab ends the demo session. Storage failures are handled with an on-screen notice. No backend, real account, SMS, staff authentication, payment validation, or real reward is connected. The QR code opens the staff demo; it does not identify a customer across devices. The demo never asks for a phone number or passcode.

Routes: `/`, `/join/`, `/login/`, `/card/`, `/staff/login/`, `/staff/`.

## Run locally

Use Node.js 22.13 or newer, then run from this directory:

```sh
npm install
npm run dev
```

Open the local address printed by Vite.

```sh
npm run typecheck
npm run lint
npm run build
npm run preview
```

The foil finish responds to mouse or touch movement. **Enable phone tilt** requests motion permission when needed. Tilt needs a supported browser and HTTPS or localhost. Touch interaction is available when sensor access is unavailable. Reduced-motion preferences disable animated effects. Real device sensor behavior needs checking on a physical phone.

## Deployment

The static production build is in `dist/`. For Netlify, set base directory `site`, build command `npm run build`, and publish directory `dist`. `public/_redirects` supplies the SPA fallback; other hosts need an equivalent fallback to `index.html` for application routes. Deployment is not connected here.

Vite's default base is `/`. For subdirectory hosting, set `base` in `vite.config.ts`. Navigation and the demo QR URL use that base. Browser-visible environment variables must use `VITE_` and must not contain secrets.
