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

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Marquee />
        <MenuSection />
        <WhyUs />
        <HowToOrder />
        <Payment />
        <Contact />
      </main>
      <Footer />

      {/* Overlays */}
      <ItemModal />
      <CartDrawer />
      <ChatWidget />
      <Toaster />
    </>
  );
}
