"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/container";
import { PricingCard } from "@/components/pricing-card";

const pricingTiers = [
  {
    name: "The Pilot",
    description: "Targeted Automation & AI Search Visibility",
    price: "$1,500",
    period: "/month",
    features: [
      "One High-Impact AI Workflow",
      "End-to-end automation of your biggest time-thief",
      "SEO + GEO (Generative Engine Optimization)",
      "Optimize for ChatGPT, Claude & Perplexity citations",
      "Prove ROI within 30 days",
      "Save 20+ hours of labor monthly",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "The Core",
    description: "Turn your company into an AI-First Organization",
    price: "$8,000",
    period: "/month",
    features: [
      "Everything in The Pilot",
      "Full-Stack Business Integration",
      "Private Knowledge Brain (Vector Database)",
      "Query company data in natural language",
      "System Synchronicity (Slack, CRM, ERP, Email)",
      "Autonomous agents for data movement",
      "Reduce operational overhead by 30-50%",
    ],
    cta: "Transform Your Business",
    popular: true,
  },
  {
    name: "The Ecosystem",
    description: "Omnichannel Content & Media Authority via AI",
    price: "$16,000",
    period: "/month",
    features: [
      "Everything in The Core",
      "AI Content Factory",
      "Automated YouTube/TikTok/Reels production",
      "Daily LinkedIn & Facebook insights",
      "Podcast automation & transcript-to-article",
      "Total top-of-funnel dominance",
      "Become the loudest voice in your industry",
    ],
    cta: "Dominate Your Market",
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="relative py-24">
      {/* Background accent */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-px w-1/2 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      </div>

      <Container>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <h2 className="text-balance text-3xl font-bold sm:text-4xl lg:text-5xl">
            Transparent Pricing,{" "}
            <span className="gradient-text">Real Results</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose the plan that fits your automation needs. All plans include our 
            free $2,500 AI Efficiency Audit.
          </p>
        </motion.div>

        {/* Pricing grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {pricingTiers.map((tier, index) => (
            <PricingCard key={index} {...tier} />
          ))}
        </div>

        {/* Trust note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center text-sm text-muted-foreground"
        >
          All prices in USD. No hidden fees. Cancel anytime with 30-day notice.
        </motion.p>
      </Container>
    </section>
  );
}
