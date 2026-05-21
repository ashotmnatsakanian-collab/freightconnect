// ============================================================
// KEPLER — Dummy Data & Types
// ============================================================

export type ContactType   = 'buyer' | 'seller' | 'both'
export type ContactStatus = 'cold' | 'warm' | 'hot' | 'converted'
export type PropertyType   = 'apartment' | 'house' | 'commercial'
export type PropertyStatus = 'available' | 'under_offer' | 'sold'
export type AlertPriority  = 'low' | 'medium' | 'high' | 'urgent'
export type AlertType      = 'hot_lead' | 'life_event' | 'match_found' | 'followup'
export type NurtureChannel = 'email' | 'whatsapp' | 'sms'
export type NurtureStatus  = 'draft' | 'sent' | 'opened' | 'clicked' | 'replied'
export type LifeEventType  = 'new_job' | 'marriage' | 'baby' | 'moved' | 'promotion'
export type InteractionType = 'call' | 'meeting' | 'email' | 'whatsapp'

export interface KeplerAgent {
  id: string
  email: string
  fullName: string
  agencyName: string
  phone: string
  avatarUrl?: string
  subscriptionPlan: string
  createdAt: string
}

export interface LifeEvent {
  id: string
  contactId: string
  eventType: LifeEventType
  detectedAt: string
  source: string
  confidenceScore: number
}

export interface Contact {
  id: string
  agentId: string
  fullName: string
  initials: string
  avatarColor: string
  email: string
  phone: string
  type: ContactType
  status: ContactStatus
  maturityScore: number
  budgetMin?: number
  budgetMax?: number
  targetArea?: string
  propertyType?: PropertyType
  nbRoomsMin?: number
  nbRoomsMax?: number
  notes?: string
  source: string
  lastInteractionAt: string
  createdAt: string
  lifeEvents?: LifeEvent[]
  aiInsight?: string
}

export interface Property {
  id: string
  agentId: string
  title: string
  address: string
  city: string
  price: number
  surface: number
  nbRooms: number
  type: PropertyType
  status: PropertyStatus
  description: string
  createdAt: string
  potentialBuyers: number
}

export interface PropertyMatch {
  id: string
  propertyId: string
  contactId: string
  matchScore: number
  messageDrafted?: string
  sentAt?: string
}

export interface NurtureMessage {
  id: string
  agentId: string
  contactId: string
  channel: NurtureChannel
  content: string
  status: NurtureStatus
  sentAt?: string
  openedAt?: string
}

export interface Interaction {
  id: string
  agentId: string
  contactId: string
  type: InteractionType
  notes: string
  outcome?: string
  createdAt: string
}

export interface KeplerAlert {
  id: string
  agentId: string
  contactId?: string
  contactName?: string
  type: AlertType
  message: string
  subMessage?: string
  priority: AlertPriority
  read: boolean
  createdAt: string
  actions: Array<{ label: string; icon: string }>
}

export interface Campaign {
  id: string
  agentId: string
  name: string
  type: 'market' | 'new_property' | 'checkin' | 'birthday'
  channel: NurtureChannel
  status: 'draft' | 'scheduled' | 'sent'
  audienceCount: number
  sentCount?: number
  openedCount?: number
  clickedCount?: number
  repliedCount?: number
  dealsCount?: number
  messageTemplate: string
  createdAt: string
  sentAt?: string
}

export interface Estimation {
  id: string
  agentId: string
  contactId?: string
  contactName?: string
  propertyAddress: string
  estimatedPriceMin: number
  estimatedPriceMax: number
  recommendedPrice: number
  surface: number
  createdAt: string
}

// ============================================================
// LOGGED-IN AGENT
// ============================================================

export const CURRENT_AGENT: KeplerAgent = {
  id: 'agent1',
  email: 'thomas.moreau@immo-excellence.fr',
  fullName: 'Thomas Moreau',
  agencyName: 'Agence Immo Excellence Nancy',
  phone: '06 82 14 37 55',
  subscriptionPlan: 'Pro',
  createdAt: '2024-09-01',
}

// ============================================================
// CONTACTS
// ============================================================

