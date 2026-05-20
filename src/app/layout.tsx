import type { Metadata } from "next";
import "./globals.css";
import { ServiceWorkerRegistrar } from "@/components/ServiceWorkerRegistrar";

export const metadata: Metadata = {
  title: "FreightConnect — Gestion Transport Routier",
  description: "Plateforme SaaS de gestion du transport routier — Éliminez les retours à vide",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e3a5f" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="FreightConnect" />
      </head>
      <body className="min-h-screen">
        <ServiceWorkerRegistrar />
        {children}
      </body>
    </html>
  );
}
