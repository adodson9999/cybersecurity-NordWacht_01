import { supabase } from "@/lib/supabase";
import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import { Container } from "@/components/container";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata, ResolvingMetadata } from "next";

export const revalidate = 3600;

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const { data: service } = await supabase
    .from("services")
    .select("title, summary, seo_keywords")
    .eq("slug", slug)
    .single();

  if (!service) return { title: "Not Found" };

  return {
    title: `${service.title} | NordWacht Services`,
    description: service.summary,
    keywords: service.seo_keywords,
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data: service } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!service) {
    notFound();
  }

  return (
    <>
      <NavBar />
      <main className="min-h-screen pt-32 pb-24 relative overflow-hidden">
        {/* Background glow specific to services */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />

        <Container className="max-w-4xl">
          <Link href="/services" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-10">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to all services
          </Link>
          
          <div className="grid md:grid-cols-[1fr_300px] gap-12">
            <article>
              <header className="mb-10">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  {service.title}
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {service.summary}
                </p>
              </header>
              
              <div 
                className="prose prose-invert prose-primary max-w-none prose-lg"
                dangerouslySetInnerHTML={{ __html: service.content }}
              />
            </article>

            {/* Sticky Sidebar */}
            <aside className="relative">
              <div className="sticky top-32 glass rounded-2xl p-6 border border-primary/20">
                <h3 className="text-lg font-bold mb-4">Ready to secure your business?</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Book a discovery call to discuss how this service applies to your specific infrastructure.
                </p>
                <Button asChild className="w-full shadow-[0_0_20px_rgba(var(--primary),0.2)]">
                  <Link href="/book">Book Consultation</Link>
                </Button>
                
                <hr className="my-6 border-border" />
                
                <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider text-muted-foreground">What you get</h4>
                <ul className="space-y-3">
                  <li className="flex items-start text-sm">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-3" />
                    <span>Expert Analysis</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-3" />
                    <span>Actionable Reporting</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-3" />
                    <span>Continuous Support</span>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
