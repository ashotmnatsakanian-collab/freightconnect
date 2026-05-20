"use client";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { api } from "@/lib/api";
import { format, startOfWeek, addDays, isWithinInterval, parseISO, addWeeks, subWeeks } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface Mission {
  id: string;
  reference: string;
  status: string;
  loadingCity: string;
  deliveryCity: string;
  loadingDate: string;
  deliveryDate: string;
  driver?: { id: string; firstName: string; lastName: string } | null;
}

const DRIVER_COLORS = [
  "#f97316", "#1e3a5f", "#10b981", "#8b5cf6", "#ef4444",
  "#06b6d4", "#f59e0b", "#ec4899", "#14b8a6", "#6366f1",
];

const STATUS_LABELS: Record<string, string> = {
  planned: "Planifiée",
  loading_confirmed: "Chargé",
  in_progress: "En route",
  arrived: "Arrivé",
  delivered: "Livré",
  cancelled: "Annulée",
};

export default function CalendarPage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selected, setSelected] = useState<Mission | null>(null);

  useEffect(() => {
    api.get<Mission[]>("/api/missions").then(setMissions).catch(() => {});
  }, []);

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Assign colors per driver
  const driverIds = [...new Set(missions.map((m) => m.driver?.id).filter(Boolean))] as string[];
  const driverColor = (id: string) => DRIVER_COLORS[driverIds.indexOf(id) % DRIVER_COLORS.length];

  function missionsForDay(day: Date): Mission[] {
    return missions.filter((m) => {
      try {
        const start = parseISO(m.loadingDate);
        const end = parseISO(m.deliveryDate);
        return isWithinInterval(day, { start, end });
      } catch { return false; }
    });
  }

  return (
    <AppShell title="Calendrier des missions">
      <div className="card p-0 overflow-hidden">
        {/* Week navigation */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <button className="btn-ghost" onClick={() => setWeekStart((w) => subWeeks(w, 1))}>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="font-bold text-slate-700 flex items-center gap-2">
            <Calendar className="w-4 h-4" style={{ color: "#f97316" }} />
            Semaine du {format(weekStart, "d MMMM yyyy", { locale: fr })}
          </div>
          <button className="btn-ghost" onClick={() => setWeekStart((w) => addWeeks(w, 1))}>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 border-b border-slate-100">
          {days.map((day) => {
            const isToday = format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
            return (
              <div key={day.toISOString()} className="border-r border-slate-100 last:border-r-0">
                <div className={`text-center py-3 ${isToday ? "text-orange-500 font-bold" : "text-slate-500"}`}>
                  <div className="text-xs uppercase tracking-wide">{format(day, "EEE", { locale: fr })}</div>
                  <div className={`text-lg font-bold mt-0.5 w-8 h-8 mx-auto flex items-center justify-center rounded-full ${isToday ? "text-white" : ""}`}
                    style={isToday ? { background: "#f97316" } : {}}>
                    {format(day, "d")}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-7 min-h-64">
          {days.map((day) => {
            const dayMissions = missionsForDay(day);
            return (
              <div key={day.toISOString()} className="border-r border-slate-100 last:border-r-0 p-1.5 space-y-1 min-h-32">
                {dayMissions.map((m) => {
                  const color = m.driver ? driverColor(m.driver.id) : "#94a3b8";
                  return (
                    <button key={m.id} onClick={() => setSelected(m)}
                      className="w-full text-left rounded-lg px-2 py-1.5 text-xs font-medium text-white leading-tight"
                      style={{ background: color }}>
                      <div className="font-bold truncate">{m.reference}</div>
                      <div className="opacity-80 truncate">{m.loadingCity} → {m.deliveryCity}</div>
                      {m.driver && <div className="opacity-70 truncate">{m.driver.firstName} {m.driver.lastName[0]}.</div>}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      {driverIds.length > 0 && (
        <div className="card mt-4">
          <div className="text-xs font-semibold text-slate-500 uppercase mb-3">Légende chauffeurs</div>
          <div className="flex flex-wrap gap-3">
            {driverIds.map((id) => {
              const m = missions.find((x) => x.driver?.id === id);
              if (!m?.driver) return null;
              return (
                <div key={id} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: driverColor(id) }} />
                  <span className="text-sm text-slate-600">{m.driver.firstName} {m.driver.lastName}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mission detail modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 text-lg">{selected.reference}</h3>
              <span className={`badge-${selected.status === "delivered" ? "green" : selected.status === "in_progress" ? "blue" : "gray"}`}>
                {STATUS_LABELS[selected.status] ?? selected.status}
              </span>
            </div>
            <div className="space-y-2 text-sm text-slate-600">
              <div><span className="font-medium">Départ :</span> {selected.loadingCity}</div>
              <div><span className="font-medium">Livraison :</span> {selected.deliveryCity}</div>
              <div><span className="font-medium">Chargement :</span> {format(parseISO(selected.loadingDate), "d MMMM yyyy", { locale: fr })}</div>
              <div><span className="font-medium">Livraison :</span> {format(parseISO(selected.deliveryDate), "d MMMM yyyy", { locale: fr })}</div>
              {selected.driver && <div><span className="font-medium">Chauffeur :</span> {selected.driver.firstName} {selected.driver.lastName}</div>}
            </div>
            <button className="btn-ghost mt-4 w-full" onClick={() => setSelected(null)}>Fermer</button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
