import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import { Container } from "@/components/container";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Booking backend removed — cancellation links are no longer processed.
export default function CancelBookingPage() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen pt-32 pb-24 relative overflow-hidden flex items-center justify-center">
        <Container>
          <div className="mx-auto max-w-md glass rounded-2xl p-8 text-center shadow-2xl">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/20 mx-auto">
              <XCircle className="h-10 w-10 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold">Booking link unavailable</h2>
            <p className="text-muted-foreground mt-2 mb-8">
              Online booking management is currently disabled. To cancel or change
              a consultation, please reach out to us directly.
            </p>
            <div className="flex gap-3 w-full">
              <Button asChild variant="outline" className="flex-1">
                <a href="/">Return Home</a>
              </Button>
              <Button asChild className="flex-1">
                <a href="/contact">Contact Us</a>
              </Button>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
