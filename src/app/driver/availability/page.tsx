"use client";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Plus, Truck, Calendar, Euro } from "lucide-react";

interface Availability {
  id: string;
  departureCity: string;
  departureRegion: string;
  arrivalCity: string | null;
  anyDestination: boolean;
  availableFrom: string;
  availableTo: string;
  vehicleType: string;
  capacity: number | null;
  price: number | null;
  priceUnit: string | null;
  status: string;
}

const VEHICLE_LABELS: Record<string, string> = {
  bache: "🚛 Bâché", frigo: "❄️ Frigo", plateau: "🔩 Plateau",
  citerne: "🛢️ Citerne", fourgon: "📦 Fourgon", mega: "🚛 Mega",
};

export default function DriverAvailabilityPage() {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const data = await api.get<Availability[]>("/api/freight");
    setAvailabilities(data);
    setLoading(false);
  }

  return (
    <AppShell title="Mes disponibilités">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-slate-500 text-sm">Déclarez vos disponibilités pour trouver des chargements</p>
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4" /> Nouvelle disponibilité
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400">Chargement...</div>
        ) : availabilities.length === 0 ? (
          <div className="card text-center py-12 text-slate-400">
            <Truck className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <div className="font-medium">Aucune disponibilité déclarée</div>
            <div className="text-sm mt-1">Déclarez votre disponibilité pour être trouvé par les dispatchers</div>
            <button className="btn-primary mt-4" onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4" /> Déclarer ma disponibilité
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availabilities.map((a) => (
              <div key={a.id} className="card">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-bold text-slate-800">
                      {a.departureCity} <span className="text-orange-500">→</span>{" "}
                      {a.anyDestination ? <span className="text-slate-400 italic">Toute destination</span> : a.arrivalCity}
                    </div>
                    <div className="text-slate-500 text-sm mt-1">{VEHICLE_LABELS[a.vehicleType]}</div>
                  </div>
                  <span className={`badge badge-${a.status}`}>
                    {a.status === "active" ? "Active" : a.status === "booked" ? "Réservée" : "Expirée"}
                  </span>
                </div>
                <div className="flex gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(a.availableFrom), "dd/MM", { locale: fr })}
                    {" — "}
                    {format(new Date(a.availableTo), "dd/MM", { locale: fr })}
                  </span>
                  {a.capacity && <span>{a.capacity} t</span>}
                  {a.price && (
                    <span className="flex items-center gap-1 text-orange-600 font-semibold">
                      <Euro className="w-3 h-3" />
                      {a.price}/{a.priceUnit === "km" ? "km" : a.priceUnit === "ton" ? "t" : "trajet"}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <AvailabilityForm
          onClose={() => setShowForm(false)}
          onCreated={() => { setShowForm(false); load(); }}
        />
      )}
    </AppShell>
  );
}

function AvailabilityForm({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({
    departureRegion: "", departureCity: "",
    arrivalRegion: "", arrivalCity: "",
    anyDestination: false,
    availableFrom: "", availableTo: "",
    vehicleType: "bache",
    capacity: "", volume: "", price: "", priceUnit: "km",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/api/freight", form);
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2 className="text-xl font-bold mb-6" style={{ color: "#1e3a5f" }}>Déclarer ma disponibilité</h2>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Ville de départ *</label>
              <input className="input" value={form.departureCity} onChange={(e) => set("departureCity", e.target.value)} required />
            </div>
            <div>
              <label className="label">Région *</label>
              <input className="input" value={form.departureRegion} onChange={(e) => set("departureRegion", e.target.value)} required />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="anyD" checked={form.anyDestination} onChange={(e) => set("anyDestination", e.target.checked)} />
            <label htmlFor="anyD" className="text-sm font-medium">Toute destination acceptée</label>
          </div>
          {!form.anyDestination && (
            <div>
              <label className="label">Ville d'arrivée souhaitée</label>
              <input className="input" value={form.arrivalCity} onChange={(e) => set("arrivalCity", e.target.value)} />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Du *</label>
              <input type="date" className="input" value={form.availableFrom} onChange={(e) => set("availableFrom", e.target.value)} required />
            </div>
            <div>
              <label className="label">Au *</label>
              <input type="date" className="input" value={form.availableTo} onChange={(e) => set("availableTo", e.target.value)} required />
            </div>
          </div>
          <div>
            <label className="label">Type de véhicule *</label>
            <select className="input" value={form.vehicleType} onChange={(e) => set("vehicleType", e.target.value)}>
              {Object.entries(VEHICLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="label">Capacité (t)</label>
              <input type="number" step="0.1" className="input" value={form.capacity} onChange={(e) => set("capacity", e.target.value)} />
            </div>
            <div>
              <label className="label">Prix</label>
              <input type="number" step="0.01" className="input" value={form.price} onChange={(e) => set("price", e.target.value)} />
            </div>
            <div>
              <label className="label">Unité</label>
              <select className="input" value={form.priceUnit} onChange={(e) => set("priceUnit", e.target.value)}>
                <option value="km">€/km</option>
                <option value="trip">€/trajet</option>
                <option value="ton">€/tonne</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1 justify-center" disabled={loading}>
              {loading ? "Enregistrement..." : "Déclarer"}
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
}
