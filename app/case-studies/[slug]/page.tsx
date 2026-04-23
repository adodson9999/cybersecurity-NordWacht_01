import { supabase } from "@/lib/supabase";
import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import { Container } from "@/components/container";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata, ResolvingMetadata } from "next";

export const revalidate = 3600;

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const { data: study } = await supabase
    .from("case_studies")
    .select("title, results_summary, seo_keywords")
    .eq("slug", slug)
    .single();

  if (!study) return { title: "Not Found" };

  return {
    title: `${study.title} | NordWacht Case Studies`,
    description: study.results_summary,
    keywords: study.seo_keywords,
  };
}

export default async function CaseStudyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data: study } = await supabase
    .from("case_studies")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!study) {
    notFound();
  }

  return (
    <>
      <NavBar />
      <main className="min-h-screen pt-32 pb-24 relative overflow-hidden">
        {study.cover_image && (
          <div className="absolute top-0 left-0 w-full h-[50vh] opacity-20 -z-10 pointer-events-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={study.cover_image} alt="Background" className="w-full h-full object-cover blur-sm mask-image-b" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
          </div>
        )}

        <Container className="max-w-4xl">
          <Link href="/case-studies" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-10">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to case studies
          </Link>
          
          <article>
            <header className="mb-12 text-center">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6 border border-primary/20">
                <Building2 className="w-4 h-4 mr-2" />
                {study.client_name}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-8">
                {study.title}
              </h1>
              
              <div className="max-w-2xl mx-auto glass p-6 rounded-2xl border border-primary/20 text-left">
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-2">The Results</h3>
                <div className="flex items-start text-lg">
                  <TrendingUp className="h-6 w-6 text-green-500 mr-4 mt-1 shrink-0" />
                  <span className="font-medium">{study.results_summary}</span>
                </div>
              </div>
            </header>
            
            <div className="glass rounded-2xl p-8 md:p-12 mb-16">
              <div 
                className="prose prose-invert prose-primary max-w-none prose-lg"
                dangerouslySetInnerHTML={{ __html: study.content }}
              />
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Want similar results for your business?</h3>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Schedule a free discovery call to discuss your automation and security needs.
              </p>
              <Button asChild size="lg" className="shadow-[0_0_20px_rgba(var(--primary),0.2)] font-bold">
                <Link href="/book">Book Your Free Consultation</Link>
              </Button>
            </div>
          </article>
        </Container>
      </main>
      <Footer />
    </>
  );
}
