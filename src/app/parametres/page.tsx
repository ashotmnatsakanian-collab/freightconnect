"use client";
import { useState } from "react";
import AppShell from "@/components/AppShell";
import { Save, Bell, Shield, CreditCard, User, Sliders, CheckCircle2 } from "lucide-react";
import { CURRENT_AGENT } from "@/lib/data";

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="kepler-card p-6 mb-4">
      <div className="flex items-center gap-2.5 mb-5 pb-4 border-b" style={{ borderColor: "#E2E8F0" }}>
        <Icon size={17} style={{ color: "#1B3A5C" }} />
        <h2 className="font-bold text-base" style={{ color: "#1A202C" }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Toggle({ label, sublabel, defaultChecked }: { label: string; sublabel?: string; defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked ?? false);
  return (
    <div className="flex items-center justify-between py-2.5">
      <div>
        <div className="text-sm font-medium" style={{ color: "#374151" }}>{label}</div>
        {sublabel && <div className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>{sublabel}</div>}
      </div>
      <button
        className="relative flex-shrink-0"
        style={{ width: 44, height: 24 }}
        onClick={() => setChecked(!checked)}
      >
        <div
          className="absolute inset-0 rounded-full transition-colors"
          style={{ background: checked ? "#1B3A5C" : "#E2E8F0" }}
        />
        <div
          className="absolute top-0.5 rounded-full bg-white shadow transition-all"
          style={{ width: 20, height: 20, left: checked ? 22 : 2 }}
        />
      </button>
    </div>
  );
}

export default function ParametresPage() {
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState(CURRENT_AGENT.fullName);
  const [agency, setAgency] = useState(CURRENT_AGENT.agencyName);
  const [phone, setPhone] = useState(CURRENT_AGENT.phone);

  const handleSave = async () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <AppShell>
      <div className="px-4 lg:px-8 py-6 max-w-[800px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#1A202C" }}>Paramètres</h1>
            <p style={{ color: "#64748B", fontSize: "0.875rem" }}>Gérez votre compte et vos préférences Kepler.</p>
          </div>
          <button
            className="btn-primary"
            onClick={handleSave}
            style={{ background: saved ? "#2D9B6F" : undefined }}
          >
            {saved ? <><CheckCircle2 size={15} /> Enregistré</> : <><Save size={15} /> Sauvegarder</>}
          </button>
        </div>

        {/* Profile */}
        <Section title="Profil agent" icon={User}>
          <div className="flex items-center gap-4 mb-6">
            <div
              className="flex items-center justify-center rounded-full text-white font-bold text-xl"
              style={{ width: 64, height: 64, background: "#C9A84C", flexShrink: 0 }}
            >
              TM
            </div>
            <div>
              <div className="font-bold text-base" style={{ color: "#1A202C" }}>{name}</div>
              <div className="text-sm" style={{ color: "#64748B" }}>{agency}</div>
              <button className="text-xs font-semibold mt-1" style={{ color: "#C9A84C" }}>Modifier la photo →</button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>Nom complet</label>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>Email professionnel</label>
              <input className="input" value={CURRENT_AGENT.email} readOnly style={{ background: "#F8FAFC", color: "#94A3B8" }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>Agence</label>
              <input className="input" value={agency} onChange={(e) => setAgency(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>Téléphone</label>
              <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>Zone d&apos;activité principale</label>
              <input className="input" defaultValue="Nancy, Vandoeuvre-lès-Nancy, Laxou, Metz" />
            </div>
          </div>
        </Section>

        {/* Notifications */}
        <Section title="Notifications" icon={Bell}>
          <div className="divide-y" style={{ borderColor: "#F1F5F9" }}>
            <Toggle label="Alertes leads chauds" sublabel="Notification immédiate quand un score dépasse 85" defaultChecked />
            <Toggle label="Événements de vie détectés" sublabel="LinkedIn, Leboncoin, Facebook" defaultChecked />
            <Toggle label="Rappels de suivi" sublabel="Contacts sans interaction depuis 14+ jours" defaultChecked />
            <Toggle label="Résultats de campagnes" sublabel="Résumé quotidien des ouvertures et clics" />
            <Toggle label="Nouveaux matches bien–acheteur" sublabel="Correspondances détectées automatiquement" defaultChecked />
            <Toggle label="Rapport hebdomadaire" sublabel="Synthèse performance chaque lundi matin" defaultChecked />
          </div>
        </Section>

        {/* IA Settings */}
        <Section title="Préférences IA" icon={Sliders}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>
                Seuil d&apos;alerte score chaud
              </label>
              <div className="flex items-center gap-3">
                <input type="range" min={50} max={95} defaultValue={70} className="flex-1" />
                <span className="text-sm font-bold w-12 text-right" style={{ color: "#1B3A5C" }}>70/100</span>
              </div>
              <div className="text-xs mt-1" style={{ color: "#94A3B8" }}>
                Les contacts au-dessus de ce score apparaissent dans &quot;Leads Chauds&quot;
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>
                Délai de réactivation automatique (jours sans contact)
              </label>
              <select className="input select w-48">
                <option>30 jours</option>
                <option selected>60 jours</option>
                <option>90 jours</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>
                Ton des messages générés par IA
              </label>
              <select className="input select w-48">
                <option>Professionnel & chaleureux</option>
                <option>Formel</option>
                <option>Décontracté</option>
              </select>
            </div>
          </div>
          <div className="divide-y mt-4" style={{ borderColor: "#F1F5F9" }}>
            <Toggle label="Matching automatique bien-acheteur" sublabel="À chaque nouveau bien enregistré" defaultChecked />
            <Toggle label="Détection d'événements de vie" sublabel="Surveillance LinkedIn, Leboncoin, réseaux sociaux" defaultChecked />
            <Toggle label="Personnalisation IA des messages" sublabel="Adapter le contenu au profil de chaque contact" defaultChecked />
          </div>
        </Section>

        {/* Subscription */}
        <Section title="Abonnement" icon={CreditCard}>
          <div
            className="rounded-xl p-4 mb-4 flex items-center justify-between"
            style={{ background: "linear-gradient(135deg, #0F2340, #1B3A5C)" }}
          >
            <div>
              <div className="text-xs font-bold mb-1" style={{ color: "#C9A84C", letterSpacing: "0.06em" }}>PLAN ACTUEL</div>
              <div className="text-white text-2xl font-extrabold">Kepler Pro</div>
              <div style={{ color: "#94A3B8", fontSize: "0.875rem" }}>299 €/mois · Engagement annuel</div>
            </div>
            <div
              className="px-4 py-2 rounded-full text-sm font-bold"
              style={{ background: "rgba(201,168,76,0.2)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.3)" }}
            >
              Actif
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {[
              { label: "Contacts", value: "Illimités", inc: true },
              { label: "Campagnes/mois", value: "Illimitées", inc: true },
              { label: "Membres équipe", value: "3 agents", inc: true },
            ].map(({ label, value, inc }) => (
              <div key={label} className="text-center p-3 rounded-xl" style={{ background: "#F8FAFC" }}>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <CheckCircle2 size={13} style={{ color: "#2D9B6F" }} />
                  <span className="text-xs" style={{ color: "#64748B" }}>{label}</span>
                </div>
                <div className="text-sm font-bold" style={{ color: "#1A202C" }}>{value}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button className="btn-ghost">Voir les factures</button>
            <button className="btn-ghost">Gérer l&apos;abonnement</button>
          </div>
        </Section>

        {/* Security */}
        <Section title="Sécurité" icon={Shield}>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-sm font-medium" style={{ color: "#374151" }}>Mot de passe</div>
                <div className="text-xs" style={{ color: "#94A3B8" }}>Dernière modification il y a 3 mois</div>
              </div>
              <button className="btn-ghost btn-sm">Modifier</button>
            </div>
            <div className="flex items-center justify-between py-2 border-t" style={{ borderColor: "#F1F5F9" }}>
              <div>
                <div className="text-sm font-medium" style={{ color: "#374151" }}>Authentification à 2 facteurs</div>
                <div className="text-xs" style={{ color: "#94A3B8" }}>Sécurisez votre compte avec un code SMS</div>
              </div>
              <button className="btn-primary btn-sm">Activer</button>
            </div>
            <div className="flex items-center justify-between py-2 border-t" style={{ borderColor: "#F1F5F9" }}>
              <div>
                <div className="text-sm font-medium" style={{ color: "#374151" }}>Sessions actives</div>
                <div className="text-xs" style={{ color: "#94A3B8" }}>1 session active · Nancy, France</div>
              </div>
              <button className="btn-ghost btn-sm">Gérer</button>
            </div>
          </div>
        </Section>
      </div>
    </AppShell>
  );
}
