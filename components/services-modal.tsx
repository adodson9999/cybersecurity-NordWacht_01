"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Check, Rocket, Building2, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CTAModal } from "@/components/cta-modal";

interface ServicesModalProps {
  children: React.ReactNode;
}

const serviceTiers = [
  {
    name: "The Pilot",
    description: "Targeted Automation & AI Search Visibility",
    price: "$1,500",
    period: "/month",
    icon: <Rocket className="h-6 w-6" />,
    features: [
      "One High-Impact AI Workflow",
      "End-to-end automation of your biggest time-thief",
      "SEO + GEO (Generative Engine Optimization)",
      "Optimize for ChatGPT, Claude & Perplexity citations",
      "Prove ROI within 30 days",
      "Save 20+ hours of labor monthly",
    ],
    popular: false,
  },
  {
    name: "The Core",
    description: "Turn your company into an AI-First Organization",
    price: "$8,000",
    period: "/month",
    icon: <Building2 className="h-6 w-6" />,
    features: [
      "Everything in The Pilot",
      "Full-Stack Business Integration",
      "Private Knowledge Brain (Vector Database)",
      "Query company data in natural language",
      "System Synchronicity (Slack, CRM, ERP, Email)",
      "Autonomous agents for data movement",
      "Reduce operational overhead by 30-50%",
    ],
    popular: true,
  },
  {
    name: "The Ecosystem",
    description: "Omnichannel Content & Media Authority via AI",
    price: "$16,000",
    period: "/month",
    icon: <Globe className="h-6 w-6" />,
    features: [
      "Everything in The Core",
      "AI Content Factory",
      "Automated YouTube/TikTok/Reels production",
      "Daily LinkedIn & Facebook insights",
      "Podcast automation & transcript-to-article",
      "Total top-of-funnel dominance",
      "Become the loudest voice in your industry",
    ],
    popular: false,
  },
];

export function ServicesModal({ children }: ServicesModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="fixed left-1/2 top-1/2 z-50 w-full max-w-5xl -translate-x-1/2 -translate-y-1/2 p-4"
              >
                <div className="glass max-h-[90vh] overflow-y-auto rounded-2xl p-6 md:p-8">
                  {/* Close button */}
                  <Dialog.Close asChild>
                    <button
                      className="absolute right-4 top-4 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
                      aria-label="Close"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </Dialog.Close>

                  {/* Header */}
                  <div className="mb-8 text-center">
                    <Dialog.Title className="text-2xl font-bold md:text-3xl">
                      Our <span className="gradient-text">Services</span>
                    </Dialog.Title>
                    <Dialog.Description className="mt-2 text-muted-foreground">
                      Choose the solution that fits your business needs
                    </Dialog.Description>
                  </div>

                  {/* Services Grid */}
                  <div className="grid gap-6 md:grid-cols-3">
                    {serviceTiers.map((tier, index) => (
                      <motion.div
                        key={tier.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={cn(
                          "relative flex flex-col rounded-xl border border-border bg-card/50 p-6",
                          tier.popular && "border-primary/50 bg-primary/5 ring-2 ring-primary/20"
                        )}
                      >
                        {/* Popular badge */}
                        {tier.popular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                              Most Popular
                            </span>
                          </div>
                        )}

                        {/* Icon & Name */}
                        <div className="mb-4 flex items-center gap-3">
                          <div className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-lg",
                            tier.popular ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                          )}>
                            {tier.icon}
                          </div>
                          <div>
                            <h3 className="font-bold">{tier.name}</h3>
                            <p className="text-xs text-muted-foreground">{tier.description}</p>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="mb-4">
                          <span className="text-3xl font-extrabold">{tier.price}</span>
                          <span className="text-muted-foreground">{tier.period}</span>
                        </div>

                        {/* Features */}
                        <ul className="mb-6 flex-1 space-y-2">
                          {tier.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start gap-2 text-sm">
                              <Check
                                className={cn(
                                  "mt-0.5 h-4 w-4 flex-shrink-0",
                                  tier.popular ? "text-primary" : "text-muted-foreground"
                                )}
                              />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>

                        {/* CTA */}
                        <CTAModal>
                          <Button
                            magnetic={tier.popular}
                            variant={tier.popular ? "default" : "outline"}
                            size="lg"
                            className="w-full"
                          >
                            Get Started
                          </Button>
                        </CTAModal>
                      </motion.div>
                    ))}
                  </div>

                  {/* Footer note */}
                  <p className="mt-6 text-center text-xs text-muted-foreground">
                    All prices in USD. No hidden fees. Cancel anytime with 30-day notice.
                  </p>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
