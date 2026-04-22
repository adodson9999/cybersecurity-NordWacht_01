"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  name: string;
  description: string;
  price: string;
  period?: string;
  features: string[];
  cta: string;
  popular?: boolean;
  onCtaClick?: () => void;
}

export function PricingCard({
  name,
  description,
  price,
  period = "/month",
  features,
  cta,
  popular = false,
  onCtaClick,
}: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        "glass relative flex flex-col rounded-2xl p-8",
        popular && "border-primary/50 bg-primary/5 ring-2 ring-primary/20"
      )}
    >
      {/* Popular badge */}
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-primary px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">
            Most Popular
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold">{name}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>

      {/* Price */}
      <div className="mb-6">
        <span className="text-4xl font-extrabold">{price}</span>
        {price !== "Custom" && (
          <span className="text-muted-foreground">{period}</span>
        )}
      </div>

      {/* Features */}
      <ul className="mb-8 flex-1 space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3 text-sm">
            <Check
              className={cn(
                "mt-0.5 h-4 w-4 flex-shrink-0",
                popular ? "text-primary" : "text-muted-foreground"
              )}
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Button
        onClick={onCtaClick}
        magnetic={popular}
        variant={popular ? "default" : "outline"}
        size="lg"
        className="w-full"
      >
        {cta}
      </Button>
    </motion.div>
  );
}
