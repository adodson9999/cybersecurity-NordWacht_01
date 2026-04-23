import { supabase } from "@/lib/supabase";
import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import { Container } from "@/components/container";
import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";

export const revalidate = 3600;

export const metadata = {
  title: "Case Studies | NordWacht",
  description: "See how NordWacht has transformed businesses through automation and advanced security protocols.",
};

export default async function CaseStudiesIndexPage() {
  const { data: studies } = await supabase
    .from("case_studies")
    .select("id, title, slug, client_name, results_summary, cover_image, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return (
    <>
      <NavBar />
      <main className="min-h-screen pt-32 pb-24 relative overflow-hidden">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h1 className="text-4xl font-bold sm:text-5xl mb-4">
              Proven <span className="gradient-text">Results</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Real-world implementations that drove measurable ROI and security posture improvements.
            </p>
          </div>

          {!studies || studies.length === 0 ? (
            <div className="text-center py-20 border border-dashed rounded-xl border-border bg-background/50">
              <p className="text-muted-foreground">Case studies are currently being curated.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {studies.map((study) => (
                <Link key={study.id} href={`/case-studies/${study.slug}`} className="group relative glass rounded-2xl overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(var(--primary),0.15)] hover:border-primary/50 flex flex-col h-full border border-border">
                  {study.cover_image && (
                    <div className="w-full h-64 bg-primary/5 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={study.cover_image} alt={study.title} className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                    </div>
                  )}
                  <div className="p-8 flex-grow relative z-10 -mt-20">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold mb-4 backdrop-blur-md border border-primary/20">
                      {study.client_name}
                    </div>
                    <h2 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                      {study.title}
                    </h2>
                    
                    <div className="mb-6 bg-background/50 p-4 rounded-xl border border-border/50">
                      <div className="flex items-start text-sm text-muted-foreground">
                        <TrendingUp className="h-5 w-5 text-green-500 mr-3 mt-0.5 shrink-0" />
                        <span className="font-medium text-foreground">{study.results_summary}</span>
                      </div>
                    </div>

                    <div className="flex items-center text-sm font-semibold text-primary">
                      Read Full Case Study <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
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
