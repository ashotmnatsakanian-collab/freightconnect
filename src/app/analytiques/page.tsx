"use client";
import AppShell from "@/components/AppShell";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, FunnelChart, Funnel, LabelList,
} from "recharts";
import {
  SCORE_DISTRIBUTION, FUNNEL_DATA, MESSAGES_TIMELINE, CHANNEL_PERF,
  CONTACTS, formatPrice,
} from "@/lib/data";
import { TrendingUp, MessageSquare, Users, DollarSign } from "lucide-react";

const DEALS_SOURCE = [
  { source: "Campagnes email", deals: 2, revenue: 24000, color: "#1B3A5C" },
  { source: "WhatsApp direct",  deals: 3, revenue: 38000, color: "#C9A84C" },
  { source: "Alertes Kepler",   deals: 2, revenue: 27000, color: "#2D9B6F" },
  { source: "Référencement",    deals: 1, revenue: 12000, color: "#6366F1" },
];

const CustomTooltipBar = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name?: string }>; label?: string }) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-white rounded-xl shadow-lg border p-3 text-sm" style={{ borderColor: "#E2E8F0" }}>
      <div className="font-semibold mb-1" style={{ color: "#1A202C" }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: "#64748B" }}>{p.name ?? "Valeur"}: <strong style={{ color: "#1A202C" }}>{p.value}</strong></div>
      ))}
    </div>
  );
};

const CustomTooltipLine = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-white rounded-xl shadow-lg border p-3 text-sm" style={{ borderColor: "#E2E8F0" }}>
      <div className="font-semibold mb-1" style={{ color: "#1A202C" }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span style={{ color: "#64748B" }}>{p.name}: <strong style={{ color: "#1A202C" }}>{p.value}</strong></span>
        </div>
      ))}
    </div>
  );
};

