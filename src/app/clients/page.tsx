"use client";
import { useLumioStore } from "@/lib/store";
import { useEffect } from "react";
import { Users } from "lucide-react";

export default function ClientsPage() {
  const { salonType } = useLumioStore();
  useEffect(() => { document.documentElement.setAttribute("data-theme", salonType); }, [salonType]);
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="p-4 rounded-2xl" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
        <Users size={32} style={{ color: "var(--primary)" }} />
      </div>
      <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>Gestion des clients</h2>
      <p className="text-sm text-center max-w-xs" style={{ color: "var(--text-muted)" }}>
        Profils clients, historique des visites, notes styliste et score IA — bientôt disponible.
      </p>
    </div>
  );
}
