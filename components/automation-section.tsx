"use client";

import { motion } from "framer-motion";
import { FileText, Zap, Clock, AlertCircle, CheckCircle, Bot } from "lucide-react";
import { Container } from "@/components/container";
import { ScenarioCard } from "@/components/scenario-card";
import { Button } from "@/components/ui/button";
import { ServicesModal } from "@/components/services-modal";

const beforeScenarios = [
  {
    title: "Manual Approvals",
    description: "Hours wasted on routine approval workflows that bog down your team.",
    icon: <FileText className="h-6 w-6" />,
    features: [
      "Email chains for every request",
      "Lost documents in inboxes",
      "Days-long approval delays",
      "No visibility into status",
    ],
  },
  {
    title: "Repetitive Data Entry",
    description: "Staff spending 40% of their time copying data between systems.",
    icon: <Clock className="h-6 w-6" />,
    features: [
      "Copy-paste between apps",
      "Manual spreadsheet updates",
      "High error rates",
      "Employee burnout",
    ],
  },
  {
    title: "Reactive Problem Solving",
    description: "Finding out about issues only after they become emergencies.",
    icon: <AlertCircle className="h-6 w-6" />,
    features: [
      "Missed deadlines",
      "Customer complaints",
      "Firefighting mode",
      "No early warnings",
    ],
  },
];

const afterScenarios = [
  {
    title: "Instant AI Routing",
    description: "Intelligent workflows that route, prioritize, and approve automatically.",
    icon: <Zap className="h-6 w-6" />,
    features: [
      "Auto-routing based on content",
      "Instant notifications",
      "Same-day approvals",
      "Full audit trail",
    ],
  },
  {
    title: "Seamless Integration",
    description: "AI agents that move data and trigger actions across all your systems.",
    icon: <Bot className="h-6 w-6" />,
    features: [
      "Real-time data sync",
      "Zero manual entry",
      "99.9% accuracy",
      "Team focuses on strategy",
    ],
  },
  {
    title: "Proactive Intelligence",
    description: "AI that spots patterns and alerts you before problems occur.",
    icon: <CheckCircle className="h-6 w-6" />,
    features: [
      "Predictive alerts",
      "Anomaly detection",
      "Automated escalation",
      "Continuous monitoring",
    ],
  },
];

export function AutomationSection() {
  return (
    <section id="services" className="relative py-24">
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
            From Manual Chaos to{" "}
            <span className="gradient-text">Seamless Automation</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            See how Houston businesses transform their operations with our AI implementation
          </p>
        </motion.div>

        {/* Before/After grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Before Column */}
          <div>
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mb-6 text-center text-lg font-semibold text-muted-foreground"
            >
              The Old Way
            </motion.h3>
            <div className="space-y-6">
              {beforeScenarios.map((scenario, index) => (
                <ScenarioCard
                  key={index}
                  {...scenario}
                  variant="before"
                />
              ))}
            </div>
          </div>

          {/* After Column */}
          <div>
            <motion.h3
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mb-6 text-center text-lg font-semibold text-primary"
            >
              The AI Way
            </motion.h3>
            <div className="space-y-6">
              {afterScenarios.map((scenario, index) => (
                <ScenarioCard
                  key={index}
                  {...scenario}
                  variant="after"
                />
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <ServicesModal>
            <Button magnetic size="xl" variant="secondary">
              See How We Do It
            </Button>
          </ServicesModal>
        </motion.div>
      </Container>
    </section>
  );
}