export const CONTACTS: Contact[] = [
  {
    id: 'c1', agentId: 'agent1',
    fullName: 'Martin Dupont', initials: 'MD', avatarColor: '#EF4444',
    email: 'martin.dupont@gmail.com', phone: '06 12 34 56 78',
    type: 'buyer', status: 'hot', maturityScore: 92,
    budgetMin: 220000, budgetMax: 280000,
    targetArea: 'Nancy Centre, Haussman', propertyType: 'apartment',
    nbRoomsMin: 4, nbRoomsMax: 4,
    source: 'Salon de l\'immobilier 2024', notes: 'Cherche T4 urgence, femme enceinte 7 mois. Visite 4x ce matin.',
    lastInteractionAt: '2026-05-21T08:42:00', createdAt: '2024-11-15',
    aiInsight: 'Martin consulte des annonces T4 de manière intensive depuis 48h. Son budget est confirmé et sa situation familiale crée une urgence réelle. Probabilité de transaction dans les 30 jours : 87%.',
    lifeEvents: [
      { id: 'le1', contactId: 'c1', eventType: 'baby', detectedAt: '2026-04-10', source: 'Facebook', confidenceScore: 91 }
    ],
  },
  {
    id: 'c2', agentId: 'agent1',
    fullName: 'Sophie Laurent', initials: 'SL', avatarColor: '#C9A84C',
    email: 'sophie.laurent@free.fr', phone: '07 23 45 67 89',
    type: 'buyer', status: 'hot', maturityScore: 88,
    budgetMin: 160000, budgetMax: 220000,
    targetArea: 'Nancy, Vandoeuvre', propertyType: 'apartment',
    nbRoomsMin: 3, nbRoomsMax: 3,
    source: 'Recommandation', notes: 'Nouveau poste détecté LinkedIn. Augmentation salariale probable.',
    lastInteractionAt: '2026-05-18T14:20:00', createdAt: '2025-02-08',
    aiInsight: 'Changement de poste détecté sur LinkedIn (CapGemini Nancy → Directrice Projet). Ses revenus ont probablement augmenté. C\'est le moment idéal pour reprendre contact : elle va vouloir stabiliser sa situation résidentielle.',
    lifeEvents: [
      { id: 'le2', contactId: 'c2', eventType: 'new_job', detectedAt: '2026-05-16', source: 'LinkedIn', confidenceScore: 96 }
    ],
  },
  {
    id: 'c3', agentId: 'agent1',
    fullName: 'Pierre Fontaine', initials: 'PF', avatarColor: '#2D9B6F',
    email: 'p.fontaine@wanadoo.fr', phone: '06 34 56 78 90',
    type: 'seller', status: 'warm', maturityScore: 67,
    targetArea: 'Saint-Max', propertyType: 'house',
    source: 'Estimation en ligne', notes: 'Maison T5 héritée, partage en cours entre héritiers.',
    lastInteractionAt: '2026-05-07T10:00:00', createdAt: '2025-06-20',
    aiInsight: 'Contact vendeur avec une propriété héritée. Le processus successoral ralentit la décision. Score en hausse — les délais administratifs arrivent à terme.',
  },
  {
    id: 'c4', agentId: 'agent1',
    fullName: 'Amélie Chassagne', initials: 'AC', avatarColor: '#6366F1',
    email: 'amelie.chassagne@hotmail.fr', phone: '07 45 67 89 01',
    type: 'both', status: 'warm', maturityScore: 71,
    budgetMin: 175000, budgetMax: 240000,
    targetArea: 'Nancy Centre', propertyType: 'apartment',
    nbRoomsMin: 3, nbRoomsMax: 4,
    source: 'Site web', notes: '2 ans de recherche. Veut vendre son studio avant d\'acheter.',
    lastInteractionAt: '2026-04-29T16:30:00', createdAt: '2024-03-12',
    aiInsight: 'Amélie cherche depuis 24 mois — la durée longue indique une décision proche par nécessité. Son studio (estimé €120k) est un bon levier pour déclencher l\'achat.',
  },
  {
    id: 'c5', agentId: 'agent1',
    fullName: 'Jean-Pierre Boucher', initials: 'JB', avatarColor: '#94A3B8',
    email: 'jpboucher@orange.fr', phone: '06 56 78 90 12',
    type: 'buyer', status: 'cold', maturityScore: 23,
    budgetMin: 120000, budgetMax: 160000,
    targetArea: 'Metz', propertyType: 'apartment',
    nbRoomsMin: 2, nbRoomsMax: 2,
    source: 'Leboncoin', notes: 'Loue actuellement, pas encore décidé. Réponse tardive.',
    lastInteractionAt: '2025-11-03T09:00:00', createdAt: '2025-10-01',
    aiInsight: 'Contact peu engagé pour l\'instant. Son horizon d\'achat est flou. Un message de réactivation doux en juin pourrait le remettre en route.',
  },
  {
    id: 'c6', agentId: 'agent1',
    fullName: 'Nathalie Girard', initials: 'NG', avatarColor: '#F59E0B',
    email: 'nathalie.girard@gmail.com', phone: '06 67 89 01 23',
    type: 'seller', status: 'hot', maturityScore: 85,
    targetArea: 'Essey-lès-Nancy', propertyType: 'house',
    source: 'Recommandation', notes: 'Maison avec jardin 140m². Divorcée, décision à prendre rapidement.',
    lastInteractionAt: '2026-05-16T11:45:00', createdAt: '2025-12-10',
    aiInsight: 'Signal fort détecté : annonce sur Leboncoin (retirée après 3 jours). Nathalie teste le marché mais hésite sur le prix. C\'est le moment d\'intervenir avec une estimation solide.',
    lifeEvents: [
      { id: 'le3', contactId: 'c6', eventType: 'moved', detectedAt: '2026-05-15', source: 'Leboncoin', confidenceScore: 78 }
    ],
  },
  {
    id: 'c7', agentId: 'agent1',
    fullName: 'François Legrand', initials: 'FL', avatarColor: '#1B3A5C',
    email: 'francois.legrand@sfr.fr', phone: '07 78 90 12 34',
    type: 'buyer', status: 'warm', maturityScore: 58,
    budgetMin: 200000, budgetMax: 270000,
    targetArea: 'Nancy, Laxou', propertyType: 'apartment',
    nbRoomsMin: 3, nbRoomsMax: 4,
    source: 'Salon immobilier', notes: 'Préfère les biens avec cave et parking. Très sélectif.',
    lastInteractionAt: '2026-04-15T14:00:00', createdAt: '2025-04-22',
    aiInsight: 'François est sérieux mais exigeant. Son score grimpe régulièrement. Un bien T4 avec parking à Laxou serait un déclencheur immédiat.',
  },
  {
    id: 'c8', agentId: 'agent1',
    fullName: 'Isabelle Marchand', initials: 'IM', avatarColor: '#8B5CF6',
    email: 'i.marchand@yahoo.fr', phone: '06 89 01 23 45',
    type: 'buyer', status: 'cold', maturityScore: 31,
    budgetMin: 140000, budgetMax: 190000,
    targetArea: 'Nancy périphérie',
    source: 'Site web', notes: 'Premier achat. Beaucoup de questions sur le financement.',
    lastInteractionAt: '2026-01-20T10:30:00', createdAt: '2025-12-05',
    aiInsight: 'Primo-accédante hésitante. Un guide sur le prêt à taux zéro + un message personnel pourraient activer sa décision.',
  },
  {
    id: 'c9', agentId: 'agent1',
    fullName: 'Thomas Chevallier', initials: 'TC', avatarColor: '#0EA5E9',
    email: 'thomas.chevallier@free.fr', phone: '07 90 12 34 56',
    type: 'both', status: 'warm', maturityScore: 64,
    budgetMin: 230000, budgetMax: 310000,
    targetArea: 'Nancy Centre, Saint-Max', propertyType: 'house',
    nbRoomsMin: 4, nbRoomsMax: 5,
    source: 'Recommandation', notes: 'Mutation pro dans 6 mois. Vendeur ET acheteur. Double opportunité.',
    lastInteractionAt: '2026-05-02T15:00:00', createdAt: '2025-08-14',
    aiInsight: 'Double opportunité : vente + achat. La mutation pro confirme le calendrier. Priorisez ce contact — une seule transaction peut en déclencher deux.',
    lifeEvents: [
      { id: 'le4', contactId: 'c9', eventType: 'promotion', detectedAt: '2026-04-28', source: 'LinkedIn', confidenceScore: 85 }
    ],
  },
  {
    id: 'c10', agentId: 'agent1',
    fullName: 'Marie-Claire Durand', initials: 'MD', avatarColor: '#EC4899',
    email: 'mc.durand@gmail.com', phone: '06 01 23 45 67',
    type: 'seller', status: 'hot', maturityScore: 79,
    targetArea: 'Vandoeuvre-lès-Nancy', propertyType: 'house',
    source: 'Estimation en ligne', notes: 'Maison T4 Vandoeuvre. Divorce en cours, délai de 3 mois max.',
    lastInteractionAt: '2026-05-14T16:00:00', createdAt: '2026-01-30',
    aiInsight: 'Situation personnelle délicate (divorce) crée une urgence réelle. Le bien est estimé €230k–€260k. Marie-Claire a besoin de votre expertise pour une vente rapide.',
  },
  {
    id: 'c11', agentId: 'agent1',
    fullName: 'Benoît Renard', initials: 'BR', avatarColor: '#94A3B8',
    email: 'b.renard@orange.fr', phone: '07 12 34 56 78',
    type: 'buyer', status: 'cold', maturityScore: 18,
    budgetMin: 100000, budgetMax: 140000,
    targetArea: 'Metz',
    source: 'Leboncoin', notes: 'En location, pas de projet immédiat.',
    lastInteractionAt: '2025-09-10T09:00:00', createdAt: '2025-09-05',
    aiInsight: 'Contact dormant. Une campagne de réactivation de printemps avec des données marché locales pourrait susciter de l\'intérêt.',
  },
  {
    id: 'c12', agentId: 'agent1',
    fullName: 'Cécile Morvan', initials: 'CM', avatarColor: '#14B8A6',
    email: 'cecile.morvan@hotmail.fr', phone: '06 23 45 67 89',
    type: 'buyer', status: 'warm', maturityScore: 45,
    budgetMin: 155000, budgetMax: 210000,
    targetArea: 'Nancy, Maxéville', propertyType: 'apartment',
    nbRoomsMin: 3, nbRoomsMax: 3,
    source: 'Recommandation', notes: 'Attend que son conjoint soit muté à Nancy (fin 2026).',
    lastInteractionAt: '2026-03-18T14:30:00', createdAt: '2025-07-11',
    aiInsight: 'Projet conditionné à la mutation du conjoint. À relancer en septembre quand la décision RH sera connue.',
  },
  {
    id: 'c13', agentId: 'agent1',
    fullName: 'Alain Petit', initials: 'AP', avatarColor: '#94A3B8',
    email: 'alain.petit@wanadoo.fr', phone: '03 83 45 67 89',
    type: 'seller', status: 'cold', maturityScore: 27,
    targetArea: 'Laxou', propertyType: 'house',
    source: 'Estimation en ligne', notes: 'Propriétaire d\'un T4 à Laxou. Pas pressé de vendre.',
    lastInteractionAt: '2025-10-22T10:00:00', createdAt: '2025-10-20',
    aiInsight: 'Vendeur non-urgent. La baisse des taux en 2026 a augmenté la demande à Laxou — un bon argument pour le convaincre de mettre en vente maintenant.',
  },
  {
    id: 'c14', agentId: 'agent1',
    fullName: 'Sylvie Blanchard', initials: 'SB', avatarColor: '#EF4444',
    email: 'sylvie.blanchard@gmail.com', phone: '07 34 56 78 90',
    type: 'buyer', status: 'hot', maturityScore: 91,
    budgetMin: 240000, budgetMax: 320000,
    targetArea: 'Nancy Haussman, Centre Ville', propertyType: 'apartment',
    nbRoomsMin: 4, nbRoomsMax: 5,
    source: 'Recommandation', notes: 'Visite le site 8 fois/semaine. Très active sur SeLoger. Enfants au lycée Nancy Centre.',
    lastInteractionAt: '2026-05-20T19:15:00', createdAt: '2025-03-01',
    aiInsight: 'Signal d\'achat très fort : 8 sessions cette semaine sur Kepler et SeLoger. Sylvie a un budget solide et une contrainte scolaire (lycée Centre). À appeler en priorité absolue ce matin.',
  },
  {
    id: 'c15', agentId: 'agent1',
    fullName: 'Philippe Leconte', initials: 'PL', avatarColor: '#2D9B6F',
    email: 'philippe.leconte@free.fr', phone: '06 45 67 89 01',
    type: 'both', status: 'warm', maturityScore: 55,
    budgetMin: 180000, budgetMax: 250000,
    targetArea: 'Nancy, périphérie', propertyType: 'house',
    nbRoomsMin: 3, nbRoomsMax: 4,
    source: 'Salon immobilier', notes: 'Retraite dans 2 ans. Veut downsize sa maison actuelle.',
    lastInteractionAt: '2026-04-08T11:00:00', createdAt: '2025-05-19',
    aiInsight: 'Projet de retraite à 2 ans. Vendeur + acheteur simultané. À relancer au T3 2026 quand la date de retraite sera plus concrète.',
  },
  {
    id: 'c16', agentId: 'agent1',
    fullName: 'Christine Muller', initials: 'CM', avatarColor: '#2D9B6F',
    email: 'c.muller@gmail.com', phone: '07 56 78 90 12',
    type: 'seller', status: 'converted', maturityScore: 100,
    targetArea: 'Nancy Centre', propertyType: 'apartment',
    source: 'Recommandation', notes: 'Vente conclue en mars 2026. €187,500. Très satisfaite.',
    lastInteractionAt: '2026-03-28T15:00:00', createdAt: '2025-11-03',
    aiInsight: 'Client fidèle converti. A recommandé 2 contacts. À chouchouter pour des recommandations supplémentaires.',
  },
  {
    id: 'c17', agentId: 'agent1',
    fullName: 'Henri Bernard', initials: 'HB', avatarColor: '#94A3B8',
    email: 'henri.bernard@orange.fr', phone: '03 87 23 45 67',
    type: 'buyer', status: 'cold', maturityScore: 12,
    budgetMin: 80000, budgetMax: 120000,
    targetArea: 'Metz', propertyType: 'apartment',
    source: 'Site web', notes: 'Tout début de réflexion. Studio ou T2.',
    lastInteractionAt: '2025-05-14T09:00:00', createdAt: '2025-05-12',
    aiInsight: 'Contact très froid. À inclure dans une campagne de nurturing long terme avec du contenu éducatif sur l\'achat immobilier.',
  },
  {
    id: 'c18', agentId: 'agent1',
    fullName: 'Anne-Sophie Roux', initials: 'AR', avatarColor: '#F97316',
    email: 'as.roux@yahoo.fr', phone: '07 67 89 01 23',
    type: 'buyer', status: 'warm', maturityScore: 62,
    budgetMin: 165000, budgetMax: 225000,
    targetArea: 'Nancy', propertyType: 'apartment',
    nbRoomsMin: 3, nbRoomsMax: 3,
    source: 'LinkedIn', notes: 'Mutation vers Nancy. Cherche T3 proche gare.',
    lastInteractionAt: '2026-05-10T13:00:00', createdAt: '2026-03-22',
    aiInsight: 'Mutation professionnelle vers Nancy dans 2 mois. Délai court, budget confirmé. Contact très qualifié.',
    lifeEvents: [
      { id: 'le5', contactId: 'c18', eventType: 'new_job', detectedAt: '2026-03-20', source: 'LinkedIn', confidenceScore: 92 }
    ],
  },
  {
    id: 'c19', agentId: 'agent1',
    fullName: 'Julien Mathieu', initials: 'JM', avatarColor: '#EF4444',
    email: 'j.mathieu@gmail.com', phone: '06 78 90 12 34',
    type: 'buyer', status: 'hot', maturityScore: 87,
    budgetMin: 195000, budgetMax: 260000,
    targetArea: 'Nancy Centre, Haussman', propertyType: 'apartment',
    nbRoomsMin: 4, nbRoomsMax: 4,
    source: 'Recommandation', notes: 'Bébé attendu en août. T4 impératif, idéalement avant l\'été.',
    lastInteractionAt: '2026-04-30T16:00:00', createdAt: '2025-09-18',
    aiInsight: 'Urgence familiale : bébé en août. Julien DOIT trouver un T4 avant fin juin. Chaque semaine compte. Proposez-lui en priorité les T4 disponibles.',
    lifeEvents: [
      { id: 'le6', contactId: 'c19', eventType: 'baby', detectedAt: '2026-02-14', source: 'Facebook', confidenceScore: 88 }
    ],
  },
  {
    id: 'c20', agentId: 'agent1',
    fullName: 'Dominique Faure', initials: 'DF', avatarColor: '#8B5CF6',
    email: 'd.faure@free.fr', phone: '07 89 01 23 45',
    type: 'seller', status: 'warm', maturityScore: 48,
    targetArea: 'Nancy, Maxéville', propertyType: 'apartment',
    source: 'Site web', notes: 'Investisseur. Veut vendre un appartement locatif T2.',
    lastInteractionAt: '2026-03-05T10:00:00', createdAt: '2025-10-30',
    aiInsight: 'Investisseur rationnel. Sensible à la data : prix au m², tension locative, délai de vente moyen. Préparez un dossier marché solide pour le convaincre.',
  },
]

