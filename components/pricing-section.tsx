"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/container";
import { PricingCard } from "@/components/pricing-card";

const pricingTiers = [
  {
    name: "Starter",
    description: "Perfect for small teams looking to automate their first workflows",
    price: "$2,500",
    period: "/month",
    features: [
      "Up to 3 automated workflows",
      "Basic AI document processing",
      "Email & Slack integrations",
      "Standard support (48hr response)",
      "Monthly performance reports",
      "1 team training session",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Professional",
    description: "For growing businesses ready to scale their automation",
    price: "$7,500",
    period: "/month",
    features: [
      "Up to 10 automated workflows",
      "Advanced AI processing & OCR",
      "CRM & ERP integrations",
      "Priority support (12hr response)",
      "Weekly performance reviews",
      "Dedicated success manager",
      "Custom workflow development",
      "API access",
    ],
    cta: "Stop Wasting Human Capital",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "Full-scale AI transformation for large organizations",
    price: "Custom",
    features: [
      "Unlimited workflows",
      "Custom AI model training",
      "Enterprise integrations",
      "24/7 dedicated support",
      "On-site implementation team",
      "Executive strategy sessions",
      "Compliance & security audits",
      "SLA guarantees",
      "Multi-department rollout",
    ],
    cta: "Contact Us",
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
