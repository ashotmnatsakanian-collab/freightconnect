import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, isResponse } from "@/lib/middleware";

function normalize(city: string): string {
  return city.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").split(/[\s-]/)[0];
}

function matchScore(availDepCity: string, missions: { deliveryCity: string; status: string }[]): { score: number; matchedDriver: string | null } {
  const dep = normalize(availDepCity);
  for (const m of missions) {
    if (m.status === "in_progress" || m.status === "planned") {
      if (normalize(m.deliveryCity) === dep) {
        return { score: 100, matchedDriver: m.deliveryCity };
      }
    }
  }
  return { score: 0, matchedDriver: null };
}

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if (isResponse(auth)) return auth;

  const { searchParams } = new URL(req.url);
  const departureCity = searchParams.get("departureCity");
  const arrivalCity = searchParams.get("arrivalCity");
  const vehicleType = searchParams.get("vehicleType");
  const dateFrom = searchParams.get("dateFrom");
  const maxPrice = searchParams.get("maxPrice");
  const myOnly = searchParams.get("myOnly") === "true";

  const where: Record<string, unknown> = { status: "active" };

  if (myOnly) {
    where.userId = auth.userId;
  }

  if (departureCity) {
    where.departureCity = { contains: departureCity };
  }
  if (arrivalCity) {
    where.arrivalCity = { contains: arrivalCity };
  }
  if (vehicleType) where.vehicleType = vehicleType;
  if (dateFrom) where.availableFrom = { gte: new Date(dateFrom) };
  if (maxPrice) where.price = { lte: parseFloat(maxPrice) };

  const [availabilities, myMissions] = await Promise.all([
    prisma.availability.findMany({
      where,
      include: {
        user: { select: { id: true, firstName: true, lastName: true, phone: true } },
        company: { select: { id: true, name: true } },
        freightRequests: {
          where: { senderId: auth.userId },
          select: { id: true, status: true },
        },
      },
      orderBy: { availableFrom: "asc" },
    }),
    // Fetch missions for match scoring
    prisma.mission.findMany({
      where: {
        companyId: auth.companyId ?? undefined,
        status: { in: ["in_progress", "planned"] },
      },
      select: { deliveryCity: true, status: true },
    }),
  ]);

  // Add match score to each availability
  const enriched = availabilities.map((a) => {
    const { score } = matchScore(a.departureCity, myMissions);
    return { ...a, matchScore: score };
  });

  // Sort: matched first, then by date
  enriched.sort((a, b) => {
    if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
    return new Date(a.availableFrom).getTime() - new Date(b.availableFrom).getTime();
  });

  return NextResponse.json(enriched);
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req, ["driver", "dispatcher"]);
  if (isResponse(auth)) return auth;

  const data = await req.json();

  const availability = await prisma.availability.create({
    data: {
      userId: auth.userId,
      companyId: auth.companyId!,
      departureRegion: data.departureRegion,
      departureCity: data.departureCity,
      arrivalRegion: data.arrivalRegion,
      arrivalCity: data.arrivalCity,
      anyDestination: data.anyDestination ?? false,
      availableFrom: new Date(data.availableFrom),
      availableTo: new Date(data.availableTo),
      vehicleType: data.vehicleType,
      capacity: data.capacity ? parseFloat(data.capacity) : null,
      volume: data.volume ? parseFloat(data.volume) : null,
      price: data.price ? parseFloat(data.price) : null,
      priceUnit: data.priceUnit,
      notes: data.notes,
    },
  });

  return NextResponse.json(availability, { status: 201 });
}