// ============================================================
// PROPERTIES
// ============================================================

export const PROPERTIES: Property[] = [
  {
    id: 'p1', agentId: 'agent1',
    title: 'Appartement T3 — Nancy Centre Cathédrale',
    address: '12 rue des Dominicains', city: 'Nancy',
    price: 185000, surface: 68, nbRooms: 3,
    type: 'apartment', status: 'available',
    description: 'Bel appartement T3 en plein cœur de Nancy, à 5 min de la place Stanislas. Parquet ancien, hauts plafonds, balcon. Cave et ascenseur.',
    createdAt: '2026-04-10', potentialBuyers: 5,
  },
  {
    id: 'p2', agentId: 'agent1',
    title: 'Maison T4 — Vandoeuvre-lès-Nancy',
    address: '8 allée des Chênes', city: 'Vandoeuvre-lès-Nancy',
    price: 245000, surface: 96, nbRooms: 4,
    type: 'house', status: 'available',
    description: 'Maison de ville rénovée, jardin 250m², garage double, cuisine équipée. Proche écoles et transports. Idéale famille.',
    createdAt: '2026-04-28', potentialBuyers: 4,
  },
  {
    id: 'p3', agentId: 'agent1',
    title: 'Appartement T2 — Metz Centre Gare',
    address: '45 avenue Foch', city: 'Metz',
    price: 139000, surface: 49, nbRooms: 2,
    type: 'apartment', status: 'available',
    description: 'T2 lumineux, 3ème étage avec ascenseur, vue dégagée. À 2 min de la gare TGV de Metz. Idéal investissement ou primo-accédant.',
    createdAt: '2026-05-01', potentialBuyers: 3,
  },
  {
    id: 'p4', agentId: 'agent1',
    title: 'Maison T5 — Saint-Max',
    address: '3 impasse des Peupliers', city: 'Saint-Max',
    price: 320000, surface: 128, nbRooms: 5,
    type: 'house', status: 'available',
    description: 'Grande maison familiale, salon 45m², 4 chambres, jardin 600m², pool house. Saint-Max, calme, 10 min Nancy.',
    createdAt: '2026-03-15', potentialBuyers: 2,
  },
  {
    id: 'p5', agentId: 'agent1',
    title: 'Appartement T4 — Nancy Haussman',
    address: '27 boulevard Haussman', city: 'Nancy',
    price: 265000, surface: 89, nbRooms: 4,
    type: 'apartment', status: 'available',
    description: 'Grand T4 haussmannien entièrement rénové, parquet massif, moulures, 2 salles de bain. Quartier prisé, proche lycées. Cave & parking.',
    createdAt: '2026-05-12', potentialBuyers: 6,
  },
  {
    id: 'p6', agentId: 'agent1',
    title: 'Maison T6 — Essey-lès-Nancy',
    address: '15 rue des Lilas', city: 'Essey-lès-Nancy',
    price: 380000, surface: 156, nbRooms: 6,
    type: 'house', status: 'under_offer',
    description: 'Somptueuse maison contemporaine, piscine, domotique, 5 chambres, garage 3 voitures. Essey-lès-Nancy, 8 min Nancy centre.',
    createdAt: '2026-02-20', potentialBuyers: 1,
  },
  {
    id: 'p7', agentId: 'agent1',
    title: 'Studio — Nancy Boudonville',
    address: '9 rue Boudonville', city: 'Nancy',
    price: 98000, surface: 33, nbRooms: 1,
    type: 'apartment', status: 'available',
    description: 'Studio lumineux, rez-de-chaussée surélevé, cuisine américaine. Quartier Boudonville calme. Idéal étudiant ou investisseur.',
    createdAt: '2026-05-18', potentialBuyers: 2,
  },
  {
    id: 'p8', agentId: 'agent1',
    title: 'Maison T4 — Laxou',
    address: '44 rue du Général Leclerc', city: 'Laxou',
    price: 215000, surface: 98, nbRooms: 4,
    type: 'house', status: 'sold',
    description: 'Maison T4 avec jardin 350m², garage, cave. Quartier résidentiel de Laxou. Vendue en 18 jours.',
    createdAt: '2026-01-10', potentialBuyers: 0,
  },
]

