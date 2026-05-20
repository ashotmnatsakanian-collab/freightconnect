"use client";
import { useEffect, useState, useCallback } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Truck, Search, Plus, Calendar, Weight, Euro,
  Phone, Send, CheckCircle, X, Zap, Target,
  Calculator, ChevronDown, ChevronUp, Info
} from "lucide-react";

interface Availability {
  id: string;
  departureCity: string;
  departureRegion: string;
  arrivalCity: string | null;
  arrivalRegion: string | null;
  anyDestination: boolean;
  availableFrom: string;
  availableTo: string;
  vehicleType: string;
  capacity: number | null;
  volume: number | null;
  price: number | null;
  priceUnit: string | null;
  status: string;
  notes: string | null;
  matchScore: number;
  user: { id: string; firstName: string; lastName: string; phone: string | null };
  company: { id: string; name: string };
  freightRequests: { id: string; status: string }[];
}

interface PriceEstimate {
  distanceKm: number | null;
  estimated: boolean;
  suggestedMin: number;
  suggestedMax: number;
  emptyReturnCost: number;
  savingsMin: number;
  savingsMax: number;
}

const VEHICLE_LABELS: Record<string, string> = {
  bache: "Bâché", frigo: "Frigo ❄️", plateau: "Plateau",
  citerne: "Citerne", fourgon: "Fourgon", mega: "Mega",
};
const VEHICLE_ICONS: Record<string, string> = {
  bache: "🚛", frigo: "❄️", plateau: "🔩", citerne: "🛢️", fourgon: "📦", mega: "🚛",
};
const PRICE_UNIT_LABELS: Record<string, string> = {
  km: "€/km", trip: "€/trajet", ton: "€/tonne",
};

