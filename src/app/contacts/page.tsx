"use client";
import { useState, useMemo } from "react";
import AppShell from "@/components/AppShell";
import MaturityRing from "@/components/MaturityRing";
import {
  Search, Filter, Phone, MessageSquare, Eye, X, ChevronRight,
  Plus, Mail, MapPin, Wallet, Home, Tag, Star, Send,
} from "lucide-react";
import {
  CONTACTS, INTERACTIONS, NURTURE_MESSAGES, PROPERTY_MATCHES, PROPERTIES,
  getStatusLabel, getTypeLabel, getPropertyTypeLabel, formatDate, formatPrice,
  getDaysSinceContact, getLifeEventLabel, getLifeEventEmoji, getInteractionLabel,
} from "@/lib/data";
import type { Contact, ContactStatus, ContactType } from "@/lib/data";

function Avatar({ contact, size = 38 }: { contact: Contact; size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-full text-white font-bold flex-shrink-0"
      style={{ width: size, height: size, background: contact.avatarColor, fontSize: size < 36 ? "0.65rem" : "0.8rem" }}
    >
      {contact.initials}
    </div>
  );
}

function StatusBadge({ status }: { status: ContactStatus }) {
  return (
    <span className={`badge badge-${status}`}>
      {status === "hot" && "🔥 "}{getStatusLabel(status)}
    </span>
  );
}

function TypeBadge({ type }: { type: ContactType }) {
  const map: Record<ContactType, string> = { buyer: "badge-buyer", seller: "badge-seller", both: "badge-both" };
  return <span className={`badge ${map[type]}`}>{getTypeLabel(type)}</span>;
}

