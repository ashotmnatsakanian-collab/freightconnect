"use client";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Upload, FileText, Download, Image, File } from "lucide-react";

interface Doc {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number | null;
  createdAt: string;
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

export default function DriverDocumentsPage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => { loadAll(); }, []);

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

  return (
    <AppShell title="Mes documents">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-slate-500 text-sm">{docs.length} document(s) uploadé(s)</p>
          <button className="btn-primary" onClick={() => setShowUpload(true)}>
            <Upload className="w-4 h-4" /> Uploader
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400">Chargement...</div>
        ) : docs.length === 0 ? (
          <div className="card text-center py-12 text-slate-400">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <div>Aucun document uploadé</div>
            <button className="btn-primary mt-4" onClick={() => setShowUpload(true)}>
              <Upload className="w-4 h-4" /> Uploader mon premier document
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {docs.map((doc) => (
              <div key={doc.id} className="card flex items-center gap-4 py-3">
                {DOC_ICONS[doc.type]}
                <div className="flex-1">
                  <div className="font-medium text-slate-700">{doc.name}</div>
                  <div className="text-xs text-slate-400">
                    {DOC_TYPE_LABELS[doc.type]} • {doc.mission.reference} •{" "}
                    {format(new Date(doc.createdAt), "dd/MM/yyyy", { locale: fr })}
                  </div>
                </div>
                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  <Download className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        )}
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
              <option value="">— Sélectionner —</option>
              {missions.map((m) => (
                <option key={m.id} value={m.id}>{m.reference} — {m.loadingCity} → {m.deliveryCity}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Type *</label>
            <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
              {Object.entries(DOC_TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Fichier (PDF ou photo) *</label>
            <input
              type="file"
              className="input py-2"
              accept=".pdf,.jpg,.jpeg,.png,.heic"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1 justify-center" disabled={loading}>
              <Upload className="w-4 h-4" /> {loading ? "Envoi..." : "Envoyer"}
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
}
