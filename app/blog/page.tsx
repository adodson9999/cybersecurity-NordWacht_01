import { supabase } from "@/lib/supabase";
import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import { Container } from "@/components/container";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";

export const revalidate = 3600; // Revalidate every hour fallback

export const metadata = {
  title: "Insights & Articles | NordWacht",
  description: "Read the latest thoughts on AI automation, cybersecurity, and tech leadership.",
};

export default async function BlogIndexPage() {
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, summary, published_at, cover_image")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return (
    <>
      <NavBar />
      <main className="min-h-screen pt-32 pb-24 relative overflow-hidden">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h1 className="text-4xl font-bold sm:text-5xl mb-4">
              Insights & <span className="gradient-text">Articles</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Deep dives into AI, security, and the future of automation.
            </p>
          </div>

          {!posts || posts.length === 0 ? (
            <div className="text-center py-20 border border-dashed rounded-xl border-border bg-background/50">
              <p className="text-muted-foreground">Check back soon for our first article.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group relative glass rounded-2xl p-6 transition-all hover:shadow-[0_0_30px_rgba(var(--primary),0.15)] hover:border-primary/50 flex flex-col h-full">
                  {post.cover_image && (
                    <div className="w-full aspect-video rounded-lg overflow-hidden mb-4 bg-primary/5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={post.cover_image} alt={post.title} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" />
                    </div>
                  )}
                  <div className="flex-grow">
                    <p className="text-sm text-primary font-medium mb-2">
                      {format(new Date(post.published_at), 'MMMM d, yyyy')}
                    </p>
                    <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {post.summary}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center text-sm font-semibold text-primary">
                    Read Article <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
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
