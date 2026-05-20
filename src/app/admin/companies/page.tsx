"use client";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { api } from "@/lib/api";
import { Building2, Users, Package, Plus, Phone, Mail } from "lucide-react";

interface Company {
  id: string;
  name: string;
  siret: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  createdAt: string;
  _count: { users: number; missions: number };
}

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const data = await api.get<Company[]>("/api/companies");
    setCompanies(data);
    setLoading(false);
  }

  return (
    <AppShell title="Gestion des entreprises">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-slate-500 text-sm">{companies.length} entreprise(s) inscrite(s) sur la plateforme</p>
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4" /> Ajouter une entreprise
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400">Chargement...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {companies.map((c) => (
              <div key={c.id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "#1e3a5f" }}>
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">{c.name}</div>
                    <div className="text-xs text-slate-400">{c.city}</div>
                    <div className="text-xs font-mono text-slate-400">SIRET: {c.siret}</div>
                  </div>
                </div>

                <div className="space-y-2 border-t pt-3 mb-4">
                  <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-orange-500">
                    <Mail className="w-4 h-4 text-slate-400" /> {c.email}
                  </a>
                  <a href={`tel:${c.phone}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-orange-500">
                    <Phone className="w-4 h-4 text-slate-400" /> {c.phone}
                  </a>
                </div>

                <div className="flex gap-3 border-t pt-3">
                  <div className="flex items-center gap-1 text-sm text-slate-500">
                    <Users className="w-4 h-4 text-slate-400" />
                    {c._count.users} utilisateur(s)
                  </div>
                  <div className="flex items-center gap-1 text-sm text-slate-500">
                    <Package className="w-4 h-4 text-slate-400" />
                    {c._count.missions} mission(s)
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <CompanyForm
          onClose={() => setShowForm(false)}
          onCreated={() => { setShowForm(false); load(); }}
        />
      )}
    </AppShell>
  );
}

function CompanyForm({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({
    name: "", siret: "", address: "", city: "", phone: "", email: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/api/companies", form);
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
        <h2 className="text-xl font-bold mb-6" style={{ color: "#1e3a5f" }}>Nouvelle entreprise</h2>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">Nom de l&apos;entreprise *</label>
            <input className="input" value={form.name} onChange={(e) => set("name", e.target.value)} required />
          </div>
          <div>
            <label className="label">SIRET *</label>
            <input className="input" value={form.siret} onChange={(e) => set("siret", e.target.value)} required maxLength={14} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Adresse *</label>
              <input className="input" value={form.address} onChange={(e) => set("address", e.target.value)} required />
            </div>
            <div>
              <label className="label">Ville *</label>
              <input className="input" value={form.city} onChange={(e) => set("city", e.target.value)} required />
            </div>
          </div>
          <div>
            <label className="label">Email *</label>
            <input type="email" className="input" value={form.email} onChange={(e) => set("email", e.target.value)} required />
          </div>
          <div>
            <label className="label">Téléphone *</label>
            <input type="tel" className="input" value={form.phone} onChange={(e) => set("phone", e.target.value)} required />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1 justify-center" disabled={loading}>
              {loading ? "Création..." : "Créer l'entreprise"}
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
}
