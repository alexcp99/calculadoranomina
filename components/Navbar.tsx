"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const CALCULADORAS = [
  {
    href: "/",
    label: "Calculadora de Nómina",
    desc: "Bruto → Neto, SS e IRPF",
    badge: undefined as string | undefined,
  },
  {
    href: "/calculadora-retencion-irpf",
    label: "Retención IRPF",
    desc: "Porcentaje que te retiene Hacienda",
    badge: "Nuevo",
  },
];

const ALL_SALARIES = [
  { slug: "15000",  label: "15.000€",  neto: "1.221€" },
  { slug: "16000",  label: "16.000€",  neto: "1.298€" },
  { slug: "18000",  label: "18.000€",  neto: "1.436€" },
  { slug: "20000",  label: "20.000€",  neto: "1.575€" },
  { slug: "22000",  label: "22.000€",  neto: "1.693€" },
  { slug: "24000",  label: "24.000€",  neto: "1.820€" },
  { slug: "25000",  label: "25.000€",  neto: "1.911€" },
  { slug: "28000",  label: "28.000€",  neto: "2.107€" },
  { slug: "30000",  label: "30.000€",  neto: "2.274€" },
  { slug: "32000",  label: "32.000€",  neto: "2.388€" },
  { slug: "35000",  label: "35.000€",  neto: "2.520€" },
  { slug: "40000",  label: "40.000€",  neto: "2.876€" },
  { slug: "45000",  label: "45.000€",  neto: "3.145€" },
  { slug: "50000",  label: "50.000€",  neto: "3.414€" },
  { slug: "60000",  label: "60.000€",  neto: "3.795€" },
  { slug: "70000",  label: "70.000€",  neto: "4.289€" },
  { slug: "80000",  label: "80.000€",  neto: "4.740€" },
  { slug: "100000", label: "100.000€", neto: "5.631€" },
];

const SAL_COL1 = ALL_SALARIES.slice(0, 6);   // 15k – 24k
const SAL_COL2 = ALL_SALARIES.slice(6, 12);  // 25k – 40k
const SAL_COL3 = ALL_SALARIES.slice(12, 18); // 45k – 100k
const ALL_SALARY_SLUGS = ALL_SALARIES.map((s) => s.slug);

const NAV_SIMPLE = [
  { href: "/blog",           label: "Blog"          },
  { href: "/metodologia",    label: "Metodología"   },
  { href: "/sobre-nosotros", label: "Sobre nosotros" },
];

// ─── Chevron ──────────────────────────────────────────────────────────────────

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="10" height="10" viewBox="0 0 10 10" fill="none"
      className="transition-transform duration-200"
      style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}
    >
      <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconCalc() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1.5" y="1.5" width="11" height="11" rx="1.5" />
      <path d="M4 4h2M4 7h6M4 10h4" />
    </svg>
  );
}

function IconPct() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="7" r="5.5" />
      <path d="M4.5 9.5l5-5M5 5.5h.01M9 8.5h.01" />
    </svg>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

