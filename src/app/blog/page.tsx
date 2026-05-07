import Navbar from "@/components/Navbar";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Calendar, Tag } from "lucide-react";

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <main style={{ padding: "120px 24px 80px" }}>
      <Navbar />
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ marginBottom: "60px" }}>
          <h1 style={{ fontSize: "2.5rem", fontFamily: "var(--font-outfit)", fontWeight: "800", marginBottom: "12px" }}>Blog</h1>
          <p style={{ color: "var(--muted)", fontSize: "1.05rem" }}>Thoughts, tutorials, and insights on software engineering.</p>
        </div>

        {posts.length === 0 ? (
          <div className="glass" style={{ padding: "60px", textAlign: "center" }}>
            <p style={{ color: "var(--muted)" }}>No posts yet. Check back soon!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                <article className="glass" style={{ padding: "28px", transition: "var(--transition)" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
                    {post.tags.map((tag: string) => (
                      <span key={tag} className="tag-pill">{tag}</span>
                    ))}
                  </div>
                  <h2 style={{ fontSize: "1.4rem", fontWeight: "700", marginBottom: "10px" }}>{post.title}</h2>
                  <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "16px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {post.content.replace(/[#*`_>-]/g, "").slice(0, 200)}…
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--muted)", fontSize: "0.8rem" }}>
                    <Calendar size={14} />
                    {new Date(post.publishedAt!).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
