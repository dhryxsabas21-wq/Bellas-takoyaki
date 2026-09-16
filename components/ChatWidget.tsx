"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import FoodImage from "./FoodImage";
import { BUSINESS, HAS_WHATSAPP, isUnset, MESSENGER_URL } from "@/lib/business";
import { peso } from "@/lib/format";
import { MENU_STATS } from "@/lib/menu";
import { useUI } from "@/lib/ui";

/**
 * Rules-based FAQ — no AI call. Edit the answers here; they read from the
 * business config and menu so they can't go stale.
 */
const FAQ: { q: string; a: string }[] = [
  {
    q: "What time are you open?",
    a: isUnset(BUSINESS.hours.display)
      ? "Message us on Facebook for today's hours — we post sold-out updates on the Page too."
      : `${BUSINESS.hours.display}. We post sold-out updates on our Facebook Page.`,
  },
  {
    q: "Where are you located?",
    a: isUnset(BUSINESS.address.street)
      ? `We're in ${BUSINESS.address.locality}, ${BUSINESS.address.region}. Message us on Facebook for directions to the stall.`
      : `${BUSINESS.address.street}, ${BUSINESS.address.locality}, ${BUSINESS.address.region}.`,
  },
  {
    q: "How much is takoyaki?",
    a: `Takoyaki starts at ${peso(
      MENU_STATS.startingPrice
    )} for 5 pieces, up to ${MENU_STATS.biggestTray} trays for the barkada. ${
      MENU_STATS.takoyakiFlavors
    } flavours to pick from — full prices are in the menu above.`,
  },
  {
    q: "How do I order?",
    a: `Add what you want to your order using the menu, then tap Order via Messenger${
      HAS_WHATSAPP ? " or WhatsApp" : ""
    }. Your basket is written out for you — just add your name and pickup time.`,
  },
  {
    q: "How do I pay?",
    a: `GCash (${BUSINESS.gcash.number}${
      isUnset(BUSINESS.gcash.accountName) ? "" : `, ${BUSINESS.gcash.accountName}`
    }) or cash on pickup. We confirm your total in the chat before you send anything.`,
  },
  {
    q: "What's your bestseller?",
    a: "Pork Cheesebomb, Ikura Seafood and Baby Tako — those three also make up the San-Yaki skewer flavours. The Chili Bomb is for the brave.",
  },
];

type Message = { from: "bot" | "user"; text: string };

const GREETING: Message = {
  from: "bot",
  text: `Hi! I'm Bella's little helper 🐙 Tap a question below, or chat with a real human on Messenger.`,
};

export default function ChatWidget() {
  const chatOpen = useUI((s) => s.chatOpen);
  const openChat = useUI((s) => s.openChat);
  const closeChat = useUI((s) => s.closeChat);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages, chatOpen]);

  useEffect(() => {
    if (!chatOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeChat();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [chatOpen, closeChat]);

  function ask(entry: (typeof FAQ)[number]) {
    setMessages((m) => [
      ...m,
      { from: "user", text: entry.q },
      { from: "bot", text: entry.a },
    ]);
  }

  return (
    <>
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            role="dialog"
            aria-label="Frequently asked questions"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-4 bottom-24 z-[80] flex max-h-[70dvh] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl bg-cream shadow-2xl ring-1 ring-brand-200"
          >
            <header className="flex items-center gap-3 bg-brand-600 px-4 py-3 text-white">
              <FoodImage
                src="/images/logo.png"
                alt=""
                width={40}
                height={40}
                className="size-10 rounded-full bg-white object-contain"
              />
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-bold">{BUSINESS.name}</p>
                <p className="text-xs text-white/75">Usually replies in minutes</p>
              </div>
              <button
                type="button"
                onClick={closeChat}
                aria-label="Close chat"
                className="grid size-10 shrink-0 place-items-center rounded-full transition hover:bg-white/15"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </header>

            <div
              ref={logRef}
              aria-live="polite"
              className="flex-1 space-y-2.5 overflow-y-auto p-4"
            >
              {messages.map((m, i) => (
                <p
                  key={i}
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.from === "bot"
                      ? "bg-white text-ink/80 ring-1 ring-brand-100"
                      : "ml-auto bg-brand-600 text-white"
                  }`}
                >
                  {m.text}
                </p>
              ))}
            </div>

            <div className="border-t border-brand-100 bg-white p-3">
              <p className="px-1 pb-2 text-[0.65rem] font-bold tracking-[0.18em] text-ink/40 uppercase">
                Quick questions
              </p>
              <div className="flex flex-wrap gap-1.5">
                {FAQ.map((entry) => (
                  <button
                    key={entry.q}
                    type="button"
                    onClick={() => ask(entry)}
                    className="min-h-9 rounded-full border border-brand-200 px-3 text-xs font-semibold text-brand-700 transition hover:bg-brand-50"
                  >
                    {entry.q}
                  </button>
                ))}
              </div>
              <a
                href={MESSENGER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex min-h-11 w-full items-center justify-center rounded-full bg-[#0866FF] px-4 text-sm font-bold text-white transition hover:brightness-110"
              >
                Chat with us on Messenger
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => (chatOpen ? closeChat() : openChat())}
        aria-expanded={chatOpen}
        aria-label={chatOpen ? "Close chat" : "Open chat and FAQs"}
        className="fixed right-4 bottom-4 z-[80] grid size-14 place-items-center rounded-full bg-brand-600 text-white shadow-2xl shadow-brand-950/40 ring-4 ring-white/70 transition hover:bg-brand-700 active:scale-95"
      >
        {chatOpen ? (
          <X className="size-6" aria-hidden="true" />
        ) : (
          <MessageCircle className="size-6" aria-hidden="true" />
        )}
      </button>
    </>
  );
}