export default function AnalytiquesPage() {
  const hotCount = CONTACTS.filter((c) => c.status === "hot").length;
  const warmCount = CONTACTS.filter((c) => c.status === "warm").length;
  const coldCount = CONTACTS.filter((c) => c.status === "cold").length;
  const convertedCount = CONTACTS.filter((c) => c.status === "converted").length;
  const totalDeals = DEALS_SOURCE.reduce((s, d) => s + d.deals, 0);
  const totalRevenue = DEALS_SOURCE.reduce((s, d) => s + d.revenue, 0);

  const kpis = [
    {
      label: "Taux de réactivation",
      value: "18.4%",
      sub: "Contacts cold → warm+ ce mois",
      color: "#1B3A5C",
      icon: TrendingUp,
    },
    {
      label: "Messages ce mois",
      value: "128",
      sub: "Taux de réponse global 42%",
      color: "#C9A84C",
      icon: MessageSquare,
    },
    {
      label: "Leads chauds actifs",
      value: String(hotCount),
      sub: `${warmCount} tièdes · ${coldCount} froids`,
      color: "#EF4444",
      icon: Users,
    },
    {
      label: "ROI estimé",
      value: formatPrice(totalRevenue),
      sub: `${totalDeals} commissions générées`,
      color: "#2D9B6F",
      icon: DollarSign,
    },
  ];

  return (
    <AppShell>
      <div className="px-4 lg:px-8 py-6 max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold" style={{ color: "#1A202C" }}>Analytiques</h1>
          <p style={{ color: "#64748B", fontSize: "0.875rem" }}>
            Performances du mois de mai 2026 · Agence Immo Excellence Nancy
          </p>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {kpis.map(({ label, value, sub, color, icon: Icon }) => (
            <div key={label} className="kepler-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="flex items-center justify-center rounded-lg"
                  style={{ width: 34, height: 34, background: `${color}14` }}
                >
                  <Icon size={16} style={{ color }} />
                </div>
              </div>
              <div className="text-2xl font-bold mb-0.5" style={{ color: "#1A202C" }}>{value}</div>
              <div className="text-xs font-semibold mb-0.5" style={{ color: "#64748B" }}>{label}</div>
              <div className="text-xs" style={{ color }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">

          {/* Score distribution */}
          <div className="kepler-card p-5">
            <h3 className="font-bold text-sm mb-4" style={{ color: "#1A202C" }}>Distribution des scores de maturité</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={SCORE_DISTRIBUTION} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: "#94A3B8" }} />
                <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} />
                <Tooltip content={<CustomTooltipBar />} />
                <Bar dataKey="count" name="Contacts" radius={[4, 4, 0, 0]}>
                  {SCORE_DISTRIBUTION.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Funnel */}
          <div className="kepler-card p-5">
            <h3 className="font-bold text-sm mb-4" style={{ color: "#1A202C" }}>Entonnoir de conversion</h3>
            <div className="space-y-3 mt-2">
              {[
                { label: "Froid",    count: coldCount,      color: "#94A3B8", pct: 100 },
                { label: "Tiède",    count: warmCount,      color: "#F59E0B", pct: Math.round((warmCount / (coldCount + warmCount + hotCount + convertedCount)) * 100) * 2 },
                { label: "Chaud",    count: hotCount,       color: "#EF4444", pct: Math.round((hotCount / (coldCount + warmCount + hotCount + convertedCount)) * 100) * 3 },
                { label: "Converti", count: convertedCount, color: "#2D9B6F", pct: Math.round((convertedCount / (coldCount + warmCount + hotCount + convertedCount)) * 100) * 4 },
              ].map(({ label, count, color, pct }) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold" style={{ color: "#374151" }}>{label}</span>
                    <span className="text-sm font-bold" style={{ color }}>{count} contacts</span>
                  </div>
                  <div className="h-6 rounded-full overflow-hidden" style={{ background: "#F1F5F9" }}>
                    <div
                      className="h-full rounded-full flex items-center justify-end pr-2 text-xs font-bold text-white transition-all"
                      style={{ width: `${Math.min(pct, 100)}%`, background: color }}
                    >
                      {Math.round(count / (coldCount + warmCount + hotCount + convertedCount) * 100)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">

          {/* Messages timeline */}
          <div className="kepler-card p-5">
            <h3 className="font-bold text-sm mb-4" style={{ color: "#1A202C" }}>
              Messages envoyés, ouverts, répondus (30 jours)
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={MESSAGES_TIMELINE}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94A3B8" }} />
                <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} />
                <Tooltip content={<CustomTooltipLine />} />
                <Legend wrapperStyle={{ fontSize: "0.75rem" }} />
                <Line type="monotone" dataKey="envoyés"  stroke="#1B3A5C" strokeWidth={2.5} dot={{ r: 3 }} name="Envoyés" />
                <Line type="monotone" dataKey="ouverts"  stroke="#C9A84C" strokeWidth={2.5} dot={{ r: 3 }} name="Ouverts" />
                <Line type="monotone" dataKey="répondus" stroke="#2D9B6F" strokeWidth={2.5} dot={{ r: 3 }} name="Répondus" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Channel performance */}
          <div className="kepler-card p-5">
            <h3 className="font-bold text-sm mb-4" style={{ color: "#1A202C" }}>
              Taux de réponse par canal
            </h3>
            <div className="space-y-4 mt-4">
              {CHANNEL_PERF.map(({ channel, taux, color }) => (
                <div key={channel}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-sm" style={{ color: "#374151" }}>{channel}</span>
                    <span className="font-bold" style={{ color }}>{taux}%</span>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden" style={{ background: "#F1F5F9" }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${taux}%`, background: color }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div
              className="mt-4 p-3 rounded-lg text-xs"
              style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", color: "#166534" }}
            >
              💡 WhatsApp génère <strong>3× plus de réponses</strong> que l&apos;email sur votre base. Priorisez ce canal pour les leads chauds.
            </div>
          </div>
        </div>

        {/* Deals by source */}
        <div className="kepler-card p-5">
          <h3 className="font-bold text-sm mb-4" style={{ color: "#1A202C" }}>
            Deals générés — Attribution par source
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={DEALS_SOURCE}
                  dataKey="revenue"
                  nameKey="source"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  labelLine={false}
                >
                  {DEALS_SOURCE.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatPrice(value as number)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {DEALS_SOURCE.map(({ source, deals, revenue, color }) => (
                <div key={source} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "#F8FAFC" }}>
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: color }} />
                  <div className="flex-1">
                    <div className="text-sm font-semibold" style={{ color: "#1A202C" }}>{source}</div>
                    <div className="text-xs" style={{ color: "#64748B" }}>{deals} deal{deals > 1 ? "s" : ""}</div>
                  </div>
                  <div className="font-bold text-sm" style={{ color }}>{formatPrice(revenue)}</div>
                </div>
              ))}
              <div
                className="flex items-center justify-between px-3 py-2 rounded-xl font-bold"
                style={{ background: "#1B3A5C", color: "white" }}
              >
                <span>Total commissions</span>
                <span>{formatPrice(totalRevenue)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
