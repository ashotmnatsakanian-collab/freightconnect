"use client";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CheckCircle, X, Package } from "lucide-react";

interface FreightRequest {
  id: string;
  message: string;
  status: string;
  createdAt: string;
  availability: {
    departureCity: string;
    arrivalCity: string | null;
    anyDestination: boolean;
    vehicleType: string;
    availableFrom: string;
    company: { name: string };
    user: { firstName: string; lastName: string; phone: string | null };
  };
  sender: {
    firstName: string;
    lastName: string;
    company: { name: string } | null;
  };
}

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  accepted: "Acceptée",
  refused: "Refusée",
};

export default function DriverRequestsPage() {
  const [requests, setRequests] = useState<FreightRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const data = await api.get<FreightRequest[]>("/api/freight/request");
    setRequests(data);
    setLoading(false);
  }

  async function respond(id: string, status: "accepted" | "refused") {
    await api.patch(`/api/freight/request/${id}`, { status });
    load();
  }

  const pending = requests.filter((r) => r.status === "pending");
  const past = requests.filter((r) => r.status !== "pending");

  return (
    <AppShell title="Demandes reçues">
      <div className="space-y-6">
        {/* Pending */}
        <div>
          <h2 className="font-bold text-slate-700 mb-3">
            En attente de réponse ({pending.length})
          </h2>
          {loading ? (
            <div className="text-slate-400 text-center py-8">Chargement...</div>
          ) : pending.length === 0 ? (
            <div className="card text-center py-8 text-slate-400">
              <Package className="w-10 h-10 mx-auto mb-2 opacity-30" />
              Aucune demande en attente
            </div>
          ) : (
            <div className="space-y-3">
              {pending.map((r) => (
                <div key={r.id} className="card border-l-4" style={{ borderLeftColor: "#f59e0b" }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-bold text-slate-800">
                        {r.availability.departureCity} →{" "}
                        {r.availability.anyDestination ? "Toute destination" : r.availability.arrivalCity}
                      </div>
                      <div className="text-sm text-slate-500">
                        Demande de : <strong>{r.sender.firstName} {r.sender.lastName}</strong>
                        {r.sender.company && ` — ${r.sender.company.name}`}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {format(new Date(r.createdAt), "dd/MM/yyyy à HH:mm", { locale: fr })}
                      </div>
                    </div>
                    <span className="badge badge-pending">En attente</span>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 mb-4 text-sm text-slate-600 italic">
                    &ldquo;{r.message}&rdquo;
                  </div>
                  <div className="flex gap-3">
                    <button
                      className="btn-primary flex-1 justify-center text-sm"
                      onClick={() => respond(r.id, "accepted")}
                    >
                      <CheckCircle className="w-4 h-4" /> Accepter
                    </button>
                    <button
                      className="btn-secondary flex-1 justify-center text-sm"
                      style={{ color: "#ef4444", borderColor: "#fca5a5" }}
                      onClick={() => respond(r.id, "refused")}
                    >
                      <X className="w-4 h-4" /> Refuser
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Past */}
        {past.length > 0 && (
          <div>
            <h2 className="font-bold text-slate-700 mb-3">Historique</h2>
            <div className="space-y-2">
              {past.map((r) => (
                <div key={r.id} className="card flex items-center justify-between py-3">
                  <div>
                    <div className="font-medium text-slate-700 text-sm">
                      {r.availability.departureCity} → {r.availability.anyDestination ? "Toute destination" : r.availability.arrivalCity}
                    </div>
                    <div className="text-xs text-slate-400">
                      {r.sender.firstName} {r.sender.lastName}
                      {" • "}
                      {format(new Date(r.createdAt), "dd/MM/yyyy", { locale: fr })}
                    </div>
                  </div>
                  <span className={`badge badge-${r.status}`}>{STATUS_LABELS[r.status]}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
