import { ScrollView, View } from "react-native";

import { Categories } from "../src/components/landing/Categories";
import { CTA } from "../src/components/landing/CTA";
import { Footer } from "../src/components/landing/Footer";
import { Hero } from "../src/components/landing/Hero";
import { HowItWorks } from "../src/components/landing/HowItWorks";
import { Navbar } from "../src/components/landing/Navbar";
import { Pricing } from "../src/components/landing/Pricing";

/** Porte de src/pages/Index.tsx — mesma ordem de secoes da landing web. */
export default function Index() {
  return (
    <View className="flex-1 bg-background">
      <Navbar />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Hero />
        <HowItWorks />
        <Categories />
        <Pricing />
        <CTA />
        <Footer />
      </ScrollView>
    </View>
  );
}
