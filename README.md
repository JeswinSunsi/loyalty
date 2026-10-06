# M Souq Rewards design preview

This is a static design preview of the M Souq loyalty experience. It has a landing page, join and customer sign-in screens, a customer card, staff sign-in, and a staff checkout screen. The name preview stays only in the current browser tab. Staff marks work only in browser memory. No account, database, login code, camera access, or real reward is created.

Routes: `/`, `/join/`, `/login/`, `/card/`, `/staff/login/`, `/staff/`.

## Run locally

From this directory:

```sh
npm install
npm run dev
```

Open the local address printed by Next.js. Run `npm run build` to generate a static site in `out/`.

## Later Netlify deployment

The app uses Next.js static export, so it can be hosted as static files. When you decide to deploy, set the site base directory to `site`, build command to `npm run build`, and publish directory to `out`. Deployment is not configured or connected here.

Before using this as a real loyalty system, add a secure customer identity flow, staff authentication, persistent storage, and real QR scanning. The demo QR code only opens the staff preview.
