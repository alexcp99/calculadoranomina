"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const COOKIE_KEY = "cn_cookie_consent";

export default function CookieBanner() {
  const [render, setRender] = useState(false);
  const [show, setShow] = useState(false);

  const open = useCallback(() => {
    setRender(true);
    // double rAF ensures the element is in the DOM before the transition starts
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setShow(true));
    });
  }, []);

  const close = useCallback(() => {
    setShow(false);
    setTimeout(() => setRender(false), 350);
  }, []);

  useEffect(() => {
    if (localStorage.getItem(COOKIE_KEY) === null) open();

    const handleShow = () => open();
    window.addEventListener("showCookieBanner", handleShow);
    return () => window.removeEventListener("showCookieBanner", handleShow);
  }, [open]);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    window.dispatchEvent(new Event("cookieConsentAccepted"));
    window.dispatchEvent(new Event("cookieConsentChanged"));
    close();
  };

  const reject = () => {
    localStorage.setItem(COOKIE_KEY, "rejected");
    window.dispatchEvent(new Event("cookieConsentChanged"));
    close();
  };

  if (!render) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        transform: show ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      role="dialog"
      aria-label="Aviso de cookies"
      aria-modal="false"
    >
      <div
        className="w-full"
        style={{
          background: "rgba(13,13,26,0.97)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 -16px 48px rgba(0,0,0,0.55)",
        }}
      >
        <div className="max-w-4xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center gap-4">

          {/* Icon + text */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <span className="text-xl shrink-0 mt-0.5 select-none" aria-hidden="true">🍪</span>
            <p className="text-sm leading-relaxed" style={{ color: "#b0b0cc" }}>
              Usamos cookies analíticas de Google Analytics para entender cómo se usa la calculadora y mejorarla.
              No recopilamos datos personales identificables.{" "}
              <Link
                href="/politica-cookies"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 transition-colors"
                style={{ color: "#818cf8" }}
              >
                Más información
              </Link>
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-row gap-2 shrink-0 w-full md:w-auto">
            <button
              type="button"
              onClick={reject}
              className="flex-1 md:flex-none px-5 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 focus:outline-none"
              style={{
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#9090b8",
                background: "transparent",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              Rechazar
            </button>
            <button
              type="button"
              onClick={accept}
              className="flex-1 md:flex-none px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-150 focus:outline-none"
              style={{ background: "#6366f1", color: "#fff" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#4f52d4")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#6366f1")}
            >
              Aceptar cookies
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
