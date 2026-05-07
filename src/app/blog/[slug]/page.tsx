import Navbar from "@/components/Navbar";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar } from "lucide-react";
import { marked } from "marked";

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  });

  // Only show published posts
  if (!post || !post.publishedAt) notFound();

  // Convert the markdown content to HTML for rendering
  const htmlContent = marked(post.content);

  return (
    <main style={{ padding: "120px 24px 80px" }}>
      <Navbar />
      <article style={{ maxWidth: "780px", margin: "0 auto" }}>
        {/* Back */}
        <Link href="/blog" className="btn btn-ghost" style={{ marginBottom: "40px", display: "inline-flex" }}>
          <ArrowLeft size={16} /> Back to Blog
        </Link>

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
          {post.tags.map((tag: string) => (
            <span key={tag} className="tag-pill">{tag}</span>
          ))}
        </div>

        {/* Title */}
        <h1 style={{ fontSize: "2.8rem", fontFamily: "var(--font-outfit)", fontWeight: "800", lineHeight: "1.2", marginBottom: "16px" }}>
          {post.title}
        </h1>

        {/* Date */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--muted)", fontSize: "0.85rem", marginBottom: "48px" }}>
          <Calendar size={14} />
          {new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </div>

        {/* Content */}
        <div
          className="glass"
          style={{ padding: "40px" }}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </article>

      {/* Inline markdown content styles */}
      <style>{`
        .glass h1,.glass h2,.glass h3,.glass h4 { font-family: var(--font-outfit); margin: 1.5em 0 0.5em; }
        .glass p { color: rgba(255,255,255,0.82); line-height: 1.85; margin-bottom: 1em; }
        .glass a { color: var(--accent); text-decoration: underline; }
        .glass code { background: rgba(255,255,255,0.08); padding: 2px 6px; border-radius: 4px; font-size: 0.88em; }
        .glass pre { background: rgba(0,0,0,0.4); border: 1px solid var(--card-border); border-radius: 8px; padding: 20px; overflow-x: auto; margin-bottom: 1em; }
        .glass pre code { background: none; padding: 0; }
        .glass blockquote { border-left: 3px solid var(--accent); padding-left: 16px; color: var(--muted); margin: 1em 0; }
        .glass ul,.glass ol { padding-left: 24px; margin-bottom: 1em; }
        .glass li { margin-bottom: 4px; color: rgba(255,255,255,0.82); }
        .glass img { max-width: 100%; border-radius: 8px; margin: 1em 0; }
        .glass hr { border: none; border-top: 1px solid var(--card-border); margin: 2em 0; }
      `}</style>
    </main>
  );
}
