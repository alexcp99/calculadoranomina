"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Calculator from "@/components/Calculator";
import RetencionCalculator from "@/components/RetencionCalculator";

type CalcTab = "nomina" | "retencion";

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
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      {/* Tab toggle */}
      <div
        className="grid grid-cols-2 gap-1 rounded-2xl p-1 w-full max-w-xs mx-auto"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        {([
          { v: "nomina" as CalcTab, l: "Calculadora de Nómina" },
          { v: "retencion" as CalcTab, l: "Retención IRPF" },
        ]).map(({ v, l }) => (
          <button
            key={v}
            type="button"
            onClick={() => switchTab(v)}
            className="rounded-xl font-semibold transition-all duration-200 text-center"
            style={{
              fontSize: "0.78rem",
              lineHeight: 1.25,
              padding: "9px 8px",
              minHeight: 42,
              background:
                activeTab === v
                  ? "linear-gradient(135deg,#6366f1,#818cf8)"
                  : "transparent",
              color: activeTab === v ? "#fff" : "var(--text-secondary)",
              boxShadow: activeTab === v ? "0 2px 14px rgba(99,102,241,0.4)" : "none",
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Calculator */}
      {activeTab === "nomina" ? <Calculator /> : <RetencionCalculator />}
    </div>
  );
}
