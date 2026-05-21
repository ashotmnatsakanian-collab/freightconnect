"use client";
import { useLumioStore, type SalonType } from "@/lib/store";
import { Scissors, Zap, Sparkles, Blend } from "lucide-react";
import { useEffect } from "react";

const TYPES: { id: SalonType; label: string; sublabel: string; icon: React.ElementType; theme: string }[] = [
  { id: "femme", label: "Coiffure Femme", sublabel: "Colorations, balayage, soin", icon: Sparkles, theme: "femme" },
  { id: "homme", label: "Barbershop", sublabel: "Coupe, barbe, rasage", icon: Scissors, theme: "homme" },
  { id: "nail", label: "Institut / Nail", sublabel: "Onglerie, beauté", icon: Zap, theme: "nail" },
  { id: "mixte", label: "Salon Mixte", sublabel: "Toutes prestations", icon: Blend, theme: "mixte" },
];

export function SalonTypeSelector() {
  const { salonType, setSalonType } = useLumioStore();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", salonType);
  }, [salonType]);

  return (
    <div className="flex gap-2 flex-wrap">
      {TYPES.map((t) => {
        const Icon = t.icon;
        const active = salonType === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setSalonType(t.id)}
            style={
              active
                ? { background: "var(--primary)", color: "white", borderColor: "var(--primary)" }
                : { background: "var(--bg-card)", color: "var(--text-muted)", borderColor: "var(--border)" }
            }
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border font-medium text-sm transition-all hover:border-[var(--primary)] hover:text-[var(--primary)] cursor-pointer"
          >
            <Icon size={15} />
            <span className="hidden sm:block">{t.label}</span>
            <span className="sm:hidden">{t.id === "femme" ? "Femme" : t.id === "homme" ? "Barbier" : t.id === "nail" ? "Nail" : "Mixte"}</span>
          </button>
        );
      })}
    </div>
  );
}
