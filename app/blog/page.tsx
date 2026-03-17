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
  return new Intl.DateTimeFormat("es-ES", { dateStyle: "medium" }).format(
    new Date(iso)
  );
}

type Category = "IRPF" | "Nómina" | "SS" | "Salario" | "Contratos";

const CATEGORY_STYLES: Record<Category, { label: string; color: string; bg: string; border: string }> = {
  IRPF:      { label: "IRPF",             color: "#818cf8", bg: "rgba(99,102,241,0.12)",  border: "rgba(99,102,241,0.3)"  },
  Nómina:    { label: "Nómina",           color: "#34d399", bg: "rgba(52,211,153,0.12)",  border: "rgba(52,211,153,0.3)"  },
  SS:        { label: "Seg. Social",      color: "#38bdf8", bg: "rgba(56,189,248,0.12)",  border: "rgba(56,189,248,0.3)"  },
  Salario:   { label: "Salario",          color: "#fbbf24", bg: "rgba(251,191,36,0.12)",  border: "rgba(251,191,36,0.3)"  },
  Contratos: { label: "Contratos",        color: "#f472b6", bg: "rgba(244,114,182,0.12)", border: "rgba(244,114,182,0.3)" },
};

function getCategory(slug: string): Category {
  if (/irpf|tramos|retenci|dos-pagadores|deduccion-maternidad/.test(slug)) return "IRPF";
  if (/nomina|como-leer|14-pagas|finiquito/.test(slug)) return "Nómina";
  if (/cotizaciones|seguridad-social|contratar/.test(slug)) return "SS";
  if (/contratar/.test(slug)) return "Contratos";
  return "Salario";
}

const SALARY_CHIPS = [
  { slug: "20000", label: "20.000€" },
  { slug: "25000", label: "25.000€" },
  { slug: "30000", label: "30.000€" },
  { slug: "35000", label: "35.000€" },
  { slug: "40000", label: "40.000€" },
  { slug: "50000", label: "50.000€" },
];

const CATEGORY_FILTERS: { label: string; active?: boolean }[] = [
  { label: "Todos", active: true },
  { label: "IRPF" },
  { label: "Nóminas" },
  { label: "Seguridad Social" },
  { label: "Salarios" },
  { label: "Contratos" },
];

