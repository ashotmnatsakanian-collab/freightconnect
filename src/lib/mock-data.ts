import type { SalonType } from "./store";

export interface Client {
  id: string;
  name: string;
  phone: string;
  lastVisit: string;
  nextVisit: string | null;
  status: "active" | "at_risk" | "lost";
  loyaltyTier: "Bronze" | "Silver" | "Gold" | "VIP";
  loyaltyPoints: number;
  averageSpend: number;
  visitCount: number;
  styleNote: string;
  avatar: string;
  daysOverdue: number;
}

export interface Appointment {
  id: string;
  clientName: string;
  clientAvatar: string;
  service: string;
  time: string;
  duration: number;
  price: number;
  status: "scheduled" | "confirmed" | "completed";
  styleNote: string;
  phone: string;
}

export interface WeekData {
  day: string;
  revenue: number;
  appointments: number;
}

const clientsFemme: Client[] = [
  {
    id: "c1",
    name: "Sophie Marchand",
    phone: "06 12 34 56 78",
    lastVisit: "2026-03-12",
    nextVisit: null,
    status: "at_risk",
    loyaltyTier: "Gold",
    loyaltyPoints: 420,
    averageSpend: 85,
    visitCount: 14,
    styleNote: "Balayage miel, coupe longue dégradée — très sensible aux produits chimiques",
    avatar: "SM",
    daysOverdue: 32,
  },
  {
    id: "c2",
    name: "Amira Benali",
    phone: "07 89 01 23 45",
    lastVisit: "2026-03-28",
    nextVisit: null,
    status: "at_risk",
    loyaltyTier: "Silver",
    loyaltyPoints: 210,
    averageSpend: 62,
    visitCount: 7,
    styleNote: "Coloration châtain profond, préfère sans ammoniaque — fringe bangs",
    avatar: "AB",
    daysOverdue: 18,
  },
  {
    id: "c3",
    name: "Léa Fontaine",
    phone: "06 55 44 33 22",
    lastVisit: "2026-02-10",
    nextVisit: null,
    status: "lost",
    loyaltyTier: "Bronze",
    loyaltyPoints: 80,
    averageSpend: 45,
    visitCount: 3,
    styleNote: "Ombré rose poudré, cheveux fins — technique mèches aluminium",
    avatar: "LF",
    daysOverdue: 58,
  },
];

const clientsHomme: Client[] = [
  {
    id: "c1",
    name: "Karim Hadj",
    phone: "06 11 22 33 44",
    lastVisit: "2026-04-18",
    nextVisit: null,
    status: "at_risk",
    loyaltyTier: "VIP",
    loyaltyPoints: 780,
    averageSpend: 35,
    visitCount: 28,
    styleNote: "Dégradé haut skin fade, barbe courte taillée au 2 — Produit: Layrite pomade",
    avatar: "KH",
    daysOverdue: 14,
  },
  {
    id: "c2",
    name: "Théo Rivière",
    phone: "07 66 77 88 99",
    lastVisit: "2026-04-10",
    nextVisit: null,
    status: "at_risk",
    loyaltyTier: "Gold",
    loyaltyPoints: 340,
    averageSpend: 28,
    visitCount: 15,
    styleNote: "Coupe classique côtés courts, dessus long texturé — barbe pleine entretenue",
    avatar: "TR",
    daysOverdue: 21,
  },
  {
    id: "c3",
    name: "Marcus Dubois",
    phone: "06 00 11 22 33",
    lastVisit: "2026-03-14",
    nextVisit: null,
    status: "lost",
    loyaltyTier: "Silver",
    loyaltyPoints: 120,
    averageSpend: 32,
    visitCount: 5,
    styleNote: "Afro fade, contours nets au rasoir — traitement hydratant",
    avatar: "MD",
    daysOverdue: 47,
  },
];

const clientsNail: Client[] = [
  {
    id: "c1",
    name: "Clara Petit",
    phone: "06 33 44 55 66",
    lastVisit: "2026-04-22",
    nextVisit: null,
    status: "at_risk",
    loyaltyTier: "VIP",
    loyaltyPoints: 560,
    averageSpend: 55,
    visitCount: 22,
    styleNote: "Gel nude avec nail art floral — forme amande, longueur medium",
    avatar: "CP",
    daysOverdue: 10,
  },
  {
    id: "c2",
    name: "Yasmine Ouali",
    phone: "07 22 33 44 55",
    lastVisit: "2026-04-08",
    nextVisit: null,
    status: "at_risk",
    loyaltyTier: "Gold",
    loyaltyPoints: 290,
    averageSpend: 48,
    visitCount: 11,
    styleNote: "Semi-permanent rouge bordeaux, forme carrée courte — ongles fragiles",
    avatar: "YO",
    daysOverdue: 24,
  },
  {
    id: "c3",
    name: "Julie Morin",
    phone: "06 77 88 99 00",
    lastVisit: "2026-03-19",
    nextVisit: null,
    status: "lost",
    loyaltyTier: "Bronze",
    loyaltyPoints: 60,
    averageSpend: 38,
    visitCount: 4,
    styleNote: "Manicure gel transparent, forma stiletto courte — préfère sans acetone",
    avatar: "JM",
    daysOverdue: 42,
  },
];

