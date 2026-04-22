"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { cn } from "@/lib/utils";

interface ScenarioCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  variant: "before" | "after";
  features: string[];
}

export function ScenarioCard({ title, description, icon, variant, features }: ScenarioCardProps) {
  const isAfter = variant === "after";

  return (
    <GlassCard
      className={cn(
        "relative overflow-hidden",
        isAfter && "border-primary/30 bg-primary/5"
      )}
    >
      {/* Variant badge */}
      <div
        className={cn(
          "mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider",
          isAfter
            ? "bg-primary/20 text-primary"
            : "bg-muted text-muted-foreground"
        )}
      >
        {isAfter ? "After AI" : "Before"}
      </div>

      {/* Icon */}
      <div
        className={cn(
          "mb-4 flex h-12 w-12 items-center justify-center rounded-lg",
          isAfter ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
        )}
      >
        {icon}
      </div>

      {/* Content */}
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="mb-4 text-muted-foreground">{description}</p>

      {/* Features list */}
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-2 text-sm"
          >
            <span
              className={cn(
                "mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full",
                isAfter ? "bg-primary" : "bg-muted-foreground"
              )}
            />
            <span className={isAfter ? "text-foreground" : "text-muted-foreground"}>
              {feature}
            </span>
          </motion.li>
        ))}
      </ul>

      {/* Decorative element for "After" cards */}
      {isAfter && (
        <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
      )}
    </GlassCard>
  );
}
