# M Souq Rewards

A Vue 3 / TypeScript / Vite loyalty card site. Customers collect **3 stamps for a free gift** (cleaning pens, smart bands, earbuds and more). Purchase eligibility and the current gift selection are confirmed in store.

## Experience

- `/`: introduction, how it works, gifts, questions
- `/join/`: create a card with just a name
- `/card/`: the customer's card, a progress bar ("1 more stamp to get your free gift"), recent activity, and a **Show my code** button that opens the checkout QR code in a dialog
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

This branch carries the **Classic** theme: a familiar retail look meant to read easily for every age, following common older-adult usability guidance and mainstream loyalty-app patterns.

- One font, Inter (Google Fonts, `index.html`), in sentence case. Body text is 18px; muted text keeps at least 7:1 contrast on white.
- One deep blue for actions and amber only for the gift. Tokens are at the top of `src/style.css`.
- Large rectangular buttons with text labels and 48px+ tap targets. No hidden gestures, carousels or rotated elements.
- Progress is stated in words and shown as a bar, Starbucks-style ("2 of 3 stamps · 1 more stamp to get your free gift").
- The checkout code opens from an explicit button in a native `<dialog>` (`src/components/CodeDialog.vue`), with Escape, backdrop and Done all closing it.
- Phones get one column; wider screens (860px+) get a normal two-column site layout.
- The card component (`src/components/LoyaltyCard.vue`) is a plain membership card that scales with container query units. Reduced-motion preferences disable all animation.

## Deployment

The static production build is in `dist/`. For Netlify, set base directory `site`, build command `npm run build`, and publish directory `dist`. `public/_redirects` supplies the SPA fallback; other hosts need an equivalent fallback to `index.html`. For subdirectory hosting, set `base` in `vite.config.ts`. Navigation and the QR code URL use that base.
