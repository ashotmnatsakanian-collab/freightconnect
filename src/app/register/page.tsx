"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { api } from "@/lib/api";
import { Truck, ArrowLeft, UserPlus, Building2, User } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    companyCity: "",
    companyPhone: "",
    siret: "",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  function nextStep(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    if (form.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }
    setError("");
    setStep(2);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await api.post<{ token: string; user: Parameters<typeof setAuth>[0] }>(
        "/api/auth/register",
        form
      );
      setAuth(data.user, data.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Fond */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(135deg, #0f2240 0%, #1e3a5f 40%, #2d5282 70%, #1a3350 100%)",
      }} />
      <div style={{
        position: "absolute", top: "-120px", right: "-80px",
        width: "500px", height: "500px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-60px", left: "20%",
        width: "400px", height: "400px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.05 }}>
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.8"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Panneau gauche */}
      <div className="hidden lg:flex lg:w-2/5 flex-col justify-center px-14 relative z-10">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ background: "linear-gradient(135deg, #f97316, #ea6c0a)" }}>
            <Truck className="w-7 h-7 text-white" />
          </div>
          <span className="text-3xl font-extrabold text-white">FreightConnect</span>
        </div>

        <h1 className="text-4xl font-extrabold text-white mb-4 leading-tight">
          Rejoignez la<br />
          <span style={{ color: "#f97316" }}>plateforme n°1</span><br />
          du transport
        </h1>
        <p style={{ color: "#93c5fd" }} className="text-base leading-relaxed mb-10">
          Créez votre compte en 2 minutes et commencez à optimiser votre flotte dès aujourd'hui.
        </p>

        <div className="space-y-4">
          {[
            "✅ Inscription gratuite",
            "✅ Accès immédiat à la bourse de fret",
            "✅ Suivi GPS illimité",
            "✅ Gestion des documents incluse",
          ].map((t) => (
            <div key={t} className="text-blue-100 text-sm font-medium">{t}</div>
          ))}
        </div>
      </div>

      {/* Formulaire */}
      <div className="w-full lg:w-3/5 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-lg">

          {/* Logo mobile */}
          <div className="flex items-center justify-center gap-2 mb-5 lg:hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#f97316" }}>
              <Truck className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl text-white">FreightConnect</span>
          </div>

          <div className="rounded-2xl shadow-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.97)" }}>

            {/* Header */}
            <div className="px-8 pt-7 pb-5">
              <div className="flex items-center gap-3 mb-3">
                <Link href="/login" className="text-slate-400 hover:text-slate-600 transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                  <h2 className="text-xl font-extrabold" style={{ color: "#1e3a5f" }}>Créer votre compte</h2>
                  <p className="text-slate-400 text-xs">Vous serez Dispatcher de votre entreprise</p>
                </div>
              </div>

              {/* Étapes */}
              <div className="flex items-center gap-2 mt-4">
                <div className="flex items-center gap-2 flex-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= 1 ? "text-white" : "bg-slate-100 text-slate-400"}`}
                    style={step >= 1 ? { background: "#f97316" } : {}}>
                    <User className="w-4 h-4" />
                  </div>
                  <span className={`text-xs font-semibold ${step === 1 ? "text-slate-700" : "text-slate-400"}`}>Votre profil</span>
                </div>
                <div className="flex-1 h-px bg-slate-200" />
                <div className="flex items-center gap-2 flex-1 justify-end">
                  <span className={`text-xs font-semibold ${step === 2 ? "text-slate-700" : "text-slate-400"}`}>Votre entreprise</span>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= 2 ? "text-white" : "bg-slate-100 text-slate-400"}`}
                    style={step >= 2 ? { background: "#f97316" } : {}}>
                    <Building2 className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-8 pb-8">
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                  ⚠️ {error}
                </div>
              )}

              {/* Étape 1 — Infos personnelles */}
              {step === 1 && (
                <form onSubmit={nextStep} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Prénom *</label>
                      <input className="input" placeholder="Marie" value={form.firstName}
                        onChange={(e) => set("firstName", e.target.value)} required />
                    </div>
                    <div>
                      <label className="label">Nom *</label>
                      <input className="input" placeholder="Martin" value={form.lastName}
                        onChange={(e) => set("lastName", e.target.value)} required />
                    </div>
                  </div>
                  <div>
                    <label className="label">Email professionnel *</label>
                    <input type="email" className="input" placeholder="vous@entreprise.fr" value={form.email}
                      onChange={(e) => set("email", e.target.value)} required />
                  </div>
                  <div>
                    <label className="label">Mot de passe *</label>
                    <input type="password" className="input" placeholder="8 caractères minimum" value={form.password}
                      onChange={(e) => set("password", e.target.value)} required minLength={8} />
                  </div>
                  <div>
                    <label className="label">Confirmer le mot de passe *</label>
                    <input type="password" className="input" placeholder="••••••••" value={form.confirmPassword}
                      onChange={(e) => set("confirmPassword", e.target.value)} required />
                  </div>
                  <button type="submit" className="btn-primary w-full justify-center py-3 mt-2">
                    Continuer →
                  </button>
                </form>
              )}

              {/* Étape 2 — Entreprise */}
              {step === 2 && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="label">Nom de l'entreprise *</label>
                    <input className="input" placeholder="Transports Martin & Fils" value={form.companyName}
                      onChange={(e) => set("companyName", e.target.value)} required />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Ville du siège *</label>
                      <input className="input" placeholder="Lyon" value={form.companyCity}
                        onChange={(e) => set("companyCity", e.target.value)} required />
                    </div>
                    <div>
                      <label className="label">Téléphone</label>
                      <input type="tel" className="input" placeholder="04 XX XX XX XX" value={form.companyPhone}
                        onChange={(e) => set("companyPhone", e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="label">Numéro SIRET</label>
                    <input className="input" placeholder="14 chiffres (facultatif)" value={form.siret}
                      onChange={(e) => set("siret", e.target.value)} maxLength={14} />
                    <p className="text-xs text-slate-400 mt-1">Vous pourrez le compléter plus tard</p>
                  </div>

                  <div className="flex gap-3 mt-2">
                    <button type="button" className="btn-secondary" onClick={() => setStep(1)}>
                      ← Retour
                    </button>
                    <button type="submit" className="btn-primary flex-1 justify-center py-3" disabled={loading}>
                      <UserPlus className="w-4 h-4" />
                      {loading ? "Création du compte..." : "Créer mon compte"}
                    </button>
                  </div>
                </form>
              )}

              <p className="text-center text-sm text-slate-400 mt-5">
                Déjà un compte ?{" "}
                <Link href="/login" className="font-bold hover:underline" style={{ color: "#f97316" }}>
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
