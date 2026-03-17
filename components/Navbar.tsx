"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const SALARY_GROUPS = [
  {
    label: "Salarios bajos",
    items: [
      { slug: "15000", label: "15.000€", neto: "1.221€/mes" },
      { slug: "16000", label: "16.000€", neto: "1.298€/mes" },
      { slug: "18000", label: "18.000€", neto: "1.436€/mes" },
      { slug: "20000", label: "20.000€", neto: "1.575€/mes" },
    ],
  },
  {
    label: "Salarios medios",
    items: [
      { slug: "22000", label: "22.000€", neto: "1.693€/mes" },
      { slug: "24000", label: "24.000€", neto: "1.820€/mes" },
      { slug: "25000", label: "25.000€", neto: "1.911€/mes" },
      { slug: "28000", label: "28.000€", neto: "2.107€/mes" },
      { slug: "30000", label: "30.000€", neto: "2.274€/mes" },
      { slug: "32000", label: "32.000€", neto: "2.388€/mes" },
      { slug: "35000", label: "35.000€", neto: "2.520€/mes" },
    ],
  },
  {
    label: "Salarios altos",
    items: [
      { slug: "40000", label: "40.000€", neto: "2.876€/mes" },
      { slug: "45000", label: "45.000€", neto: "3.145€/mes" },
      { slug: "50000", label: "50.000€", neto: "3.414€/mes" },
      { slug: "60000", label: "60.000€", neto: "3.795€/mes" },
      { slug: "70000", label: "70.000€", neto: "4.289€/mes" },
      { slug: "80000", label: "80.000€", neto: "4.740€/mes" },
      { slug: "100000", label: "100.000€", neto: "5.631€/mes" },
    ],
  },
];

const ALL_SALARY_SLUGS = SALARY_GROUPS.flatMap((g) => g.items.map((i) => i.slug));