// ============================================================
// PROPERTY MATCHES
// ============================================================

export const PROPERTY_MATCHES: PropertyMatch[] = [
  { id: 'pm1', propertyId: 'p5', contactId: 'c1', matchScore: 94, messageDrafted: 'Bonjour Martin, j\'ai un T4 boulevard Haussman qui correspond exactement à votre recherche...' },
  { id: 'pm2', propertyId: 'p5', contactId: 'c14', matchScore: 91 },
  { id: 'pm3', propertyId: 'p5', contactId: 'c19', matchScore: 89 },
  { id: 'pm4', propertyId: 'p1', contactId: 'c2', matchScore: 82 },
  { id: 'pm5', propertyId: 'p1', contactId: 'c12', matchScore: 74 },
  { id: 'pm6', propertyId: 'p2', contactId: 'c9', matchScore: 88 },
  { id: 'pm7', propertyId: 'p2', contactId: 'c7', matchScore: 78 },
]

// ============================================================
// ALERTS
// ============================================================

export const ALERTS: KeplerAlert[] = [
  {
    id: 'a1', agentId: 'agent1', contactId: 'c1', contactName: 'Martin Dupont',
    type: 'hot_lead', priority: 'urgent',
    message: 'Martin Dupont a cliqué 4× sur des annonces T4 ce matin',
    subMessage: 'Il a consulté le bien boulevard Haussman 3 fois. Signal d\'achat fort. Femme enceinte 7 mois.',
    read: false, createdAt: '2026-05-21T08:42:00',
    actions: [{ label: 'Appeler', icon: 'Phone' }, { label: 'Voir profil', icon: 'User' }],
  },
  {
    id: 'a2', agentId: 'agent1', contactId: 'c14', contactName: 'Sylvie Blanchard',
    type: 'hot_lead', priority: 'urgent',
    message: 'Sylvie Blanchard a visité le site 8 fois cette semaine',
    subMessage: 'Comportement d\'achat actif. Budget confirmé €240k–€320k. À appeler en priorité.',
    read: false, createdAt: '2026-05-21T07:30:00',
    actions: [{ label: 'Appeler', icon: 'Phone' }, { label: 'Envoyer message', icon: 'MessageSquare' }],
  },
  {
    id: 'a3', agentId: 'agent1', contactId: 'c2', contactName: 'Sophie Laurent',
    type: 'life_event', priority: 'high',
    message: 'Sophie Laurent vient d\'accepter un nouveau poste (LinkedIn détecté)',
    subMessage: 'Promotion chez CapGemini Nancy. Revenus probablement en hausse. Moment idéal pour reprendre contact.',
    read: false, createdAt: '2026-05-20T18:00:00',
    actions: [{ label: 'Envoyer message', icon: 'MessageSquare' }, { label: 'Voir profil', icon: 'User' }],
  },
  {
    id: 'a4', agentId: 'agent1', contactId: 'c6', contactName: 'Nathalie Girard',
    type: 'life_event', priority: 'high',
    message: 'Nathalie Girard a posté une annonce sur Leboncoin (signal vendeur)',
    subMessage: 'Annonce retirée après 48h — elle teste probablement le marché. Parfait moment pour lui proposer votre service.',
    read: false, createdAt: '2026-05-19T09:15:00',
    actions: [{ label: 'Appeler', icon: 'Phone' }, { label: 'Générer estimation', icon: 'FileText' }],
  },
  {
    id: 'a5', agentId: 'agent1', contactId: 'c1', contactName: 'Martin Dupont',
    type: 'match_found', priority: 'high',
    message: 'Nouveau bien T4 bd. Haussman correspond à Martin Dupont (match 94%)',
    subMessage: 'Le T4 @265,000€ que vous venez de rentrer correspond exactement aux critères de Martin. Envoyez-lui maintenant.',
    read: false, createdAt: '2026-05-18T16:45:00',
    actions: [{ label: 'Envoyer présentation', icon: 'Send' }, { label: 'Voir le bien', icon: 'Home' }],
  },
  {
    id: 'a6', agentId: 'agent1', contactId: 'c19', contactName: 'Julien Mathieu',
    type: 'followup', priority: 'medium',
    message: 'Julien Mathieu n\'a pas eu de nouvelles depuis 3 semaines',
    subMessage: 'Bébé prévu en août — il a besoin d\'un T4 avant l\'été. 21 jours sans contact c\'est trop long.',
    read: false, createdAt: '2026-05-20T10:00:00',
    actions: [{ label: 'Envoyer message', icon: 'MessageSquare' }, { label: 'Appeler', icon: 'Phone' }],
  },
  {
    id: 'a7', agentId: 'agent1',
    type: 'followup', priority: 'medium',
    message: '8 contacts sans nouvelles depuis plus de 3 mois',
    subMessage: 'Jean-Pierre Boucher, Benoît Renard, Alain Petit et 5 autres. Campagne de réactivation suggérée.',
    read: false, createdAt: '2026-05-20T09:00:00',
    actions: [{ label: 'Créer campagne', icon: 'Megaphone' }, { label: 'Voir contacts', icon: 'Users' }],
  },
  {
    id: 'a8', agentId: 'agent1', contactId: 'c4', contactName: 'Amélie Chassagne',
    type: 'followup', priority: 'medium',
    message: 'Amélie Chassagne — 24 mois de recherche active',
    subMessage: 'Sa patience a des limites. Une longue période de recherche précède souvent une décision rapide. À relancer avec un bien ciblé.',
    read: true, createdAt: '2026-05-19T14:00:00',
    actions: [{ label: 'Voir profil', icon: 'User' }, { label: 'Envoyer message', icon: 'MessageSquare' }],
  },
  {
    id: 'a9', agentId: 'agent1',
    type: 'match_found', priority: 'low',
    message: 'Le studio Boudonville correspond à 2 acheteurs potentiels',
    subMessage: 'Henri Bernard et Benoît Renard ont des critères compatibles. Score de match : 71% et 68%.',
    read: true, createdAt: '2026-05-18T11:30:00',
    actions: [{ label: 'Voir les matches', icon: 'Target' }, { label: 'Envoyer présentation', icon: 'Send' }],
  },
  {
    id: 'a10', agentId: 'agent1',
    type: 'hot_lead', priority: 'low',
    message: 'Votre taux de réponse WhatsApp atteint 68% ce mois (+12 pts)',
    subMessage: 'Excellente performance. Le canal WhatsApp génère 3× plus de réponses que l\'email sur votre base.',
    read: true, createdAt: '2026-05-17T17:00:00',
    actions: [],
  },
]

