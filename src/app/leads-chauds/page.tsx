"use client";
import AppShell from "@/components/AppShell";
import MaturityRing from "@/components/MaturityRing";
import { Phone, MessageSquare, ChevronRight, Star, AlertTriangle } from "lucide-react";
import {
  CONTACTS, getTypeLabel, formatPrice, getDaysSinceContact, getLifeEventLabel, getLifeEventEmoji,
} from "@/lib/data";

export default function LeadsChaudsPage() {
  const hotContacts = [...CONTACTS]
    .filter((c) => c.maturityScore >= 70 && c.status !== "converted")
    .sort((a, b) => b.maturityScore - a.maturityScore);

  return (
    <AppShell>
      <div className="px-4 lg:px-8 py-6 max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1" style={{ color: "#1A202C" }}>
            🔥 Leads Chauds
          </h1>
          <p style={{ color: "#64748B", fontSize: "0.9375rem" }}>
            {hotContacts.length} contacts avec un score de maturité ≥ 70 — prêts à transacter.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {hotContacts.map((contact, i) => {
            const days = getDaysSinceContact(contact.lastInteractionAt);
            const isUrgent = contact.maturityScore >= 86;
            const isPulsing = isUrgent;
            const typeLabel = getTypeLabel(contact.type);

            return (
              <div
                key={contact.id}
                className={`kepler-card p-5 animate-fade-up relative overflow-hidden ${isPulsing ? "pulse-glow" : ""}`}
                style={{
                  animationDelay: `${i * 60}ms`,
                  border: isUrgent ? "1px solid rgba(239,68,68,0.3)" : "1px solid rgba(0,0,0,0.04)",
                }}
              >
                {isUrgent && (
                  <div
                    className="absolute top-0 right-0 left-0 h-0.5"
                    style={{ background: "linear-gradient(90deg, #EF4444, #F59E0B)" }}
                  />
                )}

                {/* Top row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center rounded-full text-white font-bold text-base flex-shrink-0"
                      style={{ width: 48, height: 48, background: contact.avatarColor }}
                    >
                      {contact.initials}
                    </div>
                    <div>
                      <div className="font-bold text-base" style={{ color: "#1A202C" }}>{contact.fullName}</div>
                      <div className="text-xs" style={{ color: "#64748B" }}>{typeLabel}</div>
                    </div>
                  </div>
                  <MaturityRing score={contact.maturityScore} size={54} strokeWidth={5} showLabel />
                </div>

                {/* Budget */}
                {contact.budgetMin && (
                  <div
                    className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg text-sm"
                    style={{ background: "#F8FAFC" }}
                  >
                    <span style={{ color: "#64748B" }}>Budget :</span>
                    <span className="font-semibold" style={{ color: "#1A202C" }}>
                      {formatPrice(contact.budgetMin)} — {formatPrice(contact.budgetMax!)}
                    </span>
                  </div>
                )}

                {/* Life events */}
                {contact.lifeEvents && contact.lifeEvents.length > 0 && (
                  <div className="mb-3 space-y-1.5">
                    {contact.lifeEvents.map((ev) => (
                      <div
                        key={ev.id}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
                        style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}
                      >
                        <span>{getLifeEventEmoji(ev.eventType)}</span>
                        <span className="font-medium" style={{ color: "#166534" }}>{getLifeEventLabel(ev.eventType)}</span>
                        <span style={{ color: "#4ADE80" }}>· {ev.source}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* AI insight */}
                {contact.aiInsight && (
                  <div
                    className="rounded-lg p-3 mb-4 text-xs"
                    style={{
                      background: isUrgent ? "linear-gradient(135deg, #FFF5F5, #FFFBEB)" : "#EFF6FF",
                      border: `1px solid ${isUrgent ? "#FECACA" : "#DBEAFE"}`,
                      color: isUrgent ? "#7F1D1D" : "#1D4ED8",
                      lineHeight: 1.6,
                    }}
                  >
                    <Star size={11} style={{ display: "inline", marginRight: 4, color: "#C9A84C" }} fill="#C9A84C" />
                    {contact.aiInsight}
                  </div>
                )}

                {/* Days since contact */}
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full"
                    style={{
                      background: days > 14 ? "#FEE2E2" : days > 7 ? "#FFFBEB" : "#F0FDF4",
                      color: days > 14 ? "#991B1B" : days > 7 ? "#92400E" : "#166534",
                    }}
                  >
                    {days > 14 && <AlertTriangle size={11} />}
                    {days === 0 ? "Contact aujourd'hui" : days === 1 ? "Contacté hier" : `${days} jours sans contact`}
                  </div>
                  {isUrgent && (
                    <span
                      className="text-xs font-bold px-2 py-1 rounded-full"
                      style={{ background: "#FEE2E2", color: "#991B1B" }}
                    >
                      ⚡ URGENT
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t" style={{ borderColor: "#F1F5F9" }}>
                  <button className="btn-primary flex-1 justify-center btn-sm">
                    <Phone size={12} /> Appeler
                  </button>
                  <button className="btn-gold flex-1 justify-center btn-sm">
                    <MessageSquare size={12} /> Message
                  </button>
                  <button className="btn-ghost btn-sm">
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {hotContacts.length === 0 && (
          <div className="kepler-card p-12 text-center" style={{ color: "#94A3B8" }}>
            <div className="text-4xl mb-3">🎉</div>
            <div className="font-semibold text-lg mb-1">Tous vos leads ont été traités !</div>
            <div className="text-sm">Kepler vous alertera dès qu&apos;un nouveau lead devient chaud.</div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
