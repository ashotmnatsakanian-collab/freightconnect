"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { WeekData } from "@/lib/mock-data";

interface Props {
  data: WeekData[];
  primaryColor: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="card !p-3 text-sm shadow-xl border" style={{ minWidth: 120 }}>
        <div className="font-bold mb-1">{label}</div>
        <div style={{ color: "var(--primary)" }} className="font-semibold">
          {payload[0].value.toLocaleString("fr-FR")} €
        </div>
        <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
          {payload[0].payload.appointments} RDV
        </div>
      </div>
    );
  }
  return null;
};

export function RevenueChart({ data, primaryColor }: Props) {
  const total = data.reduce((s, d) => s + d.revenue, 0);
  const peak = data.reduce((m, d) => (d.revenue > m.revenue ? d : m), data[0]);

  return (
    <div className="card animate-fade-up" style={{ animationDelay: "0.3s" }}>
      <div className="flex items-center justify-between mb-1">
        <div>
          <h3 className="font-bold text-base" style={{ color: "var(--text)" }}>
            Revenus de la semaine
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            Pic: <span className="font-semibold">{peak.day}</span> — {peak.revenue.toLocaleString("fr-FR")} €
          </p>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold" style={{ color: "var(--primary)" }}>
            {total.toLocaleString("fr-FR")} €
          </div>
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>total</div>
        </div>
      </div>

      <div className="mt-4" style={{ height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={26} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: "var(--text-muted)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--text-muted)" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}€`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)", radius: 6 }} />
            <Bar
              dataKey="revenue"
              fill={primaryColor}
              radius={[6, 6, 0, 0]}
              opacity={0.85}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
