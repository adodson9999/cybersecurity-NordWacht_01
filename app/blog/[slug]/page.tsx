import { supabase } from "@/lib/supabase";
import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import { Container } from "@/components/container";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata, ResolvingMetadata } from "next";

export const revalidate = 3600;

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const { data: post } = await supabase
    .from("blog_posts")
    .select("title, summary, seo_keywords")
    .eq("slug", slug)
    .single();

  if (!post) return { title: "Not Found" };

  return {
    title: `${post.title} | NordWacht Blog`,
    description: post.summary,
    keywords: post.seo_keywords,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) {
    notFound();
  }

  return (
    <>
      <NavBar />
      <main className="min-h-screen pt-32 pb-24 relative overflow-hidden">
        <Container className="max-w-3xl">
          <Link href="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to all articles
          </Link>
          
          <article className="glass rounded-2xl p-8 md:p-12">
            <header className="mb-10 border-b border-border pb-8">
              <p className="text-primary font-medium mb-4">
                {format(new Date(post.published_at), 'MMMM d, yyyy')}
              </p>
              <h1 className="text-3xl md:text-5xl font-bold mb-6">
                {post.title}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {post.summary}
              </p>
            </header>
            
            {post.cover_image && (
              <div className="mb-12 rounded-xl overflow-hidden bg-primary/5 aspect-video">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div 
              className="prose prose-invert prose-primary max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>
        </Container>
      </main>
      <Footer />
    </>
  );
}
