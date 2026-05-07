import Navbar from "@/components/Navbar";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Code2, ExternalLink, ArrowLeft, Calendar } from "lucide-react";

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await prisma.project.findUnique({
    where: { slug: params.slug, isPublished: true },
  });

  if (!project) notFound();

  return (
    <main style={{ padding: "120px 24px 80px" }}>
      <Navbar />
      <article style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Back */}
        <Link href="/#projects" className="btn btn-ghost" style={{ marginBottom: "32px", display: "inline-flex" }}>
          <ArrowLeft size={16} /> Back to Projects
        </Link>

        {/* Cover */}
        <div style={{ width: "100%", height: "360px", background: "linear-gradient(135deg, #0f0f0f, #1a1a1a)", borderRadius: "16px", overflow: "hidden", marginBottom: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {project.imageUrl
            ? <img src={project.imageUrl} alt={project.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <Code2 size={64} color="var(--card-border)" />
          }
        </div>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
            {project.techStack.map((tech: string) => (
              <span key={tech} className="tag-pill">{tech}</span>
            ))}
          </div>
          <h1 style={{ fontSize: "2.5rem", fontFamily: "var(--font-outfit)", fontWeight: "800", marginBottom: "12px" }}>{project.title}</h1>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", color: "var(--muted)", fontSize: "0.85rem" }}>
            <Calendar size={14} />
            {new Date(project.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>

        {/* Description */}
        <div className="glass" style={{ padding: "32px", marginBottom: "32px" }}>
          <p style={{ fontSize: "1.05rem", lineHeight: "1.8", color: "rgba(255,255,255,0.85)" }}>{project.description}</p>
        </div>

        {/* Links */}
        <div style={{ display: "flex", gap: "16px" }}>
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              <Code2 size={16} /> View Source Code
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <ExternalLink size={16} /> View Live Demo
            </a>
          )}
        </div>
      </article>
    </main>
  );
}
