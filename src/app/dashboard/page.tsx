"use client";
import { useState } from "react";
import AppShell from "@/components/AppShell";
import MaturityRing from "@/components/MaturityRing";
import {
  Phone, MessageSquare, User, X, Home, FileText, Plus, Send, Target,
  Megaphone, Users, TrendingUp, Calendar, ChevronRight, Clock,
} from "lucide-react";
import {
  CONTACTS, ALERTS, CURRENT_AGENT, CAMPAIGNS,
  getPriorityEmoji, getPriorityLabel, formatDate, formatPrice,
  getDaysSinceContact,
} from "@/lib/data";
import type { KeplerAlert } from "@/lib/data";
import Link from "next/link";

const ICON_MAP: Record<string, React.ElementType> = {
  Phone, MessageSquare, User, X, Home, FileText, Send, Target, Megaphone, Users,
};

function AlertCard({ alert, onDismiss }: { alert: KeplerAlert; onDismiss: (id: string) => void }) {
  const priorityClass: Record<string, string> = {
    urgent: "alert-card-urgent",
    high:   "alert-card-high",
    medium: "alert-card-medium",
    low:    "alert-card-low",
  };

  const dotColor: Record<string, string> = {
    urgent: "#EF4444",
    high:   "#F59E0B",
    medium: "#F59E0B",
    low:    "#2D9B6F",
  };

  return (
    <div
      className={`kepler-card rounded-xl p-4 transition-all ${priorityClass[alert.priority]} ${!alert.read ? "" : "opacity-70"}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex flex-col items-center gap-1 pt-0.5 flex-shrink-0">
          <div
            className="rounded-full"
            style={{ width: 8, height: 8, background: dotColor[alert.priority], flexShrink: 0 }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span
              className="text-xs font-bold tracking-wider"
              style={{ color: dotColor[alert.priority] }}
            >
              {getPriorityEmoji(alert.priority)} {getPriorityLabel(alert.priority)}
            </span>
            {alert.contactName && (
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: "rgba(27,58,92,0.08)", color: "#1B3A5C" }}
              >
                {alert.contactName}
              </span>
            )}
            <span className="text-xs ml-auto flex-shrink-0" style={{ color: "#94A3B8" }}>
              {formatDate(alert.createdAt)}
            </span>
          </div>

          <div className="font-semibold text-sm mt-1 mb-1" style={{ color: "#1A202C" }}>
            {alert.message}
          </div>
          {alert.subMessage && (
            <div className="text-xs mb-3" style={{ color: "#64748B", lineHeight: 1.5 }}>
              {alert.subMessage}
            </div>
          )}

          {alert.actions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {alert.actions.map((action) => {
                const Icon = ICON_MAP[action.icon] || User;
                return (
                  <button key={action.label} className="btn-ghost btn-sm flex items-center gap-1.5">
                    <Icon size={12} />
                    {action.label}
                  </button>
                );
              })}
              <button
                className="btn-icon ml-auto"
                onClick={() => onDismiss(alert.id)}
                title="Ignorer"
              >
                <X size={13} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const TODAY_FOLLOWUPS = [
  { name: "Martin Dupont",  time: "10h00", type: "Appel" },
  { name: "Sylvie Blanchard", time: "14h30", type: "Visite" },
  { name: "Nathalie Girard", time: "16h00", type: "RDV estimation" },
];

const TODAY_DAYS = ["L", "M", "M", "J", "V", "S", "D"];
const CALENDAR_DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

export default function DashboardPage() {
  const hotLeads = CONTACTS.filter((c) => c.status === "hot" || c.maturityScore >= 70);
  const [alerts, setAlerts] = useState(ALERTS);
  const unreadCount = alerts.filter((a) => !a.read).length;

  const topContacts = [...CONTACTS]
    .filter((c) => c.status !== "converted")
    .sort((a, b) => b.maturityScore - a.maturityScore)
    .slice(0, 5);

  const kpis = [
    {
      label: "Contacts actifs",
      value: "347",
      sub: "+12 ce mois",
      color: "#1B3A5C",
      bg: "#EFF6FF",
      icon: Users,
    },
    {
      label: "Score moyen base",
      value: "34/100",
      sub: "+4 pts vs mois dernier",
      color: "#C9A84C",
      bg: "#FFFBEB",
      icon: TrendingUp,
    },
    {
      label: "Messages envoyés",
      value: "128",
      sub: "Ce mois — taux 68%",
      color: "#2D9B6F",
      bg: "#F0FDF4",
      icon: MessageSquare,
    },
    {
      label: "Deals en cours",
      value: "7",
      sub: "€ 84k estimé",
      color: "#EF4444",
      bg: "#FEF2F2",
      icon: Home,
    },
  ];

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const urgentAlerts = alerts.filter((a) => !a.read && a.priority === "urgent");
  const hotAlerts = alerts.filter((a) => !a.read && a.priority === "high");
  const otherAlerts = alerts.filter((a) => a.read || (a.priority !== "urgent" && a.priority !== "high"));

  const orderedAlerts = [...urgentAlerts, ...hotAlerts, ...otherAlerts];

  return (
    <AppShell>
      <div className="px-4 lg:px-8 py-6 max-w-[1400px] mx-auto">

        {/* ── Header greeting ── */}
        <div className="mb-6 animate-fade-up">
          <h1 className="text-2xl font-bold mb-1" style={{ color: "#1A202C" }}>
            Bonjour {CURRENT_AGENT.fullName.split(" ")[0]} 👋
          </h1>
          <p style={{ color: "#64748B", fontSize: "0.9375rem" }}>
            Vous avez{" "}
            <span className="font-semibold" style={{ color: "#EF4444" }}>
              {urgentAlerts.length + hotAlerts.length} opportunités chaudes
            </span>{" "}
            aujourd&apos;hui — dont {urgentAlerts.length} action{urgentAlerts.length !== 1 ? "s" : ""} urgente{urgentAlerts.length !== 1 ? "s" : ""}.
          </p>
        </div>

        {/* ── KPI Row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {kpis.map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <div
                key={kpi.label}
                className="kepler-card p-4 animate-fade-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="flex items-center justify-center rounded-lg"
                    style={{ width: 36, height: 36, background: kpi.bg }}
                  >
                    <Icon size={17} style={{ color: kpi.color }} />
                  </div>
                  <ChevronRight size={14} style={{ color: "#CBD5E1" }} />
                </div>
                <div className="text-2xl font-bold mb-0.5" style={{ color: "#1A202C" }}>{kpi.value}</div>
                <div className="text-xs font-semibold mb-0.5" style={{ color: "#64748B" }}>{kpi.label}</div>
                <div className="text-xs" style={{ color: kpi.color }}>{kpi.sub}</div>
              </div>
            );
          })}
        </div>

        {/* ── Main 2-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">

          {/* Left — Alert feed */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold" style={{ color: "#1A202C" }}>Alertes &amp; opportunités</h2>
                {unreadCount > 0 && (
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "#EF4444", color: "white" }}
                  >
                    {unreadCount} nouvelles
                  </span>
                )}
              </div>
              <Link href="/contacts" className="text-xs font-semibold" style={{ color: "#C9A84C" }}>
                Tout voir →
              </Link>
            </div>

            <div className="space-y-3">
              {orderedAlerts.map((alert, i) => (
                <div key={alert.id} className="animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                  <AlertCard alert={alert} onDismiss={dismissAlert} />
                </div>
              ))}
              {orderedAlerts.length === 0 && (
                <div
                  className="kepler-card p-8 text-center"
                  style={{ color: "#94A3B8" }}
                >
                  <div className="text-3xl mb-2">✅</div>
                  <div className="font-semibold">Toutes les alertes traitées</div>
                  <div className="text-sm">Revenez demain pour de nouvelles opportunités.</div>
                </div>
              )}
            </div>
          </div>

          {/* Right panel */}
          <div className="space-y-4">

            {/* Today's calendar */}
            <div className="kepler-card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm" style={{ color: "#1A202C" }}>
                  📅 Aujourd&apos;hui — 21 mai 2026
                </h3>
                <button className="btn-ghost btn-sm">Voir agenda</button>
              </div>

              {/* Day grid */}
              <div className="grid grid-cols-7 gap-0.5 mb-3">
                {TODAY_DAYS.map((d) => (
                  <div key={d} className="text-center text-xs font-semibold py-1" style={{ color: "#94A3B8" }}>{d}</div>
                ))}
                {/* offset for thursday (21st of May 2026 is a thursday) — May starts on Friday */}
                {[...Array(4)].map((_, i) => <div key={`e${i}`} />)}
                {CALENDAR_DAYS.map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs py-1 rounded-md cursor-pointer font-medium"
                    style={{
                      color: day === 21 ? "white" : "#374151",
                      background: day === 21 ? "#1B3A5C" : "transparent",
                      fontWeight: day === 21 ? 700 : undefined,
                    }}
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                {TODAY_FOLLOWUPS.map((f) => (
                  <div
                    key={f.name}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-lg"
                    style={{ background: "#F8FAFC" }}
                  >
                    <Clock size={13} style={{ color: "#1B3A5C", flexShrink: 0 }} />
                    <span className="text-xs font-semibold" style={{ color: "#1B3A5C", minWidth: 36 }}>{f.time}</span>
                    <span className="text-xs truncate font-medium" style={{ color: "#374151" }}>{f.name}</span>
                    <span
                      className="ml-auto text-xs px-1.5 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: "#EFF6FF", color: "#1D4ED8" }}
                    >
                      {f.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top contacts by score */}
            <div className="kepler-card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm" style={{ color: "#1A202C" }}>
                  🔥 Top contacts
                </h3>
                <Link href="/leads-chauds" className="text-xs font-semibold" style={{ color: "#C9A84C" }}>
                  Voir tous →
                </Link>
              </div>
              <div className="space-y-2.5">
                {topContacts.map((contact) => {
                  const days = getDaysSinceContact(contact.lastInteractionAt);
                  return (
                    <div key={contact.id} className="flex items-center gap-3">
                      <div
                        className="flex items-center justify-center rounded-full text-white font-bold text-xs flex-shrink-0"
                        style={{ width: 32, height: 32, background: contact.avatarColor }}
                      >
                        {contact.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold truncate" style={{ color: "#1A202C" }}>{contact.fullName}</div>
                        <div
                          className="text-xs"
                          style={{ color: days > 14 ? "#EF4444" : "#94A3B8" }}
                        >
                          {days === 0 ? "Aujourd'hui" : `Il y a ${days}j`}
                        </div>
                      </div>
                      <MaturityRing score={contact.maturityScore} size={38} strokeWidth={4} showLabel />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick actions */}
            <div className="kepler-card p-4">
              <h3 className="font-bold text-sm mb-3" style={{ color: "#1A202C" }}>Actions rapides</h3>
              <div className="space-y-2">
                {[
                  { icon: Plus,     label: "Ajouter un contact",     color: "#1B3A5C", href: "/contacts" },
                  { icon: Home,     label: "Rentrer un bien",         color: "#2D9B6F", href: "/biens" },
                  { icon: FileText, label: "Générer une estimation",  color: "#C9A84C", href: "/estimations" },
                  { icon: Megaphone,label: "Lancer une campagne",     color: "#6366F1", href: "/campagnes" },
                ].map(({ icon: Icon, label, color, href }) => (
                  <Link
                    key={label}
                    href={href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:opacity-80"
                    style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}
                  >
                    <div
                      className="flex items-center justify-center rounded-lg flex-shrink-0"
                      style={{ width: 30, height: 30, background: `${color}18` }}
                    >
                      <Icon size={14} style={{ color }} />
                    </div>
                    <span className="text-sm font-medium" style={{ color: "#374151" }}>{label}</span>
                    <ChevronRight size={13} className="ml-auto" style={{ color: "#CBD5E1" }} />
                  </Link>
                ))}
              </div>
            </div>

            {/* Campaign snapshot */}
            <div className="kepler-card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm" style={{ color: "#1A202C" }}>📢 Dernières campagnes</h3>
                <Link href="/campagnes" className="text-xs font-semibold" style={{ color: "#C9A84C" }}>Tout voir →</Link>
              </div>
              {CAMPAIGNS.filter((c) => c.status === "sent").map((camp) => (
                <div key={camp.id} className="mb-3 last:mb-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold truncate" style={{ color: "#374151" }}>{camp.name}</span>
                    <span className="text-xs" style={{ color: "#2D9B6F" }}>✓ Envoyée</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-xs" style={{ color: "#94A3B8" }}>
                      <strong style={{ color: "#1A202C" }}>{camp.openedCount}</strong>/{camp.sentCount} ouverts
                    </span>
                    <span className="text-xs" style={{ color: "#94A3B8" }}>
                      <strong style={{ color: "#C9A84C" }}>{camp.clickedCount}</strong> clics
                    </span>
                    {(camp.dealsCount ?? 0) > 0 && (
                      <span className="text-xs font-semibold" style={{ color: "#2D9B6F" }}>
                        {camp.dealsCount} deal{(camp.dealsCount ?? 0) > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
