import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NEXUS · GTA 6 Türkçe Yardımcı",
    short_name: "NEXUS",
    description: "GTA 6 için Türkçe, ücretsiz yardımcı. Hayran yapımıdır, resmî değildir.",
    start_url: "/",
    display: "standalone",
    background_color: "#05040c",
    theme_color: "#05040c",
    lang: "tr",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