function ContactDrawer({ contact, onClose }: { contact: Contact; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"profil" | "timeline" | "messages" | "biens">("profil");

  const interactions = INTERACTIONS.filter((i) => i.contactId === contact.id);
  const messages = NURTURE_MESSAGES.filter((m) => m.contactId === contact.id);
  const matches = PROPERTY_MATCHES.filter((m) => m.contactId === contact.id);
  const days = getDaysSinceContact(contact.lastInteractionAt);

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch justify-end"
      style={{ background: "rgba(0,0,0,0.35)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="flex flex-col w-full max-w-md bg-white h-full overflow-hidden animate-slide-right shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "#E2E8F0" }}>
          <h2 className="font-bold text-base" style={{ color: "#1A202C" }}>Fiche contact</h2>
          <button className="btn-icon" onClick={onClose}><X size={16} /></button>
        </div>

        {/* Profile header */}
        <div className="px-5 py-4 border-b" style={{ borderColor: "#E2E8F0" }}>
          <div className="flex items-start gap-4">
            <Avatar contact={contact} size={52} />
            <div className="flex-1 min-w-0">
              <div className="font-bold text-lg mb-1" style={{ color: "#1A202C" }}>{contact.fullName}</div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                <StatusBadge status={contact.status} />
                <TypeBadge type={contact.type} />
              </div>
              <div className="flex items-center gap-2 text-xs" style={{ color: "#64748B" }}>
                <Mail size={11} />
                <span className="truncate">{contact.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs mt-0.5" style={{ color: "#64748B" }}>
                <Phone size={11} />
                <span>{contact.phone}</span>
              </div>
            </div>
            <MaturityRing score={contact.maturityScore} size={52} strokeWidth={5} />
          </div>
          <div className="flex gap-2 mt-3">
            <button className="btn-primary btn-sm flex items-center gap-1.5"><Phone size={12} />Appeler</button>
            <button className="btn-gold btn-sm flex items-center gap-1.5"><MessageSquare size={12} />Message</button>
            <div
              className="ml-auto text-xs px-2 py-1 rounded-lg"
              style={{
                background: days > 14 ? "#FEE2E2" : "#F8FAFC",
                color: days > 14 ? "#991B1B" : "#64748B",
                border: `1px solid ${days > 14 ? "#FECACA" : "#E2E8F0"}`,
              }}
            >
              {days === 0 ? "Aujourd'hui" : `${days}j sans contact`}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-5 tab-bar">
          {(["profil", "timeline", "messages", "biens"] as const).map((tab) => (
            <button
              key={tab}
              className={`tab-item ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "profil" ? "Profil" : tab === "timeline" ? "Timeline" : tab === "messages" ? "Messages" : "Biens matchés"}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto px-5 py-2">

          {activeTab === "profil" && (
            <div className="space-y-4">
              {/* Critères acheteur */}
              {(contact.type === "buyer" || contact.type === "both") && contact.budgetMin && (
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#94A3B8" }}>Critères acheteur</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Wallet size={14} style={{ color: "#1B3A5C" }} />
                      <span style={{ color: "#64748B" }}>Budget :</span>
                      <span className="font-semibold" style={{ color: "#1A202C" }}>
                        {formatPrice(contact.budgetMin!)} — {formatPrice(contact.budgetMax!)}
                      </span>
                    </div>
                    {contact.targetArea && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin size={14} style={{ color: "#1B3A5C" }} />
                        <span style={{ color: "#64748B" }}>Zone :</span>
                        <span className="font-semibold" style={{ color: "#1A202C" }}>{contact.targetArea}</span>
                      </div>
                    )}
                    {contact.propertyType && (
                      <div className="flex items-center gap-2 text-sm">
                        <Home size={14} style={{ color: "#1B3A5C" }} />
                        <span style={{ color: "#64748B" }}>Type :</span>
                        <span className="font-semibold" style={{ color: "#1A202C" }}>{getPropertyTypeLabel(contact.propertyType)}</span>
                      </div>
                    )}
                    {contact.nbRoomsMin && (
                      <div className="flex items-center gap-2 text-sm">
                        <Tag size={14} style={{ color: "#1B3A5C" }} />
                        <span style={{ color: "#64748B" }}>Pièces :</span>
                        <span className="font-semibold" style={{ color: "#1A202C" }}>
                          T{contact.nbRoomsMin}{contact.nbRoomsMax !== contact.nbRoomsMin ? `–T${contact.nbRoomsMax}` : ""}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Événements de vie */}
              {contact.lifeEvents && contact.lifeEvents.length > 0 && (
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#94A3B8" }}>Événements de vie détectés</div>
                  <div className="space-y-2">
                    {contact.lifeEvents.map((ev) => (
                      <div
                        key={ev.id}
                        className="flex items-center gap-3 p-2.5 rounded-lg"
                        style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}
                      >
                        <span className="text-lg">{getLifeEventEmoji(ev.eventType)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold" style={{ color: "#166534" }}>{getLifeEventLabel(ev.eventType)}</div>
                          <div className="text-xs" style={{ color: "#4ADE80" }}>
                            via {ev.source} — {formatDate(ev.detectedAt)} · confiance {ev.confidenceScore}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Insight */}
              {contact.aiInsight && (
                <div
                  className="rounded-xl p-4"
                  style={{ background: "linear-gradient(135deg, #EFF6FF 0%, #E8F4F8 100%)", border: "1px solid #BFDBFE" }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Star size={13} style={{ color: "#C9A84C" }} fill="#C9A84C" />
                    <span className="text-xs font-bold" style={{ color: "#1B3A5C" }}>Analyse Kepler IA</span>
                  </div>
                  <p className="text-sm" style={{ color: "#1D4ED8", lineHeight: 1.6 }}>{contact.aiInsight}</p>
                </div>
              )}

              {/* Source & notes */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#94A3B8" }}>Informations</div>
                <div className="text-sm mb-1.5" style={{ color: "#64748B" }}>
                  <span className="font-medium" style={{ color: "#374151" }}>Source : </span>{contact.source}
                </div>
                {contact.notes && (
                  <div className="text-sm" style={{ color: "#64748B", lineHeight: 1.5 }}>
                    <span className="font-medium" style={{ color: "#374151" }}>Notes : </span>{contact.notes}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "timeline" && (
            <div>
              {interactions.length === 0 && (
                <div className="text-center py-8 text-sm" style={{ color: "#94A3B8" }}>
                  Aucune interaction enregistrée.
                </div>
              )}
              <div className="space-y-3">
                {interactions.map((int) => (
                  <div key={int.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#1B3A5C" }} />
                      <div className="flex-1 w-px bg-gray-100 mt-1" />
                    </div>
                    <div className="pb-4 flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: "#EFF6FF", color: "#1D4ED8" }}
                        >
                          {getInteractionLabel(int.type)}
                        </span>
                        <span className="text-xs" style={{ color: "#94A3B8" }}>{formatDate(int.createdAt)}</span>
                      </div>
                      <div className="text-sm" style={{ color: "#374151", lineHeight: 1.5 }}>{int.notes}</div>
                      {int.outcome && (
                        <div className="text-xs mt-1 font-medium" style={{ color: "#2D9B6F" }}>→ {int.outcome}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn-ghost w-full justify-center mt-2" style={{ width: "100%" }}>
                <Plus size={13} /> Ajouter une interaction
              </button>
            </div>
          )}

          {activeTab === "messages" && (
            <div>
              <button className="btn-gold w-full justify-center mb-4" style={{ width: "100%" }}>
                <Star size={13} /> Générer un nouveau message
              </button>
              {messages.length === 0 && (
                <div className="text-center py-8 text-sm" style={{ color: "#94A3B8" }}>
                  Aucun message envoyé pour l&apos;instant.
                </div>
              )}
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="rounded-xl p-3"
                    style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="text-xs font-semibold uppercase px-2 py-0.5 rounded-full"
                        style={{
                          background: msg.channel === "whatsapp" ? "#DCFCE7" : msg.channel === "email" ? "#EFF6FF" : "#F3F4F6",
                          color: msg.channel === "whatsapp" ? "#166534" : msg.channel === "email" ? "#1D4ED8" : "#374151",
                        }}
                      >
                        {msg.channel}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                          background: msg.status === "replied" ? "#DCFCE7" : msg.status === "clicked" ? "#FEF3C7" : msg.status === "opened" ? "#EFF6FF" : "#F1F5F9",
                          color: msg.status === "replied" ? "#166534" : msg.status === "clicked" ? "#92400E" : msg.status === "opened" ? "#1D4ED8" : "#64748B",
                        }}
                      >
                        {msg.status === "replied" ? "✓ Répondu" : msg.status === "clicked" ? "Cliqué" : msg.status === "opened" ? "Ouvert" : "Envoyé"}
                      </span>
                      <span className="text-xs ml-auto" style={{ color: "#94A3B8" }}>{msg.sentAt ? formatDate(msg.sentAt) : ""}</span>
                    </div>
                    <div className="text-sm" style={{ color: "#374151", lineHeight: 1.5 }}>{msg.content.slice(0, 120)}…</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "biens" && (
            <div>
              {matches.length === 0 && (
                <div className="text-center py-8 text-sm" style={{ color: "#94A3B8" }}>
                  Aucun bien correspondant à ce profil pour l&apos;instant.
                </div>
              )}
              <div className="space-y-3">
                {matches.map((match) => {
                  const property = PROPERTIES.find((p) => p.id === match.propertyId);
                  if (!property) return null;
                  return (
                    <div
                      key={match.id}
                      className="rounded-xl p-3"
                      style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold" style={{ color: "#1A202C" }}>{property.title}</span>
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{ background: match.matchScore > 85 ? "#DCFCE7" : "#FEF3C7", color: match.matchScore > 85 ? "#166534" : "#92400E" }}
                        >
                          {match.matchScore}% match
                        </span>
                      </div>
                      <div className="text-xs mb-2" style={{ color: "#64748B" }}>
                        {formatPrice(property.price)} · {property.surface}m² · {property.city}
                      </div>
                      <button className="btn-gold btn-sm">
                        <Send size={11} /> Envoyer la présentation
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ContactsPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<ContactStatus | "all">("all");
  const [filterType, setFilterType] = useState<ContactType | "all">("all");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const filtered = useMemo(() => {
    return CONTACTS.filter((c) => {
      const matchSearch = search === "" ||
        c.fullName.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.targetArea?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "all" || c.status === filterStatus;
      const matchType = filterType === "all" || c.type === filterType;
      return matchSearch && matchStatus && matchType;
    }).sort((a, b) => b.maturityScore - a.maturityScore);
  }, [search, filterStatus, filterType]);

  return (
    <AppShell>
      <div className="px-4 lg:px-8 py-6 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#1A202C" }}>Contacts</h1>
            <p style={{ color: "#64748B", fontSize: "0.875rem" }}>
              {CONTACTS.length} contacts · {CONTACTS.filter((c) => c.status === "hot").length} chauds
            </p>
          </div>
          <button className="btn-primary">
            <Plus size={15} />
            Ajouter un contact
          </button>
        </div>

        {/* Filters */}
        <div className="kepler-card p-4 mb-5 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#94A3B8" }} />
            <input
              className="input pl-9"
              placeholder="Rechercher un contact, zone, email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="input select w-40"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as ContactStatus | "all")}
          >
            <option value="all">Tous statuts</option>
            <option value="cold">Froid</option>
            <option value="warm">Tiède</option>
            <option value="hot">Chaud</option>
            <option value="converted">Converti</option>
          </select>
          <select
            className="input select w-44"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as ContactType | "all")}
          >
            <option value="all">Tous types</option>
            <option value="buyer">Acheteur</option>
            <option value="seller">Vendeur</option>
            <option value="both">Acheteur & Vendeur</option>
          </select>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "#64748B" }}>
            <Filter size={13} />
            {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Contact table */}
        <div className="kepler-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                {["Contact", "Type", "Statut", "Score", "Dernière interaction", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "#64748B" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((contact, i) => {
                const days = getDaysSinceContact(contact.lastInteractionAt);
                return (
                  <tr
                    key={contact.id}
                    className="border-b hover:bg-gray-50 transition-colors cursor-pointer"
                    style={{ borderColor: "#F1F5F9" }}
                    onClick={() => setSelectedContact(contact)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar contact={contact} size={36} />
                        <div className="min-w-0">
                          <div className="font-semibold text-sm truncate" style={{ color: "#1A202C" }}>{contact.fullName}</div>
                          <div className="text-xs truncate" style={{ color: "#94A3B8" }}>{contact.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><TypeBadge type={contact.type} /></td>
                    <td className="px-4 py-3"><StatusBadge status={contact.status} /></td>
                    <td className="px-4 py-3">
                      <MaturityRing score={contact.maturityScore} size={44} strokeWidth={4} showLabel />
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs" style={{ color: days > 30 ? "#EF4444" : days > 14 ? "#F59E0B" : "#64748B" }}>
                        {days === 0 ? "Aujourd'hui" : days === 1 ? "Hier" : `Il y a ${days}j`}
                      </div>
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1">
                        <button className="btn-icon" title="Appeler"><Phone size={13} /></button>
                        <button className="btn-icon" title="Message"><MessageSquare size={13} /></button>
                        <button className="btn-icon" title="Voir profil" onClick={() => setSelectedContact(contact)}><Eye size={13} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-sm" style={{ color: "#94A3B8" }}>
              Aucun contact ne correspond à votre recherche.
            </div>
          )}
        </div>
      </div>

      {selectedContact && (
        <ContactDrawer contact={selectedContact} onClose={() => setSelectedContact(null)} />
      )}
    </AppShell>
  );
}
