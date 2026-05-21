"use client";
import { useState } from "react";
import AppShell from "@/components/AppShell";
import {
  Plus, Search, MapPin, Home, Building2, Users, Send, X, ChevronRight,
} from "lucide-react";
import {
  PROPERTIES, PROPERTY_MATCHES, CONTACTS,
  getPropertyTypeLabel, getPropertyStatusLabel, formatPrice,
} from "@/lib/data";
import type { PropertyStatus, PropertyType } from "@/lib/data";

function PropertyCard({ property }: { property: typeof PROPERTIES[0] }) {
  const [showMatches, setShowMatches] = useState(false);
  const matches = PROPERTY_MATCHES.filter((m) => m.propertyId === property.id)
    .sort((a, b) => b.matchScore - a.matchScore);

  const statusConfig: Record<PropertyStatus, { label: string; cls: string }> = {
    available:   { label: "Disponible",  cls: "badge-available" },
    under_offer: { label: "Sous offre",  cls: "badge-under_offer" },
    sold:        { label: "Vendu",       cls: "badge-sold" },
  };

  const typeConfig: Record<PropertyType, { icon: React.ElementType; color: string }> = {
    apartment:  { icon: Building2, color: "#1B3A5C" },
    house:      { icon: Home,      color: "#2D9B6F" },
    commercial: { icon: Building2, color: "#6366F1" },
  };

  const TypeIcon = typeConfig[property.type].icon;

  return (
    <div className="kepler-card overflow-hidden">
      {/* Image placeholder */}
      <div
        className="h-44 flex items-center justify-center relative"
        style={{
          background: `linear-gradient(135deg, ${typeConfig[property.type].color}18, ${typeConfig[property.type].color}30)`,
        }}
      >
        <TypeIcon size={48} style={{ color: typeConfig[property.type].color, opacity: 0.3 }} />
        <div className="absolute top-3 left-3">
          <span className={`badge ${statusConfig[property.status].cls}`}>
            {statusConfig[property.status].label}
          </span>
        </div>
        {property.potentialBuyers > 0 && (
          <div
            className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-bold"
            style={{ background: "rgba(0,0,0,0.6)", color: "white" }}
          >
            <Users size={11} />
            {property.potentialBuyers} acheteur{property.potentialBuyers > 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="font-bold text-sm mb-1 leading-tight" style={{ color: "#1A202C" }}>{property.title}</div>
        <div className="flex items-center gap-1.5 text-xs mb-3" style={{ color: "#64748B" }}>
          <MapPin size={11} />
          <span>{property.address}, {property.city}</span>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <span className="text-lg font-extrabold" style={{ color: "#1B3A5C" }}>{formatPrice(property.price)}</span>
          <span className="text-xs" style={{ color: "#94A3B8" }}>
            {property.surface}m² · T{property.nbRooms} · {getPropertyTypeLabel(property.type)}
          </span>
        </div>

        <div className="text-xs mb-4 leading-relaxed" style={{ color: "#64748B" }}>
          {property.description.slice(0, 100)}…
        </div>

        {property.potentialBuyers > 0 && property.status !== "sold" && (
          <div className="border-t pt-3" style={{ borderColor: "#F1F5F9" }}>
            <button
              className="btn-gold w-full justify-center btn-sm mb-2"
              onClick={() => setShowMatches(!showMatches)}
            >
              <Users size={12} />
              {showMatches ? "Masquer" : "Voir"} les {property.potentialBuyers} acheteur{property.potentialBuyers > 1 ? "s" : ""} correspondant{property.potentialBuyers > 1 ? "s" : ""}
            </button>

            {showMatches && (
              <div className="space-y-2 mt-2">
                {matches.map((match) => {
                  const contact = CONTACTS.find((c) => c.id === match.contactId);
                  if (!contact) return null;
                  return (
                    <div
                      key={match.id}
                      className="flex items-center gap-2.5 p-2.5 rounded-lg"
                      style={{ background: "#F8FAFC" }}
                    >
                      <div
                        className="flex items-center justify-center rounded-full text-white font-bold text-xs flex-shrink-0"
                        style={{ width: 28, height: 28, background: contact.avatarColor }}
                      >
                        {contact.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold truncate" style={{ color: "#1A202C" }}>{contact.fullName}</div>
                        {contact.budgetMin && (
                          <div className="text-xs" style={{ color: "#94A3B8" }}>
                            {formatPrice(contact.budgetMin)}–{formatPrice(contact.budgetMax!)}
                          </div>
                        )}
                      </div>
                      <span
                        className="text-xs font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                        style={{ background: match.matchScore > 85 ? "#DCFCE7" : "#FEF3C7", color: match.matchScore > 85 ? "#166534" : "#92400E" }}
                      >
                        {match.matchScore}%
                      </span>
                      <button className="btn-icon flex-shrink-0"><Send size={12} /></button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function NewPropertyModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.4)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fade-up">
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "#E2E8F0" }}>
          <h2 className="font-bold text-lg" style={{ color: "#1A202C" }}>Rentrer un nouveau bien</h2>
          <button className="btn-icon" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>Titre du bien</label>
              <input className="input" placeholder="Ex: Appartement T3 — Nancy Centre" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>Adresse</label>
              <input className="input" placeholder="12 rue des Roses" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>Ville</label>
              <input className="input" placeholder="Nancy" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>Prix (€)</label>
              <input className="input" type="number" placeholder="185000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>Surface (m²)</label>
              <input className="input" type="number" placeholder="68" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>Nombre de pièces</label>
              <input className="input" type="number" placeholder="3" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>Type</label>
              <select className="input select">
                <option value="apartment">Appartement</option>
                <option value="house">Maison</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>Description</label>
              <textarea className="input" rows={3} placeholder="Description du bien…" style={{ resize: "vertical" }} />
            </div>
          </div>
          <div
            className="rounded-xl p-3 text-sm"
            style={{ background: "#FFFBEB", border: "1px solid #FDE68A", color: "#92400E" }}
          >
            ✨ <strong>Matching automatique :</strong> Kepler analysera votre base de contacts et vous proposera immédiatement les acheteurs correspondants.
          </div>
        </div>
        <div className="px-6 py-4 border-t flex justify-end gap-2" style={{ borderColor: "#E2E8F0" }}>
          <button className="btn-ghost" onClick={onClose}>Annuler</button>
          <button className="btn-primary" onClick={onClose}>
            <Home size={14} /> Enregistrer le bien
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BiensPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<PropertyStatus | "all">("all");
  const [showNew, setShowNew] = useState(false);

  const filtered = PROPERTIES.filter((p) => {
    const matchSearch = search === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const available = PROPERTIES.filter((p) => p.status === "available").length;
  const totalBuyers = PROPERTIES.reduce((s, p) => s + p.potentialBuyers, 0);

  return (
    <AppShell>
      <div className="px-4 lg:px-8 py-6 max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#1A202C" }}>Biens</h1>
            <p style={{ color: "#64748B", fontSize: "0.875rem" }}>
              {available} disponibles · {totalBuyers} acheteurs potentiels identifiés
            </p>
          </div>
          <button className="btn-primary" onClick={() => setShowNew(true)}>
            <Plus size={15} /> Rentrer un bien
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#94A3B8" }} />
            <input className="input pl-9" placeholder="Rechercher un bien, ville…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="input select w-44" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as PropertyStatus | "all")}>
            <option value="all">Tous statuts</option>
            <option value="available">Disponible</option>
            <option value="under_offer">Sous offre</option>
            <option value="sold">Vendu</option>
          </select>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="kepler-card p-12 text-center" style={{ color: "#94A3B8" }}>
            <Home size={48} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
            <div className="font-semibold">Aucun bien trouvé</div>
          </div>
        )}
      </div>

      {showNew && <NewPropertyModal onClose={() => setShowNew(false)} />}
    </AppShell>
  );
}
