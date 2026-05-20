"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { api } from "@/lib/api";
import { Truck, LogIn } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await api.post<{ token: string; user: Parameters<typeof setAuth>[0] }>(
        "/api/auth/login",
        { email, password }
      );
      setAuth(data.user, data.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  }

  const demoAccounts = [
    { label: "Admin plateforme", email: "admin@transport-saas.fr" },
    { label: "Dispatcher (Dupont)", email: "dispatcher@dupont-transport.fr" },
    { label: "Chauffeur (Jean)", email: "jean.dupont@dupont-transport.fr" },
  ];

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* ── Fond animé ── */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(135deg, #0f2240 0%, #1e3a5f 40%, #2d5282 70%, #1a3350 100%)",
      }} />

      {/* Cercles décoratifs flous */}
      <div style={{
        position: "absolute", top: "-120px", left: "-120px",
        width: "500px", height: "500px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-80px", right: "30%",
        width: "400px", height: "400px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", top: "30%", right: "-100px",
        width: "350px", height: "350px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(45,82,130,0.4) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Grille subtile */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.05 }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.8"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Illustration camion SVG en fond */}
      <svg
        viewBox="0 0 800 340"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "55%",
          opacity: 0.07,
          pointerEvents: "none",
        }}
      >
        {/* Remorque */}
        <rect x="30" y="120" width="520" height="160" rx="12" fill="white"/>
        <rect x="30" y="120" width="520" height="20" rx="4" fill="white" opacity="0.5"/>
        {/* Cabine */}
        <rect x="550" y="160" width="200" height="120" rx="14" fill="white"/>
        {/* Pare-brise */}
        <rect x="570" y="175" width="100" height="65" rx="8" fill="white" opacity="0.3"/>
        {/* Roues remorque */}
        <circle cx="120" cy="295" r="35" fill="white" opacity="0.6"/>
        <circle cx="120" cy="295" r="18" fill="#1e3a5f" opacity="0.8"/>
        <circle cx="260" cy="295" r="35" fill="white" opacity="0.6"/>
        <circle cx="260" cy="295" r="18" fill="#1e3a5f" opacity="0.8"/>
        <circle cx="400" cy="295" r="35" fill="white" opacity="0.6"/>
        <circle cx="400" cy="295" r="18" fill="#1e3a5f" opacity="0.8"/>
        {/* Roues cabine */}
        <circle cx="600" cy="295" r="35" fill="white" opacity="0.6"/>
        <circle cx="600" cy="295" r="18" fill="#1e3a5f" opacity="0.8"/>
        <circle cx="710" cy="295" r="35" fill="white" opacity="0.6"/>
        <circle cx="710" cy="295" r="18" fill="#1e3a5f" opacity="0.8"/>
        {/* Route */}
        <rect x="0" y="328" width="800" height="12" rx="4" fill="white" opacity="0.3"/>
        {/* Phare */}
        <rect x="742" y="195" width="22" height="14" rx="4" fill="#f97316" opacity="0.9"/>
        {/* Logo sur remorque */}
        <rect x="170" y="160" width="220" height="60" rx="8" fill="white" opacity="0.12"/>
      </svg>

      {/* ── Panneau gauche ── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 relative z-10">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ background: "linear-gradient(135deg, #f97316, #ea6c0a)" }}>
            <Truck className="w-8 h-8 text-white" />
          </div>
          <span className="text-4xl font-extrabold text-white tracking-tight">FreightConnect</span>
        </div>

        <h1 className="text-5xl font-extrabold text-white mb-5 leading-tight">
          Éliminez vos<br />
          <span style={{ color: "#f97316" }}>retours à vide</span>
        </h1>
        <p style={{ color: "#93c5fd" }} className="text-lg mb-12 leading-relaxed max-w-md">
          La plateforme SaaS qui connecte transporteurs et chargeurs pour optimiser chaque trajet et maximiser votre rentabilité.
        </p>

        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: "📦", title: "Bourse de fret", sub: "Trouvez des chargements pour vos retours", color: "#f97316" },
            { icon: "🗺️", title: "Suivi GPS", sub: "Localisez chaque camion en direct", color: "#3b82f6" },
            { icon: "📄", title: "Documents", sub: "CMR, bons de livraison, factures", color: "#10b981" },
            { icon: "📊", title: "Tableau de bord", sub: "Pilotez votre activité en un coup d'œil", color: "#8b5cf6" },
          ].map((f) => (
            <div key={f.title}
              className="rounded-2xl p-4 flex flex-col gap-2"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(8px)",
              }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: `${f.color}22`, border: `1px solid ${f.color}55` }}>
                {f.icon}
              </div>
              <div>
                <div className="text-white font-bold text-sm leading-tight">{f.title}</div>
                <div className="text-xs mt-0.5 leading-snug" style={{ color: "#93c5fd" }}>{f.sub}</div>
              </div>
              <div className="w-6 h-0.5 rounded-full mt-1" style={{ background: f.color }} />
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="flex gap-8 mt-14">
          {[
            { n: "3", label: "Entreprises" },
            { n: "10", label: "Transporteurs" },
            { n: "20+", label: "Missions" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-extrabold text-white">{s.n}</div>
              <div style={{ color: "#64748b" }} className="text-xs">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Panneau droit — Formulaire ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">

          {/* Logo mobile */}
          <div className="flex items-center justify-center gap-2 mb-6 lg:hidden">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#f97316" }}>
              <Truck className="w-6 h-6 text-white" />
            </div>
            <span className="font-extrabold text-2xl text-white">FreightConnect</span>
          </div>

          <div className="rounded-2xl shadow-2xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(20px)" }}>

            {/* Header carte */}
            <div className="px-8 pt-8 pb-6">
              <h2 className="text-2xl font-extrabold mb-1" style={{ color: "#1e3a5f" }}>Bon retour 👋</h2>
              <p className="text-slate-400 text-sm">Connectez-vous à votre espace de gestion</p>
            </div>

            <div className="px-8 pb-8">
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                  <span>⚠️</span> {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="label">Adresse email</label>
                  <input
                    type="email"
                    className="input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.fr"
                    required
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label className="label">Mot de passe</label>
                  <input
                    type="password"
                    className="input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                  />
                </div>
                <button type="submit" className="btn-primary w-full justify-center py-3 text-base mt-2" disabled={loading}>
                  <LogIn className="w-5 h-5" />
                  {loading ? "Connexion en cours..." : "Se connecter"}
                </button>
              </form>

              {/* Lien inscription */}
              <p className="text-center text-sm text-slate-500 mt-5">
                Pas encore de compte ?{" "}
                <Link href="/register" className="font-bold hover:underline" style={{ color: "#f97316" }}>
                  Créer un compte gratuit →
                </Link>
              </p>

              {/* Démo */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider text-center">
                  Tester avec un compte démo
                </p>
                <div className="space-y-2">
                  {demoAccounts.map((acc) => (
                    <button
                      key={acc.email}
                      onClick={() => { setEmail(acc.email); setPassword("Transport2024!"); }}
                      className="w-full text-left px-4 py-3 rounded-xl border-2 border-slate-100 hover:border-orange-300 hover:bg-orange-50 transition-all"
                    >
                      <span className="font-bold text-slate-700 text-sm">{acc.label}</span>
                      <span className="block text-slate-400 text-xs mt-0.5">{acc.email}</span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-300 mt-3 text-center">Mot de passe : Transport2024!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
