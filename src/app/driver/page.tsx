"use client";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Package, MapPin, Calendar, CheckCircle, Truck, Clock } from "lucide-react";

interface Mission {
  id: string;
  reference: string;
  status: string;
  loadingAddress: string;
  loadingCity: string;
  loadingDate: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryDate: string;
  goodsType: string;
  weight: number | null;
  specialInstructions: string | null;
  loadingConfirmedAt: string | null;
  inRouteAt: string | null;
  arrivedAt: string | null;
  deliveredAt: string | null;
  documents: { id: string; name: string; type: string }[];
}

const STATUS_LABELS: Record<string, string> = {
  planned: "Planifiée",
  in_progress: "En cours",
  delivered: "Livrée",
  cancelled: "Annulée",
};

const STATUS_STEPS = [
  { key: "loadingConfirmedAt", label: "Chargement confirmé", icon: "✅", action: "planned" },
  { key: "inRouteAt", label: "En route", icon: "🚛", action: "in_progress" },
  { key: "arrivedAt", label: "Arrivé à destination", icon: "📍", action: null },
  { key: "deliveredAt", label: "Livraison effectuée", icon: "✓", action: "delivered" },
];

export default function DriverPage() {
  const { user } = useAuthStore();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Mission | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const data = await api.get<Mission[]>("/api/missions");
    setMissions(data);
    setLoading(false);
  }

  async function updateMission(id: string, updates: Record<string, unknown>) {
    await api.patch(`/api/missions/${id}`, updates);
    load();
    if (selected?.id === id) {
      const updated = await api.get<Mission>(`/api/missions/${id}`);
      setSelected(updated);
    }
  }

  const active = missions.filter((m) => m.status === "in_progress");
  const planned = missions.filter((m) => m.status === "planned");
  const past = missions.filter((m) => m.status === "delivered" || m.status === "cancelled");

  return (
    <AppShell title={`Bonjour, ${user?.firstName} !`}>
      <div className="space-y-6">
        {/* Active mission highlight */}
        {active.length > 0 && (
          <div className="card border-l-4" style={{ borderLeftColor: "#f97316" }}>
            <div className="flex items-center gap-2 mb-2">
              <Truck className="w-5 h-5 text-orange-500" />
              <span className="font-bold text-slate-800">Mission en cours</span>
            </div>
            {active.map((m) => (
              <div key={m.id} onClick={() => setSelected(m)} className="cursor-pointer">
                <div className="text-xl font-bold text-slate-700">
                  {m.loadingCity} → {m.deliveryCity}
                </div>
                <div className="text-slate-500 text-sm mt-1">
                  {m.goodsType} {m.weight ? `• ${m.weight} t` : ""}
                </div>
                <div className="flex items-center gap-1 text-orange-500 text-sm mt-2">
                  <Clock className="w-3 h-3" />
                  Livraison prévue : {format(new Date(m.deliveryDate), "dd/MM/yyyy à HH:mm", { locale: fr })}
                </div>
                <button className="btn-primary mt-3 text-sm" onClick={(e) => { e.stopPropagation(); setSelected(m); }}>
                  Mettre à jour le statut →
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Planned */}
        {planned.length > 0 && (
          <div>
            <h2 className="font-bold text-slate-700 mb-3">Missions planifiées ({planned.length})</h2>
            <div className="space-y-3">
              {planned.map((m) => (
                <div key={m.id} className="card cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelected(m)}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-slate-700">{m.loadingCity} → {m.deliveryCity}</div>
                      <div className="text-sm text-slate-500 mt-1">{m.goodsType}</div>
                    </div>
                    <span className={`badge badge-${m.status}`}>{STATUS_LABELS[m.status]}</span>
                  </div>
                  <div className="flex gap-4 mt-3 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(m.loadingDate), "dd/MM à HH:mm", { locale: fr })}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {m.loadingAddress}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Past */}
        {past.length > 0 && (
          <div>
            <h2 className="font-bold text-slate-700 mb-3">Historique</h2>
            <div className="space-y-2">
              {past.slice(0, 5).map((m) => (
                <div key={m.id} className="card py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-700 text-sm">{m.loadingCity} → {m.deliveryCity}</div>
                    <div className="text-xs text-slate-400">{format(new Date(m.deliveryDate), "dd/MM/yyyy", { locale: fr })}</div>
                  </div>
                  <span className={`badge badge-${m.status}`}>{STATUS_LABELS[m.status]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {missions.length === 0 && !loading && (
          <div className="card text-center py-12 text-slate-400">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <div>Aucune mission assignée</div>
          </div>
        )}
      </div>

      {/* Mission detail modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="text-xs text-slate-400 font-mono">{selected.reference}</div>
                <h2 className="text-xl font-bold text-slate-800">
                  {selected.loadingCity} → {selected.deliveryCity}
                </h2>
              </div>
              <span className={`badge badge-${selected.status}`}>{STATUS_LABELS[selected.status]}</span>
            </div>

            {/* Addresses */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-50 p-3 rounded-lg">
                <div className="text-xs font-semibold text-slate-400 uppercase mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Chargement
                </div>
                <div className="font-medium">{selected.loadingCity}</div>
                <div className="text-sm text-slate-500">{selected.loadingAddress}</div>
                <div className="text-xs text-slate-400 mt-1">
                  {format(new Date(selected.loadingDate), "dd/MM HH:mm", { locale: fr })}
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <div className="text-xs font-semibold text-slate-400 uppercase mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Livraison
                </div>
                <div className="font-medium">{selected.deliveryCity}</div>
                <div className="text-sm text-slate-500">{selected.deliveryAddress}</div>
                <div className="text-xs text-slate-400 mt-1">
                  {format(new Date(selected.deliveryDate), "dd/MM HH:mm", { locale: fr })}
                </div>
              </div>
            </div>

            {/* Goods */}
            <div className="bg-slate-50 p-3 rounded-lg mb-4">
              <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Marchandise</div>
              <div className="font-medium">{selected.goodsType}</div>
              {selected.weight && <div className="text-sm text-slate-500">{selected.weight} tonnes</div>}
              {selected.specialInstructions && (
                <div className="text-sm text-amber-600 mt-1">⚠️ {selected.specialInstructions}</div>
              )}
            </div>

            {/* Timeline */}
            <div className="mb-6">
              <div className="text-xs font-semibold text-slate-400 uppercase mb-3">Avancement</div>
              <div className="space-y-2">
                {STATUS_STEPS.map((step, idx) => {
                  const done = !!(selected as unknown as Record<string, string>)[step.key];
                  return (
                    <div key={step.key} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${done ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-400"}`}>
                        {done ? <CheckCircle className="w-4 h-4" /> : <span>{idx + 1}</span>}
                      </div>
                      <div className="flex-1">
                        <div className={`text-sm font-medium ${done ? "text-green-700" : "text-slate-500"}`}>
                          {step.label}
                        </div>
                      </div>
                      {!done && selected.status !== "delivered" && selected.status !== "cancelled" && (
                        <button
                          className="btn-primary text-xs py-1"
                          onClick={() => {
                            const update: Record<string, unknown> = { [step.key]: new Date().toISOString() };
                            if (step.action) update.status = step.action;
                            updateMission(selected.id, update);
                          }}
                        >
                          Confirmer
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <button className="btn-ghost flex-1 justify-center" onClick={() => setSelected(null)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
