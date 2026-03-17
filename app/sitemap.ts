import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `https://calculadoranomina.org/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const salarioEntries: MetadataRoute.Sitemap = [
    "15000", "16000", "18000", "20000", "22000", "24000", "25000", "28000", "30000", "32000", "35000", "40000", "45000", "50000", "60000", "70000", "80000", "100000",
  ].map((slug) => ({
    url: `https://calculadoranomina.org/cuanto-es-${slug}-euros-brutos-neto`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: "https://calculadoranomina.org",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: "https://calculadoranomina.org/blog",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://calculadoranomina.org/sobre-nosotros",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://calculadoranomina.org/metodologia",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: "https://calculadoranomina.org/preguntas-frecuentes",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: "https://calculadoranomina.org/contacto",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    ...salarioEntries,
    ...postEntries,
  ];
}