export const atRiskClients: Record<SalonType, Client[]> = {
  femme: clientsFemme,
  homme: clientsHomme,
  nail: clientsNail,
  mixte: clientsFemme,
};

const appointmentsFemme: Appointment[] = [
  {
    id: "a1",
    clientName: "Nadia Bensouda",
    clientAvatar: "NB",
    service: "Couleur + Mèches",
    time: "09:00",
    duration: 120,
    price: 110,
    status: "confirmed",
    styleNote: "Balayage caramel sur base châtain — formule habituelle T20 vol 30",
    phone: "06 14 25 36 47",
  },
  {
    id: "a2",
    clientName: "Isabelle Tournier",
    clientAvatar: "IT",
    service: "Coupe + Brushing",
    time: "11:00",
    duration: 60,
    price: 55,
    status: "confirmed",
    styleNote: "Coupe au carré, frange effilée — brushing naturel, volume à la racine",
    phone: "07 58 69 70 81",
  },
  {
    id: "a3",
    clientName: "Priya Sharma",
    clientAvatar: "PS",
    service: "Soin Kératine",
    time: "13:30",
    duration: 90,
    price: 95,
    status: "scheduled",
    styleNote: "Lissage kératine brésilienne — 2ème séance, résultats excellents",
    phone: "06 92 83 74 65",
  },
  {
    id: "a4",
    clientName: "Marie-Claire Dupont",
    clientAvatar: "MD",
    service: "Balayage",
    time: "15:30",
    duration: 105,
    price: 90,
    status: "scheduled",
    styleNote: "Balayage soleil californien, cheveux longs — ne veut pas de reflets orangés",
    phone: "07 46 57 68 79",
  },
  {
    id: "a5",
    clientName: "Fatou Diallo",
    clientAvatar: "FD",
    service: "Coiffage Événement",
    time: "17:00",
    duration: 75,
    price: 70,
    status: "scheduled",
    styleNote: "Chignon tressé semi-relevé — mariage samedi, test aujourd'hui",
    phone: "06 30 41 52 63",
  },
];

const appointmentsHomme: Appointment[] = [
  {
    id: "a1",
    clientName: "Samir Bouzid",
    clientAvatar: "SB",
    service: "Coupe + Barbe",
    time: "09:00",
    duration: 45,
    price: 35,
    status: "confirmed",
    styleNote: "Dégradé américain au 2 sur les côtés, dessus scissored — barbe au rasoir droit",
    phone: "06 10 20 30 40",
  },
  {
    id: "a2",
    clientName: "Antoine Leroy",
    clientAvatar: "AL",
    service: "Coupe",
    time: "10:00",
    duration: 30,
    price: 20,
    status: "confirmed",
    styleNote: "Coupe classique élégante, nuque courte — aucune machine sur le dessus",
    phone: "07 50 60 70 80",
  },
  {
    id: "a3",
    clientName: "Rayan Khaled",
    clientAvatar: "RK",
    service: "Skin Fade + Beard Design",
    time: "11:30",
    duration: 60,
    price: 42,
    status: "confirmed",
    styleNote: "Skin fade à zéro, dégradé progressif — beard design arrondi, contours précis",
    phone: "06 90 80 70 60",
  },
  {
    id: "a4",
    clientName: "Pierre-Henri Morel",
    clientAvatar: "PM",
    service: "Coupe + Taille Barbe",
    time: "14:00",
    duration: 45,
    price: 32,
    status: "scheduled",
    styleNote: "Undercut texturé, long sur le dessus — barbe pleine au 4, arrondis naturels",
    phone: "07 40 30 20 10",
  },
  {
    id: "a5",
    clientName: "Yassine Farouq",
    clientAvatar: "YF",
    service: "Rasage Traditionnel",
    time: "16:00",
    duration: 35,
    price: 28,
    status: "scheduled",
    styleNote: "Rasage complet au coupe-chou — serviettes chaudes, baume après-rasage Baxter",
    phone: "06 20 30 40 50",
  },
];

