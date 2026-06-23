import Link from "next/link";
import { CalendarClock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { contactInfo } from "@/lib/contact-info";

// Online booking is currently disabled (scheduling backend removed).
// Visitors are directed to reach out directly to arrange a call.
export function BookingWizard() {
  return (
    <div className="mx-auto max-w-xl glass rounded-2xl p-8 md:p-12 text-center shadow-2xl">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto">
        <CalendarClock className="h-8 w-8 text-primary" />
      </div>
      <h2 className="text-2xl font-bold">Online booking coming soon</h2>
      <p className="text-muted-foreground mt-3 mb-8">
        Self-serve scheduling isn&apos;t available yet. To arrange a free discovery
        call, send us a quick message and we&apos;ll find a time that works.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button asChild size="lg" className="font-semibold">
          <Link href="/contact">Request a Call</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="font-semibold">
          <a href={contactInfo.emailLink}>
            <Mail className="mr-2 h-4 w-4" />
            Email Us
          </a>
        </Button>
      </div>
    </div>
  );
}
