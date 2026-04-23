"use client";

import { useState, use } from "react";
import { supabase } from "@/lib/supabase";
import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import { Container } from "@/components/container";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CancelBookingPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [reason, setReason] = useState("");

  async function handleCancel(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const { data, error } = await supabase.functions.invoke('cancel-booking', {
        body: { 
          cancel_token: token,
          cancel_reason: reason || undefined
        }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setStatus("success");
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Failed to cancel booking. The link may have expired.");
      setStatus("error");
    }
  }

  return (
    <>
      <NavBar />
      <main className="min-h-screen pt-32 pb-24 relative overflow-hidden flex items-center justify-center">
        <Container>
          <div className="mx-auto max-w-md glass rounded-2xl p-8 shadow-2xl">
            {status === "idle" && (
              <form onSubmit={handleCancel} className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold">Cancel Booking</h2>
                  <p className="text-muted-foreground mt-2">Are you sure you want to cancel your consultation?</p>
                </div>
                
                <div>
                  <label className="mb-1.5 block text-xs font-medium">Reason for cancelling (optional)</label>
                  <textarea
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g. Schedule conflict"
                    className="w-full resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-destructive focus:outline-none focus:ring-1 focus:ring-destructive"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button asChild variant="outline" className="flex-1">
                    <a href="/">Keep Booking</a>
                  </Button>
                  <Button type="submit" variant="destructive" className="flex-1">
                    Yes, Cancel It
                  </Button>
                </div>
              </form>
            )}

            {status === "loading" && (
              <div className="flex flex-col items-center text-center py-8">
                <Loader2 className="h-12 w-12 animate-spin text-destructive mb-4" />
                <h2 className="text-2xl font-bold">Cancelling...</h2>
              </div>
            )}

            {status === "success" && (
              <div className="flex flex-col items-center text-center py-4">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
                  <CheckCircle2 className="h-10 w-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold">Booking Cancelled</h2>
                <p className="text-muted-foreground mt-2 mb-8">
                  Your meeting has been successfully cancelled. We hope to connect with you in the future.
                </p>
                <Button asChild className="w-full">
                  <a href="/">Return to Home</a>
                </Button>
              </div>
            )}

            {status === "error" && (
              <div className="flex flex-col items-center text-center py-4">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/20">
                  <XCircle className="h-10 w-10 text-destructive" />
                </div>
                <h2 className="text-2xl font-bold">Cancellation Failed</h2>
                <p className="text-muted-foreground mt-2 mb-8">
                  {errorMessage}
                </p>
                <Button asChild variant="outline" className="w-full">
                  <a href="/contact">Contact Support</a>
                </Button>
              </div>
            )}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
