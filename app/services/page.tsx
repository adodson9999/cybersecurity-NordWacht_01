import { supabase } from "@/lib/supabase";
import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import { Container } from "@/components/container";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

export const revalidate = 3600;

export const metadata = {
  title: "Cybersecurity & Automation Services | NordWacht",
  description: "Explore our comprehensive suite of AI automation and cybersecurity services tailored for your business.",
};

export default async function ServicesIndexPage() {
  const { data: services } = await supabase
    .from("services")
    .select("id, title, slug, summary, icon_name, display_order")
    .eq("status", "published")
    .order("display_order", { ascending: true });

  return (
    <>
      <NavBar />
      <main className="min-h-screen pt-32 pb-24 relative overflow-hidden">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h1 className="text-4xl font-bold sm:text-5xl mb-4">
              Our <span className="gradient-text">Services</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Strategic consulting and implementation for the modern security landscape.
            </p>
          </div>

          {!services || services.length === 0 ? (
            <div className="text-center py-20 border border-dashed rounded-xl border-border bg-background/50">
              <p className="text-muted-foreground">Services are currently being updated.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <Link key={service.id} href={`/services/${service.slug}`} className="group relative glass rounded-2xl p-8 transition-all hover:shadow-[0_0_30px_rgba(var(--primary),0.15)] hover:border-primary/50 flex flex-col h-full">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {/* Placeholder for dynamic icon. You could map icon_name to Lucide icons here */}
                    <ShieldCheck className="h-7 w-7" />
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {service.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {service.summary}
                    </p>
                  </div>
                  <div className="mt-8 flex items-center text-sm font-semibold text-primary">
                    Learn More <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
}
