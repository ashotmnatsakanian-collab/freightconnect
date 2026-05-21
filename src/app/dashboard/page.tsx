"use client";
import { useLumioStore } from "@/lib/store";
import { StatsCards } from "@/components/lumio/StatsCards";
import { ClientsAtRisk } from "@/components/lumio/ClientsAtRisk";
import { TodayAppointments } from "@/components/lumio/TodayAppointments";
import { RevenueChart } from "@/components/lumio/RevenueChart";
import { QuickActions } from "@/components/lumio/QuickActions";
import {
  atRiskClients,
  todayAppointments,
  weekRevenue,
  dashboardStats,
} from "@/lib/mock-data";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useEffect } from "react";

const THEME_COLORS: Record<string, string> = {
  femme: "#4A1942",
  homme: "#2C4A6E",
  mixte: "#2D3748",
  nail:  "#4A1942",
};

export default function DashboardPage() {
  const { salonType } = useLumioStore();
  const today = format(new Date(), "EEEE d MMMM yyyy", { locale: fr });
  const stats = dashboardStats[salonType];
  const clients = atRiskClients[salonType];
  const appointments = todayAppointments[salonType];
  const revenue = weekRevenue[salonType];
  const primaryColor = THEME_COLORS[salonType];

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", salonType);
  }, [salonType]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
            Bonjour, Marie 👋
          </h1>
          <p className="text-sm mt-0.5 capitalize" style={{ color: "var(--text-muted)" }}>
            {today}
          </p>
        </div>
        <div
          className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: primaryColor }}
        >
          {salonType === "femme" && "✨ Salon Coiffure Femme"}
          {salonType === "homme" && "✂️ Barbershop"}
          {salonType === "nail" && "💅 Institut / Nail"}
          {salonType === "mixte" && "⚡ Salon Mixte"}
        </div>
      </div>

      {/* Stats grid */}
      <StatsCards stats={stats} />

      {/* Main 2-col grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left col */}
        <div className="flex flex-col gap-6">
          <TodayAppointments appointments={appointments} />
          <QuickActions />
        </div>

        {/* Right col */}
        <div className="flex flex-col gap-6">
          <RevenueChart data={revenue} primaryColor={primaryColor} />
          <ClientsAtRisk clients={clients} />
        </div>
      </div>
    </div>
  );
}
