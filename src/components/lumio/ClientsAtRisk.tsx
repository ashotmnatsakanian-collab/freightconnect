"use client";
import { AlertTriangle, MessageCircle, Phone, Clock } from "lucide-react";
import type { Client } from "@/lib/mock-data";

interface Props {
  clients: Client[];
}

const tierColors: Record<string, { bg: string; text: string }> = {
  Bronze: { bg: "#FEF3C7", text: "#92400E" },
  Silver: { bg: "#F1F5F9", text: "#475569" },
  Gold:   { bg: "#FEF9C3", text: "#854D0E" },
  VIP:    { bg: "#F3E8FF", text: "#6B21A8" },
};

const statusConfig = {
  at_risk: { label: "À risque", bg: "#FEF3C7", text: "#92400E", dot: "#F59E0B" },
  lost:    { label: "Perdu",    bg: "#FEE2E2", text: "#991B1B", dot: "#EF4444" },
  active:  { label: "Actif",   bg: "#D1FAE5", text: "#065F46", dot: "#10B981" },
};

export function ClientsAtRisk({ clients }: Props) {
  return (
    <div className="card animate-fade-up" style={{ animationDelay: "0.2s" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-50">
            <AlertTriangle size={16} className="text-amber-500" />
          </div>
          <div>
            <h3 className="font-bold text-base" style={{ color: "var(--text)" }}>
              Clients à relancer
            </h3>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Relance automatique dans 24h
            </p>
          </div>
        </div>
        <button className="btn-ghost text-xs">Voir tous</button>
      </div>

      <div className="flex flex-col gap-3">
        {clients.map((client, i) => {
          const sc = statusConfig[client.status];
          const tc = tierColors[client.loyaltyTier];
          return (
            <div
              key={client.id}
              className="rounded-xl p-3.5 border transition-all hover:shadow-md cursor-pointer animate-fade-up"
              style={{ borderColor: "var(--border)", animationDelay: `${0.25 + i * 0.07}s` }}
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div
                  className="avatar text-white"
                  style={{ background: "var(--primary)" }}
                >
                  {client.avatar}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="font-semibold text-sm" style={{ color: "var(--text)" }}>
                      {client.name}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="badge text-xs"
                        style={{ background: tc.bg, color: tc.text }}
                      >
                        {client.loyaltyTier}
                      </span>
                      <span
                        className="badge text-xs"
                        style={{ background: sc.bg, color: sc.text }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full inline-block pulse-dot"
                          style={{ background: sc.dot }}
                        />
                        {sc.label}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mt-0.5 mb-2">
                    <Clock size={11} style={{ color: "var(--text-muted)" }} />
                    <span className="text-xs font-medium text-red-500">
                      {client.daysOverdue}j sans visite
                    </span>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      · {client.averageSpend}€ / visite moy.
                    </span>
                  </div>

                  <div
                    className="text-xs px-2.5 py-1.5 rounded-lg mb-3 italic"
                    style={{ background: "var(--bg)", color: "var(--text-muted)" }}
                  >
                    "{client.styleNote}"
                  </div>

                  <div className="flex gap-2">
                    <button className="btn-primary text-xs !py-1.5 !px-3 flex-1 sm:flex-none">
                      <MessageCircle size={13} />
                      Envoyer rappel
                    </button>
                    <button className="btn-ghost text-xs !py-1.5 !px-3">
                      <Phone size={13} />
                      Appeler
                    </button>
                    <button className="btn-ghost text-xs !py-1.5 !px-3">
                      Rebooker
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
