"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  DollarSign,
  Smile,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { ROIModal } from "@/components/roi-modal";

const stats = [
  {
    value: "96",
    suffix: "%",
    label: "Process Efficiency",
    description: "Workflow automation accuracy",
    icon: TrendingUp,
  },
  {
    value: "20",
    suffix: "%",
    label: "Cost Reduction",
    description: "Average operational savings",
    icon: DollarSign,
  },
  {
    value: "51",
    suffix: "%",
    label: "Satisfaction Increase",
    description: "Team productivity & morale",
    icon: Smile,
  },
  {
    value: "44",
    suffix: "%",
    label: "Revenue Growth",
    description: "Year-over-year improvement",
    icon: BarChart3,
  },
];

export function ProvenImpact() {
  return (
    <section
      id="proven-impact"
      className="relative overflow-hidden border-t border-white/[0.06] bg-[#0D0D0D] py-20 lg:py-28"
    >
      {/* Background glow effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-[#50C878]/[0.04] blur-[120px]" />
        <div className="absolute -right-32 bottom-0 h-[400px] w-[400px] rounded-full bg-[#50C878]/[0.03] blur-[100px]" />
      </div>

      <Container className="relative z-10">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#50C878]/20 bg-[#50C878]/10 px-4 py-1.5 text-sm font-medium text-[#50C878]">
            <Sparkles className="h-4 w-4" />
            <span>Proven Impact</span>
          </div>
          <h2 className="text-balance text-3xl font-bold sm:text-4xl lg:text-5xl">
            Results Our Clients{" "}
            <span className="bg-gradient-to-r from-[#50C878] to-[#50C878]/60 bg-clip-text text-transparent">
              Actually See
            </span>
          </h2>
          <p className="mt-4 text-lg text-[#A1A1A1]">
            Real metrics from real businesses powered by AI automation.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#50C878]/30 hover:bg-white/[0.05] hover:shadow-lg hover:shadow-[#50C878]/5 sm:p-6"
              >
                {/* Emerald top accent */}
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#50C878]/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Icon */}
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#50C878]/10">
                  <Icon className="h-5 w-5 text-[#50C878]" />
                </div>

                {/* Stat value */}
                <p className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
                  {stat.value}
                  <span className="text-[#50C878]">{stat.suffix}</span>
                </p>

                {/* Label */}
                <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-white/80">
                  {stat.label}
                </p>
                <p className="mt-1 text-xs text-[#A1A1A1]">
                  {stat.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA — Calculate Your ROI (triggers modal) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <ROIModal>
            <Button
              variant="ghost"
              size="xl"
              className="border-2 border-[#50C878] text-white hover:bg-[#50C878]/10"
            >
              Calculate Your Personal ROI
            </Button>
          </ROIModal>
        </motion.div>
      </Container>
    </section>
  );
}
