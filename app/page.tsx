import CartDrawer from "@/components/CartDrawer";
import ChatWidget from "@/components/ChatWidget";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowToOrder from "@/components/HowToOrder";
import ItemModal from "@/components/ItemModal";
import Marquee from "@/components/Marquee";
import MenuSection from "@/components/MenuSection";
import Payment from "@/components/Payment";
import Toaster from "@/components/Toaster";
import WhyUs from "@/components/WhyUs";
import { getMenu } from "@/lib/menu-server";
import { computeStats, marqueeWords } from "@/lib/menu";

/**
 * How long a cached menu may be served before it's rebuilt.
 *
 * Toggling an item in /admin calls revalidatePath("/"), so staff changes show
 * up immediately. This window only bounds how stale the menu can get if the
 * database is edited some other way — 10s means a customer can never be more
 * than ten seconds behind on a sold-out item, while still capping the database
 * at ~6 queries a minute no matter how much traffic a Facebook post brings.
 *
 * If Supabase is unset or the fetch fails, getMenu() falls back to the static
 * MENU and the page renders exactly as it did in Phase 1.
 */
export const revalidate = 10;

export default async function HomePage() {
  const menu = await getMenu();
  const stats = computeStats(menu);
  const words = marqueeWords(menu);

  return (
    <>
      <Header />
      <main>
        <Hero stats={stats} />
        <Marquee words={words} />
        <MenuSection menu={menu} />
        <WhyUs />
        <HowToOrder />
        <Payment />
        <Contact />
      </main>
      <Footer />

      {/* Overlays */}
      <ItemModal menu={menu} />
      <CartDrawer menu={menu} />
      <ChatWidget stats={stats} />
      <Toaster />
    </>
  );
}
