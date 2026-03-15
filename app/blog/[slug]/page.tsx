import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { getAllSlugs, getPostBySlug, getAllPosts } from "@/lib/blog";

// ─── Static generation ────────────────────────────────────────────────────────

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: `https://calculadoranomina.org/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://calculadoranomina.org/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
    },
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("es-ES", { dateStyle: "long" }).format(
    new Date(iso)
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const { content } = await compileMDX({
    source: post.content,
    options: { parseFrontmatter: false },
  });

  // Related posts: 3 most recent excluding current
  const related = getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: "Calculadora de Nómina",
      url: "https://calculadoranomina.org",
    },
    publisher: {
      "@type": "Organization",
      name: "Calculadora de Nómina",
      url: "https://calculadoranomina.org",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://calculadoranomina.org/blog/${post.slug}`,
    },
    keywords: post.keywords.join(", "),
  };

  return (
    <main className="min-h-screen" style={{ background: "#080810" }}>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
        <div className="flex-1 px-4 pt-8 pb-16 md:pt-14">
          <div className="max-w-2xl mx-auto">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs mb-8 flex-wrap" style={{ color: "#4a4a6a" }}>
              <Link href="/" className="hover:underline" style={{ color: "#818CF8" }}>
                Inicio
              </Link>
              <span>/</span>
              <Link href="/blog" className="hover:underline" style={{ color: "#818CF8" }}>
                Blog
              </Link>
              <span>/</span>
              <span
                className="truncate max-w-[180px]"
                style={{ color: "#7c7ca0" }}
                title={post.title}
              >
                {post.title}
              </span>
            </nav>

            {/* Article header */}
            <header className="mb-10">
              <h1
                className="font-syne font-extrabold tracking-tight leading-tight mb-4"
                style={{
                  fontSize: "clamp(1.6rem, 5vw, 2.5rem)",
                  color: "#f0f0ff",
                }}
              >
                {post.title}
              </h1>

              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{
                    background: "rgba(99,102,241,0.1)",
                    border: "1px solid rgba(99,102,241,0.22)",
                    color: "#818CF8",
                  }}
                >
                  {formatDate(post.date)}
                </span>
                <span
                  className="text-xs px-2.5 py-1 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#7c7ca0",
                  }}
                >
                  {post.readTime} de lectura
                </span>
              </div>
            </header>

            {/* Article content */}
            <article className="blog-prose">
              {content}
            </article>

            {/* CTA */}
            <div
              className="mt-12 rounded-2xl p-6 md:p-8 text-center"
              style={{
                background: "rgba(99,102,241,0.08)",
                border: "1px solid rgba(99,102,241,0.22)",
              }}
            >
              <p
                className="font-syne font-bold text-lg mb-2"
                style={{ color: "#e0e0ff" }}
              >
                Calcula tu nómina al instante
              </p>
              <p className="text-sm mb-5" style={{ color: "#7c7ca0" }}>
                Aplica los tramos IRPF 2026, cotizaciones SS y tu situación familiar. Gratis y sin registro.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-150"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #818cf8)",
                  color: "#fff",
                  boxShadow: "0 2px 18px rgba(99,102,241,0.4)",
                }}
              >
                Ir a la calculadora →
              </Link>
            </div>

            {/* Related posts */}
            {related.length > 0 && (
              <section className="mt-14">
                <h2
                  className="font-syne font-bold text-lg mb-5"
                  style={{ color: "#e0e0ff" }}
                >
                  Artículos relacionados
                </h2>
                <div className="flex flex-col gap-3">
                  {related.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/blog/${r.slug}`}
                      className="flex items-start gap-3 rounded-xl p-4 transition-colors"
                      style={{
                        background: "#0c0c1e",
                        border: "1px solid rgba(255,255,255,0.07)",
                      }}
                    >
                      <span
                        className="mt-0.5 shrink-0 w-1.5 h-1.5 rounded-full"
                        style={{ background: "#6366f1" }}
                      />
                      <div>
                        <p
                          className="text-sm font-medium leading-snug"
                          style={{ color: "#c0c0e0" }}
                        >
                          {r.title}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: "#4a4a6a" }}>
                          {r.readTime} lectura
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Back to blog */}
            <div className="mt-10">
              <Link
                href="/blog"
                className="text-sm font-medium hover:underline"
                style={{ color: "#818CF8" }}
              >
                ← Todos los artículos
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="pb-8 px-4 text-center">
          <p className="text-xs" style={{ color: "#3e3e60" }}>
            Datos oficiales AEAT · España · 2026
          </p>
        </footer>
      </div>
    </main>
  );
}
