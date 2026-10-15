# M Souq Rewards

A Vue 3 / TypeScript / Vite loyalty card site. Customers collect **3 stamps for a free gift** (cleaning pens, smart bands, earbuds and more). Purchase eligibility and the current gift selection are confirmed in store.

## Experience

- `/`: introduction, how it works, gifts, questions
- `/join/`: create a card with just a name
- `/card/`: the customer's card with stamp progress (tap it to flip over and stand it upright as a tall card with the checkout QR code), and activity as a stamp slip
- `/staff/`: staff checkout. Look up a card by scanning its code or typing its 8-digit number, add one stamp per checkout, undo the last change, and confirm gift redemption. Redeeming uses all three stamps and starts the next card at zero.

`/login/` redirects to `/card/` and `/staff/login/` redirects to `/staff/`.

## Data

The card (name, card number, stamps, activity) lives in a reactive store (`src/store.ts`) persisted to `localStorage`, and stays in sync across open tabs. There is no backend yet: a card exists only in the browser that created it, and staff lookup matches against that same browser's card. If storage is blocked, the card page shows a notice.

## Run locally

Use Node.js 22.13 or newer, then run from this directory:

```sh
npm install
npm run dev
```

```sh
npm run typecheck
npm run lint
npm run build
npm run preview
```

## Design notes

- Fonts: Bricolage Grotesque (display), Geist (body), Geist Mono (card numbers), loaded from Google Fonts in `index.html`.
- Colour and type tokens are defined at the top of `src/style.css`.
- The card component (`src/components/LoyaltyCard.vue`) scales with container query units and tilts gently under a mouse pointer. Reduced-motion preferences disable all animation.

## Deployment

The static production build is in `dist/`. For Netlify, set base directory `site`, build command `npm run build`, and publish directory `dist`. `public/_redirects` supplies the SPA fallback; other hosts need an equivalent fallback to `index.html`. For subdirectory hosting, set `base` in `vite.config.ts`. Navigation and the QR code URL use that base.
