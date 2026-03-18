"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Calculator from "@/components/Calculator";
import RetencionCalculator from "@/components/RetencionCalculator";

type CalcTab = "nomina" | "retencion";

const TABS: { v: CalcTab; label: string; icon: React.ReactNode }[] = [
  {
    v: "nomina",
    label: "Calculadora de Nómina",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="12" height="12" rx="2" />
        <path d="M5 5.5h3M5 8h6M5 10.5h4" />
      </svg>
    ),
  },
  {
    v: "retencion",
    label: "Retención IRPF",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="8" r="6.5" />
        <path d="M5.5 10.5l5-5M6 6h.01M10 10h.01" />
      </svg>
    ),
  },
];

export default function HomeCalculatorTabs() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<CalcTab>(
    searchParams.get("calc") === "retencion" ? "retencion" : "nomina"
  );

  function switchTab(tab: CalcTab) {
    setActiveTab(tab);
    router.replace(tab === "nomina" ? "/" : "/?calc=retencion", { scroll: false });
  }

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-5">

      {/* ── Tool selector ── */}
      <div className="flex flex-col items-center gap-1.5">
        <p className="text-xs font-medium" style={{ color: "#9090b8" }}>
          Selecciona calculadora
        </p>
        <div
          className="flex gap-1.5 p-1.5 rounded-2xl w-full max-w-sm"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {TABS.map(({ v, label, icon }) => (
            <button
              key={v}
              type="button"
              onClick={() => switchTab(v)}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200"
              style={{
                padding: "11px 10px",
                minHeight: 50,
                background: activeTab === v ? "#6366f1" : "transparent",
                color:      activeTab === v ? "#ffffff" : "#5a5a80",
                boxShadow:  activeTab === v ? "0 2px 16px rgba(99,102,241,0.45)" : "none",
                fontSize: "0.82rem",
                lineHeight: 1.3,
              }}
            >
              {icon}
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Calculator ── */}
      {activeTab === "nomina" ? <Calculator /> : <RetencionCalculator />}
    </div>
  );
}
