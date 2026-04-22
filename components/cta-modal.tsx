"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Sparkles, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CTAModalProps {
  children: React.ReactNode;
}

export function CTAModal({ children }: CTAModalProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Static form - just show success state
    setSubmitted(true);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      // Reset form when closing
      setTimeout(() => {
        setSubmitted(false);
        setEmail("");
        setName("");
        setCompany("");
      }, 200);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
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
                className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 p-4"
              >
                <div className="glass rounded-2xl p-8">
                  {/* Close button */}
                  <Dialog.Close asChild>
                    <button
                      className="absolute right-4 top-4 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
                      aria-label="Close"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </Dialog.Close>

                  {!submitted ? (
                    <>
                      {/* Header */}
                      <div className="mb-6 text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                          <Sparkles className="h-6 w-6 text-primary" />
                        </div>
                        <Dialog.Title className="text-2xl font-bold">
                          Get Your Free AI Audit
                        </Dialog.Title>
                        <Dialog.Description className="mt-2 text-muted-foreground">
                          Our $2,500-value audit identifies automation opportunities 
                          and provides a custom implementation roadmap.
                        </Dialog.Description>
                      </div>

                      {/* Form */}
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label
                            htmlFor="name"
                            className="mb-1.5 block text-sm font-medium"
                          >
                            Name
                          </label>
                          <input
                            id="name"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={cn(
                              "w-full rounded-lg border border-border bg-background px-4 py-3 text-sm",
                              "placeholder:text-muted-foreground",
                              "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
                              "transition-all duration-200"
                            )}
                            placeholder="John Smith"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="email"
                            className="mb-1.5 block text-sm font-medium"
                          >
                            Work Email
                          </label>
                          <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={cn(
                              "w-full rounded-lg border border-border bg-background px-4 py-3 text-sm",
                              "placeholder:text-muted-foreground",
                              "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
                              "transition-all duration-200"
                            )}
                            placeholder="john@company.com"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="company"
                            className="mb-1.5 block text-sm font-medium"
                          >
                            Company
                          </label>
                          <input
                            id="company"
                            type="text"
                            required
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className={cn(
                              "w-full rounded-lg border border-border bg-background px-4 py-3 text-sm",
                              "placeholder:text-muted-foreground",
                              "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
                              "transition-all duration-200"
                            )}
                            placeholder="Acme Corp"
                          />
                        </div>

                        <Button
                          type="submit"
                          size="lg"
                          magnetic
                          className="group mt-2 w-full font-bold"
                        >
                          Schedule My Free Audit
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </form>

                      <p className="mt-4 text-center text-xs text-muted-foreground">
                        No commitment required. We&apos;ll reach out within 24 hours.
                      </p>
                    </>
                  ) : (
                    /* Success state */
                    <div className="py-8 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
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
                      <h3 className="text-xl font-bold">You&apos;re All Set!</h3>
                      <p className="mt-2 text-muted-foreground">
                        Thanks, {name}! Our team will reach out within 24 hours 
                        to schedule your free AI Efficiency Audit.
                      </p>
                      <Dialog.Close asChild>
                        <Button variant="outline" className="mt-6">
                          Close
                        </Button>
                      </Dialog.Close>
                    </div>
                  )}
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