const NAV_LINKS = [
  { href: "/", label: "Calculadora" },
  { href: "/blog", label: "Blog" },
  { href: "/metodologia", label: "Metodología" },
  { href: "/sobre-nosotros", label: "Sobre nosotros" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); setDropdownOpen(false); }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const isSalaryActive = ALL_SALARY_SLUGS.some((slug) =>
    pathname === `/cuanto-es-${slug}-euros-brutos-neto`
  );

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
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <rect x="2" y="2" width="4.5" height="3" rx="0.75" fill="white" opacity="0.9" />
              <rect x="8.5" y="2" width="4.5" height="3" rx="0.75" fill="white" opacity="0.5" />
              <rect x="2" y="6.5" width="4.5" height="2" rx="0.75" fill="white" opacity="0.5" />
              <rect x="8.5" y="6.5" width="4.5" height="2" rx="0.75" fill="white" opacity="0.5" />
              <rect x="2" y="10" width="4.5" height="3" rx="0.75" fill="white" opacity="0.5" />
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
          {/* Calculadora link */}
          <Link
            href="/"
            className="relative text-sm rounded-lg transition-all duration-200"
            style={{
              color: isActive("/") ? "#ffffff" : "#e5e7eb",
              background: isActive("/") ? "rgba(99,102,241,0.15)" : "transparent",
              padding: "6px 12px",
            }}
            onMouseEnter={(e) => { if (!isActive("/")) { (e.currentTarget as HTMLElement).style.color = "#ffffff"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; } }}
            onMouseLeave={(e) => { if (!isActive("/")) { (e.currentTarget as HTMLElement).style.color = "#e5e7eb"; (e.currentTarget as HTMLElement).style.background = "transparent"; } }}
          >
            Calculadora
          </Link>

          {/* Calculadoras dropdown */}
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              className="flex items-center gap-1 text-sm rounded-lg transition-all duration-200"
              style={{
                color: isSalaryActive ? "#ffffff" : "#e5e7eb",
                background: isSalaryActive ? "rgba(99,102,241,0.15)" : "transparent",
                padding: "6px 12px",
              }}
            >
              Calculadoras
              <svg
                width="10" height="10" viewBox="0 0 10 10" fill="none"
                className="transition-transform duration-200"
                style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Dropdown panel — pt-2 bridges the gap so mouse stays in hover zone */}
            <div
              className="absolute top-full left-0 w-72 pt-2 transition-all duration-200"
              style={{
                opacity: dropdownOpen ? 1 : 0,
                pointerEvents: dropdownOpen ? "auto" : "none",
                transform: dropdownOpen ? "translateY(0)" : "translateY(-4px)",
              }}
            >
              <div
                className="rounded-xl overflow-hidden"
                style={{
                  background: "#0d0d1a",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
                }}
              >
              <div className="p-2 max-h-96 overflow-y-auto">
                {SALARY_GROUPS.map((group) => (
                  <div key={group.label} className="mb-1">
                    <p className="text-xs font-semibold uppercase tracking-wider px-3 py-1.5" style={{ color: "#4a4a6a" }}>
                      {group.label}
                    </p>
                    {group.items.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/cuanto-es-${s.slug}-euros-brutos-neto`}
                        className="flex items-center justify-between px-3 py-2 rounded-lg transition-colors"
                        style={{ color: "#e0e0ff" }}
                        onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.1)"}
                        onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = "transparent"}
                      >
                        <span className="text-sm whitespace-nowrap">{s.label}</span>
                        <span className="text-xs font-medium shrink-0" style={{ color: "#34d399" }}>{s.neto}</span>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
              </div>
            </div>
          </div>

          {/* Blog + Metodología + Sobre nosotros */}
          {[{ href: "/blog", label: "Blog" }, { href: "/metodologia", label: "Metodología" }, { href: "/sobre-nosotros", label: "Sobre nosotros" }].map(({ href, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className="relative text-sm rounded-lg transition-all duration-200"
                style={{
                  color: active ? "#ffffff" : "#e5e7eb",
                  background: active ? "rgba(99,102,241,0.15)" : "transparent",
                  padding: "6px 12px",
                }}
                onMouseEnter={(e) => { if (!active) { (e.currentTarget as HTMLElement).style.color = "#ffffff"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; } }}
                onMouseLeave={(e) => { if (!active) { (e.currentTarget as HTMLElement).style.color = "#e5e7eb"; (e.currentTarget as HTMLElement).style.background = "transparent"; } }}
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
            <span className="block w-5 h-px rounded-full transition-all duration-300 origin-center" style={{ background: "#a0a0c0", transform: open ? "translateY(6px) rotate(45deg)" : "none" }} />
            <span className="block w-5 h-px rounded-full transition-all duration-200" style={{ background: "#a0a0c0", opacity: open ? 0 : 1, transform: open ? "scaleX(0)" : "scaleX(1)" }} />
            <span className="block w-5 h-px rounded-full transition-all duration-300 origin-center" style={{ background: "#a0a0c0", transform: open ? "translateY(-6px) rotate(-45deg)" : "none" }} />
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: open ? "600px" : "0px",
          background: "#0d0d1a",
          borderTop: open ? "1px solid rgba(255,255,255,0.05)" : "none",
        }}
      >
        <nav className="px-4 py-2 flex flex-col" aria-label="Menú móvil">
          {/* Main links */}
          {NAV_LINKS.map(({ href, label }, i) => {
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

          {/* Salary sub-links */}
          <div className="px-3 pt-3 pb-2">
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#4a4a6a" }}>
              Calculadoras por salario
            </p>
            <div className="overflow-y-auto" style={{ maxHeight: "240px" }}>
            {SALARY_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="text-xs font-semibold uppercase tracking-wider px-2 py-1.5 mt-1" style={{ color: "#3a3a5a" }}>
                  {group.label}
                </p>
                {group.items.map((s) => {
                  const active = pathname === `/cuanto-es-${s.slug}-euros-brutos-neto`;
                  return (
                    <Link
                      key={s.slug}
                      href={`/cuanto-es-${s.slug}-euros-brutos-neto`}
                      className="flex items-center justify-between px-2 py-2.5 text-sm transition-colors"
                      style={{ color: active ? "#e0e0ff" : "#7c7ca0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                    >
                      <span>{s.label} brutos</span>
                      <span className="text-xs" style={{ color: "#34d399" }}>{s.neto}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
