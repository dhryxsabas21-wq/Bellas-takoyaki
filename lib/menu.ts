/**
 * ============================================================================
 *  BELLA'S TAKOYAKI — MENU (SINGLE SOURCE OF TRUTH)
 *
 *  Every price, name and photo on the website comes from this file.
 *  To change a price: edit one number below. To hide an item for the day:
 *  set `available: false`. To add an item: copy a block and change the `id`.
 *
 *  ⚠️ PRICES TO VERIFY — three 5pc prices were flagged as guesses in the
 *  source menu. See the "CHECK" comments inline. Two look consistent with the
 *  rest of the price ladder; one does not. Details in the README.
 * ============================================================================
 */

export type Variant = { id: string; label: string; price: number };

/** A paid extra, e.g. "Add Mozzarella +₱40". Adds to the line's unit price. */
export type AddOn = { id: string; label: string; price: number };

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  /** Shown as "from ₱X" on the card. Should equal the cheapest variant. */
  basePrice: number;
  image: string;
  badge?: "Bestseller" | "New";
  variants?: Variant[];
  /** Free choices, e.g. skewer flavours. No effect on price. */
  options?: string[];
  /** Heading above the option list. */
  optionsLabel?: string;
  /** How many options the customer may pick. Defaults to 1. */
  maxOptions?: number;
  /** Paid extras, priced individually. */
  addOns?: AddOn[];
  available: boolean;
};

export type Category = { id: string; label: string; items: MenuItem[] };