// ============================================================
// CAMPAIGNS
// ============================================================

export const CAMPAIGNS: Campaign[] = [
  {
    id: 'camp1', agentId: 'agent1',
    name: 'Marché du printemps Nancy 2026',
    type: 'market', channel: 'email',
    status: 'sent',
    audienceCount: 45, sentCount: 45, openedCount: 31, clickedCount: 12, repliedCount: 4, dealsCount: 1,
    messageTemplate: 'Bonjour {{prénom}},\n\nLe marché immobilier nancéien continue sa hausse au T1 2026 : +3,2% sur les appartements, -1,8% sur les délais de vente. Nancy reste une des villes les plus dynamiques du Grand Est.\n\nVous m\'aviez confié votre projet {{type_projet}} dans le secteur {{zone}}. Le moment est particulièrement favorable pour...',
    createdAt: '2026-04-05', sentAt: '2026-04-07',
  },
  {
    id: 'camp2', agentId: 'agent1',
    name: 'Nouveau T4 boulevard Haussman',
    type: 'new_property', channel: 'whatsapp',
    status: 'sent',
    audienceCount: 8, sentCount: 8, openedCount: 7, clickedCount: 5, repliedCount: 2, dealsCount: 0,
    messageTemplate: 'Bonjour {{prénom}} 👋 Thomas Moreau - Immo Excellence Nancy.\n\nJe viens de rentrer un T4 boulevard Haussman qui correspond à votre recherche : 89m², parquet, 2SdB, cave + parking. €265,000.\n\nVisites ce week-end — dites-moi si vous êtes disponible ?',
    createdAt: '2026-05-13', sentAt: '2026-05-13',
  },
  {
    id: 'camp3', agentId: 'agent1',
    name: 'Prise de nouvelles été 2026',
    type: 'checkin', channel: 'email',
    status: 'draft',
    audienceCount: 23, messageTemplate: 'Bonjour {{prénom}},\n\nL\'été approche et je voulais prendre de vos nouvelles. Votre projet immobilier {{type_projet}} est-il toujours d\'actualité ?\n\nLe marché nancéien est particulièrement actif en ce moment et j\'ai quelques biens intéressants dans votre budget...',
    createdAt: '2026-05-19',
  },
]

