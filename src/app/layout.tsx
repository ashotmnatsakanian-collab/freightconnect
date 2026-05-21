import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lumio — Gestion intelligente de salon",
  description: "Plateforme SaaS pour salons de coiffure, barbershops et instituts beauté",
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  themeColor: "#4A1942",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