export default function BlogPage() {
  const posts = getAllPosts();
  const featured = posts.slice(0, 2);
  const rest = posts.slice(2);

  return (
    <main className="min-h-screen" style={{ background: "#080810" }}>
      {/* Background gradient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 55% at 50% -5%, rgba(99,102,241,0.13) 0%, transparent 65%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 flex flex-col min-h-screen">

        {/* ── Header ── */}
        <header className="px-4 pt-10 pb-12 md:pt-16 md:pb-16">
          <div
            className="max-w-4xl mx-auto rounded-3xl px-6 py-10 md:px-10 md:py-14 relative overflow-hidden"
            style={{
              background: "linear-gradient(160deg, rgba(30,20,60,0.6) 0%, rgba(8,8,16,0.4) 100%)",
              border: "1px solid rgba(99,102,241,0.18)",
            }}
          >
            {/* Subtle inner glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(99,102,241,0.1) 0%, transparent 70%)",
              }}
              aria-hidden
            />

            <div className="relative z-10">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-xs mb-7" style={{ color: "#4a4a6a" }}>
                <Link href="/" className="hover:underline" style={{ color: "#818CF8" }}>Inicio</Link>
                <span>/</span>
                <span style={{ color: "#7c7ca0" }}>Blog</span>
              </nav>

              {/* Title */}
              <h1
                className="font-syne font-extrabold tracking-tight leading-snug mb-3"
                style={{ fontSize: "clamp(1.9rem, 6vw, 3.2rem)", color: "#f0f0ff" }}
              >
                Blog sobre{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #6366f1 0%, #818cf8 45%, #a5b4fc 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    display: "inline-block",
                    paddingBottom: "0.1em",
                  }}
                >
                  nóminas e IRPF
                </span>
              </h1>

              <p className="text-sm md:text-base mb-8" style={{ color: "#7c7ca0" }}>
                {posts.length} guías prácticas sobre salarios, impuestos y Seguridad Social en España.
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-2.5">
                {[
                  { label: "✓ Actualizado 2026", color: "#34d399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.25)" },
                  { label: "✓ Ejemplos reales",  color: "#818cf8", bg: "rgba(99,102,241,0.1)", border: "rgba(99,102,241,0.25)" },
                  { label: "✓ Datos AEAT",       color: "#818cf8", bg: "rgba(99,102,241,0.1)", border: "rgba(99,102,241,0.25)" },
                ].map((b) => (
                  <span
                    key={b.label}
                    className="inline-flex items-center text-xs font-medium px-3 py-1.5 rounded-full"
                    style={{ background: b.bg, border: `1px solid ${b.border}`, color: b.color }}
                  >
                    {b.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* ── Category filters ── */}
        <section className="px-4 pb-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-2">
              {CATEGORY_FILTERS.map((f) => (
                <span
                  key={f.label}
                  className="text-sm px-4 py-1.5 rounded-full cursor-default select-none"
                  style={
                    f.active
                      ? { background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.45)", color: "#a5b4fc", fontWeight: 600 }
                      : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "#6060a0" }
                  }
                >
                  {f.label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Featured cards (2 latest) ── */}
        {featured.length > 0 && (
          <section className="px-4 pb-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {featured.map((post) => {
                  const cat = getCategory(post.slug);
                  const style = CATEGORY_STYLES[cat];
                  return (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="blog-card-v2 group flex flex-col rounded-2xl p-7"
                    >
                      {/* Category badge */}
                      <span
                        className="self-start text-xs font-semibold px-2.5 py-1 rounded-full mb-4"
                        style={{ background: style.bg, border: `1px solid ${style.border}`, color: style.color }}
                      >
                        {style.label}
                      </span>

                      {/* Title */}
                      <h2
                        className="font-syne font-bold mb-3 line-clamp-2"
                        style={{ fontSize: "clamp(1.05rem, 2.5vw, 1.3rem)", color: "#eeeeff", lineHeight: 1.45 }}
                      >
                        {post.title}
                      </h2>

                      {/* Description */}
                      <p className="text-sm leading-relaxed flex-1 mb-6 line-clamp-3" style={{ color: "#8a8ab0" }}>
                        {post.description}
                      </p>

                      {/* Footer */}
                      <div
                        className="flex items-center justify-between pt-4"
                        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs" style={{ color: "#6060a0" }}>{formatDate(post.date)}</span>
                          <span
                            className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                            style={{ background: "rgba(99,102,241,0.08)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.15)" }}
                          >
                            <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden>
                              <circle cx="6" cy="6" r="5" stroke="#818cf8" strokeWidth="1.3"/>
                              <path d="M6 3.5V6l1.5 1.5" stroke="#818cf8" strokeWidth="1.3" strokeLinecap="round"/>
                            </svg>
                            {post.readTime}
                          </span>
                        </div>
                        <span
                          className="blog-card-v2-arrow flex items-center gap-1.5 text-xs font-semibold"
                          style={{ color: "#818cf8" }}
                        >
                          Leer
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                            <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── Rest of articles — 3-col grid ── */}
        {rest.length > 0 && (
          <section className="flex-1 px-4 pb-16">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {rest.map((post) => {
                  const cat = getCategory(post.slug);
                  const style = CATEGORY_STYLES[cat];
                  return (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="blog-card-v2 group flex flex-col rounded-2xl p-6"
                    >
                      {/* Category badge */}
                      <span
                        className="self-start text-xs font-semibold px-2.5 py-1 rounded-full mb-4"
                        style={{ background: style.bg, border: `1px solid ${style.border}`, color: style.color }}
                      >
                        {style.label}
                      </span>

                      {/* Title */}
                      <h3
                        className="font-syne font-bold mb-3 line-clamp-2"
                        style={{ fontSize: "clamp(0.95rem, 2.2vw, 1.1rem)", color: "#eeeeff", lineHeight: 1.45 }}
                      >
                        {post.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm leading-relaxed flex-1 mb-5 line-clamp-3" style={{ color: "#8a8ab0" }}>
                        {post.description}
                      </p>

                      {/* Footer */}
                      <div
                        className="flex items-center justify-between pt-4"
                        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs" style={{ color: "#6060a0" }}>{formatDate(post.date)}</span>
                          <span
                            className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                            style={{ background: "rgba(99,102,241,0.08)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.15)" }}
                          >
                            <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden>
                              <circle cx="6" cy="6" r="5" stroke="#818cf8" strokeWidth="1.3"/>
                              <path d="M6 3.5V6l1.5 1.5" stroke="#818cf8" strokeWidth="1.3" strokeLinecap="round"/>
                            </svg>
                            {post.readTime}
                          </span>
                        </div>
                        <span
                          className="blog-card-v2-arrow flex items-center gap-1 text-xs font-semibold"
                          style={{ color: "#818cf8" }}
                        >
                          Leer
                          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
                            <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── Salary quick access ── */}
        <section className="px-4 pb-12">
          <div className="max-w-6xl mx-auto">
            <div
              className="rounded-2xl px-6 py-7"
              style={{ background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.14)" }}
            >
              <p className="font-syne font-bold text-sm mb-1" style={{ color: "#e0e0ff" }}>
                Calcula tu salario exacto
              </p>
              <p className="text-xs mb-4" style={{ color: "#6060a0" }}>
                Neto mensual en Madrid · Soltero/a sin hijos · 2026
              </p>
              <div className="flex flex-wrap gap-2">
                {SALARY_CHIPS.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/cuanto-es-${s.slug}-euros-brutos-neto`}
                    className="text-sm px-4 py-2 rounded-full transition-all duration-200 salary-chip"
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