export default function FreightPage() {
  const { user } = useAuthStore();
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({ dep: "", arr: "", vehicle: "", maxPrice: "" });
  const [showForm, setShowForm] = useState(false);
  const [contactModal, setContactModal] = useState<Availability | null>(null);
  const [requestSent, setRequestSent] = useState<Set<string>>(new Set());
  const [showCalculator, setShowCalculator] = useState(false);
  const [tab, setTab] = useState<"all" | "mine">("all");

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search.dep) params.set("departureCity", search.dep);
    if (search.arr) params.set("arrivalCity", search.arr);
    if (search.vehicle) params.set("vehicleType", search.vehicle);
    if (search.maxPrice) params.set("maxPrice", search.maxPrice);
    if (tab === "mine") params.set("myOnly", "true");
    const data = await api.get<Availability[]>(`/api/freight?${params}`);
    setAvailabilities(data);
    setLoading(false);
  }, [search, tab]);

  useEffect(() => { load(); }, [tab]);

  async function sendRequest(availabilityId: string, message: string) {
    await api.post("/api/freight/request", { availabilityId, message });
    setRequestSent((s) => new Set([...s, availabilityId]));
    setContactModal(null);
  }

  const matched = availabilities.filter((a) => a.matchScore === 100);
  const others = availabilities.filter((a) => a.matchScore < 100);

  return (
    <AppShell title="Bourse de fret">
      <div className="space-y-5">

        {/* Bannière match si des résultats pertinents */}
        {matched.length > 0 && tab === "all" && (
          <div className="rounded-2xl px-5 py-4 flex items-center gap-4"
            style={{ background: "linear-gradient(90deg,#1e3a5f,#2d5282)", border: "1px solid #f9731633" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#f97316" }}>
              <Target className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-white font-bold text-sm">
                🎯 {matched.length} fret{matched.length > 1 ? "s" : ""} compatible{matched.length > 1 ? "s" : ""} avec vos retours à vide
              </div>
              <div className="text-blue-200 text-xs mt-0.5">
                Ces disponibilités correspondent aux villes de livraison de vos missions en cours
              </div>
            </div>
            <div className="text-orange-400 font-bold text-lg flex-shrink-0">
              {matched.length}
            </div>
          </div>
        )}

        {/* Barre d'outils */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            {/* Onglets */}
            <div className="flex rounded-xl p-1 gap-1" style={{ background: "#f1f5f9" }}>
              {(["all", "mine"] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${tab === t ? "bg-white shadow text-slate-800" : "text-slate-500 hover:text-slate-700"}`}>
                  {t === "all" ? "Tous les frets" : "Mes disponibilités"}
                </button>
              ))}
            </div>
            <div className="flex-1" />
            {/* Calculateur */}
            <button className="btn-secondary text-sm" onClick={() => setShowCalculator((v) => !v)}>
              <Calculator className="w-4 h-4" />
              Calculer un prix
              {showCalculator ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            {(user?.role === "driver" || user?.role === "dispatcher") && (
              <button className="btn-primary text-sm" onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4" />
                {user.role === "driver" ? "Déclarer ma dispo" : "Publier un fret"}
              </button>
            )}
          </div>

          {/* Calculateur intégré */}
          {showCalculator && <PriceCalculator />}

          {/* Filtres */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
            <div>
              <label className="label">Départ</label>
              <input className="input" placeholder="Ex: Lyon" value={search.dep}
                onChange={(e) => setSearch((s) => ({ ...s, dep: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && load()} />
            </div>
            <div>
              <label className="label">Arrivée</label>
              <input className="input" placeholder="Ex: Paris" value={search.arr}
                onChange={(e) => setSearch((s) => ({ ...s, arr: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && load()} />
            </div>
            <div>
              <label className="label">Véhicule</label>
              <select className="input" value={search.vehicle}
                onChange={(e) => setSearch((s) => ({ ...s, vehicle: e.target.value }))}>
                <option value="">Tous types</option>
                {Object.entries(VEHICLE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{VEHICLE_ICONS[k]} {v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Prix max (€)</label>
              <input type="number" className="input" placeholder="Illimité" value={search.maxPrice}
                onChange={(e) => setSearch((s) => ({ ...s, maxPrice: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button className="btn-primary text-sm" onClick={load}>
              <Search className="w-4 h-4" /> Rechercher
            </button>
            <button className="btn-ghost text-sm" onClick={() => { setSearch({ dep: "", arr: "", vehicle: "", maxPrice: "" }); }}>
              Réinitialiser
            </button>
          </div>
        </div>

        {/* Résultats */}
        {loading ? (
          <div className="text-center py-16 text-slate-400">
            <Truck className="w-10 h-10 mx-auto mb-3 animate-pulse opacity-40" />
            Recherche en cours...
          </div>
        ) : availabilities.length === 0 ? (
          <EmptyState tab={tab} onAdd={() => setShowForm(true)} role={user?.role} />
        ) : (
          <div className="space-y-6">
            {/* Frets matchés */}
            {matched.length > 0 && tab === "all" && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-orange-500" />
                  <h2 className="font-bold text-slate-700 text-sm uppercase tracking-wide">Compatibles avec vos retours</h2>
                  <span className="badge badge-active text-xs">{matched.length}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {matched.map((a) => (
                    <FreightCard key={a.id} a={a} role={user?.role}
                      alreadySent={requestSent.has(a.id) || a.freightRequests.length > 0}
                      onContact={() => setContactModal(a)} highlight />
                  ))}
                </div>
              </div>
            )}

            {/* Autres frets */}
            {others.length > 0 && (
              <div>
                {matched.length > 0 && tab === "all" && (
                  <div className="flex items-center gap-2 mb-3">
                    <h2 className="font-bold text-slate-700 text-sm uppercase tracking-wide text-slate-400">Autres disponibilités</h2>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {others.map((a) => (
                    <FreightCard key={a.id} a={a} role={user?.role}
                      alreadySent={requestSent.has(a.id) || a.freightRequests.length > 0}
                      onContact={() => setContactModal(a)} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {contactModal && (
        <ContactModal availability={contactModal} onClose={() => setContactModal(null)}
          onSend={(msg) => sendRequest(contactModal.id, msg)} />
      )}
      {showForm && (
        <AvailabilityForm onClose={() => setShowForm(false)} onCreated={() => { setShowForm(false); load(); }} />
      )}
    </AppShell>
  );
}

/* ── Carte fret ── */
function FreightCard({ a, role, alreadySent, onContact, highlight }: {
  a: Availability; role?: string; alreadySent: boolean; onContact: () => void; highlight?: boolean;
}) {
  return (
    <div className="card hover:shadow-lg transition-shadow relative overflow-hidden"
      style={highlight ? { borderTop: "3px solid #f97316" } : {}}>
      {highlight && (
        <div className="absolute top-3 right-3">
          <span className="badge" style={{ background: "#fff3e0", color: "#f97316", fontSize: "0.65rem" }}>
            🎯 Match retour à vide
          </span>
        </div>
      )}

      <div className="mb-3 pr-24">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl">{VEHICLE_ICONS[a.vehicleType]}</span>
          <div>
            <div className="font-bold text-slate-800 leading-tight">
              {a.departureCity}
              <span className="text-orange-500 mx-1.5">→</span>
              {a.anyDestination ? <span className="italic text-slate-400 font-normal text-sm">Toute destination</span> : a.arrivalCity}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">{VEHICLE_LABELS[a.vehicleType]} • {a.departureRegion}</div>
          </div>
        </div>
      </div>

      <div className="space-y-1.5 mb-4 text-sm">
        <div className="flex items-center gap-2 text-slate-500">
          <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{format(new Date(a.availableFrom), "dd MMM", { locale: fr })} — {format(new Date(a.availableTo), "dd MMM yyyy", { locale: fr })}</span>
        </div>
        {a.capacity && (
          <div className="flex items-center gap-2 text-slate-500">
            <Weight className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{a.capacity} tonnes{a.volume ? ` · ${a.volume} m³` : ""}</span>
          </div>
        )}
        {a.price && (
          <div className="flex items-center gap-2 font-bold" style={{ color: "#f97316" }}>
            <Euro className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{a.price} {PRICE_UNIT_LABELS[a.priceUnit || "trip"]}</span>
          </div>
        )}
      </div>

      {a.notes && (
        <div className="text-xs text-slate-400 italic mb-3 bg-slate-50 rounded-lg px-3 py-2">
          &ldquo;{a.notes}&rdquo;
        </div>
      )}

      <div className="border-t pt-3 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-700 truncate">
            {a.user.firstName} {a.user.lastName}
          </div>
          <div className="text-xs text-slate-400 truncate">{a.company.name}</div>
        </div>
        <div className="flex gap-1.5 flex-shrink-0">
          {a.user.phone && (
            <a href={`tel:${a.user.phone}`} className="btn-ghost text-xs p-2" title={a.user.phone}>
              <Phone className="w-3.5 h-3.5" />
            </a>
          )}
          {role === "dispatcher" && (
            <button
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 ${alreadySent ? "bg-green-50 text-green-600" : "btn-primary"}`}
              onClick={onContact}
              disabled={alreadySent}
            >
              {alreadySent ? <><CheckCircle className="w-3 h-3" /> Envoyé</> : <><Send className="w-3 h-3" /> Contacter</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Calculateur de prix ── */
function PriceCalculator() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [vehicle, setVehicle] = useState("bache");
  const [result, setResult] = useState<PriceEstimate | null>(null);
  const [loading, setLoading] = useState(false);

  async function calculate() {
    if (!from || !to) return;
    setLoading(true);
    const data = await api.get<PriceEstimate>(`/api/price-estimate?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&vehicleType=${vehicle}`);
    setResult(data);
    setLoading(false);
  }

  return (
    <div className="rounded-xl p-4 mb-1" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
      <div className="flex items-center gap-2 mb-3">
        <Calculator className="w-4 h-4 text-orange-500" />
        <span className="font-bold text-slate-700 text-sm">Calculateur de tarif & économies</span>
        <span className="text-xs text-slate-400 flex items-center gap-1"><Info className="w-3 h-3" /> Basé sur les tarifs du marché</span>
      </div>
      <div className="flex flex-wrap gap-2 items-end">
        <div>
          <label className="label">De</label>
          <input className="input" style={{ width: "130px" }} placeholder="Lyon" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div>
          <label className="label">À</label>
          <input className="input" style={{ width: "130px" }} placeholder="Paris" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <div>
          <label className="label">Véhicule</label>
          <select className="input" style={{ width: "130px" }} value={vehicle} onChange={(e) => setVehicle(e.target.value)}>
            {Object.entries(VEHICLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <button className="btn-primary text-sm" onClick={calculate} disabled={loading || !from || !to}>
          {loading ? "..." : "Estimer"}
        </button>
      </div>

      {result && (
        <div className="mt-3 grid grid-cols-3 gap-3">
          <div className="rounded-lg p-3 text-center" style={{ background: "#dbeafe" }}>
            <div className="text-xs text-blue-600 font-semibold mb-1">
              {result.distanceKm ? `Distance (~${result.distanceKm} km)` : "Distance estimée"}
            </div>
            <div className="text-lg font-extrabold text-blue-800">
              {result.suggestedMin}€ – {result.suggestedMax}€
            </div>
            <div className="text-xs text-blue-500 mt-0.5">Tarif marché suggéré</div>
          </div>
          <div className="rounded-lg p-3 text-center" style={{ background: "#fee2e2" }}>
            <div className="text-xs text-red-500 font-semibold mb-1">Coût retour à vide</div>
            <div className="text-lg font-extrabold text-red-700">~{result.emptyReturnCost}€</div>
            <div className="text-xs text-red-400 mt-0.5">Gasoil + chauffeur uniquement</div>
          </div>
          <div className="rounded-lg p-3 text-center" style={{ background: "#d1fae5" }}>
            <div className="text-xs text-green-600 font-semibold mb-1">💰 Économies réalisées</div>
            <div className="text-lg font-extrabold text-green-700">
              {result.savingsMin}€ – {result.savingsMax}€
            </div>
            <div className="text-xs text-green-500 mt-0.5">En trouvant un fret</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Empty state ── */
function EmptyState({ tab, onAdd, role }: { tab: string; onAdd: () => void; role?: string }) {
  return (
    <div className="card text-center py-16">
      <div className="text-6xl mb-4">{tab === "mine" ? "📋" : "🔍"}</div>
      <div className="font-bold text-slate-700 text-lg mb-2">
        {tab === "mine" ? "Vous n'avez aucune disponibilité publiée" : "Aucun fret disponible pour le moment"}
      </div>
      <div className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
        {tab === "mine"
          ? "Déclarez votre disponibilité pour être trouvé par les dispatchers de toute la plateforme."
          : "La bourse est vide. Soyez le premier à publier une disponibilité ou modifiez vos critères de recherche."}
      </div>
      {(role === "driver" || role === "dispatcher") && (
        <button className="btn-primary mx-auto" onClick={onAdd}>
          <Plus className="w-4 h-4" />
          {role === "driver" ? "Déclarer ma disponibilité" : "Publier un fret"}
        </button>
      )}
    </div>
  );
}

/* ── Modal contact ── */
function ContactModal({ availability: a, onClose, onSend }: {
  availability: Availability; onClose: () => void; onSend: (msg: string) => void;
}) {
  const [message, setMessage] = useState(
    `Bonjour ${a.user.firstName}, je suis intéressé par votre disponibilité au départ de ${a.departureCity} (${format(new Date(a.availableFrom), "dd/MM/yyyy", { locale: fr })}). Pouvez-vous me recontacter ?`
  );
  return (
    <div className="modal-overlay">
      <div className="modal-box max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold" style={{ color: "#1e3a5f" }}>Envoyer une demande</h2>
          <button onClick={onClose} className="btn-ghost p-1"><X className="w-4 h-4" /></button>
        </div>
        <div className="rounded-xl p-3 mb-4" style={{ background: "#f8fafc" }}>
          <div className="font-semibold text-slate-700">{a.user.firstName} {a.user.lastName}</div>
          <div className="text-xs text-slate-400">{a.company.name}</div>
          <div className="text-sm font-bold mt-1" style={{ color: "#f97316" }}>
            {a.departureCity} → {a.anyDestination ? "Toute destination" : a.arrivalCity}
          </div>
        </div>
        <label className="label">Message</label>
        <textarea className="input" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} />
        <div className="flex gap-3 mt-4">
          <button className="btn-primary flex-1 justify-center" onClick={() => onSend(message)}>
            <Send className="w-4 h-4" /> Envoyer
          </button>
          <button className="btn-secondary" onClick={onClose}>Annuler</button>
        </div>
      </div>
    </div>
  );
}

/* ── Formulaire disponibilité ── */
function AvailabilityForm({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({
    departureRegion: "", departureCity: "", arrivalRegion: "", arrivalCity: "",
    anyDestination: false, availableFrom: "", availableTo: "",
    vehicleType: "bache", capacity: "", volume: "", price: "", priceUnit: "km", notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try { await api.post("/api/freight", form); onCreated(); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2 className="text-xl font-bold mb-6" style={{ color: "#1e3a5f" }}>Publier une disponibilité</h2>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Ville de départ *</label>
              <input className="input" value={form.departureCity} onChange={(e) => set("departureCity", e.target.value)} required />
            </div>
            <div><label className="label">Région *</label>
              <input className="input" value={form.departureRegion} onChange={(e) => set("departureRegion", e.target.value)} required />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="anyD" checked={form.anyDestination} onChange={(e) => set("anyDestination", e.target.checked)} />
            <label htmlFor="anyD" className="text-sm font-medium">Toute destination acceptée</label>
          </div>
          {!form.anyDestination && (
            <div><label className="label">Ville d'arrivée souhaitée</label>
              <input className="input" value={form.arrivalCity} onChange={(e) => set("arrivalCity", e.target.value)} />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Disponible du *</label>
              <input type="date" className="input" value={form.availableFrom} onChange={(e) => set("availableFrom", e.target.value)} required />
            </div>
            <div><label className="label">Au *</label>
              <input type="date" className="input" value={form.availableTo} onChange={(e) => set("availableTo", e.target.value)} required />
            </div>
          </div>
          <div><label className="label">Type de véhicule *</label>
            <select className="input" value={form.vehicleType} onChange={(e) => set("vehicleType", e.target.value)}>
              {Object.entries(VEHICLE_LABELS).map(([k, v]) => <option key={k} value={k}>{VEHICLE_ICONS[k]} {v}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="label">Capacité (t)</label>
              <input type="number" step="0.1" className="input" value={form.capacity} onChange={(e) => set("capacity", e.target.value)} />
            </div>
            <div><label className="label">Prix</label>
              <input type="number" step="0.01" className="input" value={form.price} onChange={(e) => set("price", e.target.value)} />
            </div>
            <div><label className="label">Unité</label>
              <select className="input" value={form.priceUnit} onChange={(e) => set("priceUnit", e.target.value)}>
                <option value="km">€/km</option>
                <option value="trip">€/trajet</option>
                <option value="ton">€/tonne</option>
              </select>
            </div>
          </div>
          <div><label className="label">Notes (facultatif)</label>
            <textarea className="input" rows={2} placeholder="Ex: Disponible dès 7h, chargement rapide possible..." value={form.notes} onChange={(e) => set("notes", e.target.value)} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1 justify-center" disabled={loading}>
              {loading ? "Publication..." : "Publier"}
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
}
