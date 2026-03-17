import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import SiteFooter from "@/components/SiteFooter";
import BlogContent from "@/components/BlogContent";

export const metadata: Metadata = {
  title: "Blog sobre nóminas, IRPF y Seguridad Social en España",
  description:
    "Artículos sobre IRPF 2026, Seguridad Social, salario bruto y neto, tramos del IRPF y todo lo que necesitas saber sobre tu nómina en España.",
  alternates: { canonical: "https://calculadoranomina.org/blog" },
  openGraph: {
    title: "Blog — Calculadora de Nómina",
    description: "Artículos sobre IRPF 2026, Seguridad Social y nóminas en España.",
    url: "https://calculadoranomina.org/blog",
    type: "website",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="min-h-screen" style={{ background: "#080810" }}>
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 90% 55% at 50% -5%, rgba(99,102,241,0.13) 0%, transparent 65%)" }}
        aria-hidden
      />

      <div className="relative z-10 flex flex-col min-h-screen">

        {/* ── Header compacto ── */}
        <header className="px-4 pt-8 pb-6 md:pt-12 md:pb-8">
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs mb-5" style={{ color: "#4a4a6a" }}>
              <Link href="/" className="hover:underline" style={{ color: "#818CF8" }}>Inicio</Link>
              <span>/</span>
              <span style={{ color: "#7c7ca0" }}>Blog</span>
            </nav>

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h1
                  className="font-syne font-extrabold tracking-tight leading-snug mb-2"
                  style={{ fontSize: "clamp(1.5rem, 5vw, 2.4rem)", color: "#f0f0ff" }}
                >
                  Blog sobre{" "}
                  <span
                    style={{
                      background: "linear-gradient(135deg, #6366f1 0%, #818cf8 45%, #a5b4fc 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      display: "inline-block",
                      paddingBottom: "0.08em",
                    }}
                  >
                    nóminas e IRPF
                  </span>
                </h1>
                <p className="text-sm" style={{ color: "#7c7ca0" }}>
                  {posts.length} guías prácticas sobre salarios, impuestos y Seguridad Social.
                </p>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-2 shrink-0">
                {[
                  { label: "✓ Actualizado 2026", color: "#34d399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.22)" },
                  { label: "✓ Datos AEAT",       color: "#818cf8", bg: "rgba(99,102,241,0.1)", border: "rgba(99,102,241,0.22)" },
                ].map((b) => (
                  <span key={b.label} className="inline-flex items-center text-xs font-medium px-3 py-1.5 rounded-full"
                    style={{ background: b.bg, border: `1px solid ${b.border}`, color: b.color }}>
                    {b.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* ── Interactive content (filters + cards) ── */}
        <BlogContent posts={posts} />

        <SiteFooter />
      </div>
    </main>
  );
}