// ============================================================
// INTERACTIONS (timeline per contact)
// ============================================================

export const INTERACTIONS: Interaction[] = [
  { id: 'i1', agentId: 'agent1', contactId: 'c1', type: 'call', notes: 'Budget confirmé €220k–€280k. Cherche T4 urgence, femme enceinte 7 mois. Très motivé.', outcome: 'Positif — envoyer sélection T4', createdAt: '2026-05-15T14:30:00' },
  { id: 'i2', agentId: 'agent1', contactId: 'c1', type: 'email', notes: 'Envoi mise à jour marché Q1 2026 + sélection T4 Nancy', outcome: 'Ouvert, 3 clics', createdAt: '2026-04-28T10:00:00' },
  { id: 'i3', agentId: 'agent1', contactId: 'c1', type: 'meeting', notes: 'Visite 2 T4 : rue des Brice (trop petit) et avenue de la Libération (trop bruyant)', outcome: 'Négatif — cherche toujours', createdAt: '2026-03-12T14:00:00' },
  { id: 'i4', agentId: 'agent1', contactId: 'c1', type: 'call', notes: 'Premier contact après salon immo. Projet T4 Nancy Centre.', outcome: 'Positif — à rappeler en mars', createdAt: '2025-12-05T11:00:00' },
  { id: 'i5', agentId: 'agent1', contactId: 'c2', type: 'whatsapp', notes: 'Message de réactivation — pas de réponse', outcome: 'Non répondu', createdAt: '2026-05-10T09:00:00' },
  { id: 'i6', agentId: 'agent1', contactId: 'c2', type: 'call', notes: 'Budget confirmé €160k–€220k. T3 Nancy ou Vandoeuvre. Pas pressée mais sérieuse.', outcome: 'Positif', createdAt: '2026-04-02T16:00:00' },
  { id: 'i7', agentId: 'agent1', contactId: 'c2', type: 'email', notes: 'Contact initial suite salon immobilier', outcome: 'Positif', createdAt: '2025-11-15T10:00:00' },
  { id: 'i8', agentId: 'agent1', contactId: 'c14', type: 'call', notes: 'Très intéressée par le T4 Haussman. Veut visiter.', outcome: 'RDV planifié samedi', createdAt: '2026-05-14T11:00:00' },
  { id: 'i9', agentId: 'agent1', contactId: 'c19', type: 'call', notes: 'Bébé en août, cherche T4 avant fin juin. Urgent.', outcome: 'Positif — envoyer T4 disponibles', createdAt: '2026-04-30T16:00:00' },
  { id: 'i10', agentId: 'agent1', contactId: 'c6', type: 'email', notes: 'Proposition d\'estimation gratuite pour sa maison', outcome: 'Ouvert, pas de réponse', createdAt: '2026-05-08T09:00:00' },
]

