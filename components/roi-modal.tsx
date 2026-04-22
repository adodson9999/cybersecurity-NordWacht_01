"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Calculator, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ROICalculator } from "@/components/roi-calculator";
import { CTAModal } from "@/components/cta-modal";
import { ServicesModal } from "@/components/services-modal";

interface ROIModalProps {
  children: React.ReactNode;
}

export function ROIModal({ children }: ROIModalProps) {
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
                className="fixed left-1/2 top-1/2 z-50 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 p-4"
              >
                <div className="glass max-h-[90vh] overflow-y-auto rounded-2xl p-6 md:p-8">
                  {/* Close button */}
                  <Dialog.Close asChild>
                    <button
                      className="absolute right-4 top-4 z-10 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
                      aria-label="Close"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </Dialog.Close>

                  {/* Header */}
                  <div className="mb-6 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#50C878]/20">
                      <Calculator className="h-6 w-6 text-[#50C878]" />
                    </div>
                    <Dialog.Title className="text-2xl font-bold">
                      Calculate Your{" "}
                      <span className="bg-gradient-to-r from-[#50C878] to-[#50C878]/60 bg-clip-text text-transparent">
                        Automation ROI
                      </span>
                    </Dialog.Title>
                    <Dialog.Description className="mt-2 text-muted-foreground">
                      Adjust the sliders to see your potential savings with
                      AI-powered automation.
                    </Dialog.Description>
                  </div>

                  {/* Calculator Body */}
                  <ROICalculator />

                  {/* ── Conversion Hub Footer ── */}
                  <div className="mt-8 border-t border-white/[0.06] pt-6">
                    <p className="mb-4 text-center text-sm text-[#A1A1A1]">
                      Ready to unlock these savings?
                    </p>
                    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                      <CTAModal>
                        <Button
                          size="lg"
                          className="group w-full bg-[#50C878] font-bold text-[#0D0D0D] hover:brightness-110 sm:w-auto"
                        >
                          Book a Call
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </CTAModal>
                      <ServicesModal>
                        <Button
                          variant="ghost"
                          size="lg"
                          className="w-full border-2 border-[#50C878] text-white hover:bg-[#50C878]/10 sm:w-auto"
                        >
                          Services
                        </Button>
                      </ServicesModal>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
