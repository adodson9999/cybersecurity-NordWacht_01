"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { supabase } from "@/lib/supabase";
import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import { Container } from "@/components/container";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ConfirmBookingPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function confirmBooking() {
      try {
        const { data, error } = await supabase.functions.invoke('confirm-booking', {
          body: { confirmation_token: token }
        });

        if (error) throw error;
        if (data?.error) throw new Error(data.error);

        setStatus("success");
      } catch (err: any) {
        console.error(err);
        setErrorMessage(err.message || "Failed to confirm booking.");
        setStatus("error");
      }
    }

    if (token) {
      confirmBooking();
    }
  }, [token]);

  return (
    <>
      <NavBar />
      <main className="min-h-screen pt-32 pb-24 relative overflow-hidden flex items-center justify-center">
        <Container>
          <div className="mx-auto max-w-md glass rounded-2xl p-8 text-center shadow-2xl">
            {status === "loading" && (
              <div className="flex flex-col items-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <h2 className="text-2xl font-bold">Confirming Booking...</h2>
                <p className="text-muted-foreground mt-2">Please wait while we verify your token.</p>
              </div>
            )}

            {status === "success" && (
              <div className="flex flex-col items-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
                  <CheckCircle2 className="h-10 w-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
                <p className="text-muted-foreground mt-2 mb-8">
                  Your meeting is officially locked in our calendar. You will receive a calendar invite shortly if you haven't already.
                </p>
                <Button asChild className="w-full">
                  <a href="/">Return to Home</a>
                </Button>
              </div>
            )}

            {status === "error" && (
              <div className="flex flex-col items-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/20">
                  <XCircle className="h-10 w-10 text-destructive" />
                </div>
                <h2 className="text-2xl font-bold">Confirmation Failed</h2>
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
