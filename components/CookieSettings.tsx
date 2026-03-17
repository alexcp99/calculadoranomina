"use client";

import { useState, useEffect } from "react";

const COOKIE_KEY = "cn_cookie_consent";

export default function CookieSettings() {
  const [hasConsent, setHasConsent] = useState(false);
  const [tooltip, setTooltip] = useState(false);

  useEffect(() => {
    setHasConsent(localStorage.getItem(COOKIE_KEY) !== null);

    const handleChange = () => {
      setHasConsent(localStorage.getItem(COOKIE_KEY) !== null);
    };
    window.addEventListener("cookieConsentChanged", handleChange);
    return () => window.removeEventListener("cookieConsentChanged", handleChange);
  }, []);

  if (!hasConsent) return null;

  return (
    <div className="fixed bottom-5 left-5 z-40">
      {tooltip && (
        <div
          className="absolute bottom-full left-0 mb-2 px-2.5 py-1 rounded-lg text-xs whitespace-nowrap pointer-events-none"
          style={{
            background: "rgba(13,13,26,0.95)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#9090b8",
          }}
        >
          Gestionar cookies
        </div>
      )}
      <button
        type="button"
        onClick={() => window.dispatchEvent(new Event("showCookieBanner"))}
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}
        aria-label="Gestionar preferencias de cookies"
        className="w-9 h-9 rounded-full flex items-center justify-center text-base transition-all duration-150"
        style={{
          background: "rgba(13,13,26,0.9)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "#5a5a80",
          boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
        }}
        onFocus={() => setTooltip(true)}
        onBlur={() => setTooltip(false)}
      >
        🍪
      </button>
    </div>
  );
}
