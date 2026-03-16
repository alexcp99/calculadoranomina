"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { href: "/", label: "Calculadora" },
  { href: "/blog", label: "Blog" },
  { href: "/metodologia", label: "Metodología" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(8,8,16,0.97)" : "rgba(8,8,16,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          boxShadow: scrolled
            ? "0 4px 32px rgba(0,0,0,0.5)"
            : "0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-14 md:h-16">

          {/* ── Logo ── */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 shrink-0"
            aria-label="Calculadora Nomina — Inicio"
          >
            {/* Calculator icon */}
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all group-hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #4f52d4 0%, #6366f1 100%)",
                boxShadow: "0 0 0 1px rgba(99,102,241,0.3)",
              }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <rect x="2" y="2" width="4.5" height="3" rx="0.75" fill="white" opacity="0.9" />
                <rect x="8.5" y="2" width="4.5" height="3" rx="0.75" fill="white" opacity="0.5" />
                <rect x="2" y="6.5" width="4.5" height="2" rx="0.75" fill="white" opacity="0.5" />
                <rect x="8.5" y="6.5" width="4.5" height="2" rx="0.75" fill="white" opacity="0.5" />
                <rect x="2" y="10" width="4.5" height="3" rx="0.75" fill="white" opacity="0.5" />
                <rect x="8.5" y="10" width="4.5" height="3" rx="0.75" fill="white" opacity="0.9" />
              </svg>
            </div>

            {/* Brand text */}
            <span className="font-syne font-bold text-sm leading-none">
              <span
                className="transition-colors group-hover:text-white"
                style={{ color: "#e0e0ff" }}
              >
                CalculadoraNomina
              </span>
              <span style={{ color: "#6366f1" }}>.org</span>
            </span>
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Navegación principal">
            {NAV_LINKS.map(({ href, label }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className="relative px-4 py-2 rounded-lg text-sm transition-all duration-200"
                  style={{
                    color: active ? "#f0f0ff" : "#6b7280",
                    background: active ? "rgba(99,102,241,0.08)" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.color = "#e0e0ff";
                  }}
                  onMouseLeave={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.color = "#6b7280";
                  }}
                >
                  {label}
                  {active && (
                    <span
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: "#6366f1" }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ── Right: badge + hamburger ── */}
          <div className="flex items-center gap-3">
            {/* Badge — hidden on small mobile */}
            <div
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
              style={{
                background: "rgba(52,211,153,0.08)",
                border: "1px solid rgba(52,211,153,0.18)",
                color: "#6ee7b7",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"
                style={{ boxShadow: "0 0 6px rgba(52,211,153,0.7)" }}
              />
              Actualizado AEAT 2026
            </div>

            {/* Hamburger — mobile only */}
            <button
              className="md:hidden flex flex-col justify-center items-center w-9 h-9 rounded-lg gap-[5px] transition-colors"
              style={{ background: open ? "rgba(99,102,241,0.1)" : "transparent" }}
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={open}
            >
              <span
                className="block w-5 h-px rounded-full transition-all duration-300 origin-center"
                style={{
                  background: "#a0a0c0",
                  transform: open ? "translateY(6px) rotate(45deg)" : "none",
                }}
              />
              <span
                className="block w-5 h-px rounded-full transition-all duration-200"
                style={{
                  background: "#a0a0c0",
                  opacity: open ? 0 : 1,
                  transform: open ? "scaleX(0)" : "scaleX(1)",
                }}
              />
              <span
                className="block w-5 h-px rounded-full transition-all duration-300 origin-center"
                style={{
                  background: "#a0a0c0",
                  transform: open ? "translateY(-6px) rotate(-45deg)" : "none",
                }}
              />
            </button>
          </div>
        </div>

        {/* ── Mobile menu ── */}
        <div
          className="md:hidden overflow-hidden transition-all duration-300"
          style={{
            maxHeight: open ? "320px" : "0px",
            background: "#0d0d1a",
            borderTop: open ? "1px solid rgba(255,255,255,0.05)" : "none",
          }}
        >
          <nav className="px-4 py-3 flex flex-col" aria-label="Menú móvil">
            {NAV_LINKS.map(({ href, label }, i) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 px-3 py-4 rounded-xl text-base font-medium transition-colors"
                  style={{
                    color: active ? "#f0f0ff" : "#a0a0c0",
                    borderBottom:
                      i < NAV_LINKS.length - 1
                        ? "1px solid rgba(255,255,255,0.04)"
                        : "none",
                  }}
                >
                  {active && (
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: "#6366f1" }}
                    />
                  )}
                  {label}
                </Link>
              );
            })}

            {/* Badge in mobile menu */}
            <div className="pt-4 pb-2 px-3">
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                style={{
                  background: "rgba(52,211,153,0.08)",
                  border: "1px solid rgba(52,211,153,0.18)",
                  color: "#6ee7b7",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"
                  style={{ boxShadow: "0 0 6px rgba(52,211,153,0.7)" }}
                />
                Actualizado AEAT 2026
              </div>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
