import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";
import path from "path";

const dbPath = path.resolve(process.cwd(), "dev.db");
const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

async function main() {
  console.log("Seeding database...");

  // Companies
  const company1 = await prisma.company.upsert({
    where: { siret: "12345678901234" },
    update: {},
    create: {
      name: "Transports Dupont & Fils",
      siret: "12345678901234",
      address: "15 rue des Camionneurs",
      city: "Lyon",
      phone: "04 72 00 11 22",
      email: "contact@dupont-transport.fr",
    },
  });

  const company2 = await prisma.company.upsert({
    where: { siret: "98765432109876" },
    update: {},
    create: {
      name: "Euroroute Logistique",
      siret: "98765432109876",
      address: "8 avenue du Port",
      city: "Marseille",
      phone: "04 91 00 33 44",
      email: "info@euroroute-log.fr",
    },
  });

  const company3 = await prisma.company.upsert({
    where: { siret: "55544433322211" },
    update: {},
    create: {
      name: "Nord Express Transport",
      siret: "55544433322211",
      address: "42 boulevard Industriel",
      city: "Lille",
      phone: "03 20 00 55 66",
      email: "contact@nord-express.fr",
    },
  });

  const hash = await bcrypt.hash("Transport2024!", 10);

  // Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@transport-saas.fr" },
    update: {},
    create: {
      email: "admin@transport-saas.fr",
      password: hash,
      firstName: "Super",
      lastName: "Admin",
      role: "admin",
    },
  });

  // Dispatchers
  const dispatcher1 = await prisma.user.upsert({
    where: { email: "dispatcher@dupont-transport.fr" },
    update: {},
    create: {
      email: "dispatcher@dupont-transport.fr",
      password: hash,
      firstName: "Marie",
      lastName: "Martin",
      phone: "06 10 20 30 40",
      role: "dispatcher",
      companyId: company1.id,
    },
  });

  const dispatcher2 = await prisma.user.upsert({
    where: { email: "dispatcher@euroroute-log.fr" },
    update: {},
    create: {
      email: "dispatcher@euroroute-log.fr",
      password: hash,
      firstName: "Pierre",
      lastName: "Dubois",
      phone: "06 50 60 70 80",
      role: "dispatcher",
      companyId: company2.id,
    },
  });

  const _dispatcher3 = await prisma.user.upsert({
    where: { email: "dispatcher@nord-express.fr" },
    update: {},
    create: {
      email: "dispatcher@nord-express.fr",
      password: hash,
      firstName: "Sophie",
      lastName: "Bernard",
      phone: "06 90 80 70 60",
      role: "dispatcher",
      companyId: company3.id,
    },
  });

  // Drivers — Company 1
  const drivers1 = await Promise.all([
    prisma.user.upsert({
      where: { email: "jean.dupont@dupont-transport.fr" },
      update: {},
      create: {
        email: "jean.dupont@dupont-transport.fr",
        password: hash,
        firstName: "Jean",
        lastName: "Dupont",
        phone: "06 11 22 33 44",
        role: "driver",
        companyId: company1.id,
      },
    }),
    prisma.user.upsert({
      where: { email: "marc.leroy@dupont-transport.fr" },
      update: {},
      create: {
        email: "marc.leroy@dupont-transport.fr",
        password: hash,
        firstName: "Marc",
        lastName: "Leroy",
        phone: "06 22 33 44 55",
        role: "driver",
        companyId: company1.id,
      },
    }),
    prisma.user.upsert({
      where: { email: "thomas.moreau@dupont-transport.fr" },
      update: {},
      create: {
        email: "thomas.moreau@dupont-transport.fr",
        password: hash,
        firstName: "Thomas",
        lastName: "Moreau",
        phone: "06 33 44 55 66",
        role: "driver",
        companyId: company1.id,
      },
    }),
  ]);

  // Drivers — Company 2
  const drivers2 = await Promise.all([
    prisma.user.upsert({
      where: { email: "paul.garcia@euroroute-log.fr" },
      update: {},
      create: {
        email: "paul.garcia@euroroute-log.fr",
        password: hash,
        firstName: "Paul",
        lastName: "Garcia",
        phone: "06 44 55 66 77",
        role: "driver",
        companyId: company2.id,
      },
    }),
    prisma.user.upsert({
      where: { email: "lucas.simon@euroroute-log.fr" },
      update: {},
      create: {
        email: "lucas.simon@euroroute-log.fr",
        password: hash,
        firstName: "Lucas",
        lastName: "Simon",
        phone: "06 55 66 77 88",
        role: "driver",
        companyId: company2.id,
      },
    }),
    prisma.user.upsert({
      where: { email: "antoine.michel@euroroute-log.fr" },
      update: {},
      create: {
        email: "antoine.michel@euroroute-log.fr",
        password: hash,
        firstName: "Antoine",
        lastName: "Michel",
        phone: "06 66 77 88 99",
        role: "driver",
        companyId: company2.id,
      },
    }),
  ]);

  // Drivers — Company 3
  const drivers3 = await Promise.all([
    prisma.user.upsert({
      where: { email: "nicolas.petit@nord-express.fr" },
      update: {},
      create: {
        email: "nicolas.petit@nord-express.fr",
        password: hash,
        firstName: "Nicolas",
        lastName: "Petit",
        phone: "06 77 88 99 00",
        role: "driver",
        companyId: company3.id,
      },
    }),
    prisma.user.upsert({
      where: { email: "kevin.roux@nord-express.fr" },
      update: {},
      create: {
        email: "kevin.roux@nord-express.fr",
        password: hash,
        firstName: "Kevin",
        lastName: "Roux",
        phone: "06 88 99 00 11",
        role: "driver",
        companyId: company3.id,
      },
    }),
    prisma.user.upsert({
      where: { email: "alexis.blanc@nord-express.fr" },
      update: {},
      create: {
        email: "alexis.blanc@nord-express.fr",
        password: hash,
        firstName: "Alexis",
        lastName: "Blanc",
        phone: "06 99 00 11 22",
        role: "driver",
        companyId: company3.id,
      },
    }),
    prisma.user.upsert({
      where: { email: "julien.henry@nord-express.fr" },
      update: {},
      create: {
        email: "julien.henry@nord-express.fr",
        password: hash,
        firstName: "Julien",
        lastName: "Henry",
        phone: "06 00 11 22 33",
        role: "driver",
        companyId: company3.id,
      },
    }),
  ]);

  const now = new Date();
  const day = (n: number) => new Date(now.getTime() + n * 86400000);

  // Missions — 20 total
  const missionDefs = [
    // Company 1
    { ref: "MIS-001", companyId: company1.id, driverId: drivers1[0].id, status: "delivered", lCity: "Lyon", dCity: "Paris", goods: "Électronique", w: 5.2, v: 12, price: 850, loadD: day(-5), delivD: day(-4), loConf: day(-5), inRoute: day(-5), arrived: day(-4), delivered: day(-4) },
    { ref: "MIS-002", companyId: company1.id, driverId: drivers1[1].id, status: "in_progress", lCity: "Grenoble", dCity: "Bordeaux", goods: "Agroalimentaire", w: 18, v: 45, price: 1200, loadD: day(-1), delivD: day(1), loConf: day(-1), inRoute: day(-1), arrived: null, delivered: null },
    { ref: "MIS-003", companyId: company1.id, driverId: drivers1[2].id, status: "planned", lCity: "Lyon", dCity: "Strasbourg", goods: "Textile", w: 8, v: 22, price: 720, loadD: day(2), delivD: day(3), loConf: null, inRoute: null, arrived: null, delivered: null },
    { ref: "MIS-004", companyId: company1.id, driverId: drivers1[0].id, status: "planned", lCity: "Clermont-Ferrand", dCity: "Nantes", goods: "Matériaux BTP", w: 24, v: 60, price: 1450, loadD: day(4), delivD: day(5), loConf: null, inRoute: null, arrived: null, delivered: null },
    { ref: "MIS-005", companyId: company1.id, driverId: null, status: "planned", lCity: "Mâcon", dCity: "Nice", goods: "Produits chimiques", w: 12, v: 30, price: 980, loadD: day(6), delivD: day(8), loConf: null, inRoute: null, arrived: null, delivered: null },
    { ref: "MIS-006", companyId: company1.id, driverId: drivers1[1].id, status: "cancelled", lCity: "Lyon", dCity: "Toulouse", goods: "Mobilier", w: 6, v: 18, price: 650, loadD: day(-3), delivD: day(-2), loConf: null, inRoute: null, arrived: null, delivered: null },
    { ref: "MIS-007", companyId: company1.id, driverId: drivers1[2].id, status: "delivered", lCity: "Dijon", dCity: "Paris", goods: "Vins et spiritueux", w: 10, v: 15, price: 780, loadD: day(-8), delivD: day(-7), loConf: day(-8), inRoute: day(-8), arrived: day(-7), delivered: day(-7) },
    // Company 2
    { ref: "MIS-008", companyId: company2.id, driverId: drivers2[0].id, status: "in_progress", lCity: "Marseille", dCity: "Lyon", goods: "Fruits et légumes", w: 20, v: 55, price: 620, loadD: day(-1), delivD: day(0), loConf: day(-1), inRoute: day(-1), arrived: null, delivered: null },
    { ref: "MIS-009", companyId: company2.id, driverId: drivers2[1].id, status: "planned", lCity: "Montpellier", dCity: "Bordeaux", goods: "Matériel médical", w: 3, v: 8, price: 890, loadD: day(2), delivD: day(3), loConf: null, inRoute: null, arrived: null, delivered: null },
    { ref: "MIS-010", companyId: company2.id, driverId: drivers2[2].id, status: "planned", lCity: "Nice", dCity: "Paris", goods: "Automobile pièces", w: 15, v: 35, price: 1350, loadD: day(3), delivD: day(4), loConf: null, inRoute: null, arrived: null, delivered: null },
    { ref: "MIS-011", companyId: company2.id, driverId: drivers2[0].id, status: "delivered", lCity: "Toulon", dCity: "Marseille", goods: "Produits de la mer", w: 8, v: 20, price: 320, loadD: day(-10), delivD: day(-10), loConf: day(-10), inRoute: day(-10), arrived: day(-10), delivered: day(-10) },
    { ref: "MIS-012", companyId: company2.id, driverId: null, status: "planned", lCity: "Avignon", dCity: "Strasbourg", goods: "Céréales", w: 22, v: 58, price: 1100, loadD: day(7), delivD: day(9), loConf: null, inRoute: null, arrived: null, delivered: null },
    { ref: "MIS-013", companyId: company2.id, driverId: drivers2[1].id, status: "delivered", lCity: "Marseille", dCity: "Paris", goods: "Cosmétiques", w: 4, v: 10, price: 950, loadD: day(-6), delivD: day(-5), loConf: day(-6), inRoute: day(-6), arrived: day(-5), delivered: day(-5) },
    // Company 3
    { ref: "MIS-014", companyId: company3.id, driverId: drivers3[0].id, status: "in_progress", lCity: "Lille", dCity: "Paris", goods: "Textile habillement", w: 7, v: 20, price: 480, loadD: day(-1), delivD: day(0), loConf: day(-1), inRoute: day(-1), arrived: null, delivered: null },
    { ref: "MIS-015", companyId: company3.id, driverId: drivers3[1].id, status: "planned", lCity: "Amiens", dCity: "Lyon", goods: "Pièces industrielles", w: 16, v: 40, price: 870, loadD: day(2), delivD: day(3), loConf: null, inRoute: null, arrived: null, delivered: null },
    { ref: "MIS-016", companyId: company3.id, driverId: drivers3[2].id, status: "planned", lCity: "Reims", dCity: "Bordeaux", goods: "Champagne", w: 9, v: 18, price: 760, loadD: day(4), delivD: day(5), loConf: null, inRoute: null, arrived: null, delivered: null },
    { ref: "MIS-017", companyId: company3.id, driverId: drivers3[3].id, status: "delivered", lCity: "Roubaix", dCity: "Marseille", goods: "Matière première", w: 25, v: 65, price: 1600, loadD: day(-12), delivD: day(-10), loConf: day(-12), inRoute: day(-12), arrived: day(-10), delivered: day(-10) },
    { ref: "MIS-018", companyId: company3.id, driverId: null, status: "planned", lCity: "Dunkerque", dCity: "Paris", goods: "Conteneur import", w: 28, v: 75, price: 580, loadD: day(5), delivD: day(6), loConf: null, inRoute: null, arrived: null, delivered: null },
    { ref: "MIS-019", companyId: company3.id, driverId: drivers3[0].id, status: "delivered", lCity: "Lens", dCity: "Nantes", goods: "Équipements sportifs", w: 5, v: 14, price: 690, loadD: day(-4), delivD: day(-3), loConf: day(-4), inRoute: day(-4), arrived: day(-3), delivered: day(-3) },
    { ref: "MIS-020", companyId: company3.id, driverId: drivers3[2].id, status: "planned", lCity: "Valenciennes", dCity: "Toulouse", goods: "Machines-outils", w: 19, v: 50, price: 1250, loadD: day(8), delivD: day(10), loConf: null, inRoute: null, arrived: null, delivered: null },
  ];

  for (const m of missionDefs) {
    await prisma.mission.upsert({
      where: { reference: m.ref },
      update: {},
      create: {
        reference: m.ref,
        companyId: m.companyId,
        driverId: m.driverId,
        status: m.status,
        loadingAddress: `15 rue de la Gare`,
        loadingCity: m.lCity,
        loadingDate: m.loadD,
        deliveryAddress: `8 avenue du Commerce`,
        deliveryCity: m.dCity,
        deliveryDate: m.delivD,
        goodsType: m.goods,
        weight: m.w,
        volume: m.v,
        price: m.price,
        priceUnit: "trip",
        loadingConfirmedAt: m.loConf,
        inRouteAt: m.inRoute,
        arrivedAt: m.arrived,
        deliveredAt: m.delivered,
      },
    });
  }

  // Availabilities — 15
  const availDefs = [
    { userId: drivers1[0].id, companyId: company1.id, depCity: "Lyon", depReg: "Auvergne-Rhône-Alpes", arrCity: null, anyDest: true, from: day(5), to: day(7), vtype: "bache", cap: 25, vol: 65, price: 1.8, pUnit: "km" },
    { userId: drivers1[1].id, companyId: company1.id, depCity: "Bordeaux", depReg: "Nouvelle-Aquitaine", arrCity: "Paris", anyDest: false, from: day(2), to: day(3), vtype: "frigo", cap: 18, vol: 45, price: 2.2, pUnit: "km" },
    { userId: drivers1[2].id, companyId: company1.id, depCity: "Strasbourg", depReg: "Grand-Est", arrCity: "Lyon", anyDest: false, from: day(4), to: day(5), vtype: "plateau", cap: 20, vol: 55, price: 950, pUnit: "trip" },
    { userId: drivers2[0].id, companyId: company2.id, depCity: "Marseille", depReg: "PACA", arrCity: null, anyDest: true, from: day(1), to: day(3), vtype: "citerne", cap: 30, vol: null, price: 1.5, pUnit: "km" },
    { userId: drivers2[1].id, companyId: company2.id, depCity: "Nice", depReg: "PACA", arrCity: "Paris", anyDest: false, from: day(3), to: day(4), vtype: "bache", cap: 22, vol: 58, price: 1380, pUnit: "trip" },
    { userId: drivers2[2].id, companyId: company2.id, depCity: "Toulon", depReg: "PACA", arrCity: null, anyDest: true, from: day(6), to: day(8), vtype: "frigo", cap: 15, vol: 38, price: 2.0, pUnit: "km" },
    { userId: drivers3[0].id, companyId: company3.id, depCity: "Lille", depReg: "Hauts-de-France", arrCity: "Paris", anyDest: false, from: day(1), to: day(2), vtype: "fourgon", cap: 8, vol: 20, price: 450, pUnit: "trip" },
    { userId: drivers3[1].id, companyId: company3.id, depCity: "Amiens", depReg: "Hauts-de-France", arrCity: null, anyDest: true, from: day(4), to: day(6), vtype: "bache", cap: 24, vol: 62, price: 1.7, pUnit: "km" },
    { userId: drivers3[2].id, companyId: company3.id, depCity: "Reims", depReg: "Grand-Est", arrCity: "Bordeaux", anyDest: false, from: day(3), to: day(5), vtype: "mega", cap: 28, vol: 80, price: 1650, pUnit: "trip" },
    { userId: drivers3[3].id, companyId: company3.id, depCity: "Valenciennes", depReg: "Hauts-de-France", arrCity: null, anyDest: true, from: day(2), to: day(4), vtype: "plateau", cap: 20, vol: 50, price: 1.6, pUnit: "km" },
    { userId: drivers1[0].id, companyId: company1.id, depCity: "Paris", depReg: "Île-de-France", arrCity: "Lyon", anyDest: false, from: day(10), to: day(11), vtype: "bache", cap: 25, vol: 65, price: 820, pUnit: "trip" },
    { userId: drivers2[0].id, companyId: company2.id, depCity: "Lyon", depReg: "Auvergne-Rhône-Alpes", arrCity: null, anyDest: true, from: day(8), to: day(10), vtype: "citerne", cap: 30, vol: null, price: 1.4, pUnit: "km" },
    { userId: drivers3[1].id, companyId: company3.id, depCity: "Nantes", depReg: "Pays de la Loire", arrCity: "Lille", anyDest: false, from: day(5), to: day(7), vtype: "frigo", cap: 16, vol: 40, price: 1100, pUnit: "trip" },
    { userId: drivers1[2].id, companyId: company1.id, depCity: "Toulouse", depReg: "Occitanie", arrCity: null, anyDest: true, from: day(7), to: day(9), vtype: "bache", cap: 22, vol: 58, price: 1.9, pUnit: "km" },
    { userId: drivers2[2].id, companyId: company2.id, depCity: "Bordeaux", depReg: "Nouvelle-Aquitaine", arrCity: "Marseille", anyDest: false, from: day(9), to: day(11), vtype: "frigo", cap: 18, vol: 45, price: 1250, pUnit: "trip" },
  ];

  for (let i = 0; i < availDefs.length; i++) {
    const a = availDefs[i];
    const existing = await prisma.availability.findFirst({
      where: { userId: a.userId, availableFrom: a.from },
    });
    if (!existing) {
      await prisma.availability.create({
        data: {
          userId: a.userId,
          companyId: a.companyId,
          departureCity: a.depCity,
          departureRegion: a.depReg,
          arrivalCity: a.arrCity,
          anyDestination: a.anyDest,
          availableFrom: a.from,
          availableTo: a.to,
          vehicleType: a.vtype,
          capacity: a.cap,
          volume: a.vol,
          price: a.price,
          priceUnit: a.pUnit,
          status: "active",
        },
      });
    }
  }

  // Positions for active drivers
  const positions = [
    { userId: drivers1[1].id, latitude: 45.748, longitude: 3.081, city: "Clermont-Ferrand" },
    { userId: drivers2[0].id, latitude: 43.604, longitude: 1.444, city: "Toulouse" },
    { userId: drivers3[0].id, latitude: 48.856, longitude: 2.352, city: "Paris" },
    { userId: drivers3[1].id, latitude: 47.218, longitude: -1.553, city: "Nantes" },
  ];

  for (const p of positions) {
    await prisma.driverPosition.create({ data: p });
  }

  console.log("✅ Seed completed!");
  console.log("\n🔑 Comptes de test:");
  console.log("  Admin:      admin@transport-saas.fr / Transport2024!");
  console.log("  Dispatcher: dispatcher@dupont-transport.fr / Transport2024!");
  console.log("  Chauffeur:  jean.dupont@dupont-transport.fr / Transport2024!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
