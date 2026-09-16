# Bella's Takoyaki — ordering site

A single-page ordering site for Bella's Takoyaki, Baler. Customers build a
basket, then send it to you on Messenger. No database, no payment gateway, no
backend — everything lives in two config files you can edit yourself.

Built with Next.js 15 (App Router), React 19, Tailwind CSS v4, Zustand,
Framer Motion and lucide-react. Deploys free on Vercel.

---

## 1. Run it locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

To check the production build before deploying:

```bash
npm run build
npm start
```

---

## 2. Finish your details — `lib/business.ts`

Your GCash number, Facebook Page and Baler location are already in. Four things
are still marked `FILL THIS IN` in [`lib/business.ts`](lib/business.ts):

| Field | What to put | Site behaviour until you fill it |
| --- | --- | --- |
| `gcash.accountName` | The name shown when someone sends to your GCash. | The "Account name" line is hidden; the number still shows. |
| `address.street` | Your exact stall address. | Only "Baler, Aurora" shows, and the street is left out of the Google structured data. |
| `address.serviceArea` | Pickup only? Delivery radius? Which riders? | Falls back to "Message us on Facebook for directions and delivery." |
| `hours.display` + `hours.schema` | Your opening hours, twice: `display` is the text on screen, `schema` is what Google reads. Keep them saying the same thing. | Falls back to "Message us on Facebook for today's hours." |

Nothing here shows a placeholder to a customer — each unset field degrades to a
sensible line instead. The site is safe to deploy right now.

Two optional fields that unlock features:

- **`messengerPageId`** — your numeric Page ID or username (Page → About → Page
  transparency → Page ID). Without it, checkout opens your Facebook Page and the
  customer taps *Message* themselves. With it, they land straight in the chat.
- **`whatsappNumber`** — international format, digits only, no `+`
  (e.g. `639757373297`). **Left empty, every WhatsApp button is hidden
  automatically** — the cart, contact grid, How to Order copy and chat bot all
  adjust on their own. Add a number and they all appear. No other file changes.

Also update **`siteUrl`** after your first deploy so link previews work.

---

## 3. Edit the menu — `lib/menu.ts`

Every price, name, photo and badge on the site comes from
[`lib/menu.ts`](lib/menu.ts) — your real 18 items across five categories.

### ⚠️ Three prices to verify first

Your source menu flagged three 5-piece prices as guesses. Every other item
follows the same ladder — the 8pc is about **1.6×** the 5pc, and the 16pc is
about **2.4×** the 8pc. Checked against that:

| Item | Flagged price | Verdict |
| --- | --- | --- |
| Cheesy Garlic Beef 5pc | ₱110 | ✅ Fits (₱175 ÷ 1.6 = ₱109) and mirrors Tuna Melt exactly. Almost certainly right. |
| Pork Cheesebomb 5pc | ₱125 | ✅ Fits (₱200 ÷ 1.6 = ₱125). Looks right. |
| **Octo Veggies 5pc** | **₱95** | ⚠️ **Breaks the ladder.** ₱135 ÷ 1.6 = ₱85. Either the 5pc should be ₱85, or the 8pc should be ₱152. Check your board. |

One more that wasn't flagged but is worth a glance: **Pork Cheesebomb 16pc is
₱420**, while Chicken Cheesebomb — identical at 5pc and 8pc — is **₱480**.
Might be intentional, might be a typo.

I left all prices exactly as you gave them. Nothing was silently changed.

**Change a price** — edit one number:

```ts
{ id: "8pcs", label: "8 pcs", price: 110 },   // ← change 110
```

**Mark something sold out for the day** — flip one flag. The card greys out and
its button disables automatically:

```ts
available: false,
```

**Add a new item** — copy an existing block, change the `id` (must be unique),
and drop its photo into `public/images/`:

```ts
{
  id: "new-item",                       // unique, lowercase, no spaces
  name: "New Item",
  description: "One appetising sentence.",
  basePrice: 60,                        // matches the cheapest variant
  image: "/images/new-item.webp",
  badge: "New",                         // "Bestseller" | "New" | omit entirely
  variants: [                           // omit if there's only one size
    { id: "4pcs", label: "4 pcs", price: 60 },
    { id: "8pcs", label: "8 pcs", price: 110 },
  ],
  options: ["Flavour A", "Flavour B"],  // free choices — omit if none
  optionsLabel: "Pick your flavour",
  maxOptions: 1,                        // how many they may pick
  addOns: [                             // PAID extras — omit if none
    { id: "mozzarella", label: "Add Mozzarella", price: 40 },
  ],
  available: true,
},
```

