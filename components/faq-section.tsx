"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/container";
import { FAQItem } from "@/components/faq-item";

const faqs = [
  {
    question: "How long does AI implementation typically take?",
    answer:
      "Most implementations are completed in 4-8 weeks, depending on complexity. We focus on quick wins first — you'll see initial automations running within the first 2 weeks. Our Houston-based team works directly with your staff to ensure minimal disruption.",
  },
  {
    question: "What ROI can we expect from AI automation?",
    answer:
      "Our clients typically see 40-60% reduction in time spent on automated tasks, with full ROI within 6-9 months. We provide detailed analytics so you can track exactly how much time and money you're saving each month.",
  },
  {
    question: "Do we need to replace our existing software?",
    answer:
      "No. Our AI solutions integrate with your existing tools — CRMs, ERPs, email, Slack, spreadsheets, and more. We build bridges between your systems rather than replacing them, protecting your existing investments.",
  },
  {
    question: "Is our data secure with AI automation?",
    answer:
      "Absolutely. We implement enterprise-grade security including end-to-end encryption, SOC 2 compliance, and strict access controls. Your data never leaves your approved systems, and we can work within your existing security policies.",
  },
  {
    question: "What if something goes wrong with an automation?",
    answer:
      "Every automation includes monitoring, alerting, and fallback procedures. Our team receives instant notifications of any issues and can intervene immediately. Professional and Enterprise plans include dedicated support with guaranteed response times.",
  },
  {
    question: "What's included in the free AI Efficiency Audit?",
    answer:
      "Our $2,500-value audit includes a deep-dive into your current workflows, identification of automation opportunities, ROI projections, and a custom implementation roadmap. It's completely free with no obligation — we want you to see the potential before committing.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="relative py-24">
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
            Frequently Asked{" "}
            <span className="gradient-text">Questions</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to know about our AI implementation services
          </p>
        </motion.div>

        {/* FAQ list */}
        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <FAQItem
                question={faq.question}
                answer={faq.answer}
                defaultOpen={index === 0}
              />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
