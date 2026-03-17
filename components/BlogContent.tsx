"use client";

import Link from "next/link";
import { useState } from "react";
import type { PostMeta } from "@/lib/blog";

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("es-ES", { dateStyle: "medium" }).format(new Date(iso));
}

type Category = "Todos" | "IRPF" | "Nómina" | "SS" | "Salario" | "Contratos";

const CATEGORY_STYLES: Record<Exclude<Category, "Todos">, { label: string; color: string; bg: string; border: string }> = {
  IRPF:      { label: "IRPF",        color: "#818cf8", bg: "rgba(99,102,241,0.12)",  border: "rgba(99,102,241,0.3)"  },
  Nómina:    { label: "Nómina",      color: "#34d399", bg: "rgba(52,211,153,0.12)",  border: "rgba(52,211,153,0.3)"  },
  SS:        { label: "Seg. Social", color: "#38bdf8", bg: "rgba(56,189,248,0.12)",  border: "rgba(56,189,248,0.3)"  },
  Salario:   { label: "Salario",     color: "#fbbf24", bg: "rgba(251,191,36,0.12)",  border: "rgba(251,191,36,0.3)"  },
  Contratos: { label: "Contratos",   color: "#f472b6", bg: "rgba(244,114,182,0.12)", border: "rgba(244,114,182,0.3)" },
};

function getCategory(slug: string): Exclude<Category, "Todos"> {
  if (/irpf|tramos|retenci|dos-pagadores|deduccion-maternidad/.test(slug)) return "IRPF";
  if (/nomina|como-leer|14-pagas|finiquito/.test(slug)) return "Nómina";
  if (/cotizaciones|seguridad-social/.test(slug)) return "SS";
  if (/contratar/.test(slug)) return "Contratos";
  return "Salario";
}

const FILTERS: { label: Category }[] = [
  { label: "Todos" },
  { label: "IRPF" },
  { label: "Nómina" },
  { label: "SS" },
  { label: "Salario" },
  { label: "Contratos" },
];

const FILTER_DISPLAY: Record<Category, string> = {
  Todos:     "Todos",
  IRPF:      "IRPF",
  Nómina:    "Nóminas",
  SS:        "Seguridad Social",
  Salario:   "Salarios",
  Contratos: "Contratos",
};

const SALARY_CHIPS = [
  { slug: "20000", label: "20.000€" },
  { slug: "25000", label: "25.000€" },
  { slug: "30000", label: "30.000€" },
  { slug: "35000", label: "35.000€" },
  { slug: "40000", label: "40.000€" },
  { slug: "50000", label: "50.000€" },
];