**`options` vs `addOns`** — `options` are free choices that don't change the
price (the San-Yaki skewer flavours). `addOns` cost extra and are added to the
line total live in the modal (the Okonomiyaki's Mozzarella and Floss, +₱40
each). Both show up in the order message you receive.

**Add a whole category** — add another `{ id, label, items: [...] }` block to the
`MENU` array. A new tab appears by itself.

Rules that matter:

- Prices are **whole numbers** — `110`, never `110.00`. The `₱1,000` formatting
  is handled for you in `lib/format.ts`.
- Every `id` must be unique across the whole menu.
- The hero stats, the scrolling marquee and the chat widget's price answer all
  compute themselves from `MENU`, so they can never drift out of date.

---

## 4. Swap the images

Photo filenames and recommended dimensions are listed in
[`public/images/README.md`](public/images/README.md). Drop files in with the
exact names shown there.

A missing photo renders a red-and-gold branded placeholder rather than a broken
image, so you can ship before every shot is ready.

Your **logo is already in place** at `public/images/logo.png` — it's used in the
header, footer, chat bubble and as the favicon.

---

## 5. Change the brand colours

The red and gold are defined once, at the top of
[`app/globals.css`](app/globals.css), in the `@theme` block. `--color-brand-600`
is the logo red; `--color-accent-500` is the gold of the lettering. Change those
scales and the entire site re-skins.

One extra place to update if you change the red: `themeColor` in
[`app/layout.tsx`](app/layout.tsx), which tints the mobile browser bar.

---

## 6. Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Go to [vercel.com/new](https://vercel.com/new), import the repo.
3. Vercel detects Next.js — accept every default and hit **Deploy**.
4. Once it's live, put the real URL into `siteUrl` in `lib/business.ts`, commit,
   and push. Vercel redeploys on every push to `main`.
5. Optional: add your own domain under Project → Settings → Domains.

No environment variables are needed for Phase 1.

---

## How checkout works

The basket is turned into a plain-text message in
[`lib/order.ts`](lib/order.ts):

```
Hi Bella's Takoyaki! I'd like to order:

• 2x Pork Cheesebomb (8 pcs) — ₱400
• 1x San-Yaki Skewers (12 pcs) — Pork Cheesebomb, Ikura Seafood — ₱200
• 1x Okonomiyaki — Add Mozzarella — ₱220

TOTAL: ₱820

Name:
Pickup/Delivery:
Preferred time:
```

- **Messenger does not accept prefilled text.** The message is copied to the
  clipboard and Messenger opens, with a toast telling the customer to paste.
  Until you set `messengerPageId`, this opens your Facebook Page rather than the
  inbox, and the toast wording changes to match.
- **WhatsApp** accepts prefilled text, so the message goes straight into the
  chat box via `wa.me/<number>?text=…`. Hidden entirely until you set a number.
- **If copying is blocked** — which happens routinely inside the Facebook and
  Instagram in-app browsers — the message appears in a selectable text box so
  they can copy it by hand. Checkout never dead-ends.

---

## Project structure

```
app/
  layout.tsx        fonts, metadata, Open Graph, JSON-LD Restaurant data
  page.tsx          composes every section
  globals.css       Tailwind + brand colour tokens
  login/page.tsx    Phase 2 stub
components/
  Header.tsx        sticky nav, cart button
  Hero.tsx          headline + stats
  Marquee.tsx       scrolling flavour strip
  MenuSection.tsx   category tabs + item grid
  ItemModal.tsx     variant/flavour/quantity picker
  CartDrawer.tsx    basket + Messenger/WhatsApp checkout
  WhyUs.tsx  HowToOrder.tsx  Payment.tsx  Contact.tsx  Footer.tsx
  ChatWidget.tsx    rules-based FAQ bot (no AI call)
  Toaster.tsx       toasts + manual-copy fallback
  FoodImage.tsx     next/image with a branded fallback
  Reveal.tsx        scroll-reveal wrapper
lib/
  business.ts       ← your contact details, links and feature flags
  menu.ts           ← your menu, single source of truth
  cart.ts           Zustand cart store
  ui.ts             Zustand UI store (drawer, modal, toasts)
  order.ts          order message + checkout handlers
  format.ts         peso formatting
  dialog.ts         Escape / focus-trap / scroll-lock for overlays
public/images/      your photos
```

---

## Phase 2 (not built yet)

Staff admin so you can toggle availability without editing code: Supabase auth,
a `/admin` table with availability toggles and editable prices, public menu
reading from Supabase with `revalidate: 60` and falling back to the static
`MENU` array if the fetch fails.