// ============================================================
// NURTURE MESSAGES
// ============================================================

export const NURTURE_MESSAGES: NurtureMessage[] = [
  { id: 'nm1', agentId: 'agent1', contactId: 'c1', channel: 'email', content: 'Bonjour Martin, voici la sélection de T4 correspondant à votre recherche...', status: 'clicked', sentAt: '2026-04-28T10:05:00', openedAt: '2026-04-28T12:30:00' },
  { id: 'nm2', agentId: 'agent1', contactId: 'c2', channel: 'whatsapp', content: 'Bonjour Sophie, Thomas Moreau - Immo Excellence. J\'ai un T3 lumineux à Vandoeuvre...', status: 'sent', sentAt: '2026-05-10T09:01:00' },
  { id: 'nm3', agentId: 'agent1', contactId: 'c14', channel: 'email', content: 'Bonjour Sylvie, le T4 bd. Haussman que vous avez consulté est toujours disponible...', status: 'replied', sentAt: '2026-05-13T16:00:00', openedAt: '2026-05-13T18:45:00' },
  { id: 'nm4', agentId: 'agent1', contactId: 'c19', channel: 'whatsapp', content: 'Bonjour Julien, 3 T4 disponibles ce mois — dont un à 2 min des écoles...', status: 'opened', sentAt: '2026-05-05T11:00:00', openedAt: '2026-05-05T11:42:00' },
  { id: 'nm5', agentId: 'agent1', contactId: 'c4', channel: 'email', content: 'Bonjour Amélie, le marché T3/T4 à Nancy Centre est très actif en ce moment...', status: 'opened', sentAt: '2026-04-20T09:00:00', openedAt: '2026-04-20T10:15:00' },
]

// ============================================================
// ESTIMATIONS
// ============================================================

export const ESTIMATIONS: Estimation[] = [
  {
    id: 'est1', agentId: 'agent1', contactId: 'c16', contactName: 'Christine Muller',
    propertyAddress: '18 rue des Tiercelins, Nancy', estimatedPriceMin: 175000, estimatedPriceMax: 195000, recommendedPrice: 187500,
    surface: 72, createdAt: '2026-02-10',
  },
  {
    id: 'est2', agentId: 'agent1', contactId: 'c10', contactName: 'Marie-Claire Durand',
    propertyAddress: '7 avenue Paul Muller, Vandoeuvre', estimatedPriceMin: 225000, estimatedPriceMax: 255000, recommendedPrice: 239000,
    surface: 95, createdAt: '2026-04-15',
  },
  {
    id: 'est3', agentId: 'agent1', contactId: 'c3', contactName: 'Pierre Fontaine',
    propertyAddress: '24 rue Victor Hugo, Saint-Max', estimatedPriceMin: 295000, estimatedPriceMax: 340000, recommendedPrice: 318000,
    surface: 128, createdAt: '2026-05-02',
  },
]

