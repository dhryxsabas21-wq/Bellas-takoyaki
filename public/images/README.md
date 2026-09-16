# Images to supply

Drop these files into this folder (`public/images/`) using **exactly** these
filenames. Any file that's missing shows a branded red placeholder instead of a
broken image, so the site never looks broken while you're still shooting photos.

Export photos as **WebP** (quality 75–80). Keep them under ~200 KB each.
Squoosh (<https://squoosh.app>) does this in the browser, free.

## Already supplied ✅

| Filename | Status |
| --- | --- |
| `logo.png` | ✅ Done — copied from your Downloads folder. |

## Site photos

| Filename | Dimensions | What it is |
| --- | --- | --- |
| `hero.webp` | 1600 × 1100 | Wide hero shot. **Your skewers-and-milktea photo is perfect for this.** Shot dark or busy is fine — a gradient sits over it. |
| `why-us.webp` | 900 × 1100 | **Portrait** griddle shot. **Your shrimp/crab/corn pan photo is ideal.** Leave headroom at the bottom — a caption sits over it. |
| `og-image.jpg` | 1200 × 630 | Facebook share card. Logo + a food shot, centred. **JPG, not WebP** — some scrapers reject WebP. |
| `gcash-qr.png` | 600 × 600 | Screenshot of your GCash QR, cropped square. |

## Menu items — Takoyaki

| Filename | What it is |
| --- | --- |
| `octo-veggies.webp` | Octo Veggies — **your white-plate takoyaki with bonito flakes fits here.** |
| `pork-cheesebomb.webp` | Pork Cheesebomb — **you already have the labelled tray shot.** |
| `spicy-chicken-teriyaki.webp` | Spicy Chicken Teriyaki |
| `chili-bomb.webp` | Chili Bomb (TakoX) |
| `cheesy-garlic-beef.webp` | Cheesy Garlic Beef |
| `chicken-cheesebomb.webp` | Chicken Cheesebomb |
| `ikura-seafood.webp` | Ikura Seafood — **your nori/bonito/sriracha box shot works well.** |
| `pepperoni-cheese.webp` | Pepperoni Cheese |
| `tuna-melt.webp` | Tuna Melt |
| `baby-tako.webp` | Baby Tako |

## Menu items — everything else

| Filename | What it is |
| --- | --- |
| `san-yaki.webp` | San-Yaki Skewers |
| `fries-octo.webp` | Fries + Octo |
| `fries-cheese.webp` | Fries + Cheese |
| `fries-chicken.webp` | Fries + Chicken |
| `yakisoba-octo.webp` | Yakisoba + Octo |
| `yakisoba-cheese.webp` | Yakisoba + Cheese |
| `yakisoba-chicken.webp` | Yakisoba + Chicken |
| `okonomiyaki.webp` | Okonomiyaki |

All menu photos: **800 × 600**, landscape. They're cropped to 4:3 on the cards,
so keep the food centred.

Menu filenames come from the `image` field in `lib/menu.ts` — if you rename an
item's photo, update that one line too.
