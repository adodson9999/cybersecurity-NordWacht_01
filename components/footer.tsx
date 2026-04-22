"use client";

import Link from "next/link";
import { Shield, Mail, Phone, MapPin } from "lucide-react";
import { Container } from "@/components/container";
import { TerminalSimulator } from "@/components/terminal-simulator";
import { Button } from "@/components/ui/button";

const neighborhoods = [
  "The Heights",
  "Uptown",
  "Downtown",
  "Midtown",
  "Energy Corridor",
  "Memorial",
  "Galleria",
  "Medical Center",
];

const quickLinks = [
  { href: "#pricing", label: "Services" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 pt-16">
      <Container>
        {/* Main footer content */}
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Company info */}
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2 text-xl font-bold">
              <Shield className="h-7 w-7 text-primary" />
              <span>NordWacht</span>
            </Link>
            <p className="mb-6 text-muted-foreground">
              AI Implementation Agency serving Houston businesses. We transform 
              manual workflows into intelligent automation.
            </p>
            
            {/* Contact info */}
            <div className="space-y-3">
              <a
                href="mailto:hello@nordwacht.com"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Mail className="h-4 w-4" />
                hello@nordwacht.com
              </a>
              <a
                href="tel:+17135551234"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Phone className="h-4 w-4" />
                (713) 555-1234
              </a>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>
                  1234 Main Street, Suite 500<br />
                  Houston, TX 77002
                </span>
              </div>
            </div>
          </div>

          {/* Terminal section */}
          <div className="lg:col-span-1">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Live Agent Status
            </h3>
            <TerminalSimulator />
          </div>

          {/* Links & Service Areas */}
          <div className="grid gap-8 sm:grid-cols-2">
            {/* Quick Links */}
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Quick Links
              </h3>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Service Areas */}
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Service Areas
              </h3>
              <ul className="space-y-2">
                {neighborhoods.map((area) => (
                  <li key={area}>
                    <span className="text-sm text-muted-foreground">{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-16 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 p-8 text-center">
          <h3 className="mb-2 text-xl font-bold">Ready to stop wasting human capital?</h3>
          <p className="mb-6 text-muted-foreground">
            Get your free $2,500 AI Efficiency Audit today
          </p>
          <Button magnetic size="lg">
            Schedule Your Free Audit
          </Button>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border py-8 text-sm text-muted-foreground sm:flex-row">
          <p>&copy; {new Date().getFullYear()} NordWacht. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="transition-colors hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-foreground">
              Terms of Service
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