// ============================================================
// ANALYTICS DATA
// ============================================================

export const SCORE_DISTRIBUTION = [
  { range: '0–10', count: 2, color: '#94A3B8' },
  { range: '11–20', count: 1, color: '#94A3B8' },
  { range: '21–30', count: 2, color: '#94A3B8' },
  { range: '31–45', count: 3, color: '#F97316' },
  { range: '46–60', count: 4, color: '#F97316' },
  { range: '61–75', count: 4, color: '#F59E0B' },
  { range: '76–85', count: 2, color: '#F59E0B' },
  { range: '86–100', count: 4, color: '#2D9B6F' },
]

export const FUNNEL_DATA = [
  { stage: 'Froid', count: 5, color: '#94A3B8' },
  { stage: 'Tiède', count: 9, color: '#F59E0B' },
  { stage: 'Chaud', count: 5, color: '#EF4444' },
  { stage: 'Converti', count: 1, color: '#2D9B6F' },
]

export const MESSAGES_TIMELINE = [
  { date: '21 avr', envoyés: 12, ouverts: 8, répondus: 3 },
  { date: '28 avr', envoyés: 18, ouverts: 13, répondus: 4 },
  { date: '5 mai', envoyés: 22, ouverts: 16, répondus: 6 },
  { date: '12 mai', envoyés: 15, ouverts: 11, répondus: 3 },
  { date: '19 mai', envoyés: 28, ouverts: 21, répondus: 8 },
  { date: '21 mai', envoyés: 33, ouverts: 24, répondus: 9 },
]

export const CHANNEL_PERF = [
  { channel: 'WhatsApp', taux: 68, color: '#25D366' },
  { channel: 'Email', taux: 41, color: '#1B3A5C' },
  { channel: 'SMS', taux: 52, color: '#C9A84C' },
]

// ============================================================
// HELPERS
// ============================================================

export function getScoreColor(score: number): string {
  if (score <= 30)  return '#94A3B8'
  if (score <= 60)  return '#F97316'
  if (score <= 85)  return '#F59E0B'
  return '#2D9B6F'
}

export function getStatusLabel(status: ContactStatus): string {
  const map: Record<ContactStatus, string> = { cold: 'Froid', warm: 'Tiède', hot: 'Chaud', converted: 'Converti' }
  return map[status]
}

export function getTypeLabel(type: ContactType): string {
  const map: Record<ContactType, string> = { buyer: 'Acheteur', seller: 'Vendeur', both: 'Acheteur & Vendeur' }
  return map[type]
}

export function getPropertyTypeLabel(type: PropertyType): string {
  const map: Record<PropertyType, string> = { apartment: 'Appartement', house: 'Maison', commercial: 'Local commercial' }
  return map[type]
}

export function getPropertyStatusLabel(status: PropertyStatus): string {
  const map: Record<PropertyStatus, string> = { available: 'Disponible', under_offer: 'Sous offre', sold: 'Vendu' }
  return map[status]
}

export function getPriorityEmoji(priority: AlertPriority): string {
  const map: Record<AlertPriority, string> = { urgent: '🔴', high: '🟠', medium: '🟡', low: '🟢' }
  return map[priority]
}

export function getPriorityLabel(priority: AlertPriority): string {
  const map: Record<AlertPriority, string> = { urgent: 'URGENT', high: 'CHAUD', medium: 'TIÈDE', low: 'INFO' }
  return map[priority]
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price)
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMinutes = Math.floor(diffMs / (1000 * 60))

  if (diffMinutes < 60)  return `Il y a ${diffMinutes} min`
  if (diffHours < 24)    return `Il y a ${diffHours}h`
  if (diffDays === 1)    return 'Hier'
  if (diffDays < 7)      return `Il y a ${diffDays} jours`
  if (diffDays < 30)     return `Il y a ${Math.floor(diffDays / 7)} semaine${Math.floor(diffDays / 7) > 1 ? 's' : ''}`
  if (diffDays < 365)    return `Il y a ${Math.floor(diffDays / 30)} mois`
  return `Il y a ${Math.floor(diffDays / 365)} an${Math.floor(diffDays / 365) > 1 ? 's' : ''}`
}

export function getDaysSinceContact(dateStr: string): number {
  const date = new Date(dateStr)
  const now = new Date()
  return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
}

export function getLifeEventLabel(type: LifeEventType): string {
  const map: Record<LifeEventType, string> = {
    new_job: 'Nouveau poste',
    marriage: 'Mariage',
    baby: 'Naissance / Grossesse',
    moved: 'Déménagement',
    promotion: 'Promotion',
  }
  return map[type]
}

export function getLifeEventEmoji(type: LifeEventType): string {
  const map: Record<LifeEventType, string> = {
    new_job: '💼',
    marriage: '💍',
    baby: '👶',
    moved: '📦',
    promotion: '🚀',
  }
  return map[type]
}

export function getInteractionIcon(type: InteractionType): string {
  const map: Record<InteractionType, string> = { call: 'Phone', meeting: 'Users', email: 'Mail', whatsapp: 'MessageSquare' }
  return map[type]
}

export function getInteractionLabel(type: InteractionType): string {
  const map: Record<InteractionType, string> = { call: 'Appel', meeting: 'Rendez-vous', email: 'Email', whatsapp: 'WhatsApp' }
  return map[type]
}
