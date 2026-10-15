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

This branch carries the **Souq** theme: a market stall at golden hour, kept easy to read and use for everyone.

- Palette: warm sand and paper, deep peacock teal for anything you press, terracotta for stamps, marigold for the gift. Tokens are at the top of `src/style.css`.
- Type: Young Serif for headlines, Figtree for everything else (Google Fonts, `index.html`). Body text is 18px, in sentence case.
- Motifs from the market: a scalloped striped awning under the header (and over the closing "stall" and the code dialog), round arches (`src/components/ArchStage.vue`), an eight-point star tile (`src/components/StarMark.vue` and the `--tile` pattern), and a gift shelf of arched niches with hanging price tags.
- The card (`src/components/LoyaltyCard.vue`) is teal card stock with a star-tile ground; each stamp lands as a terracotta star, the gift as a marigold one. It scales with container query units.
- UX stays plain: progress in words plus a bar ("2 of 3 stamps · 1 more stamp to get your free gift"), and the checkout code opens from a clearly labelled **Show my code** button in a native `<dialog>` (`src/components/CodeDialog.vue`), closed by Escape, the backdrop or Done.
- Phones get one column; wider screens (900px+) get a two-column layout. Reduced-motion preferences disable all animation.

## Deployment

The static production build is in `dist/`. For Netlify, set base directory `site`, build command `npm run build`, and publish directory `dist`. `public/_redirects` supplies the SPA fallback; other hosts need an equivalent fallback to `index.html`. For subdirectory hosting, set `base` in `vite.config.ts`. Navigation and the QR code URL use that base.
