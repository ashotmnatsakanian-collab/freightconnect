"use client";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Plus, Search, Package, ChevronRight,
  MapPin, Calendar, Weight, User, Star, Download, Upload
} from "lucide-react";
import { useRef } from "react";

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
  volume: number | null;
  price: number | null;
  priceUnit: string | null;
  driver?: { id: string; firstName: string; lastName: string } | null;
  documents: unknown[];
}

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
}

const STATUS_LABELS: Record<string, string> = {
  planned: "Planifiée",
  in_progress: "En cours",
  delivered: "Livrée",
  cancelled: "Annulée",
};

const VEHICLE_TYPES: Record<string, string> = {
  bache: "Bâché",
  frigo: "Frigo",
  plateau: "Plateau",
  citerne: "Citerne",
  fourgon: "Fourgon",
  mega: "Mega",
};

export default function MissionsPage() {
  const { user } = useAuthStore();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Mission | null>(null);
  const [ratingScore, setRatingScore] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  const [ratingDone, setRatingDone] = useState<Set<string>>(new Set());
  const [ratingSaving, setRatingSaving] = useState(false);
  const [importResult, setImportResult] = useState<{ created: number; errors: string[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    const [m, d] = await Promise.all([
      api.get<Mission[]>("/api/missions"),
      api.get<Driver[]>("/api/drivers").catch(() => []),
    ]);
    setMissions(m);
    setDrivers(d);
    setLoading(false);
  }

  const filtered = missions.filter((m) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      m.reference.toLowerCase().includes(q) ||
      m.loadingCity.toLowerCase().includes(q) ||
      m.deliveryCity.toLowerCase().includes(q) ||
      m.goodsType.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  async function updateStatus(id: string, status: string) {
    await api.patch(`/api/missions/${id}`, { status });
    setMissions((prev) => prev.map((m) => m.id === id ? { ...m, status } : m));
    if (selected?.id === id) setSelected((s) => s ? { ...s, status } : s);
  }

  async function submitRating(missionId: string) {
    if (!ratingScore) return;
    setRatingSaving(true);
    try {
      await api.post("/api/ratings", { missionId, score: ratingScore, comment: ratingComment });
      setRatingDone((s) => new Set([...s, missionId]));
      setRatingScore(0);
      setRatingComment("");
    } catch { /* already rated */ }
    setRatingSaving(false);
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    try {
      const result = await api.upload<{ created: number; errors: string[] }>("/api/missions/import", fd);
      setImportResult(result);
      loadAll();
    } catch (err) {
      setImportResult({ created: 0, errors: [err instanceof Error ? err.message : "Erreur import"] });
    }
    e.target.value = "";
  }

  function exportPDF() {
    const css = `<style>body{font-family:sans-serif;padding:20px}h1{color:#1e3a5f}table{width:100%;border-collapse:collapse;font-size:12px}th{background:#1e3a5f;color:white;padding:8px;text-align:left}td{padding:8px;border-bottom:1px solid #e2e8f0}.badge{display:inline-block;padding:2px 8px;border-radius:9999px;font-size:11px;font-weight:600}</style>`;
    const rows = filtered.map((m) => `<tr>
      <td>${m.reference}</td>
      <td>${m.loadingCity} → ${m.deliveryCity}</td>
      <td>${format(new Date(m.loadingDate), "dd/MM/yyyy", { locale: fr })}</td>
      <td>${format(new Date(m.deliveryDate), "dd/MM/yyyy", { locale: fr })}</td>
      <td>${m.driver ? `${m.driver.firstName} ${m.driver.lastName}` : "—"}</td>
      <td>${STATUS_LABELS[m.status] ?? m.status}</td>
      <td>${m.price ? `${m.price} €` : "—"}</td>
    </tr>`).join("");
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">${css}</head><body>
      <h1>Rapport des missions</h1>
      <p>Généré le ${format(new Date(), "d MMMM yyyy", { locale: fr })} — ${filtered.length} mission(s)</p>
      <table><thead><tr><th>Référence</th><th>Trajet</th><th>Chargement</th><th>Livraison</th><th>Chauffeur</th><th>Statut</th><th>Prix</th></tr></thead>
      <tbody>${rows}</tbody></table>
    </body></html>`;
    const w = window.open("", "_blank");
    if (w) { w.document.write(html); w.document.close(); w.print(); }
  }

  return (
    <AppShell title="Gestion des missions">
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              className="input pl-9"
              placeholder="Rechercher une mission..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="input"
            style={{ width: "auto" }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            {Object.entries(STATUS_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
          {user?.role === "dispatcher" && (
            <>
              <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleImport} />
              <button className="btn-secondary" onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4" />
                Importer Excel
              </button>
            </>
          )}
          <button className="btn-secondary" onClick={exportPDF}>
            <Download className="w-4 h-4" />
            Exporter PDF
          </button>
          <button className="btn-primary" onClick={() => { setShowForm(true); setSelected(null); }}>
            <Plus className="w-4 h-4" />
            Nouvelle mission
          </button>
        </div>

        {/* Import result */}
        {importResult && (
          <div className={`px-4 py-3 rounded-xl text-sm flex items-start gap-3 ${importResult.errors.length === 0 ? "bg-green-50 border border-green-200 text-green-700" : "bg-orange-50 border border-orange-200 text-orange-700"}`}>
            <div className="flex-1">
              <span className="font-semibold">{importResult.created} mission(s) importée(s).</span>
              {importResult.errors.length > 0 && (
                <div className="mt-1 text-xs opacity-80">{importResult.errors.join(" — ")}</div>
              )}
            </div>
            <button onClick={() => setImportResult(null)} className="opacity-60 hover:opacity-100 font-bold">×</button>
          </div>
        )}

        {/* Summary chips */}
        <div className="flex gap-2 flex-wrap">
          {Object.entries(STATUS_LABELS).map(([status, label]) => {
            const count = missions.filter((m) => m.status === status).length;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(statusFilter === status ? "all" : status)}
                className={`badge badge-${status} cursor-pointer select-none transition-transform hover:scale-105 ${statusFilter === status ? "ring-2 ring-offset-1 ring-slate-400" : ""}`}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div className="card p-0 overflow-hidden">
          {loading ? (
            <div className="py-12 text-center text-slate-400">Chargement...</div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Package className="w-10 h-10 mx-auto mb-2 opacity-30" />
              Aucune mission trouvée
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead style={{ background: "#f8fafc" }}>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-slate-500 font-semibold text-xs uppercase">Référence</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-semibold text-xs uppercase">Chargement</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-semibold text-xs uppercase">Livraison</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-semibold text-xs uppercase hidden md:table-cell">Marchandise</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-semibold text-xs uppercase hidden lg:table-cell">Chauffeur</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-semibold text-xs uppercase">Statut</th>
                  <th className="w-8"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr
                    key={m.id}
                    className="table-row border-b border-slate-50 cursor-pointer"
                    onClick={() => setSelected(m)}
                  >
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-700 text-xs">{m.reference}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-700">{m.loadingCity}</div>
                      <div className="text-slate-400 text-xs flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(m.loadingDate), "dd/MM HH:mm", { locale: fr })}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-700">{m.deliveryCity}</div>
                      <div className="text-slate-400 text-xs flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(m.deliveryDate), "dd/MM HH:mm", { locale: fr })}
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell text-slate-600">{m.goodsType}</td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      {m.driver
                        ? <span className="text-slate-700">{m.driver.firstName} {m.driver.lastName}</span>
                        : <span className="text-orange-400 font-medium text-xs">Non assigné</span>}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`badge badge-${m.status}`}>{STATUS_LABELS[m.status]}</span>
                    </td>
                    <td className="py-3 px-4">
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Mission Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-xs text-slate-400 font-mono">{selected.reference}</div>
                <h2 className="text-xl font-bold text-slate-800">
                  {selected.loadingCity} → {selected.deliveryCity}
                </h2>
              </div>
              <span className={`badge badge-${selected.status}`}>{STATUS_LABELS[selected.status]}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <InfoBlock label="Chargement" icon={<MapPin className="w-4 h-4" />}>
                <div className="font-medium">{selected.loadingCity}</div>
                <div className="text-slate-500 text-sm">{selected.loadingAddress}</div>
                <div className="text-slate-400 text-sm">{format(new Date(selected.loadingDate), "dd/MM/yyyy HH:mm", { locale: fr })}</div>
              </InfoBlock>
              <InfoBlock label="Livraison" icon={<MapPin className="w-4 h-4" />}>
                <div className="font-medium">{selected.deliveryCity}</div>
                <div className="text-slate-500 text-sm">{selected.deliveryAddress}</div>
                <div className="text-slate-400 text-sm">{format(new Date(selected.deliveryDate), "dd/MM/yyyy HH:mm", { locale: fr })}</div>
              </InfoBlock>
              <InfoBlock label="Marchandise" icon={<Weight className="w-4 h-4" />}>
                <div className="font-medium">{selected.goodsType}</div>
                {selected.weight && <div className="text-slate-500 text-sm">{selected.weight} t</div>}
                {selected.volume && <div className="text-slate-500 text-sm">{selected.volume} m³</div>}
              </InfoBlock>
              <InfoBlock label="Chauffeur" icon={<User className="w-4 h-4" />}>
                {selected.driver
                  ? <div className="font-medium">{selected.driver.firstName} {selected.driver.lastName}</div>
                  : <div className="text-orange-400 font-medium text-sm">Non assigné</div>}
              </InfoBlock>
            </div>

            {/* Status update */}
            {selected.status !== "delivered" && selected.status !== "cancelled" && (
              <div className="border-t pt-4 mt-4">
                <label className="label mb-2">Mettre à jour le statut</label>
                <div className="flex gap-2 flex-wrap">
                  {selected.status === "planned" && (
                    <button className="btn-primary text-sm" onClick={() => updateStatus(selected.id, "in_progress")}>
                      → En cours
                    </button>
                  )}
                  {selected.status === "in_progress" && (
                    <button className="btn-primary text-sm" onClick={() => updateStatus(selected.id, "delivered")}>
                      ✓ Marquer comme livré
                    </button>
                  )}
                  <button className="btn-secondary text-sm" style={{ color: "#ef4444" }} onClick={() => updateStatus(selected.id, "cancelled")}>
                    Annuler la mission
                  </button>
                </div>
              </div>
            )}

            {/* Rating */}
            {user?.role === "dispatcher" && selected.status === "delivered" && selected.driver && !ratingDone.has(selected.id) && (
              <div className="border-t pt-4 mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4" style={{ color: "#f97316" }} />
                  <label className="label mb-0">Évaluer le chauffeur</label>
                </div>
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} type="button" onClick={() => setRatingScore(s)}>
                      <Star className={`w-7 h-7 transition-colors ${s <= ratingScore ? "fill-orange-400 text-orange-400" : "text-slate-300"}`} />
                    </button>
                  ))}
                </div>
                <textarea className="input text-sm" rows={2} placeholder="Commentaire (optionnel)..." value={ratingComment} onChange={(e) => setRatingComment(e.target.value)} />
                <button className="btn-primary mt-2 text-sm" disabled={!ratingScore || ratingSaving} onClick={() => submitRating(selected.id)}>
                  {ratingSaving ? "Envoi..." : "Envoyer l'évaluation"}
                </button>
              </div>
            )}
            {ratingDone.has(selected.id) && (
              <div className="border-t pt-4 mt-4 text-sm text-green-600 flex items-center gap-2">
                <Star className="w-4 h-4 fill-green-500 text-green-500" /> Évaluation envoyée — merci !
              </div>
            )}

            <div className="flex justify-between mt-6 pt-4 border-t">
              <span className="text-slate-400 text-sm">{selected.documents.length} document(s)</span>
              <button className="btn-ghost" onClick={() => setSelected(null)}>Fermer</button>
            </div>
          </div>
        </div>
      )}

      {/* New Mission Form */}
      {showForm && (
        <MissionForm
          drivers={drivers}
          onClose={() => setShowForm(false)}
          onCreated={() => { setShowForm(false); loadAll(); }}
        />
      )}
    </AppShell>
  );
}

function InfoBlock({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-slate-50 rounded-lg p-3">
      <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold uppercase mb-2">
        {icon} {label}
      </div>
      {children}
    </div>
  );
}

function MissionForm({ drivers, onClose, onCreated }: {
  drivers: Driver[];
  onClose: () => void;
  onCreated: () => void;
}) {
  const [form, setForm] = useState({
    loadingAddress: "15 rue de la Gare",
    loadingCity: "",
    loadingDate: "",
    deliveryAddress: "8 avenue du Commerce",
    deliveryCity: "",
    deliveryDate: "",
    goodsType: "",
    weight: "",
    volume: "",
    price: "",
    priceUnit: "trip",
    driverId: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/api/missions", form);
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
        <h2 className="text-xl font-bold mb-6" style={{ color: "#1e3a5f" }}>Nouvelle mission</h2>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Ville de chargement *</label>
              <input className="input" value={form.loadingCity} onChange={(e) => set("loadingCity", e.target.value)} required />
            </div>
            <div>
              <label className="label">Date de chargement *</label>
              <input type="datetime-local" className="input" value={form.loadingDate} onChange={(e) => set("loadingDate", e.target.value)} required />
            </div>
            <div>
              <label className="label">Ville de livraison *</label>
              <input className="input" value={form.deliveryCity} onChange={(e) => set("deliveryCity", e.target.value)} required />
            </div>
            <div>
              <label className="label">Date de livraison *</label>
              <input type="datetime-local" className="input" value={form.deliveryDate} onChange={(e) => set("deliveryDate", e.target.value)} required />
            </div>
          </div>
          <div>
            <label className="label">Nature des marchandises *</label>
            <input className="input" value={form.goodsType} onChange={(e) => set("goodsType", e.target.value)} required />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="label">Poids (t)</label>
              <input type="number" step="0.1" className="input" value={form.weight} onChange={(e) => set("weight", e.target.value)} />
            </div>
            <div>
              <label className="label">Volume (m³)</label>
              <input type="number" step="0.1" className="input" value={form.volume} onChange={(e) => set("volume", e.target.value)} />
            </div>
            <div>
              <label className="label">Prix (€)</label>
              <input type="number" step="0.01" className="input" value={form.price} onChange={(e) => set("price", e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label">Chauffeur</label>
            <select className="input" value={form.driverId} onChange={(e) => set("driverId", e.target.value)}>
              <option value="">— Non assigné —</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>{d.firstName} {d.lastName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea className="input" rows={2} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1 justify-center" disabled={loading}>
              {loading ? "Création..." : "Créer la mission"}
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
}
