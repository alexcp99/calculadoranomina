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
    "20000", "25000", "30000", "40000", "50000",
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
    ...salarioEntries,
    ...postEntries,
  ];
}