export default function BlogContent({ posts }: { posts: PostMeta[] }) {
  const [active, setActive] = useState<Category>("Todos");

  const filtered = active === "Todos"
    ? posts
    : posts.filter((p) => getCategory(p.slug) === active);

  const featured = filtered.slice(0, 2);
  const rest = filtered.slice(2);

  return (
    <>
      {/* ── Category filters ── */}
      <section className="px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const isActive = active === f.label;
              return (
                <button
                  key={f.label}
                  onClick={() => setActive(f.label)}
                  className="text-sm px-4 py-1.5 rounded-full transition-all duration-150"
                  style={
                    isActive
                      ? { background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.45)", color: "#a5b4fc", fontWeight: 600 }
                      : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "#6060a0" }
                  }
                >
                  {FILTER_DISPLAY[f.label]}
                  {f.label !== "Todos" && (
                    <span className="ml-1.5 text-xs opacity-60">
                      ({posts.filter((p) => getCategory(p.slug) === f.label).length})
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {filtered.length === 0 && (
        <div className="px-4 pb-16 text-center" style={{ color: "#6060a0" }}>
          <p className="text-sm">No hay artículos en esta categoría todavía.</p>
        </div>
      )}

      {/* ── Featured cards (top 2) ── */}
      {featured.length > 0 && (
        <section className="px-4 pb-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {featured.map((post) => {
                const cat = getCategory(post.slug);
                const s = CATEGORY_STYLES[cat];
                return (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-card-v2 group flex flex-col rounded-2xl p-7">
                    <span className="self-start text-xs font-semibold px-2.5 py-1 rounded-full mb-4"
                      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>
                      {s.label}
                    </span>
                    <h2 className="font-syne font-bold mb-3 line-clamp-2"
                      style={{ fontSize: "clamp(1.05rem, 2.5vw, 1.3rem)", color: "#eeeeff", lineHeight: 1.45 }}>
                      {post.title}
                    </h2>
                    <p className="text-sm leading-relaxed flex-1 mb-6 line-clamp-3" style={{ color: "#8a8ab0" }}>
                      {post.description}
                    </p>
                    <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                      <div className="flex items-center gap-3">
                        <span className="text-xs" style={{ color: "#6060a0" }}>{formatDate(post.date)}</span>
                        <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                          style={{ background: "rgba(99,102,241,0.08)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.15)" }}>
                          <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden>
                            <circle cx="6" cy="6" r="5" stroke="#818cf8" strokeWidth="1.3"/>
                            <path d="M6 3.5V6l1.5 1.5" stroke="#818cf8" strokeWidth="1.3" strokeLinecap="round"/>
                          </svg>
                          {post.readTime}
                        </span>
                      </div>
                      <span className="blog-card-v2-arrow flex items-center gap-1.5 text-xs font-semibold" style={{ color: "#818cf8" }}>
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

      {/* ── Rest — 3-col grid ── */}
      {rest.length > 0 && (
        <section className="flex-1 px-4 pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map((post) => {
                const cat = getCategory(post.slug);
                const s = CATEGORY_STYLES[cat];
                return (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-card-v2 group flex flex-col rounded-2xl p-6">
                    <span className="self-start text-xs font-semibold px-2.5 py-1 rounded-full mb-4"
                      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>
                      {s.label}
                    </span>
                    <h3 className="font-syne font-bold mb-3 line-clamp-2"
                      style={{ fontSize: "clamp(0.95rem, 2.2vw, 1.1rem)", color: "#eeeeff", lineHeight: 1.45 }}>
                      {post.title}
                    </h3>
                    <p className="text-sm leading-relaxed flex-1 mb-5 line-clamp-3" style={{ color: "#8a8ab0" }}>
                      {post.description}
                    </p>
                    <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                      <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ color: "#6060a0" }}>{formatDate(post.date)}</span>
                        <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                          style={{ background: "rgba(99,102,241,0.08)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.15)" }}>
                          <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden>
                            <circle cx="6" cy="6" r="5" stroke="#818cf8" strokeWidth="1.3"/>
                            <path d="M6 3.5V6l1.5 1.5" stroke="#818cf8" strokeWidth="1.3" strokeLinecap="round"/>
                          </svg>
                          {post.readTime}
                        </span>
                      </div>
                      <span className="blog-card-v2-arrow flex items-center gap-1 text-xs font-semibold" style={{ color: "#818cf8" }}>
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
          <div className="rounded-2xl px-6 py-6" style={{ background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.14)" }}>
            <p className="font-syne font-bold text-sm mb-1" style={{ color: "#e0e0ff" }}>Calcula tu salario exacto</p>
            <p className="text-xs mb-4" style={{ color: "#6060a0" }}>Neto mensual en Madrid · Soltero/a sin hijos · 2026</p>
            <div className="flex flex-wrap gap-2">
              {SALARY_CHIPS.map((s) => (
                <Link key={s.slug} href={`/cuanto-es-${s.slug}-euros-brutos-neto`}
                  className="text-sm px-4 py-2 rounded-full salary-chip transition-all duration-200"
                  style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", color: "#818cf8" }}>
                  {s.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