const appointmentsNail: Appointment[] = [
  {
    id: "a1",
    clientName: "Emma Rousseau",
    clientAvatar: "ER",
    service: "Pose Gel Complet",
    time: "09:30",
    duration: 90,
    price: 65,
    status: "confirmed",
    styleNote: "Extension gel, forme ballerine — nail art géométrique noir & or",
    phone: "06 13 24 35 46",
  },
  {
    id: "a2",
    clientName: "Anaïs Bertrand",
    clientAvatar: "AB",
    service: "Semi-Permanent",
    time: "11:30",
    duration: 60,
    price: 42,
    status: "confirmed",
    styleNote: "Semi-perma rose nude, forma ovale courte — extra shine top coat",
    phone: "07 57 68 79 90",
  },
  {
    id: "a3",
    clientName: "Samira Touati",
    clientAvatar: "ST",
    service: "Manucure Classique",
    time: "13:00",
    duration: 45,
    price: 30,
    status: "scheduled",
    styleNote: "Manucure + vernis rouge cerise — lime fine, aucun soin acrylique",
    phone: "06 91 82 73 64",
  },
  {
    id: "a4",
    clientName: "Noémie Garnier",
    clientAvatar: "NG",
    service: "Nail Art Élaboré",
    time: "15:00",
    duration: 120,
    price: 85,
    status: "scheduled",
    styleNote: "Fleurs 3D et strass, couleur pastel printemps — forma coffin longue",
    phone: "07 45 56 67 78",
  },
  {
    id: "a5",
    clientName: "Chloé Vidal",
    clientAvatar: "CV",
    service: "Remplissage Gel",
    time: "17:00",
    duration: 75,
    price: 50,
    status: "scheduled",
    styleNote: "Remplissage toutes les 3 semaines — French manucure inversée blanc/nude",
    phone: "06 34 45 56 67",
  },
];

export const todayAppointments: Record<SalonType, Appointment[]> = {
  femme: appointmentsFemme,
  homme: appointmentsHomme,
  nail: appointmentsNail,
  mixte: appointmentsFemme,
};

const weekRevenueFemme: WeekData[] = [
  { day: "Lun", revenue: 480, appointments: 6 },
  { day: "Mar", revenue: 620, appointments: 8 },
  { day: "Mer", revenue: 390, appointments: 5 },
  { day: "Jeu", revenue: 710, appointments: 9 },
  { day: "Ven", revenue: 890, appointments: 11 },
  { day: "Sam", revenue: 1240, appointments: 14 },
  { day: "Dim", revenue: 0, appointments: 0 },
];

const weekRevenueHomme: WeekData[] = [
  { day: "Lun", revenue: 280, appointments: 9 },
  { day: "Mar", revenue: 350, appointments: 11 },
  { day: "Mer", revenue: 420, appointments: 13 },
  { day: "Jeu", revenue: 380, appointments: 12 },
  { day: "Ven", revenue: 510, appointments: 16 },
  { day: "Sam", revenue: 720, appointments: 22 },
  { day: "Dim", revenue: 0, appointments: 0 },
];

const weekRevenueNail: WeekData[] = [
  { day: "Lun", revenue: 320, appointments: 6 },
  { day: "Mar", revenue: 410, appointments: 8 },
  { day: "Mer", revenue: 480, appointments: 9 },
  { day: "Jeu", revenue: 520, appointments: 10 },
  { day: "Ven", revenue: 680, appointments: 12 },
  { day: "Sam", revenue: 950, appointments: 16 },
  { day: "Dim", revenue: 0, appointments: 0 },
];

export const weekRevenue: Record<SalonType, WeekData[]> = {
  femme: weekRevenueFemme,
  homme: weekRevenueHomme,
  nail: weekRevenueNail,
  mixte: weekRevenueFemme,
};

export interface DashboardStats {
  appointmentsToday: number;
  revenueWeek: number;
  noShowRate: number;
  avgLifetimeValue: number;
  newClientsPercent: number;
  googleScore: number;
  clientsAtRisk: number;
}

export const dashboardStats: Record<SalonType, DashboardStats> = {
  femme: {
    appointmentsToday: 5,
    revenueWeek: 4330,
    noShowRate: 8,
    avgLifetimeValue: 740,
    newClientsPercent: 23,
    googleScore: 4.8,
    clientsAtRisk: 3,
  },
  homme: {
    appointmentsToday: 5,
    revenueWeek: 2660,
    noShowRate: 12,
    avgLifetimeValue: 420,
    newClientsPercent: 35,
    googleScore: 4.9,
    clientsAtRisk: 3,
  },
  nail: {
    appointmentsToday: 5,
    revenueWeek: 3360,
    noShowRate: 6,
    avgLifetimeValue: 580,
    newClientsPercent: 28,
    googleScore: 4.7,
    clientsAtRisk: 3,
  },
  mixte: {
    appointmentsToday: 5,
    revenueWeek: 4330,
    noShowRate: 8,
    avgLifetimeValue: 740,
    newClientsPercent: 23,
    googleScore: 4.8,
    clientsAtRisk: 3,
  },
};
