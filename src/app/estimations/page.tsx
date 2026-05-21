"use client";
import { useState } from "react";
import AppShell from "@/components/AppShell";
import {
  FileText, Plus, TrendingUp, TrendingDown, MapPin, Download,
  Send, BarChart2, CheckCircle2, ChevronDown, ChevronUp,
} from "lucide-react";
import { ESTIMATIONS, formatPrice, formatDate } from "@/lib/data";

const COMPARABLE_SALES = [
  { address: "14 rue des Tiercelins, Nancy",     date: "mars 2026",    surface: 68,  price: 188000, priceM2: 2765 },
  { address: "3 avenue de la Libération, Nancy", date: "février 2026", surface: 72,  price: 195000, priceM2: 2708 },
  { address: "22 place Maginot, Nancy",          date: "janvier 2026", surface: 65,  price: 178000, priceM2: 2738 },
  { address: "8 rue Poincaré, Nancy",            date: "avril 2026",   surface: 75,  price: 210000, priceM2: 2800 },
  { address: "17 boulevard Joffre, Nancy",       date: "mars 2026",    surface: 58,  price: 162000, priceM2: 2793 },
];

function EstimationReport({ address, surface }: { address: string; surface: number }) {
  const [expanded, setExpanded] = useState(false);
  const priceMin = Math.round(surface * 2600);
  const priceMax = Math.round(surface * 2900);
  const recommended = Math.round(surface * 2750);
  const priceM2 = 2750;

  return (
    <div className="kepler-card overflow-hidden animate-fade-up">
      {/* Report header */}
      <div className="px-6 py-5" style={{ background: "linear-gradient(135deg, #0F2340 0%, #1B3A5C 100%)" }}>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#C9A84C" }}>
              ✦ Dossier d&apos;Estimation Kepler
            </div>
            <div className="text-white font-bold text-xl mb-1">{address}</div>
            <div style={{ color: "#94A3B8", fontSize: "0.875rem" }}>
              Appartement · {surface}m² · Nancy Centre · Généré le 21 mai 2026
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button className="btn-ghost btn-sm" style={{ color: "#C9A84C", borderColor: "rgba(201,168,76,0.3)" }}>
              <Download size={12} /> PDF
            </button>
            <button className="btn-gold btn-sm">
              <Send size={12} /> Envoyer
            </button>
          </div>
        </div>
      </div>

      {/* Price range */}
      <div className="px-6 py-5 border-b" style={{ borderColor: "#E2E8F0" }}>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs font-semibold mb-1" style={{ color: "#94A3B8" }}>FOURCHETTE BASSE</div>
            <div className="text-2xl font-bold" style={{ color: "#F59E0B" }}>{formatPrice(priceMin)}</div>
            <div className="text-xs" style={{ color: "#94A3B8" }}>{formatPrice(priceMin / surface)}/m²</div>
          </div>
          <div className="border-x" style={{ borderColor: "#E2E8F0" }}>
            <div className="text-xs font-bold mb-1" style={{ color: "#1B3A5C" }}>PRIX RECOMMANDÉ</div>
            <div className="text-3xl font-extrabold" style={{ color: "#1B3A5C" }}>{formatPrice(recommended)}</div>
            <div
              className="text-xs mt-1 font-semibold px-2 py-0.5 rounded-full inline-block"
              style={{ background: "#DCFCE7", color: "#166534" }}
            >
              Estimation fiable
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold mb-1" style={{ color: "#94A3B8" }}>FOURCHETTE HAUTE</div>
            <div className="text-2xl font-bold" style={{ color: "#2D9B6F" }}>{formatPrice(priceMax)}</div>
            <div className="text-xs" style={{ color: "#94A3B8" }}>{formatPrice(priceMax / surface)}/m²</div>
          </div>
        </div>
      </div>

      {/* Market data */}
      <div className="px-6 py-4 border-b" style={{ borderColor: "#E2E8F0" }}>
        <h3 className="font-bold text-sm mb-3" style={{ color: "#1A202C" }}>Analyse du marché — Nancy Centre</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Prix moyen/m²",    value: `${priceM2} €`, trend: "+3.2%", up: true },
            { label: "Délai vente moy.", value: "52 jours",      trend: "-8j",  up: true },
            { label: "Biens vendus (3m)","value": "47",          trend: "+12%", up: true },
            { label: "Tension marché",   value: "Forte",          trend: "↑",   up: true },
          ].map(({ label, value, trend, up }) => (
            <div key={label} className="text-center p-3 rounded-xl" style={{ background: "#F8FAFC" }}>
              <div className="text-base font-bold mb-0.5" style={{ color: "#1A202C" }}>{value}</div>
              <div className="text-xs mb-1" style={{ color: "#64748B" }}>{label}</div>
              <div className="flex items-center justify-center gap-1 text-xs font-semibold" style={{ color: up ? "#2D9B6F" : "#EF4444" }}>
                {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {trend}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparable sales toggle */}
      <div className="px-6 py-4">
        <button
          className="flex items-center justify-between w-full text-left"
          onClick={() => setExpanded(!expanded)}
        >
          <span className="font-bold text-sm" style={{ color: "#1A202C" }}>
            Références de vente comparables (5)
          </span>
          {expanded ? <ChevronUp size={16} style={{ color: "#64748B" }} /> : <ChevronDown size={16} style={{ color: "#64748B" }} />}
        </button>

        {expanded && (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid #E2E8F0" }}>
                  {["Adresse", "Date", "Surface", "Prix de vente", "Prix/m²"].map((h) => (
                    <th key={h} className="text-left pb-2 pr-3 text-xs font-semibold" style={{ color: "#94A3B8" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARABLE_SALES.map((sale) => (
                  <tr key={sale.address} style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <td className="py-2 pr-3 text-xs" style={{ color: "#374151" }}>{sale.address}</td>
                    <td className="py-2 pr-3 text-xs" style={{ color: "#64748B" }}>{sale.date}</td>
                    <td className="py-2 pr-3 text-xs font-medium" style={{ color: "#1A202C" }}>{sale.surface}m²</td>
                    <td className="py-2 pr-3 text-xs font-bold" style={{ color: "#1B3A5C" }}>{formatPrice(sale.price)}</td>
                    <td className="py-2 text-xs font-medium" style={{ color: "#2D9B6F" }}>{sale.priceM2.toLocaleString("fr-FR")} €/m²</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Justification */}
        <div
          className="mt-4 rounded-xl p-4 text-sm"
          style={{ background: "#EFF6FF", border: "1px solid #DBEAFE", color: "#1D4ED8", lineHeight: 1.6 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <BarChart2 size={14} />
            <span className="font-bold">Justification du prix recommandé</span>
          </div>
          Le prix recommandé de <strong>{formatPrice(recommended)}</strong> ({priceM2} €/m²) est basé sur 5 transactions récentes dans un rayon de 500m. Il tient compte de l&apos;état du bien, de l&apos;étage, de la présence d&apos;un balcon et de la tendance haussière du marché nancéien (+3,2% en 2026). Ce prix permet une vente dans un délai de 45 à 60 jours.
        </div>
      </div>
    </div>
  );
}

export default function EstimationsPage() {
  const [showGenerator, setShowGenerator] = useState(false);
  const [address, setAddress] = useState("");
  const [surface, setSurface] = useState("");
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!address || !surface) return;
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 1400));
    setGenerating(false);
    setGenerated(true);
  };

  return (
    <AppShell>
      <div className="px-4 lg:px-8 py-6 max-w-[1100px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#1A202C" }}>Générateur d&apos;estimation</h1>
            <p style={{ color: "#64748B", fontSize: "0.875rem" }}>
              Préparez un dossier d&apos;estimation professionnel en 30 secondes.
            </p>
          </div>
          <button className="btn-primary" onClick={() => { setShowGenerator(true); setGenerated(false); }}>
            <Plus size={15} /> Nouvelle estimation
          </button>
        </div>

        {/* Generator form */}
        {showGenerator && !generated && (
          <div className="kepler-card p-6 mb-6 animate-fade-up">
            <h2 className="font-bold text-lg mb-1" style={{ color: "#1A202C" }}>Nouvelle estimation</h2>
            <p className="text-sm mb-5" style={{ color: "#64748B" }}>
              Renseignez les informations du bien pour générer une analyse de marché complète.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>
                  Adresse du bien
                </label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#94A3B8" }} />
                  <input
                    className="input pl-9"
                    placeholder="Ex: 12 rue des Dominicains, Nancy"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>Surface (m²)</label>
                <input className="input" type="number" placeholder="68" value={surface} onChange={(e) => setSurface(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>Nombre de pièces</label>
                <select className="input select"><option>T3</option><option>T2</option><option>T4</option><option>T5</option></select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>Type de bien</label>
                <select className="input select"><option>Appartement</option><option>Maison</option></select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>État général</label>
                <select className="input select"><option>Bon état</option><option>À rénover</option><option>Neuf</option></select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>Atouts particuliers</label>
                <input className="input" placeholder="Ex: balcon, cave, parking, vue dégagée, dernier étage…" />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                className="btn-gold flex-1 justify-center py-2.5"
                onClick={handleGenerate}
                disabled={generating || !address || !surface}
                style={{ background: generating ? "#94A3B8" : undefined }}
              >
                {generating ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block rounded-full border-2 border-white/30 border-t-white animate-spin" style={{ width: 15, height: 15 }} />
                    Analyse en cours…
                  </span>
                ) : (
                  <><BarChart2 size={15} /> Générer l&apos;estimation</>
                )}
              </button>
              <button className="btn-ghost" onClick={() => setShowGenerator(false)}>Annuler</button>
            </div>
          </div>
        )}

        {/* Generated report */}
        {generated && address && (
          <div className="mb-6">
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl mb-4"
              style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}
            >
              <CheckCircle2 size={18} style={{ color: "#2D9B6F" }} />
              <span className="text-sm font-semibold" style={{ color: "#166534" }}>
                Dossier d&apos;estimation généré avec succès !
              </span>
              <button className="btn-ghost btn-sm ml-auto" onClick={() => { setGenerated(false); setShowGenerator(false); }}>
                Nouvelle estimation
              </button>
            </div>
            <EstimationReport address={address} surface={parseInt(surface) || 68} />
          </div>
        )}

        {/* Past estimations */}
        <div>
          <h2 className="text-base font-bold mb-3" style={{ color: "#1A202C" }}>Estimations récentes</h2>
          <div className="space-y-3">
            {ESTIMATIONS.map((est) => (
              <div key={est.id} className="kepler-card p-4">
                <div className="flex items-center gap-4">
                  <div
                    className="flex items-center justify-center rounded-xl flex-shrink-0"
                    style={{ width: 44, height: 44, background: "#EFF6FF" }}
                  >
                    <FileText size={18} style={{ color: "#1B3A5C" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold" style={{ color: "#1A202C" }}>{est.propertyAddress}</div>
                    <div className="text-xs mt-0.5 flex items-center gap-2" style={{ color: "#64748B" }}>
                      {est.contactName && <span>{est.contactName}</span>}
                      <span>· {est.surface}m²</span>
                      <span>· {formatDate(est.createdAt)}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-bold text-lg" style={{ color: "#1B3A5C" }}>{formatPrice(est.recommendedPrice)}</div>
                    <div className="text-xs" style={{ color: "#94A3B8" }}>
                      {formatPrice(est.estimatedPriceMin)} — {formatPrice(est.estimatedPriceMax)}
                    </div>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button className="btn-ghost btn-sm"><Download size={12} /> PDF</button>
                    <button className="btn-ghost btn-sm"><Send size={12} /> Envoyer</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
