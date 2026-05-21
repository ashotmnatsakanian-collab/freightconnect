"use client";
import { UserPlus, Bell, Camera, CalendarPlus, Gift, Star } from "lucide-react";

const actions = [
  {
    icon: UserPlus,
    label: "Nouveau client",
    desc: "Créer un profil",
    color: "#4A1942",
  },
  {
    icon: CalendarPlus,
    label: "Nouveau RDV",
    desc: "Réserver un créneau",
    color: "#2C4A6E",
  },
  {
    icon: Bell,
    label: "Envoyer rappel",
    desc: "SMS / WhatsApp",
    color: "#D4AF37",
  },
  {
    icon: Camera,
    label: "Contenu Instagram",
    desc: "Générer caption IA",
    color: "#E8445A",
  },
  {
    icon: Gift,
    label: "Offre fidélité",
    desc: "Envoyer bon cadeau",
    color: "#059669",
  },
  {
    icon: Star,
    label: "Demander avis",
    desc: "Google / Facebook",
    color: "#F59E0B",
  },
];

export function QuickActions() {
  return (
    <div className="card animate-fade-up" style={{ animationDelay: "0.35s" }}>
      <h3 className="font-bold text-base mb-4" style={{ color: "var(--text)" }}>
        Actions rapides
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              className="flex flex-col items-start gap-2 p-3.5 rounded-xl border transition-all hover:shadow-md hover:scale-[1.02] cursor-pointer text-left"
              style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
            >
              <div
                className="p-2 rounded-lg"
                style={{ background: `${action.color}15` }}
              >
                <Icon size={16} style={{ color: action.color }} />
              </div>
              <div>
                <div className="text-xs font-bold" style={{ color: "var(--text)" }}>
                  {action.label}
                </div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {action.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
