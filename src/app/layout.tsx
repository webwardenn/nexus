import type { Metadata, Viewport } from "next";
import { Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { NexusProvider } from "@/lib/store";
import { Shell } from "@/components/Shell";

const grotesk = Space_Grotesk({ subsets: ["latin", "latin-ext"], variable: "--font-grotesk", display: "swap" });
const outfit = Outfit({ subsets: ["latin", "latin-ext"], variable: "--font-outfit", display: "swap" });

export const metadata: Metadata = {
  title: { default: "NEXUS · GTA 6 Türkçe Yardımcı", template: "%s · NEXUS" },
  description: "GTA 6 için Türkçe, ücretsiz yardımcı: %100 tamamlama takibi, araç garajı, kendi haritan ve oyun günlüğün. Hayran yapımıdır, resmî değildir.",
  applicationName: "NEXUS",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon-192.png", apple: "/icon-192.png" },
};

export const viewport: Viewport = { themeColor: "#05040c", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${grotesk.variable} ${outfit.variable}`}>
      <body>
        <NexusProvider>
          <Shell>{children}</Shell>
        </NexusProvider>
      </body>
    </html>
  );
}
