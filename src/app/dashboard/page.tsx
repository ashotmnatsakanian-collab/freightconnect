"use client";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useAuthStore } from "@/lib/store";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Truck, Package, CheckCircle, AlertTriangle,
  TrendingUp, Clock, Users, ArrowRight
} from "lucide-react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Mission {
  id: string;
  reference: string;
  status: string;
  loadingCity: string;
  deliveryCity: string;
  loadingDate: string;
  deliveryDate: string;
  goodsType: string;
  driver?: { firstName: string; lastName: string } | null;
}

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  missionsAsDriver: Mission[];
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    if (user.role === "driver") return;

    Promise.all([
      api.get<Mission[]>("/api/missions"),
      api.get<Driver[]>("/api/drivers"),
    ]).then(([m, d]) => {
      setMissions(m);
      setDrivers(d);
    }).finally(() => setLoading(false));
  }, [user]);

  if (!user) return null;
  if (user.role === "driver") {
    return (
      <AppShell title="Mes missions">
        <div className="text-center py-12">
          <Link href="/driver" className="btn-primary">Aller à mes missions</Link>
        </div>
      </AppShell>
    );
  }

  const active = missions.filter((m) => m.status === "in_progress").length;
  const planned = missions.filter((m) => m.status === "planned").length;
  const delivered = missions.filter((m) => m.status === "delivered").length;
  const unassigned = missions.filter((m) => m.status === "planned" && !m.driver).length;

  const activeDrivers = drivers.filter((d) => d.missionsAsDriver.some((m) => m.status === "in_progress")).length;
  const idleDrivers = drivers.filter((d) => d.missionsAsDriver.length === 0 || d.missionsAsDriver.every((m) => m.status === "delivered" || m.status === "cancelled")).length;

  const recentMissions = missions.slice(0, 6);

  // Chart data — missions by status
  const chartData = [
    { name: "Planifiées", count: planned, fill: "#3b82f6" },
    { name: "En cours", count: active, fill: "#f59e0b" },
    { name: "Livrées", count: delivered, fill: "#10b981" },
    { name: "Annulées", count: missions.filter((m) => m.status === "cancelled").length, fill: "#ef4444" },
  ];

  const statusLabel: Record<string, string> = {
    planned: "Planifiée",
    in_progress: "En cours",
    delivered: "Livrée",
    cancelled: "Annulée",
  };

  return (
    <AppShell title="Tableau de bord">
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            icon={<Truck className="w-6 h-6 text-white" />}
            label="Camions actifs"
            value={loading ? "…" : String(activeDrivers)}
            sub={`${idleDrivers} disponibles`}
            color="#f97316"
          />
          <KpiCard
            icon={<Package className="w-6 h-6 text-white" />}
            label="Missions en cours"
            value={loading ? "…" : String(active)}
            sub={`${planned} planifiées`}
            color="#1e3a5f"
          />
          <KpiCard
            icon={<CheckCircle className="w-6 h-6 text-white" />}
            label="Livraisons"
            value={loading ? "…" : String(delivered)}
            sub="ce mois"
            color="#10b981"
          />
          <KpiCard
            icon={<AlertTriangle className="w-6 h-6 text-white" />}
            label="Sans chauffeur"
            value={loading ? "…" : String(unassigned)}
            sub="missions non assignées"
            color={unassigned > 0 ? "#ef4444" : "#10b981"}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="card lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-800">Répartition des missions</h2>
              <TrendingUp className="w-4 h-4 text-slate-400" />
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <rect key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Alerts */}
          <div className="card">
            <h2 className="font-bold text-slate-800 mb-4">Alertes</h2>
            <div className="space-y-3">
              {unassigned > 0 && (
                <Alert
                  icon={<AlertTriangle className="w-4 h-4" />}
                  text={`${unassigned} mission${unassigned > 1 ? "s" : ""} sans chauffeur`}
                  type="warning"
                />
              )}
              {idleDrivers > 0 && (
                <Alert
                  icon={<Users className="w-4 h-4" />}
                  text={`${idleDrivers} chauffeur${idleDrivers > 1 ? "s" : ""} sans mission`}
                  type="info"
                />
              )}
              {unassigned === 0 && idleDrivers === 0 && (
                <Alert
                  icon={<CheckCircle className="w-4 h-4" />}
                  text="Tout est en ordre !"
                  type="success"
                />
              )}
            </div>
          </div>
        </div>

        {/* Recent missions */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800">Missions récentes</h2>
            <Link href="/missions" className="btn-ghost text-sm">
              Voir tout <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {loading ? (
            <div className="text-slate-400 text-sm py-4 text-center">Chargement...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-2 px-3 text-slate-500 font-semibold text-xs uppercase">Réf.</th>
                    <th className="text-left py-2 px-3 text-slate-500 font-semibold text-xs uppercase">Trajet</th>
                    <th className="text-left py-2 px-3 text-slate-500 font-semibold text-xs uppercase">Date</th>
                    <th className="text-left py-2 px-3 text-slate-500 font-semibold text-xs uppercase">Chauffeur</th>
                    <th className="text-left py-2 px-3 text-slate-500 font-semibold text-xs uppercase">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {recentMissions.map((m) => (
                    <tr key={m.id} className="table-row border-b border-slate-50">
                      <td className="py-2 px-3 font-mono font-semibold text-slate-700">{m.reference}</td>
                      <td className="py-2 px-3 text-slate-700">
                        {m.loadingCity} → {m.deliveryCity}
                      </td>
                      <td className="py-2 px-3 text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(m.loadingDate), "dd/MM", { locale: fr })}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-600">
                        {m.driver ? `${m.driver.firstName} ${m.driver.lastName}` : <span className="text-orange-400 font-medium">Non assigné</span>}
                      </td>
                      <td className="py-2 px-3">
                        <span className={`badge badge-${m.status}`}>{statusLabel[m.status]}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function KpiCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="card flex items-start gap-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: color }}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-slate-800">{value}</div>
        <div className="text-sm font-semibold text-slate-600">{label}</div>
        <div className="text-xs text-slate-400">{sub}</div>
      </div>
    </div>
  );
}

function Alert({ icon, text, type }: { icon: React.ReactNode; text: string; type: "warning" | "info" | "success" }) {
  const colors = {
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
    success: "bg-green-50 text-green-700 border-green-200",
  };
  return (
    <div className={`flex items-center gap-2 p-3 rounded-lg border text-sm ${colors[type]}`}>
      {icon}
      {text}
    </div>
  );
}
