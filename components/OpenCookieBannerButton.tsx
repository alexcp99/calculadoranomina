"use client";

export default function OpenCookieBannerButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("showCookieBanner"))}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-150 focus:outline-none not-prose"
      style={{ background: "#6366f1", color: "#fff" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#4f52d4")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "#6366f1")}
    >
      🍪 Gestionar mis preferencias de cookies
    </button>
  );
}
