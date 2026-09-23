# NUVO — AI E-Commerce + Personal Shopping Assistant

A full front-end e-commerce demo with an AI shopping assistant ("Nova") built in React.
No backend, no database, no build step — everything runs in the browser.

## What's included

```
index.html        the app shell (loads React + Babel + your styles/script)
css/style.css      all styling (light/dark theme, responsive layout)
js/app.js          the entire app logic (catalog, cart, checkout, AI chat)
```

A second file, **`nuvo-shopping-assistant.html`** (in the parent folder you downloaded this
from), is the same app bundled into a single self-contained file — open that one directly
if you don't want to deal with the `index.html` / `css` / `js` split.

## Features

- **Product catalog** — 24 products across Electronics, Fashion, Home & Living and
  Accessories, with search, a filter sidebar (price range, rating) and sorting.
  Cards show "% off" and "Bestseller" badges.
- **Product detail modal**, quantity picker, add-to-cart.
- **Cart drawer** — quantity controls, remove, subtotal, free-shipping threshold.
- **Notifications** — a bell icon in the header with a dropdown of order and offer
  updates and an unread badge.
- **Checkout flow** — shipping → **payment (Card / UPI / Net Banking / Cash on
  Delivery, each with its own fields)** → review → confirmation with a generated
  order ID.
- **Invoice** — "Download invoice" on the confirmation screen and in order history
  generates a real invoice file (HTML, print-to-PDF ready).
- **Order history** — past orders are listed under the header's "N past orders" /
  footer "Track your order" link, each re-downloadable as an invoice.
- **Persistent "backend"** — when opened as a published Claude Artifact, orders and
  notifications are saved to Claude's built-in per-user `db` capability (a real
  server-side document store, not just the browser), so your order history follows
  your account across devices. Falls back to `localStorage` automatically outside
  that environment.
- **Nova, the AI shopping assistant** — a chat panel that can search the catalog,
  recommend products, and add items to the cart on the shopper's behalf using
  tool-calling.

## Running it

Because `index.html` loads `js/app.js` as an external file, most browsers block that
with a CORS error if you just double-click `index.html` (the `file://` restriction).
Two easy ways around that:

**Option A — just use the single-file version.** Double-click
`nuvo-shopping-assistant.html` (outside this folder) — no server needed.

**Option B — run a tiny local server** for the split `index.html` version:

```bash
cd nuvo-project
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

(Any static server works — `npx serve`, VS Code's "Live Server" extension, etc.)

## About the AI chat, orders, and invoices

Nova's brain is Claude, and the order/notification "backend" is Claude's built-in
`db` capability. Both call `window.claude.use(...)`, a set of runtime abilities
that's provided automatically **when this page is opened as a published Claude
Artifact** (the `claude.ai/artifact/...` link you were given). Opened that way,
chat, cart tool-calls, persisted order history, and the invoice file download all
work live, with no API key or server needed from you.

If you instead run these files completely standalone (double-clicking the HTML, or
hosting it on GitHub Pages, Vercel, etc. with no Claude runtime behind it),
`window.claude` won't exist, and the chat panel will say so rather than fail silently
— the rest of the store (browsing, cart, checkout) still works normally.

To wire Nova up to your own backend instead (for a fully standalone deployment), you'd
add a small server endpoint that calls the Claude API (see
https://docs.claude.com/en/api/overview) with your own API key, and point the app's
`sendChat` function at that endpoint instead of `window.claude.use("sample")`. Keep the
API key server-side — never ship it inside client-side JavaScript.

## Tech stack

- React 18 (UMD build, no npm install needed)
- Babel Standalone (in-browser JSX transform)
- Plain CSS (custom properties for theming, no framework)
- No backend — catalog data is hard-coded in `js/app.js`

## Customizing

- **Products**: edit the `PRODUCTS` array at the top of `js/app.js`.
- **Colors/fonts**: edit the CSS custom properties (`:root`) at the top of `css/style.css`.
- **Assistant persona/behavior**: edit `SYSTEM_TEXT` inside `js/app.js`.