export default function Navbar() {
  const pathname = usePathname();
  const [open,            setOpen]            = useState(false);
  const [scrolled,        setScrolled]        = useState(false);
  const [dropCalc,        setDropCalc]        = useState(false);
  const [dropSal,         setDropSal]         = useState(false);
  const [mobileCalcOpen,  setMobileCalcOpen]  = useState(false);
  const [mobileSalOpen,   setMobileSalOpen]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setDropCalc(false);
    setDropSal(false);
    setMobileCalcOpen(false);
    setMobileSalOpen(false);
  }, [pathname]);

  const isCalcActive    = pathname === "/" || pathname === "/calculadora-retencion-irpf";
  const isSalaryActive  = ALL_SALARY_SLUGS.some((slug) => pathname === `/cuanto-es-${slug}-euros-brutos-neto`);
  const isActive        = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  // shared drop-panel style
  const dropPanel = {
    background: "#0d0d1a",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
  };

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(8,8,16,0.97)" : "rgba(8,8,16,0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.5)" : "0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-14 md:h-16">

        {/* ── Logo ── */}
        <Link href="/" className="group flex items-center gap-2.5 shrink-0" aria-label="Calculadora Nomina — Inicio">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all group-hover:scale-105"
            style={{ background: "linear-gradient(135deg, #4f52d4 0%, #6366f1 100%)", boxShadow: "0 0 0 1px rgba(99,102,241,0.3)" }}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
              <rect x="2"   y="2"  width="4.5" height="3" rx="0.75" fill="white" opacity="0.9" />
              <rect x="8.5" y="2"  width="4.5" height="3" rx="0.75" fill="white" opacity="0.5" />
              <rect x="2"   y="6.5" width="4.5" height="2" rx="0.75" fill="white" opacity="0.5" />
              <rect x="8.5" y="6.5" width="4.5" height="2" rx="0.75" fill="white" opacity="0.5" />
              <rect x="2"   y="10" width="4.5" height="3" rx="0.75" fill="white" opacity="0.5" />
              <rect x="8.5" y="10" width="4.5" height="3" rx="0.75" fill="white" opacity="0.9" />
            </svg>
          </div>
          <span className="font-syne font-bold text-sm leading-none transition-opacity group-hover:opacity-90">
            <span style={{ color: "#e0e0ff" }}>Calculadora</span>
            <span style={{ color: "#818cf8" }}>Nomina</span>
          </span>
        </Link>

        {/* ── Desktop nav ── */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Navegación principal">

          {/* ── Calculadoras dropdown ── */}
          <div
            className="relative"
            onMouseEnter={() => setDropCalc(true)}
            onMouseLeave={() => setDropCalc(false)}
          >
            <button
              className="flex items-center gap-1 text-sm rounded-lg transition-all duration-200"
              style={{
                color:      isCalcActive ? "#ffffff" : "#e5e7eb",
                background: isCalcActive ? "rgba(99,102,241,0.15)" : "transparent",
                padding: "6px 12px",
              }}
            >
              Calculadoras
              <Chevron open={dropCalc} />
            </button>

            <div
              className="absolute top-full left-0 w-64 pt-2 transition-all duration-200"
              style={{
                opacity:       dropCalc ? 1 : 0,
                pointerEvents: dropCalc ? "auto" : "none",
                transform:     dropCalc ? "translateY(0)" : "translateY(-4px)",
              }}
            >
              <div className="rounded-xl overflow-hidden" style={dropPanel}>
                <div className="p-2">
                  <p className="text-xs font-semibold uppercase tracking-wider px-3 py-1.5" style={{ color: "#4a4a6a" }}>
                    Herramientas
                  </p>
                  {CALCULADORAS.map((c) => {
                    const Icon = c.href === "/" ? IconCalc : IconPct;
                    const active = c.href === "/" ? pathname === "/" : pathname === c.href;
                    return (
                      <Link
                        key={c.href}
                        href={c.href}
                        className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg transition-colors"
                        style={{ color: "#e0e0ff", background: active ? "rgba(99,102,241,0.1)" : "transparent" }}
                        onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.08)"; }}
                        onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = active ? "rgba(99,102,241,0.1)" : "transparent"; }}
                      >
                        <span className="mt-0.5 shrink-0" style={{ color: "#818cf8" }}><Icon /></span>
                        <span className="flex-1 min-w-0">
                          <span className="flex items-center gap-1.5">
                            <span className="text-sm font-medium whitespace-nowrap">{c.label}</span>
                            {c.badge && (
                              <span className="text-xs font-semibold px-1.5 py-0.5 rounded" style={{ background: "rgba(99,102,241,0.25)", color: "#a5b4fc" }}>{c.badge}</span>
                            )}
                          </span>
                          <span className="text-xs block mt-0.5" style={{ color: "#5a5a80" }}>{c.desc}</span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ── Salarios dropdown ── */}
          <div
            className="relative"
            onMouseEnter={() => setDropSal(true)}
            onMouseLeave={() => setDropSal(false)}
          >
            <button
              className="flex items-center gap-1 text-sm rounded-lg transition-all duration-200"
              style={{
                color:      isSalaryActive ? "#ffffff" : "#e5e7eb",
                background: isSalaryActive ? "rgba(99,102,241,0.15)" : "transparent",
                padding: "6px 12px",
              }}
            >
              Salarios
              <Chevron open={dropSal} />
            </button>

            <div
              className="absolute top-full left-0 pt-2 transition-all duration-200"
              style={{
                opacity:       dropSal ? 1 : 0,
                pointerEvents: dropSal ? "auto" : "none",
                transform:     dropSal ? "translateY(0)" : "translateY(-4px)",
                width: 440,
              }}
            >
              <div className="rounded-xl overflow-hidden" style={dropPanel}>
                <div className="p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider px-1 pb-2" style={{ color: "#4a4a6a" }}>
                    ¿Cuánto cobro con...?
                  </p>
                  <div className="grid grid-cols-3 gap-x-0.5">
                    {[SAL_COL1, SAL_COL2, SAL_COL3].map((col, ci) => (
                      <div key={ci}>
                        {col.map((s) => {
                          const active = pathname === `/cuanto-es-${s.slug}-euros-brutos-neto`;
                          return (
                            <Link
                              key={s.slug}
                              href={`/cuanto-es-${s.slug}-euros-brutos-neto`}
                              className="flex items-center justify-between px-2 py-1.5 rounded-lg transition-colors"
                              style={{ color: active ? "#a5b4fc" : "#e0e0ff", background: active ? "rgba(99,102,241,0.1)" : "transparent" }}
                              onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.08)"; }}
                              onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = active ? "rgba(99,102,241,0.1)" : "transparent"; }}
                            >
                              <span className="text-sm whitespace-nowrap">{s.label}</span>
                              <span className="text-xs ml-1 shrink-0 tabnum" style={{ color: "#34d399" }}>{s.neto}</span>
                            </Link>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Blog + Metodología + Sobre nosotros ── */}
          {NAV_SIMPLE.map(({ href, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className="relative text-sm rounded-lg transition-all duration-200"
                style={{
                  color:      active ? "#ffffff" : "#e5e7eb",
                  background: active ? "rgba(99,102,241,0.15)" : "transparent",
                  padding: "6px 12px",
                }}
                onMouseEnter={(e) => { if (!active) { (e.currentTarget as HTMLElement).style.color = "#ffffff"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; } }}
                onMouseLeave={(e) => { if (!active) { (e.currentTarget as HTMLElement).style.color = "#e5e7eb";  (e.currentTarget as HTMLElement).style.background = "transparent"; } }}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* ── Right: badge + hamburger ── */}
        <div className="flex items-center gap-3">
          <div
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
            style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.18)", color: "#6ee7b7" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" style={{ boxShadow: "0 0 6px rgba(52,211,153,0.7)" }} />
            Actualizado AEAT 2026
          </div>

          <button
            className="md:hidden flex flex-col justify-center items-center w-9 h-9 rounded-lg gap-[5px] transition-colors"
            style={{ background: open ? "rgba(99,102,241,0.1)" : "transparent" }}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
          >
            <span className="block w-5 h-px rounded-full transition-all duration-300 origin-center" style={{ background: "#a0a0c0", transform: open ? "translateY(6px) rotate(45deg)"  : "none" }} />
            <span className="block w-5 h-px rounded-full transition-all duration-200"               style={{ background: "#a0a0c0", opacity: open ? 0 : 1, transform: open ? "scaleX(0)"  : "scaleX(1)" }} />
            <span className="block w-5 h-px rounded-full transition-all duration-300 origin-center" style={{ background: "#a0a0c0", transform: open ? "translateY(-6px) rotate(-45deg)" : "none" }} />
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight:  open ? "900px" : "0px",
          background: "#0d0d1a",
          borderTop:  open ? "1px solid rgba(255,255,255,0.05)" : "none",
        }}
      >
        <nav className="px-4 py-2 flex flex-col" aria-label="Menú móvil">

          {/* Calculadoras accordion */}
          <button
            className="flex items-center justify-between w-full px-3 py-4 text-base font-medium transition-colors"
            style={{ color: isCalcActive ? "#ffffff" : "#a0a0c0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
            onClick={() => setMobileCalcOpen((v) => !v)}
          >
            <span className="flex items-center gap-2">
              {isCalcActive && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#6366f1" }} />}
              Calculadoras
            </span>
            <Chevron open={mobileCalcOpen} />
          </button>
          <div
            className="overflow-hidden transition-all duration-300"
            style={{ maxHeight: mobileCalcOpen ? "200px" : "0px", borderBottom: mobileCalcOpen ? "1px solid rgba(255,255,255,0.05)" : "none" }}
          >
            {CALCULADORAS.map((c) => {
              const Icon = c.href === "/" ? IconCalc : IconPct;
              const active = c.href === "/" ? pathname === "/" : pathname === c.href;
              return (
                <Link
                  key={c.href}
                  href={c.href}
                  className="flex items-center gap-3 pl-6 pr-3 py-3.5 text-sm font-medium transition-colors"
                  style={{ color: active ? "#a5b4fc" : "#7c7ca0" }}
                >
                  <span style={{ color: "#818cf8" }}><Icon /></span>
                  {c.label}
                  {c.badge && (
                    <span className="text-xs font-semibold px-1.5 py-0.5 rounded ml-auto" style={{ background: "rgba(99,102,241,0.25)", color: "#a5b4fc" }}>{c.badge}</span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Salarios accordion */}
          <button
            className="flex items-center justify-between w-full px-3 py-4 text-base font-medium transition-colors"
            style={{ color: isSalaryActive ? "#ffffff" : "#a0a0c0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
            onClick={() => setMobileSalOpen((v) => !v)}
          >
            <span className="flex items-center gap-2">
              {isSalaryActive && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#6366f1" }} />}
              Salarios
            </span>
            <Chevron open={mobileSalOpen} />
          </button>
          <div
            className="overflow-hidden transition-all duration-300"
            style={{ maxHeight: mobileSalOpen ? "320px" : "0px", borderBottom: mobileSalOpen ? "1px solid rgba(255,255,255,0.05)" : "none" }}
          >
            <div className="overflow-y-auto" style={{ maxHeight: "320px" }}>
              <p className="text-xs font-semibold uppercase tracking-wider pl-6 pr-3 pt-2 pb-1" style={{ color: "#4a4a6a" }}>
                ¿Cuánto cobro con...?
              </p>
              {ALL_SALARIES.map((s) => {
                const active = pathname === `/cuanto-es-${s.slug}-euros-brutos-neto`;
                return (
                  <Link
                    key={s.slug}
                    href={`/cuanto-es-${s.slug}-euros-brutos-neto`}
                    className="flex items-center justify-between pl-6 pr-3 py-2.5 text-sm transition-colors"
                    style={{ color: active ? "#e0e0ff" : "#7c7ca0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                  >
                    <span>{s.label} brutos</span>
                    <span className="text-xs tabnum" style={{ color: "#34d399" }}>{s.neto}/mes</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Simple links */}
          {NAV_SIMPLE.map(({ href, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-4 text-base font-medium transition-colors"
                style={{ color: active ? "#ffffff" : "#a0a0c0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
              >
                {active && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#6366f1" }} />}
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
