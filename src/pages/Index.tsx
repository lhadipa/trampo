import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Categories from "@/components/landing/Categories";
import HowItWorks from "@/components/landing/HowItWorks";
import Stats from "@/components/landing/Stats";
import Pricing from "@/components/landing/Pricing";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <div id="categorias">
        <Categories />
      </div>
      <Stats />
      <div id="como-funciona">
        <HowItWorks />
      </div>
      <div id="precos">
        <Pricing />
      </div>
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
