import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Not Found" };
}

// Content backend removed — individual posts are unavailable.
export default async function BlogPostPage() {
  notFound();
}
