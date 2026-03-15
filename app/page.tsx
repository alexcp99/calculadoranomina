import Calculator from "@/components/Calculator";

export default function HomePage() {
  return (
    <main className="min-h-screen" style={{ background: "#080810" }}>
      {/* Radial gradient spotlight */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 55% at 50% -5%, rgba(99,102,241,0.13) 0%, transparent 65%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* ── Header ── */}
        <header className="pt-14 pb-10 px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-8"
            style={{
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.22)",
              color: "#818CF8",
            }}>
            <span
              className="w-1.5 h-1.5 rounded-full bg-emerald-400"
              style={{ boxShadow: "0 0 6px rgba(52,211,153,0.7)" }}
            />
            Actualizado · AEAT 2026
          </div>

          {/* Heading */}
          <h1
            className="font-syne font-extrabold tracking-tight leading-none mb-4"
            style={{
              fontSize: "clamp(2.25rem, 6vw, 4rem)",
              color: "#f0f0ff",
            }}
          >
            Calculadora de{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #6366f1 0%, #818cf8 45%, #a5b4fc 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Nómina
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-base md:text-lg max-w-lg mx-auto leading-relaxed"
            style={{ color: "#7c7ca0" }}
          >
            Salario bruto → neto y neto → bruto.
            <br className="hidden sm:block" />
            IRPF + Seguridad Social incluidos.
          </p>
        </header>

        {/* ── Calculator ── */}
        <section className="flex-1 px-4 pb-16">
          <Calculator />
        </section>

        {/* ── Footer ── */}
        <footer className="pb-8 px-4 text-center">
          <p className="text-xs" style={{ color: "#3e3e60" }}>
            Datos oficiales AEAT · España · 2026
          </p>
        </footer>
      </div>
    </main>
  );
}
