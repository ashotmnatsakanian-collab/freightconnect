"use client";
import { TrendingUp, Users, Star, AlertTriangle, Calendar, BarChart2 } from "lucide-react";
import type { DashboardStats } from "@/lib/mock-data";

interface Props {
  stats: DashboardStats;
}

export function StatsCards({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
      {/* Chiffre d'affaires semaine */}
      <div
        className="rounded-2xl p-5 text-white col-span-2 lg:col-span-1 animate-fade-up"
        style={{ background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)" }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="text-xs font-semibold uppercase tracking-widest opacity-70">CA Semaine</div>
          <div className="p-1.5 rounded-lg bg-white/15">
            <TrendingUp size={14} />
          </div>
        </div>
        <div className="text-3xl font-bold mb-1">
          {stats.revenueWeek.toLocaleString("fr-FR")} €
        </div>
        <div className="text-xs opacity-60 flex items-center gap-1">
          <span className="text-green-300 font-semibold">↑ +12%</span>
          <span>vs semaine dernière</span>
        </div>
      </div>

      {/* RDV aujourd'hui */}
      <div className="card animate-fade-up" style={{ animationDelay: "0.05s" }}>
        <div className="flex items-start justify-between mb-3">
          <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
            RDV Aujourd'hui
          </div>
          <div className="p-1.5 rounded-lg" style={{ background: "var(--bg)" }}>
            <Calendar size={14} style={{ color: "var(--primary)" }} />
          </div>
        </div>
        <div className="text-3xl font-bold mb-1" style={{ color: "var(--text)" }}>
          {stats.appointmentsToday}
        </div>
        <div className="text-xs" style={{ color: "var(--text-muted)" }}>
          Prochain à 09:00
        </div>
      </div>

      {/* Score Google */}
      <div className="card animate-fade-up" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-start justify-between mb-3">
          <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
            Avis Google
          </div>
          <div className="p-1.5 rounded-lg bg-amber-50">
            <Star size={14} className="text-amber-500" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5 mb-1">
          <div className="text-3xl font-bold" style={{ color: "var(--text)" }}>
            {stats.googleScore}
          </div>
          <div className="text-sm" style={{ color: "var(--text-muted)" }}>/5</div>
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < Math.floor(stats.googleScore) ? "text-amber-400" : "text-gray-200"} style={{ fontSize: "12px" }}>
              ★
            </span>
          ))}
        </div>
      </div>

      {/* Clients à risque */}
      <div className="card animate-fade-up border-amber-200" style={{ animationDelay: "0.15s" }}>
        <div className="flex items-start justify-between mb-3">
          <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
            À Risque
          </div>
          <div className="p-1.5 rounded-lg bg-amber-50">
            <AlertTriangle size={14} className="text-amber-500" />
          </div>
        </div>
        <div className="text-3xl font-bold text-amber-600 mb-1">{stats.clientsAtRisk}</div>
        <div className="text-xs" style={{ color: "var(--text-muted)" }}>Relance auto activée</div>
      </div>

      {/* No-show rate */}
      <div className="card animate-fade-up" style={{ animationDelay: "0.2s" }}>
        <div className="flex items-start justify-between mb-3">
          <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
            Taux No-Show
          </div>
          <div className="p-1.5 rounded-lg" style={{ background: "var(--bg)" }}>
            <BarChart2 size={14} style={{ color: "var(--primary)" }} />
          </div>
        </div>
        <div className="text-3xl font-bold mb-1" style={{ color: stats.noShowRate > 10 ? "#E8445A" : "var(--text)" }}>
          {stats.noShowRate}%
        </div>
        <div className="text-xs" style={{ color: "var(--text-muted)" }}>Rappels SMS actifs</div>
      </div>

      {/* Valeur vie client */}
      <div className="card animate-fade-up" style={{ animationDelay: "0.25s" }}>
        <div className="flex items-start justify-between mb-3">
          <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
            Valeur Vie Client
          </div>
          <div className="p-1.5 rounded-lg" style={{ background: "var(--bg)" }}>
            <Users size={14} style={{ color: "var(--primary)" }} />
          </div>
        </div>
        <div className="text-3xl font-bold mb-1" style={{ color: "var(--text)" }}>
          {stats.avgLifetimeValue} €
        </div>
        <div className="flex items-center gap-1.5">
          <div className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold">
            {stats.newClientsPercent}% nouveaux
          </div>
        </div>
      </div>
    </div>
  );
}
