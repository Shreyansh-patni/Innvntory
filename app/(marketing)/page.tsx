import type { Metadata } from "next";
import { HeroSection } from "@/components/marketing/hero-section";
import { CapabilitiesSection } from "@/components/marketing/capabilities-section";
import { OperationsWorkflow } from "@/components/marketing/operations-workflow";
import { WhyInnvntory } from "@/components/marketing/why-innvntory";
import { FAQSection } from "@/components/marketing/faq-section";
import { CTASection } from "@/components/marketing/cta-section";

export const metadata: Metadata = {
  title: "Innvntory — Operating System for Modern Inventory & Operations",
  description:
    "Make complex business operations feel simple. High-precision multi-warehouse inventory, procurement, sales, and reporting built for growing businesses.",
};

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <CapabilitiesSection />
      <OperationsWorkflow />
      <WhyInnvntory />
      <FAQSection />
      <CTASection />
    </>
  );
}
