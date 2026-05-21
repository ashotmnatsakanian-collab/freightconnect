"use client";
import { useState } from "react";
import AppShell from "@/components/AppShell";
import { Plus, Send, Eye, BarChart2, MessageSquare, Mail, Smartphone, Star, Users, TrendingUp } from "lucide-react";
import { CAMPAIGNS, formatDate, formatPrice } from "@/lib/data";
import type { Campaign } from "@/lib/data";

function ChannelIcon({ channel }: { channel: Campaign["channel"] }) {
  if (channel === "whatsapp") return <MessageSquare size={14} style={{ color: "#25D366" }} />;
  if (channel === "email") return <Mail size={14} style={{ color: "#1D4ED8" }} />;
  return <Smartphone size={14} style={{ color: "#6366F1" }} />;
}

function ChannelBadge({ channel }: { channel: Campaign["channel"] }) {
  const config = {
    whatsapp: { bg: "#DCFCE7", color: "#166534", label: "WhatsApp" },
    email:    { bg: "#EFF6FF", color: "#1D4ED8", label: "Email" },
    sms:      { bg: "#F3F4F6", color: "#374151", label: "SMS" },
  }[channel];
  return (
    <span className="badge" style={{ background: config.bg, color: config.color }}>
      {config.label}
    </span>
  );
}

function OpenRate({ sent = 0, opened = 0 }: { sent?: number; opened?: number }) {
  const pct = sent > 0 ? Math.round((opened / sent) * 100) : 0;
  return (
    <div>
      <div className="text-xs mb-1" style={{ color: "#64748B" }}>Taux d&apos;ouverture</div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 rounded-full" style={{ background: "#F1F5F9" }}>
          <div
            className="h-2 rounded-full"
            style={{ width: `${pct}%`, background: pct >= 50 ? "#2D9B6F" : pct >= 30 ? "#F59E0B" : "#EF4444" }}
          />
        </div>
        <span className="text-xs font-bold" style={{ color: "#1A202C" }}>{pct}%</span>
      </div>
    </div>
  );
}

const CAMPAIGN_TYPES = [
  { id: "market",       label: "Marché local",     icon: BarChart2,    color: "#1B3A5C",  desc: "Mise à jour prix au m², délais, tendances" },
  { id: "new_property", label: "Nouveau bien",      icon: Star,         color: "#C9A84C",  desc: "Présentation d'un bien correspondant aux critères" },
  { id: "checkin",      label: "Prise de nouvelles",icon: MessageSquare,color: "#2D9B6F",  desc: "Relance douce après X mois sans contact" },
  { id: "birthday",     label: "Anniversaire",      icon: TrendingUp,   color: "#6366F1",  desc: "Message personnalisé pour l'anniversaire" },
];

function NewCampaignModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<Campaign["channel"]>("email");
  const [name, setName] = useState("");

  const generatedMessage = selectedType === "market"
    ? `Bonjour {{prénom}},\n\nLe marché immobilier nancéien continue sa dynamique en mai 2026 : les appartements T3-T4 s'échangent désormais entre 2 400 et 2 800 €/m² en centre-ville, avec des délais de vente réduits à 52 jours en moyenne (-8j vs 2025).\n\nVous m'aviez confié votre projet {{type_projet}} dans le secteur {{zone}}. Ce contexte favorable est idéal pour...\n\nCordialement,\nThomas Moreau – Immo Excellence Nancy`
    : `Bonjour {{prénom}},\n\nJ'espère que vous allez bien ! Je voulais prendre de vos nouvelles concernant votre projet immobilier {{type_projet}}.\n\nLe marché est particulièrement actif en ce moment et j'ai des opportunités intéressantes qui correspondent à vos critères...\n\nÀ très bientôt,\nThomas Moreau`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.4)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-up">
        {/* Header */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ background: "#0F2340" }}
        >
          <div>
            <div className="text-white font-bold text-lg">Nouvelle campagne</div>
            <div style={{ color: "#64748B", fontSize: "0.8rem" }}>Étape {step}/3</div>
          </div>
          <button className="btn-icon" style={{ color: "#64748B" }} onClick={onClose}>✕</button>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div>
              <h3 className="font-bold mb-4" style={{ color: "#1A202C" }}>Choisissez le type de campagne</h3>
              <div className="grid grid-cols-2 gap-3">
                {CAMPAIGN_TYPES.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      className="text-left p-4 rounded-xl transition-all border-2"
                      style={{
                        borderColor: selectedType === type.id ? type.color : "#E2E8F0",
                        background: selectedType === type.id ? `${type.color}08` : "white",
                      }}
                      onClick={() => setSelectedType(type.id)}
                    >
                      <div
                        className="flex items-center justify-center rounded-lg mb-2"
                        style={{ width: 36, height: 36, background: `${type.color}18` }}
                      >
                        <Icon size={16} style={{ color: type.color }} />
                      </div>
                      <div className="font-semibold text-sm mb-0.5" style={{ color: "#1A202C" }}>{type.label}</div>
                      <div className="text-xs" style={{ color: "#64748B" }}>{type.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-bold mb-4" style={{ color: "#1A202C" }}>Configurez votre campagne</h3>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>Nom de la campagne</label>
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Marché été 2026 — Nancy Centre" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#374151" }}>Canal d&apos;envoi</label>
                <div className="flex gap-2">
                  {(["email", "whatsapp", "sms"] as Campaign["channel"][]).map((ch) => (
                    <button
                      key={ch}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all"
                      style={{
                        borderColor: selectedChannel === ch ? "#1B3A5C" : "#E2E8F0",
                        background: selectedChannel === ch ? "#EFF6FF" : "white",
                        color: selectedChannel === ch ? "#1B3A5C" : "#64748B",
                      }}
                      onClick={() => setSelectedChannel(ch)}
                    >
                      <ChannelIcon channel={ch} />
                      {ch.charAt(0).toUpperCase() + ch.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium" style={{ color: "#374151" }}>Message généré par IA</label>
                  <button className="btn-ghost btn-sm">
                    <Star size={11} /> Régénérer
                  </button>
                </div>
                <textarea
                  className="input"
                  rows={8}
                  defaultValue={generatedMessage}
                  style={{ fontFamily: "inherit", lineHeight: 1.6, resize: "vertical" }}
                />
                <div className="text-xs mt-1" style={{ color: "#94A3B8" }}>
                  Les variables {"{{prénom}}"}, {"{{type_projet}}"} seront personnalisées automatiquement.
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="font-bold mb-4" style={{ color: "#1A202C" }}>Aperçu &amp; envoi</h3>
              <div
                className="rounded-xl p-4 mb-4"
                style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}
              >
                <div className="text-sm font-semibold mb-1" style={{ color: "#166534" }}>✅ Campagne prête</div>
                <div className="text-sm" style={{ color: "#166534" }}>23 contacts ciblés · Canal : {selectedChannel} · Personnalisation IA activée</div>
              </div>
              <div className="space-y-3">
                <div className="font-medium text-sm mb-2" style={{ color: "#374151" }}>Aperçu pour les 3 premiers contacts :</div>
                {[
                  { name: "Martin Dupont",  zone: "Nancy Centre", projet: "achat T4" },
                  { name: "Sophie Laurent", zone: "Vandoeuvre",    projet: "achat T3" },
                  { name: "Julien Mathieu", zone: "Nancy Haussman",projet: "achat T4" },
                ].map((preview) => (
                  <div
                    key={preview.name}
                    className="rounded-lg p-3 text-sm"
                    style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}
                  >
                    <div className="font-semibold mb-1" style={{ color: "#1A202C" }}>{preview.name}</div>
                    <div style={{ color: "#64748B", lineHeight: 1.5, fontSize: "0.8rem" }}>
                      Bonjour <strong>{preview.name.split(" ")[0]}</strong>, Le marché de <strong>{preview.zone}</strong> est particulièrement actif pour votre projet <strong>{preview.projet}</strong>…
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex items-center justify-between" style={{ borderColor: "#E2E8F0" }}>
          {step > 1 ? (
            <button className="btn-ghost" onClick={() => setStep(step - 1)}>← Précédent</button>
          ) : (
            <button className="btn-ghost" onClick={onClose}>Annuler</button>
          )}
          {step < 3 ? (
            <button className="btn-primary" onClick={() => setStep(step + 1)} disabled={!selectedType && step === 1}>
              Suivant →
            </button>
          ) : (
            <div className="flex gap-2">
              <button className="btn-ghost">Planifier</button>
              <button className="btn-gold" onClick={onClose}>
                <Send size={14} /> Envoyer maintenant
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CampagnesPage() {
  const [showNew, setShowNew] = useState(false);

  const sent = CAMPAIGNS.filter((c) => c.status === "sent");
  const drafts = CAMPAIGNS.filter((c) => c.status === "draft");

  const totalSent = sent.reduce((s, c) => s + (c.sentCount ?? 0), 0);
  const totalOpened = sent.reduce((s, c) => s + (c.openedCount ?? 0), 0);
  const totalClicked = sent.reduce((s, c) => s + (c.clickedCount ?? 0), 0);
  const totalDeals = sent.reduce((s, c) => s + (c.dealsCount ?? 0), 0);

  return (
    <AppShell>
      <div className="px-4 lg:px-8 py-6 max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#1A202C" }}>Campagnes de réactivation</h1>
            <p style={{ color: "#64748B", fontSize: "0.875rem" }}>
              Relancez vos contacts dormants avec des messages personnalisés par l&apos;IA.
            </p>
          </div>
          <button className="btn-primary" onClick={() => setShowNew(true)}>
            <Plus size={15} /> Nouvelle campagne
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Messages envoyés", value: totalSent, color: "#1B3A5C", icon: Send },
            { label: "Ouverts", value: totalOpened, color: "#C9A84C", icon: Eye },
            { label: "Clics", value: totalClicked, color: "#6366F1", icon: BarChart2 },
            { label: "Deals générés", value: totalDeals, color: "#2D9B6F", icon: TrendingUp },
          ].map(({ label, value, color, icon: Icon }) => (
            <div key={label} className="kepler-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={16} style={{ color }} />
                <span className="text-xs font-semibold" style={{ color: "#64748B" }}>{label}</span>
              </div>
              <div className="text-2xl font-bold" style={{ color: "#1A202C" }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Drafts */}
        {drafts.length > 0 && (
          <div className="mb-6">
            <h2 className="text-base font-bold mb-3" style={{ color: "#1A202C" }}>Brouillons</h2>
            <div className="space-y-3">
              {drafts.map((camp) => (
                <div key={camp.id} className="kepler-card p-4 flex items-center gap-4">
                  <div
                    className="flex items-center justify-center rounded-lg flex-shrink-0"
                    style={{ width: 40, height: 40, background: "#F1F5F9" }}
                  >
                    <MessageSquare size={18} style={{ color: "#64748B" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold" style={{ color: "#1A202C" }}>{camp.name}</div>
                    <div className="text-xs mt-0.5 flex items-center gap-2" style={{ color: "#64748B" }}>
                      <ChannelBadge channel={camp.channel} />
                      <span>{camp.audienceCount} contacts ciblés</span>
                      <span>· Créée le {formatDate(camp.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button className="btn-ghost btn-sm"><Eye size={12} /> Prévisualiser</button>
                    <button className="btn-gold btn-sm"><Send size={12} /> Envoyer</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sent campaigns */}
        <div>
          <h2 className="text-base font-bold mb-3" style={{ color: "#1A202C" }}>Campagnes envoyées</h2>
          <div className="space-y-4">
            {sent.map((camp) => {
              const openRate = camp.sentCount ? Math.round(((camp.openedCount ?? 0) / camp.sentCount) * 100) : 0;
              const clickRate = camp.openedCount ? Math.round(((camp.clickedCount ?? 0) / camp.openedCount) * 100) : 0;
              const replyRate = camp.openedCount ? Math.round(((camp.repliedCount ?? 0) / camp.openedCount) * 100) : 0;

              return (
                <div key={camp.id} className="kepler-card p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="flex items-center justify-center rounded-xl flex-shrink-0"
                      style={{ width: 44, height: 44, background: camp.channel === "whatsapp" ? "#DCFCE7" : "#EFF6FF" }}
                    >
                      <ChannelIcon channel={camp.channel} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold" style={{ color: "#1A202C" }}>{camp.name}</div>
                      <div className="text-xs mt-0.5 flex flex-wrap items-center gap-2" style={{ color: "#64748B" }}>
                        <ChannelBadge channel={camp.channel} />
                        <span className="badge badge-converted">✓ Envoyée</span>
                        <span>{camp.sentAt ? formatDate(camp.sentAt) : ""}</span>
                      </div>
                    </div>
                    {(camp.dealsCount ?? 0) > 0 && (
                      <div
                        className="flex-shrink-0 text-sm font-bold px-3 py-1.5 rounded-full"
                        style={{ background: "#DCFCE7", color: "#166534" }}
                      >
                        🏆 {camp.dealsCount} deal{(camp.dealsCount ?? 0) > 1 ? "s" : ""}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    {[
                      { label: "Envoyés",   value: camp.sentCount ?? 0,    color: "#1B3A5C" },
                      { label: "Ouverts",   value: camp.openedCount ?? 0,  color: "#C9A84C", pct: `${openRate}%` },
                      { label: "Cliqués",   value: camp.clickedCount ?? 0, color: "#6366F1", pct: `${clickRate}% des ouverts` },
                      { label: "Répondus",  value: camp.repliedCount ?? 0, color: "#2D9B6F", pct: `${replyRate}% des ouverts` },
                    ].map(({ label, value, color, pct }) => (
                      <div key={label} className="text-center p-3 rounded-lg" style={{ background: "#F8FAFC" }}>
                        <div className="text-xl font-bold mb-0.5" style={{ color }}>{value}</div>
                        <div className="text-xs font-medium" style={{ color: "#64748B" }}>{label}</div>
                        {pct && <div className="text-xs mt-0.5 font-semibold" style={{ color }}>{pct}</div>}
                      </div>
                    ))}
                  </div>

                  <OpenRate sent={camp.sentCount} opened={camp.openedCount} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showNew && <NewCampaignModal onClose={() => setShowNew(false)} />}
    </AppShell>
  );
}
