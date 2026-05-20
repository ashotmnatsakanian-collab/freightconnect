"use client";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { api } from "@/lib/api";
import { Plus, Phone, Mail, User, Truck } from "lucide-react";

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  isActive: boolean;
  company: { name: string } | null;
  positions: { latitude: number; longitude: number; city: string | null }[];
  missionsAsDriver: { id: string; status: string; deliveryCity: string; deliveryDate: string }[];
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const data = await api.get<Driver[]>("/api/drivers");
    setDrivers(data);
    setLoading(false);
  }

  const activeDrivers = drivers.filter((d) => d.missionsAsDriver.some((m) => m.status === "in_progress"));
  const availableDrivers = drivers.filter((d) => !d.missionsAsDriver.some((m) => m.status === "in_progress" || m.status === "planned"));

  return (
    <AppShell title="Gestion des chauffeurs">
      <div className="space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="card text-center py-4">
            <div className="text-3xl font-bold" style={{ color: "#1e3a5f" }}>{drivers.length}</div>
            <div className="text-slate-500 text-sm">Total chauffeurs</div>
          </div>
          <div className="card text-center py-4">
            <div className="text-3xl font-bold text-amber-500">{activeDrivers.length}</div>
            <div className="text-slate-500 text-sm">En mission</div>
          </div>
          <div className="card text-center py-4">
            <div className="text-3xl font-bold text-green-500">{availableDrivers.length}</div>
            <div className="text-slate-500 text-sm">Disponibles</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-slate-700">Flotte ({drivers.length})</h2>
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4" /> Ajouter un chauffeur
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-12 text-slate-400">Chargement...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {drivers.map((driver) => {
              const currentMission = driver.missionsAsDriver.find((m) => m.status === "in_progress");
              const nextMission = driver.missionsAsDriver.find((m) => m.status === "planned");
              const lastPos = driver.positions[0];

              let statusColor = "#10b981";
              let statusLabel = "Disponible";
              if (currentMission) { statusColor = "#f59e0b"; statusLabel = "En mission"; }
              else if (nextMission) { statusColor = "#3b82f6"; statusLabel = "Mission planifiée"; }

              return (
                <div key={driver.id} className="card hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                      style={{ background: "#1e3a5f" }}>
                      {driver.firstName[0]}{driver.lastName[0]}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-slate-800">
                        {driver.firstName} {driver.lastName}
                      </div>
                      {driver.company && (
                        <div className="text-xs text-slate-400">{driver.company.name}</div>
                      )}
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-2 h-2 rounded-full" style={{ background: statusColor }} />
                        <span className="text-xs" style={{ color: statusColor }}>{statusLabel}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 border-t pt-3">
                    {driver.email && (
                      <a href={`mailto:${driver.email}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-orange-500">
                        <Mail className="w-4 h-4 text-slate-400" />
                        {driver.email}
                      </a>
                    )}
                    {driver.phone && (
                      <a href={`tel:${driver.phone}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-orange-500">
                        <Phone className="w-4 h-4 text-slate-400" />
                        {driver.phone}
                      </a>
                    )}
                    {lastPos && (
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Truck className="w-4 h-4 text-slate-400" />
                        <span>Dernière pos: {lastPos.city || "GPS"}</span>
                      </div>
                    )}
                    {currentMission && (
                      <div className="mt-2 p-2 rounded-lg text-xs font-medium" style={{ background: "#fef3c7", color: "#d97706" }}>
                        🚛 En route → {currentMission.deliveryCity}
                      </div>
                    )}
                    {nextMission && !currentMission && (
                      <div className="mt-2 p-2 rounded-lg text-xs font-medium" style={{ background: "#dbeafe", color: "#1e40af" }}>
                        📅 Prochain: → {nextMission.deliveryCity}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showForm && (
        <DriverForm
          onClose={() => setShowForm(false)}
          onCreated={() => { setShowForm(false); load(); }}
        />
      )}
    </AppShell>
  );
}

function DriverForm({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "Transport2024!" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/api/drivers", form);
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-box max-w-md">
        <div className="flex items-center gap-2 mb-6">
          <User className="w-5 h-5" style={{ color: "#f97316" }} />
          <h2 className="text-xl font-bold" style={{ color: "#1e3a5f" }}>Nouveau chauffeur</h2>
        </div>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Prénom *</label>
              <input className="input" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} required />
            </div>
            <div>
              <label className="label">Nom *</label>
              <input className="input" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} required />
            </div>
          </div>
          <div>
            <label className="label">Email *</label>
            <input type="email" className="input" value={form.email} onChange={(e) => set("email", e.target.value)} required />
          </div>
          <div>
            <label className="label">Téléphone</label>
            <input type="tel" className="input" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>
          <div>
            <label className="label">Mot de passe temporaire</label>
            <input className="input" value={form.password} onChange={(e) => set("password", e.target.value)} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1 justify-center" disabled={loading}>
              {loading ? "Création..." : "Créer le compte"}
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
}
