"use client";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { User, Lock, Phone, Check, AlertCircle } from "lucide-react";

interface ProfileData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: string;
  company?: { name: string } | null;
}

export default function ProfilePage() {
  const { user, setAuth } = useAuthStore();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    api.get<ProfileData>("/api/profile").then((p) => {
      setProfile(p);
      setFirstName(p.firstName);
      setLastName(p.lastName);
      setPhone(p.phone ?? "");
    });
  }, []);

  async function saveInfo(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const updated = await api.patch<ProfileData>("/api/profile", { firstName, lastName, phone });
      setProfile(updated);
      if (user) {
        setAuth({ ...user, firstName: updated.firstName, lastName: updated.lastName }, localStorage.getItem("token") ?? "");
      }
      setMsg({ type: "ok", text: "Profil mis à jour avec succès." });
    } catch {
      setMsg({ type: "err", text: "Erreur lors de la mise à jour." });
    }
    setSaving(false);
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMsg({ type: "err", text: "Les mots de passe ne correspondent pas." });
      return;
    }
    setSaving(true);
    setMsg(null);
    try {
      await api.patch("/api/profile", { currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMsg({ type: "ok", text: "Mot de passe modifié avec succès." });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur";
      setMsg({ type: "err", text: message.includes("incorrect") ? "Mot de passe actuel incorrect." : "Erreur lors du changement." });
    }
    setSaving(false);
  }

  const roleLabel = { admin: "Administrateur", dispatcher: "Dispatcher", driver: "Chauffeur" };

  return (
    <AppShell title="Mon profil">
      <div className="max-w-2xl mx-auto space-y-6">
        {msg && (
          <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${msg.type === "ok" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {msg.type === "ok" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {msg.text}
          </div>
        )}

        {/* Identity card */}
        {profile && (
          <div className="card flex items-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
              style={{ background: "#f97316" }}>
              {profile.firstName[0]}{profile.lastName[0]}
            </div>
            <div>
              <div className="font-bold text-slate-800 text-lg">{profile.firstName} {profile.lastName}</div>
              <div className="text-slate-500 text-sm">{profile.email}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="badge-blue">{roleLabel[profile.role as keyof typeof roleLabel] ?? profile.role}</span>
                {profile.company && <span className="text-xs text-slate-400">{profile.company.name}</span>}
              </div>
            </div>
          </div>
        )}

        {/* Edit info */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5" style={{ color: "#f97316" }} />
            <h2 className="font-bold text-slate-700">Informations personnelles</h2>
          </div>
          <form onSubmit={saveInfo} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Prénom</label>
                <input className="input" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div>
                <label className="label">Nom</label>
                <input className="input" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>
            </div>
            <div>
              <label className="label">Téléphone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input className="input pl-9" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+33 6 12 34 56 78" />
              </div>
            </div>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
          </form>
        </div>

        {/* Change password */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5" style={{ color: "#f97316" }} />
            <h2 className="font-bold text-slate-700">Changer le mot de passe</h2>
          </div>
          <form onSubmit={savePassword} className="space-y-4">
            <div>
              <label className="label">Mot de passe actuel</label>
              <input className="input" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
            </div>
            <div>
              <label className="label">Nouveau mot de passe</label>
              <input className="input" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
            </div>
            <div>
              <label className="label">Confirmer le nouveau mot de passe</label>
              <input className="input" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Modification..." : "Modifier le mot de passe"}
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
