import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Blog sobre nóminas, IRPF y Seguridad Social en España",
  description:
    "Artículos sobre IRPF 2026, Seguridad Social, salario bruto y neto, tramos del IRPF y todo lo que necesitas saber sobre tu nómina en España.",
  alternates: {
    canonical: "https://calculadoranomina.org/blog",
  },
  openGraph: {
    title: "Blog — Calculadora de Nómina",
    description:
      "Artículos sobre IRPF 2026, Seguridad Social y nóminas en España.",
    url: "https://calculadoranomina.org/blog",
    type: "website",
  },
};

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("es-ES", { dateStyle: "long" }).format(
    new Date(iso)
  );
}

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="min-h-screen" style={{ background: "#080810" }}>
      {/* Radial gradient spotlight */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 55% at 50% -5%, rgba(99,102,241,0.13) 0%, transparent 65%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="pt-8 pb-4 px-4 md:pt-14 md:pb-10">
          <div className="max-w-3xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs mb-8" style={{ color: "#4a4a6a" }}>
              <Link href="/" className="hover:underline" style={{ color: "#818CF8" }}>
                Inicio
              </Link>
              <span>/</span>
              <span style={{ color: "#7c7ca0" }}>Blog</span>
            </nav>

            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
              style={{
                background: "rgba(99,102,241,0.1)",
                border: "1px solid rgba(99,102,241,0.22)",
                color: "#818CF8",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                style={{ boxShadow: "0 0 6px rgba(52,211,153,0.7)" }}
              />
              Artículos · IRPF y Nóminas 2026
            </div>

            <h1
              className="font-syne font-extrabold tracking-tight leading-tight mb-3"
              style={{ fontSize: "clamp(1.8rem, 6vw, 3rem)", color: "#f0f0ff" }}
            >
              Blog sobre{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #6366f1 0%, #818cf8 45%, #a5b4fc 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                nóminas e IRPF
              </span>
            </h1>
            <p className="text-sm md:text-base" style={{ color: "#7c7ca0" }}>
              Guías prácticas sobre salarios, impuestos y Seguridad Social en España.
            </p>
          </div>
        </header>

        {/* Articles grid */}
        <section className="flex-1 px-4 pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group blog-card flex flex-col h-full rounded-2xl p-5 md:p-6"
                >
                  {/* Meta row */}
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="text-xs font-medium"
                      style={{ color: "#818CF8" }}
                    >
                      {formatDate(post.date)}
                    </span>
                    <span style={{ color: "#3e3e60" }}>·</span>
                    <span className="text-xs" style={{ color: "#4a4a6a" }}>
                      {post.readTime} lectura
                    </span>
                  </div>

                  {/* Title */}
                  <h2
                    className="font-syne font-bold mb-2 leading-snug group-hover:text-indigo-300 transition-colors"
                    style={{
                      fontSize: "clamp(1rem, 3vw, 1.2rem)",
                      color: "#e0e0ff",
                    }}
                  >
                    {post.title}
                  </h2>

                  {/* Description */}
                  <p className="text-sm leading-relaxed flex-1" style={{ color: "#7c7ca0" }}>
                    {post.description}
                  </p>

                  {/* Keywords */}
                  {post.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {post.keywords.slice(0, 3).map((kw) => (
                        <span
                          key={kw}
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            background: "rgba(99,102,241,0.08)",
                            border: "1px solid rgba(99,102,241,0.18)",
                            color: "#818CF8",
                          }}
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Salary chips */}
        <section className="px-4 pb-10">
          <div className="max-w-6xl mx-auto">
            <div
              className="rounded-2xl px-6 py-5"
              style={{ background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.12)" }}
            >
              <p className="text-sm font-semibold mb-3" style={{ color: "#c0c0e0" }}>
                Calcula tu salario exacto
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { slug: "20000", label: "20.000€" },
                  { slug: "25000", label: "25.000€" },
                  { slug: "30000", label: "30.000€" },
                  { slug: "40000", label: "40.000€" },
                  { slug: "50000", label: "50.000€" },
                ].map((s) => (
                  <Link
                    key={s.slug}
                    href={`/cuanto-es-${s.slug}-euros-brutos-neto`}
                    className="text-sm px-4 py-2 rounded-full transition-all duration-200"
                    style={{
                      background: "rgba(99,102,241,0.1)",
                      border: "1px solid rgba(99,102,241,0.2)",
                      color: "#818cf8",
                    }}
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <SiteFooter />
      </div>
    </main>
  );
}
