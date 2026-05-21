"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("thomas.moreau@immo-excellence.fr");
  const [password, setPassword] = useState("kepler2026");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    router.replace("/dashboard");
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#F8FAFC" }}>
      {/* Left panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-[52%] px-14 py-12"
        style={{ background: "#0F2340" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{ width: 40, height: 40, background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)" }}
          >
            <Star size={18} style={{ color: "#C9A84C" }} fill="#C9A84C" />
          </div>
          <div>
            <div className="text-white font-bold text-xl tracking-tight">Kepler</div>
            <div style={{ color: "#64748B", fontSize: "0.65rem", letterSpacing: "0.06em" }}>CRM IMMOBILIER INTELLIGENT</div>
          </div>
        </div>

        <div>
          <div className="text-5xl font-extrabold text-white leading-tight mb-6">
            Transformez vos<br />
            <span style={{ color: "#C9A84C" }}>contacts dormants</span><br />
            en commissions.
          </div>
          <div style={{ color: "#94A3B8", fontSize: "1.05rem", lineHeight: 1.7, maxWidth: 480 }}>
            Kepler détecte automatiquement quels contacts sont prêts à acheter ou vendre — avant qu&apos;ils appellent la concurrence.
          </div>
          <div className="mt-10 space-y-4">
            {[
              "Score de maturité IA sur chaque contact",
              "Détection d'événements de vie (LinkedIn, Leboncoin)",
              "Campagnes de réactivation personnalisées",
              "ROI moyen : 1 deal récupéré = 9 mois d'abonnement",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 size={18} style={{ color: "#2D9B6F", flexShrink: 0 }} />
                <span style={{ color: "#CBD5E1", fontSize: "0.9rem" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          className="rounded-2xl p-6"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-start gap-4">
            <div
              className="flex items-center justify-center rounded-full text-white font-bold text-base flex-shrink-0"
              style={{ width: 44, height: 44, background: "#C9A84C" }}
            >
              TM
            </div>
            <div>
              <div className="text-white font-semibold">Thomas Moreau</div>
              <div style={{ color: "#64748B", fontSize: "0.8rem" }}>Agence Immo Excellence Nancy</div>
              <div className="mt-3" style={{ color: "#94A3B8", fontSize: "0.875rem", lineHeight: 1.6, fontStyle: "italic" }}>
                &ldquo;En 3 mois, Kepler m&apos;a permis de récupérer 4 deals que j&apos;aurais perdus. Martin Dupont était dormant depuis 8 mois — Kepler m&apos;a alerté le matin même où il était prêt.&rdquo;
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <Star size={22} style={{ color: "#C9A84C" }} fill="#C9A84C" />
            <span className="font-bold text-xl" style={{ color: "#1B3A5C" }}>Kepler</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1.5" style={{ color: "#1A202C" }}>Bon retour 👋</h1>
            <p style={{ color: "#64748B", fontSize: "0.9375rem" }}>Connectez-vous à votre espace Kepler.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>Adresse email</label>
              <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium" style={{ color: "#374151" }}>Mot de passe</label>
                <button type="button" className="text-xs font-medium" style={{ color: "#C9A84C" }}>Mot de passe oublié ?</button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="input pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 btn-icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-2.5 mt-2"
              style={{ background: loading ? "#64748B" : "#1B3A5C" }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block rounded-full border-2 border-white/30 border-t-white animate-spin" style={{ width: 16, height: 16 }} />
                  Connexion…
                </span>
              ) : (
                <>Se connecter <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="mt-6 rounded-xl p-4 flex items-start gap-3" style={{ background: "#EFF6FF", border: "1px solid #DBEAFE" }}>
            <span style={{ flexShrink: 0 }}>💡</span>
            <div style={{ color: "#1D4ED8", fontSize: "0.8125rem", lineHeight: 1.5 }}>
              <strong>Compte démo pré-rempli.</strong> Cliquez sur &ldquo;Se connecter&rdquo; pour accéder à l&apos;espace de Thomas Moreau.
            </div>
          </div>

          <p className="mt-6 text-center text-xs" style={{ color: "#94A3B8" }}>
            Pas encore de compte ?{" "}
            <span className="font-semibold cursor-pointer" style={{ color: "#C9A84C" }}>Essai gratuit 14 jours →</span>
          </p>
        </div>
      </div>
    </div>
  );
}
