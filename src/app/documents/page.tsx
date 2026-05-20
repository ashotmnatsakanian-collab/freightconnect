"use client";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { FileText, Upload, Download, Image, File, Search } from "lucide-react";

interface Doc {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number | null;
  mimeType: string | null;
  notes: string | null;
  createdAt: string;
  uploadedBy: { firstName: string; lastName: string };
  mission: { reference: string };
}

interface Mission {
  id: string;
  reference: string;
  loadingCity: string;
  deliveryCity: string;
}

const DOC_TYPE_LABELS: Record<string, string> = {
  cmr: "Lettre CMR",
  delivery_note: "Bon de livraison",
  invoice: "Facture",
  photo_loading: "Photo chargement",
  photo_delivery: "Photo livraison",
  other: "Autre",
};

const DOC_ICONS: Record<string, React.ReactNode> = {
  cmr: <FileText className="w-5 h-5 text-blue-500" />,
  delivery_note: <FileText className="w-5 h-5 text-green-500" />,
  invoice: <FileText className="w-5 h-5 text-purple-500" />,
  photo_loading: <Image className="w-5 h-5 text-orange-500" />,
  photo_delivery: <Image className="w-5 h-5 text-orange-500" />,
  other: <File className="w-5 h-5 text-slate-400" />,
};

function formatSize(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / 1024 / 1024).toFixed(1)} Mo`;
}

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    const [d, m] = await Promise.all([
      api.get<Doc[]>("/api/documents"),
      api.get<Mission[]>("/api/missions"),
    ]);
    setDocs(d);
    setMissions(m);
    setLoading(false);
  }

  const filtered = docs.filter((d) => {
    const q = search.toLowerCase();
    return (
      !q ||
      d.name.toLowerCase().includes(q) ||
      d.mission.reference.toLowerCase().includes(q) ||
      DOC_TYPE_LABELS[d.type]?.toLowerCase().includes(q)
    );
  });

  return (
    <AppShell title="Gestion des documents">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              className="input pl-9"
              placeholder="Rechercher un document..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn-primary" onClick={() => setShowUpload(true)}>
            <Upload className="w-4 h-4" />
            Uploader un document
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(DOC_TYPE_LABELS).map(([type, label]) => {
            const count = docs.filter((d) => d.type === type).length;
            return (
              <div key={type} className="card py-3 flex items-center gap-3">
                {DOC_ICONS[type]}
                <div>
                  <div className="font-bold text-slate-800">{count}</div>
                  <div className="text-xs text-slate-500">{label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Documents list */}
        <div className="card p-0 overflow-hidden">
          {loading ? (
            <div className="py-12 text-center text-slate-400">Chargement...</div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
              Aucun document
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead style={{ background: "#f8fafc" }}>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-slate-500 font-semibold text-xs uppercase">Document</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-semibold text-xs uppercase">Type</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-semibold text-xs uppercase hidden md:table-cell">Mission</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-semibold text-xs uppercase hidden lg:table-cell">Ajouté par</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-semibold text-xs uppercase hidden lg:table-cell">Date</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-semibold text-xs uppercase">Taille</th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((doc) => (
                  <tr key={doc.id} className="table-row border-b border-slate-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {DOC_ICONS[doc.type]}
                        <span className="font-medium text-slate-700 truncate max-w-40">{doc.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-slate-600 text-xs">{DOC_TYPE_LABELS[doc.type]}</span>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="font-mono text-xs text-slate-500">{doc.mission.reference}</span>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell text-slate-500">
                      {doc.uploadedBy.firstName} {doc.uploadedBy.lastName}
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell text-slate-400 text-xs">
                      {format(new Date(doc.createdAt), "dd/MM/yyyy HH:mm", { locale: fr })}
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-xs">{formatSize(doc.size)}</td>
                    <td className="py-3 px-4">
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="btn-ghost p-2">
                        <Download className="w-4 h-4" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showUpload && (
        <UploadForm
          missions={missions}
          onClose={() => setShowUpload(false)}
          onUploaded={() => { setShowUpload(false); loadAll(); }}
        />
      )}
    </AppShell>
  );
}

function UploadForm({ missions, onClose, onUploaded }: {
  missions: Mission[];
  onClose: () => void;
  onUploaded: () => void;
}) {
  const [missionId, setMissionId] = useState("");
  const [type, setType] = useState("cmr");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !missionId) { setError("Fichier et mission requis"); return; }
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("missionId", missionId);
      fd.append("type", type);
      fd.append("notes", notes);
      await api.upload("/api/documents", fd);
      onUploaded();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur d'upload");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-box max-w-md">
        <h2 className="text-xl font-bold mb-6" style={{ color: "#1e3a5f" }}>Uploader un document</h2>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">Mission *</label>
            <select className="input" value={missionId} onChange={(e) => setMissionId(e.target.value)} required>
              <option value="">— Sélectionner une mission —</option>
              {missions.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.reference} — {m.loadingCity} → {m.deliveryCity}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Type de document *</label>
            <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
              {Object.entries(DOC_TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Fichier *</label>
            <input
              type="file"
              className="input py-2"
              accept=".pdf,.jpg,.jpeg,.png,.heic"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea className="input" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1 justify-center" disabled={loading}>
              <Upload className="w-4 h-4" />
              {loading ? "Envoi..." : "Uploader"}
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
}
