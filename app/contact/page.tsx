"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Phone, MapPin, Send } from "lucide-react";
import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const services = [
  "Workflow Automation",
  "Document Processing",
  "Data Integration",
  "Custom AI Solutions",
  "AI Strategy Consulting",
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
    services: [] as string[],
  });
  const [submitted, setSubmitted] = useState(false);

  const handleServiceToggle = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <NavBar />
      <main className="min-h-screen pt-32 pb-16">
        <Container>
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </motion.div>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left column - Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-balance text-4xl font-bold sm:text-5xl">
                Let&apos;s Discuss Your{" "}
                <span className="gradient-text">Automation Strategy</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Ready to stop wasting human capital? Tell us about your challenges 
                and we&apos;ll show you how AI can transform your operations.
              </p>

              {/* Contact info */}
              <div className="mt-12 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email Us</h3>
                    <a
                      href="mailto:hello@nordwacht.com"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      hello@nordwacht.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/20">
                    <Phone className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Call Us</h3>
                    <a
                      href="tel:+17135551234"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      (713) 555-1234
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/20">
                    <MapPin className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Visit Us</h3>
                    <p className="text-muted-foreground">
                      1234 Main Street, Suite 500<br />
                      Houston, TX 77002
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right column - Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {!submitted ? (
                <form
                  onSubmit={handleSubmit}
                  className="glass rounded-2xl p-8"
                >
                  <div className="space-y-6">
                    {/* Name */}
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="mb-1.5 block text-sm font-medium"
                      >
                        Name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className={cn(
                          "w-full rounded-lg border border-border bg-background px-4 py-3 text-sm",
                          "placeholder:text-muted-foreground",
                          "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
                          "transition-all duration-200"
                        )}
                        placeholder="John Smith"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="mb-1.5 block text-sm font-medium"
                      >
                        Work Email *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className={cn(
                          "w-full rounded-lg border border-border bg-background px-4 py-3 text-sm",
                          "placeholder:text-muted-foreground",
                          "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
                          "transition-all duration-200"
                        )}
                        placeholder="john@company.com"
                      />
                    </div>

                    {/* Company */}
                    <div>
                      <label
                        htmlFor="contact-company"
                        className="mb-1.5 block text-sm font-medium"
                      >
                        Company
                      </label>
                      <input
                        id="contact-company"
                        type="text"
                        value={formData.company}
                        onChange={(e) =>
                          setFormData({ ...formData, company: e.target.value })
                        }
                        className={cn(
                          "w-full rounded-lg border border-border bg-background px-4 py-3 text-sm",
                          "placeholder:text-muted-foreground",
                          "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
                          "transition-all duration-200"
                        )}
                        placeholder="Acme Corp"
                      />
                    </div>

                    {/* Services */}
                    <div>
                      <label className="mb-3 block text-sm font-medium">
                        Services of Interest
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {services.map((service) => (
                          <button
                            key={service}
                            type="button"
                            onClick={() => handleServiceToggle(service)}
                            className={cn(
                              "rounded-full border px-4 py-2 text-sm transition-all duration-200",
                              formData.services.includes(service)
                                ? "border-primary bg-primary/20 text-primary"
                                : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                            )}
                          >
                            {service}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label
                        htmlFor="contact-message"
                        className="mb-1.5 block text-sm font-medium"
                      >
                        Message *
                      </label>
                      <textarea
                        id="contact-message"
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        className={cn(
                          "w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm",
                          "placeholder:text-muted-foreground",
                          "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
                          "transition-all duration-200"
                        )}
                        placeholder="Tell us about your automation challenges..."
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      magnetic
                      className="group w-full font-bold"
                    >
                      Send Message
                      <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="glass flex flex-col items-center justify-center rounded-2xl p-12 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                    <svg
                      className="h-8 w-8 text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold">Message Sent!</h3>
                  <p className="mt-2 text-muted-foreground">
                    Thanks for reaching out, {formData.name}! Our team will 
                    get back to you within 24 hours.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: "",
                        email: "",
                        company: "",
                        message: "",
                        services: [],
                      });
                    }}
                  >
                    Send Another Message
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
