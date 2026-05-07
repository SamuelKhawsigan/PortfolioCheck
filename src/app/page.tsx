import Navbar from "@/components/Navbar";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { ArrowRight, Code2, ExternalLink, Terminal, Award, Mail } from "lucide-react";

export default async function Home() {
  // Fetch all real data in parallel
  const [profile, projects, experiences, skills] = await Promise.all([
    prisma.profile.findFirst(),
    prisma.project.findMany({ where: { isPublished: true }, orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.experience.findMany({ orderBy: { startDate: "desc" } }),
    prisma.skill.findMany({ orderBy: { category: "asc" } }),
  ]);

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  return (
    <main style={{ padding: "120px 24px 60px" }}>
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────── */}
      <section style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center", minHeight: "60vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "24px" }}>
        <div className="animate-fade-in" style={{ background: "var(--accent)", color: "white", padding: "4px 14px", borderRadius: "20px", fontSize: "0.78rem", fontWeight: "700", letterSpacing: "1.5px" }}>
          AVAILABLE FOR HIRE
        </div>

        <h1 className="text-gradient" style={{ fontSize: "clamp(3rem, 8vw, 5rem)", lineHeight: "1.1", fontFamily: "var(--font-outfit)", fontWeight: "800" }}>
          {profile?.name ? `Hi, I'm ${profile.name.split(" ")[0]}.` : "Crafting Digital"}
          <br />
          {profile?.name ? "I Build Things for the Web." : "Experiences with Precision."}
        </h1>

        <p style={{ color: "var(--muted)", maxWidth: "600px", fontSize: "1.05rem" }}>
          {profile?.bio ?? "Expert Backend Engineer & Database Architect. Building scalable systems and elegant interfaces for the next generation of web applications."}
        </p>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="#projects" className="btn btn-primary" style={{ fontSize: "1rem" }}>
            View Projects <ArrowRight size={18} />
          </Link>
          <Link href="/contact" className="btn btn-ghost" style={{ fontSize: "1rem" }}>
            Contact Me
          </Link>
        </div>
      </section>

      {/* ── Projects ──────────────────────────────────────── */}
      <section id="projects" style={{ maxWidth: "1200px", margin: "120px auto" }}>
        <div style={{ marginBottom: "48px" }}>
          <h2 style={{ fontSize: "2.2rem", fontFamily: "var(--font-outfit)" }}>Selected Projects</h2>
          <p style={{ color: "var(--muted)" }}>A collection of work that defines my engineering standards.</p>
        </div>

        {projects.length === 0 ? (
          <p style={{ color: "var(--muted)" }}>No projects published yet. Check back soon!</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "28px" }}>
            {projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.slug}`} style={{ textDecoration: "none" }}>
                <div className="glass" style={{ overflow: "hidden", cursor: "pointer", transition: "var(--transition)", height: "100%" }}>
                  {/* Cover image */}
                  <div style={{ height: "200px", background: "linear-gradient(135deg, #0f0f0f, #1a1a1a)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    {project.imageUrl
                      ? <img src={project.imageUrl} alt={project.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <Code2 size={48} color="var(--card-border)" />
                    }
                  </div>

                  <div style={{ padding: "24px" }}>
                    {/* Tech stack pills */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
                      {project.techStack.slice(0, 4).map((tech: string) => (
                        <span key={tech} className="tag-pill">{tech}</span>
                      ))}
                    </div>

                    <h3 style={{ fontSize: "1.3rem", marginBottom: "8px" }}>{project.title}</h3>
                    <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "20px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {project.description}
                    </p>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", gap: "12px" }}>
                        {project.repoUrl && <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}><Code2 size={18} color="var(--muted)" /></a>}
                        {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}><ExternalLink size={18} color="var(--muted)" /></a>}
                      </div>
                      <ArrowRight size={18} color="var(--accent)" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── Skills & Experience ────────────────────────────── */}
      <section id="experience" style={{ maxWidth: "1200px", margin: "120px auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px" }}>
        {/* Skills */}
        <div>
          <h2 style={{ fontSize: "2rem", fontFamily: "var(--font-outfit)", marginBottom: "32px" }}>Expertise</h2>
          {Object.keys(skillsByCategory).length === 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="glass" style={{ padding: "24px" }}>
                <Terminal size={28} color="var(--accent)" style={{ marginBottom: "12px" }} />
                <h4 style={{ marginBottom: "8px" }}>Backend Development</h4>
                <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>Node.js, Go, Python, Distributed Systems</p>
              </div>
              <div className="glass" style={{ padding: "24px" }}>
                <Award size={28} color="var(--accent)" style={{ marginBottom: "12px" }} />
                <h4 style={{ marginBottom: "8px" }}>Cloud Architecture</h4>
                <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>AWS, Docker, Kubernetes, CI/CD</p>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {Object.entries(skillsByCategory).map(([category, catSkills]) => (
                <div key={category} className="glass" style={{ padding: "20px" }}>
                  <h4 style={{ marginBottom: "12px", color: "var(--accent)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px" }}>{category}</h4>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {catSkills.map((skill) => (
                      <span key={skill.id} className="tag-pill">{skill.name}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Experience Timeline */}
        <div>
          <h2 style={{ fontSize: "2rem", fontFamily: "var(--font-outfit)", marginBottom: "32px" }}>Experience</h2>
          {experiences.length === 0 ? (
            <p style={{ color: "var(--muted)" }}>Experience coming soon.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              {experiences.map((exp) => (
                <div key={exp.id} style={{ borderLeft: "2px solid var(--card-border)", paddingLeft: "24px", position: "relative" }}>
                  <div style={{ position: "absolute", left: "-7px", top: "4px", width: "12px", height: "12px", borderRadius: "50%", background: "var(--accent)" }} />
                  <h4 style={{ fontSize: "1.05rem", fontWeight: "700" }}>{exp.role}</h4>
                  <div style={{ fontSize: "0.85rem", color: "var(--accent)", marginBottom: "6px" }}>
                    {exp.company} &middot; {new Date(exp.startDate).getFullYear()} — {exp.endDate ? new Date(exp.endDate).getFullYear() : "Present"}
                  </div>
                  <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>{exp.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer style={{ maxWidth: "1200px", margin: "80px auto 0", paddingTop: "40px", borderTop: "1px solid var(--card-border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
          © {new Date().getFullYear()} {profile?.name ?? "Portfolio"}. All rights reserved.
        </div>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          {profile?.githubUrl && <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer"><Code2 size={20} color="var(--muted)" /></a>}
          {profile?.email && <a href={`mailto:${profile.email}`}><Mail size={20} color="var(--muted)" /></a>}
          <Link href="/blog" style={{ color: "var(--muted)", fontSize: "0.85rem" }}>Blog</Link>
        </div>
      </footer>
    </main>
  );
}