export const MENU: Category[] = [
  {
    id: "takoyaki",
    label: "Takoyaki",
    items: [
      {
        id: "octo-veggies",
        name: "Octo Veggies",
        description:
          "The classic. Real octopus and crisp vegetables folded into a molten centre, sauced and finished with dancing bonito flakes.",
        basePrice: 95,
        image: "/images/octo-veggies.webp",
        variants: [
          // CHECK: ₱95 breaks the 5→8pc ladder every other item follows
          // (×1.6 would put it near ₱85). The 8pc and 16pc are consistent.
          { id: "5pcs", label: "5 pcs", price: 95 },
          { id: "8pcs", label: "8 pcs", price: 135 },
          { id: "16pcs", label: "16 pcs", price: 325 },
        ],
        available: true,
      },
      {
        id: "pork-cheesebomb",
        name: "Pork Cheesebomb",
        description:
          "Savoury pork and a molten cheese core that pulls when you bite. Buried under crispy floss — the one people come back for.",
        basePrice: 125,
        image: "/images/pork-cheesebomb.webp",
        badge: "Bestseller",
        variants: [
          // CHECK: ₱125 matches the ladder exactly (200 ÷ 1.6). Looks right.
          { id: "5pcs", label: "5 pcs", price: 125 },
          { id: "8pcs", label: "8 pcs", price: 200 },
          { id: "16pcs", label: "16 pcs", price: 420 },
        ],
        available: true,
      },
      {
        id: "spicy-chicken-teriyaki",
        name: "Spicy Chicken Teriyaki",
        description:
          "Sweet-savoury teriyaki chicken with a slow chilli burn that builds around the third ball.",
        basePrice: 100,
        image: "/images/spicy-chicken-teriyaki.webp",
        variants: [
          { id: "5pcs", label: "5 pcs", price: 100 },
          { id: "8pcs", label: "8 pcs", price: 160 },
          { id: "16pcs", label: "16 pcs", price: 385 },
        ],
        available: true,
      },
      {
        id: "chili-bomb",
        name: "Chili Bomb (TakoX)",
        description:
          "Our extra-spicy signature. Not a dare — genuinely delicious, just bring a drink.",
        basePrice: 100,
        image: "/images/chili-bomb.webp",
        variants: [
          { id: "5pcs", label: "5 pcs", price: 100 },
          { id: "8pcs", label: "8 pcs", price: 160 },
          { id: "16pcs", label: "16 pcs", price: 385 },
        ],
        available: true,
      },
      {
        id: "cheesy-garlic-beef",
        name: "Cheesy Garlic Beef",
        description:
          "Seasoned beef, toasted garlic and melted cheese. Rich, buttery and unapologetically heavy.",
        basePrice: 110,
        image: "/images/cheesy-garlic-beef.webp",
        variants: [
          // CHECK: ₱110 matches the ladder (175 ÷ 1.6) and mirrors Tuna Melt
          // exactly. Looks right.
          { id: "5pcs", label: "5 pcs", price: 110 },
          { id: "8pcs", label: "8 pcs", price: 175 },
          { id: "16pcs", label: "16 pcs", price: 420 },
        ],
        available: true,
      },
      {
        id: "chicken-cheesebomb",
        name: "Chicken Cheesebomb",
        description:
          "Tender seasoned chicken wrapped around a molten cheese centre. The lighter half of the Cheesebomb family.",
        basePrice: 125,
        image: "/images/chicken-cheesebomb.webp",
        variants: [
          { id: "5pcs", label: "5 pcs", price: 125 },
          { id: "8pcs", label: "8 pcs", price: 200 },
          { id: "16pcs", label: "16 pcs", price: 480 },
        ],
        available: true,
      },
      {
        id: "ikura-seafood",
        name: "Ikura Seafood",
        description:
          "Shrimp, crab stick and sweet corn on the griddle, crowned with ikura, nori and sesame. Our proudest plate.",
        basePrice: 135,
        image: "/images/ikura-seafood.webp",
        badge: "Bestseller",
        variants: [
          { id: "5pcs", label: "5 pcs", price: 135 },
          { id: "8pcs", label: "8 pcs", price: 210 },
          { id: "16pcs", label: "16 pcs", price: 500 },
        ],
        available: true,
      },
      {
        id: "pepperoni-cheese",
        name: "Pepperoni Cheese",
        description:
          "Pepperoni and cheese in a takoyaki shell — pizza night, rolled into a ball.",
        basePrice: 125,
        image: "/images/pepperoni-cheese.webp",
        variants: [
          { id: "5pcs", label: "5 pcs", price: 125 },
          { id: "8pcs", label: "8 pcs", price: 200 },
          { id: "16pcs", label: "16 pcs", price: 480 },
        ],
        available: true,
      },
      {
        id: "tuna-melt",
        name: "Tuna Melt",
        description:
          "Flaked tuna and cheese melted through the middle. Comfort food with a Japanese accent.",
        basePrice: 110,
        image: "/images/tuna-melt.webp",
        variants: [
          { id: "5pcs", label: "5 pcs", price: 110 },
          { id: "8pcs", label: "8 pcs", price: 175 },
          { id: "16pcs", label: "16 pcs", price: 420 },
        ],
        available: true,
      },
      {
        id: "baby-tako",
        name: "Baby Tako",
        description:
          "Whole baby octopus, our premium pick. Worth every peso and usually the first to sell out.",
        basePrice: 150,
        image: "/images/baby-tako.webp",
        badge: "Bestseller",
        variants: [
          { id: "5pcs", label: "5 pcs", price: 150 },
          { id: "8pcs", label: "8 pcs", price: 250 },
          { id: "16pcs", label: "16 pcs", price: 600 },
        ],
        available: true,
      },
    ],
  },
  {
    id: "san-yaki",
    label: "San-Yaki",
    items: [
      {
        id: "san-yaki-skewers",
        name: "San-Yaki Skewers",
        description:
          "Takoyaki off the ball and onto the stick — grilled, sauced and stacked. Pick from our three bestsellers.",
        basePrice: 200,
        image: "/images/san-yaki.webp",
        variants: [
          { id: "12pcs", label: "12 pcs", price: 200 },
          { id: "24pcs", label: "24 pcs", price: 400 },
        ],
        options: ["Pork Cheesebomb", "Octo Veggies", "Ikura Seafood"],
        optionsLabel: "Pick your flavours",
        maxOptions: 3,
        available: true,
      },
    ],
  },
  {
    id: "tako-fries",
    label: "Tako-Fries",
    items: [
      {
        id: "fries-octo",
        name: "Fries + Octo",
        description:
          "Hot crispy fries buried under octo takoyaki bits, sauce and mayo. Built for sharing, eaten alone.",
        basePrice: 160,
        image: "/images/fries-octo.webp",
        available: true,
      },
      {
        id: "fries-cheese",
        name: "Fries + Cheese",
        description:
          "Fries loaded with cheese takoyaki bits and a proper molten blanket on top.",
        basePrice: 175,
        image: "/images/fries-cheese.webp",
        available: true,
      },
      {
        id: "fries-chicken",
        name: "Fries + Chicken",
        description:
          "Fries topped with seasoned chicken takoyaki bits. The safe order that never disappoints.",
        basePrice: 170,
        image: "/images/fries-chicken.webp",
        available: true,
      },
    ],
  },
  {
    id: "tako-yakisoba",
    label: "Tako-Yakisoba",
    items: [
      {
        id: "yakisoba-octo",
        name: "Yakisoba + Octo",
        description:
          "Stir-fried yakisoba noodles tossed in sweet-savoury sauce, topped with octo takoyaki bits and bonito.",
        basePrice: 180,
        image: "/images/yakisoba-octo.webp",
        available: true,
      },
      {
        id: "yakisoba-cheese",
        name: "Yakisoba + Cheese",
        description:
          "Our yakisoba under cheese takoyaki bits and a generous melt. A full meal in one box.",
        basePrice: 195,
        image: "/images/yakisoba-cheese.webp",
        available: true,
      },
      {
        id: "yakisoba-chicken",
        name: "Yakisoba + Chicken",
        description:
          "Yakisoba noodles with chicken takoyaki bits, spring onion and pickled ginger.",
        basePrice: 190,
        image: "/images/yakisoba-chicken.webp",
        available: true,
      },
    ],
  },
  {
    id: "okonomiyaki",
    label: "Okonomiyaki",
    items: [
      {
        id: "okonomiyaki",
        name: "Okonomiyaki",
        description:
          "The Japanese pancake done properly — cabbage, octobits and bacon griddled together, then crosshatched with sauce and mayo.",
        basePrice: 180,
        image: "/images/okonomiyaki.webp",
        badge: "New",
        addOns: [
          { id: "mozzarella", label: "Add Mozzarella", price: 40 },
          { id: "floss", label: "Add Floss", price: 40 },
        ],
        available: true,
      },
    ],
  },
];

/* ---------------------------------------------------------------------------
 * Derived helpers — everything below reads from MENU. Don't hand-edit.
 * ------------------------------------------------------------------------ */

export const ALL_ITEMS: MenuItem[] = MENU.flatMap((c) => c.items);

export function findItem(id: string): MenuItem | undefined {
  return ALL_ITEMS.find((i) => i.id === id);
}

/** Cheapest price for an item, used for the "from ₱X" label. */
export function startingPrice(item: MenuItem): number {
  if (!item.variants?.length) return item.basePrice;
  return Math.min(...item.variants.map((v) => v.price));
}

/** Names that scroll past in the marquee strip. */
export const MARQUEE_WORDS: string[] = Array.from(
  new Set(ALL_ITEMS.filter((i) => i.available).map((i) => i.name))
);

/** Hero stat blocks, computed so they can never drift from the menu. */
export const MENU_STATS = {
  takoyakiFlavors: MENU[0].items.length,
  startingPrice: Math.min(...ALL_ITEMS.map(startingPrice)),
  biggestTray: "16 pcs",
};
