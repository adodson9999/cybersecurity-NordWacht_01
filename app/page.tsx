import { NavBar } from "@/components/nav-bar";
import { Hero } from "@/components/hero";
import { ROICalculator } from "@/components/roi-calculator";
import { AutomationSection } from "@/components/automation-section";
import { PricingSection } from "@/components/pricing-section";
import { FAQSection } from "@/components/faq-section";
import { Footer } from "@/components/footer";
import { BackToTop } from "@/components/back-to-top";

export default function Home() {
  return (
    <>
      <NavBar />
      <main>
        <Hero />
        <ROICalculator />
        <AutomationSection />
        <PricingSection />
        <FAQSection />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
