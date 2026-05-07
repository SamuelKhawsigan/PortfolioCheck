import Navbar from "@/components/Navbar";
import { ArrowRight, AtSign, ExternalLink, Code2, Terminal, Award } from "lucide-react";

export default function Home() {
  return (
    <main style={{ padding: "120px 24px 60px" }}>
      <Navbar />
      
      {/* Hero Section */}
      <section style={{ 
        maxWidth: "1000px", 
        margin: "0 auto", 
        textAlign: "center",
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "24px"
      }}>
        <div className="animate-fade-in" style={{ 
          background: "var(--accent)", 
          color: "white", 
          padding: "4px 12px", 
          borderRadius: "20px", 
          fontSize: "0.8rem",
          fontWeight: "600",
          letterSpacing: "1px"
        }}>
          AVAILABLE FOR HIRE
        </div>
        <h1 className="text-gradient" style={{ 
          fontSize: "clamp(3rem, 8vw, 5rem)", 
          lineHeight: "1.1",
          fontFamily: "var(--font-outfit)",
          fontWeight: "800"
        }}>
          Crafting Digital<br />Experiences with Precision.
        </h1>
        <p style={{ 
          color: "var(--muted)", 
          maxWidth: "600px", 
          fontSize: "1.1rem",
          margin: "12px 0 24px"
        }}>
          Expert Backend Engineer & Database Architect. Building scalable systems and elegant interfaces for the next generation of web applications.
        </p>
        <div style={{ display: "flex", gap: "16px" }}>
          <button className="glass" style={{ 
            background: "var(--accent)", 
            color: "white", 
            padding: "12px 32px", 
            fontSize: "1rem",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            View Projects <ArrowRight size={18} />
          </button>
          <button className="glass" style={{ padding: "12px 32px", fontSize: "1rem" }}>
            Contact Me
          </button>
        </div>
      </section>

      {/* Grid Section */}
      <section id="projects" style={{ maxWidth: "1200px", margin: "100px auto" }}>
        <div style={{ marginBottom: "48px" }}>
          <h2 style={{ fontSize: "2rem", fontFamily: "var(--font-outfit)" }}>Selected Projects</h2>
          <p style={{ color: "var(--muted)" }}>A collection of work that defines my engineering standards.</p>
        </div>
        
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", 
          gap: "32px" 
        }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass" style={{ padding: "0", overflow: "hidden", cursor: "pointer" }}>
              <div style={{ 
                height: "220px", 
                background: "linear-gradient(45deg, #1a1a1a, #0a0a0a)", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center" 
              }}>
                <Code2 size={48} color="var(--card-border)" />
              </div>
              <div style={{ padding: "24px" }}>
                <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                  <span style={{ fontSize: "0.7rem", color: "var(--accent)", fontWeight: "bold" }}>NEXT.JS</span>
                  <span style={{ fontSize: "0.7rem", color: "var(--accent)", fontWeight: "bold" }}>POSTGRESQL</span>
                </div>
                <h3 style={{ fontSize: "1.4rem", marginBottom: "8px" }}>Project Alpha v0.{i}</h3>
                <p style={{ color: "var(--muted)", fontSize: "0.95rem", marginBottom: "20px" }}>
                  A high-performance scalable backend system with real-time data processing and advanced analytics.
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <Code2 size={18} color="var(--muted)" />
                    <ExternalLink size={18} color="var(--muted)" />
                  </div>
                  <ArrowRight size={18} color="var(--accent)" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills & Experience */}
      <section id="experience" style={{ maxWidth: "1200px", margin: "100px auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px" }}>
        <div>
          <h2 style={{ fontSize: "2rem", fontFamily: "var(--font-outfit)", marginBottom: "32px" }}>Expertise</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            <div className="glass" style={{ padding: "24px" }}>
              <Terminal size={32} color="var(--accent)" style={{ marginBottom: "16px" }} />
              <h4 style={{ marginBottom: "8px" }}>Backend Development</h4>
              <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>Node.js, Go, Python, Distributed Systems.</p>
            </div>
            <div className="glass" style={{ padding: "24px" }}>
              <Award size={32} color="var(--accent)" style={{ marginBottom: "16px" }} />
              <h4 style={{ marginBottom: "8px" }}>Cloud Architecture</h4>
              <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>AWS, Docker, Kubernetes, CI/CD.</p>
            </div>
          </div>
        </div>
        
        <div>
          <h2 style={{ fontSize: "2rem", fontFamily: "var(--font-outfit)", marginBottom: "32px" }}>Experience</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {[1, 2].map(i => (
              <div key={i} style={{ borderLeft: "2px solid var(--card-border)", paddingLeft: "24px", position: "relative" }}>
                <div style={{ 
                  position: "absolute", 
                  left: "-7px", 
                  top: "0", 
                  width: "12px", 
                  height: "12px", 
                  borderRadius: "50%", 
                  background: "var(--accent)" 
                }}></div>
                <h4 style={{ fontSize: "1.1rem" }}>Senior Software Architect</h4>
                <div style={{ fontSize: "0.85rem", color: "var(--accent)", marginBottom: "8px" }}>Tech Giant Inc. | 2022 - Present</div>
                <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                  Leading the development of core infrastructure and optimizing database performance for millions of users.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        maxWidth: "1200px", 
        margin: "100px auto 0", 
        paddingTop: "60px", 
        borderTop: "1px solid var(--card-border)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
          © 2026 Portfolio Backend. All rights reserved.
        </div>
        <div style={{ display: "flex", gap: "24px" }}>
          <AtSign size={20} color="var(--muted)" />
          <Code2 size={20} color="var(--muted)" />
          <AtSign size={20} color="var(--muted)" />
        </div>
      </footer>
    </main>
  );
}
