import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import { Container } from "@/components/container";
import { BookingWizard } from "@/components/booking-wizard";

export const metadata = {
  title: "Book a Consultation | NordWacht",
  description: "Schedule a discovery call or consultation to discuss how NordWacht can transform your business with AI.",
};

export default function BookPage() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen pt-32 pb-24 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-4xl font-bold sm:text-5xl mb-4">
              Schedule Your <span className="gradient-text">Session</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Find a time that works for you. Our initial discovery calls are always free.
            </p>
          </div>

          <BookingWizard />
        </Container>
      </main>
      <Footer />
    </>
  );
}
