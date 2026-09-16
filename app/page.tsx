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
 * Re-fetch live availability and prices at most once a minute. If Supabase
 * isn't set up or the fetch fails, getMenu() returns the static MENU and the
 * page renders exactly as it did in Phase 1.
 */
export const revalidate = 60;

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
      <CartDrawer />
      <ChatWidget stats={stats} />
      <Toaster />
    </>
  );
}
