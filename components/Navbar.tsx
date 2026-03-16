"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "rgba(8,8,16,0.95)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-syne font-bold text-sm" style={{ color: "#e0e0ff" }}>
          Calculadora<span style={{ color: "#818cf8" }}>Nomina</span>
          <span style={{ color: "#6060a0" }}>.org</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/blog"
            className="text-sm transition-colors"
            style={{ color: "#a0a0c0" }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#e0e0ff")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#a0a0c0")}
          >
            Blog
          </Link>
          <Link
            href="/metodologia"
            className="text-sm transition-colors"
            style={{ color: "#a0a0c0" }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#e0e0ff")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#a0a0c0")}
          >
            Metodología
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menú"
        >
          <span
            className="block w-5 h-0.5 transition-all"
            style={{
              background: "#a0a0c0",
              transform: open ? "translateY(8px) rotate(45deg)" : "none",
            }}
          />
          <span
            className="block w-5 h-0.5 transition-all"
            style={{
              background: "#a0a0c0",
              opacity: open ? 0 : 1,
            }}
          />
          <span
            className="block w-5 h-0.5 transition-all"
            style={{
              background: "#a0a0c0",
              transform: open ? "translateY(-8px) rotate(-45deg)" : "none",
            }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden px-4 pb-4 flex flex-col gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <Link
            href="/blog"
            className="text-sm pt-4"
            style={{ color: "#a0a0c0" }}
            onClick={() => setOpen(false)}
          >
            Blog
          </Link>
          <Link
            href="/metodologia"
            className="text-sm"
            style={{ color: "#a0a0c0" }}
            onClick={() => setOpen(false)}
          >
            Metodología
          </Link>
        </div>
      )}
    </header>
  );
}
