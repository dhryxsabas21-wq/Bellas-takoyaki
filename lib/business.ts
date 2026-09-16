/**
 * ============================================================================
 *  BELLA'S TAKOYAKI — BUSINESS CONFIG
 *  This is the ONLY file you edit to change contact details, links and hours.
 *  Everything marked "FILL THIS IN" is still a placeholder — replace it.
 * ============================================================================
 */

export const BUSINESS = {
  name: "Bella's Takoyaki",
  shortName: "Bella's",
  since: 2018,
  tagline:
    "All Famous Authentic Japanese Street Foods — Milktea, Bento Meals, Silog Meals, Wing Meals, Sizzling Meals, Sticks & Bites",
  /** Short version used in the hero and share cards. */
  pitch:
    "Authentic Japanese street food in Baler. Ten takoyaki flavours off a hot griddle, skewers, tako-fries, yakisoba and okonomiyaki — cooked to order, boxed while it's still crackling.",

  /** GCash number, doubling as the call/text number. */
  phoneDisplay: "0975 737 3297",
  phoneTel: "+639757373297",

  gcash: {
    number: "0975 737 3297",
    /** FILL THIS IN — the name that shows when someone sends to your GCash. */
    accountName: "FILL THIS IN",
  },

  /**
   * FILL THIS IN (optional) — numeric Facebook Page ID or page username, for a
   * direct m.me link. Find it at: Page → About → Page transparency → Page ID.
   * Left empty, checkout falls back to the Facebook Page URL below, which
   * works fine — the m.me link just opens the chat one tap sooner.
   */
  messengerPageId: "",

  facebookUrl: "https://www.facebook.com/Bellastakoyaki/",

  /**
   * FILL THIS IN (optional) — international format, digits only, no "+".
   * e.g. "639757373297". Left empty, every WhatsApp button is hidden
   * automatically and Messenger becomes the only checkout route.
   */
  whatsappNumber: "",

  address: {
    /** FILL THIS IN — your exact stall address. */
    street: "FILL THIS IN",
    locality: "Baler",
    region: "Aurora",
    /** FILL THIS IN — pickup only? delivery radius? which riders? */
    serviceArea: "FILL THIS IN — e.g. Pickup at the stall • Delivery around Baler",
  },

  /** FILL THIS IN — keep `display` and `schema` saying the same thing. */
  hours: {
    display: "FILL THIS IN — e.g. Open daily, 10:00 AM – 9:00 PM",
    /** schema.org format, read by Google. 24-hour times. */
    schema: [
      {
        days: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "10:00",
        closes: "21:00",
      },
    ],
  },

  priceRange: "₱₱",

  /** Used for Open Graph / canonical URLs. Update after your first deploy. */
  siteUrl: "https://bellas-takoyaki.vercel.app",
} as const;

/* ---------------------------------------------------------------------------
 * Derived links — do not edit; these read from the values above.
 * ------------------------------------------------------------------------ */

/** m.me when a Page ID is set, otherwise the plain Page URL. Always valid. */
export const MESSENGER_URL = BUSINESS.messengerPageId
  ? `https://m.me/${BUSINESS.messengerPageId}`
  : BUSINESS.facebookUrl;

export const WHATSAPP_URL = `https://wa.me/${BUSINESS.whatsappNumber}`;
export const TEL_URL = `tel:${BUSINESS.phoneTel}`;

/**
 * Feature flags. Set a WhatsApp number above and every WhatsApp button appears
 * on its own — no other file needs touching.
 */
export const HAS_WHATSAPP = BUSINESS.whatsappNumber.trim().length > 0;
export const HAS_MESSENGER = MESSENGER_URL.trim().length > 0;

/** True while a "FILL THIS IN" placeholder is still on screen. */
export function isUnset(value: string): boolean {
  return value.startsWith("FILL THIS IN");
}

export const NAV_LINKS = [
  { href: "#menu", label: "Menu" },
  { href: "#why-us", label: "Why Us" },
  { href: "#how-to-order", label: "How to Order" },
  { href: "#payment", label: "Payment" },
  { href: "#contact", label: "Contact" },
] as const;
