import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isResponse } from "@/lib/middleware";

// Approximate straight-line distances between major French cities (km)
const DISTANCES: Record<string, Record<string, number>> = {
  paris: { lyon: 465, marseille: 775, bordeaux: 580, lille: 225, strasbourg: 490, nantes: 385, toulouse: 680, nice: 930, rennes: 350, grenoble: 570, montpellier: 750, nancy: 370, reims: 145, dijon: 315, clermont: 420 },
  lyon: { paris: 465, marseille: 315, bordeaux: 555, lille: 655, strasbourg: 490, nantes: 660, toulouse: 535, nice: 470, rennes: 740, grenoble: 110, montpellier: 330, nancy: 405, reims: 465, dijon: 190, clermont: 170 },
  marseille: { paris: 775, lyon: 315, bordeaux: 650, lille: 1000, strasbourg: 800, nantes: 925, toulouse: 405, nice: 205, rennes: 1000, grenoble: 300, montpellier: 170, nancy: 715, reims: 760, dijon: 530, clermont: 470 },
  bordeaux: { paris: 580, lyon: 555, marseille: 650, lille: 800, strasbourg: 900, nantes: 345, toulouse: 245, nice: 880, rennes: 420, grenoble: 680, montpellier: 465, nancy: 740, reims: 640, dijon: 610, clermont: 465 },
  lille: { paris: 225, lyon: 655, marseille: 1000, bordeaux: 800, strasbourg: 525, nantes: 605, toulouse: 1005, nice: 1200, rennes: 520, grenoble: 740, montpellier: 960, nancy: 310, reims: 205, dijon: 520, clermont: 665 },
  strasbourg: { paris: 490, lyon: 490, marseille: 800, bordeaux: 900, lille: 525, nantes: 870, toulouse: 1000, nice: 920, rennes: 950, grenoble: 530, montpellier: 760, nancy: 145, reims: 300, dijon: 335, clermont: 600 },
  nantes: { paris: 385, lyon: 660, marseille: 925, bordeaux: 345, lille: 605, strasbourg: 870, toulouse: 570, nice: 1130, rennes: 110, grenoble: 780, montpellier: 795, nancy: 700, reims: 560, dijon: 700, clermont: 565 },
  toulouse: { paris: 680, lyon: 535, marseille: 405, bordeaux: 245, lille: 1005, strasbourg: 1000, nantes: 570, nice: 610, rennes: 700, grenoble: 570, montpellier: 245, nancy: 845, reims: 790, dijon: 680, clermont: 480 },
  nice: { paris: 930, lyon: 470, marseille: 205, bordeaux: 880, lille: 1200, strasbourg: 920, nantes: 1130, toulouse: 610, rennes: 1200, grenoble: 330, montpellier: 335, nancy: 835, reims: 975, dijon: 665, clermont: 630 },
  grenoble: { paris: 570, lyon: 110, marseille: 300, bordeaux: 680, lille: 740, strasbourg: 530, nantes: 780, toulouse: 570, nice: 330, rennes: 870, montpellier: 425, nancy: 510, reims: 560, dijon: 280, clermont: 260 },
};

function normalize(city: string): string {
  return city.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/-/g, " ")
    .split(" ")[0];
}

function getDistance(from: string, to: string): number | null {
  const f = normalize(from);
  const t = normalize(to);
  return DISTANCES[f]?.[t] ?? DISTANCES[t]?.[f] ?? null;
}

// Price per km by vehicle type (€/km, includes driver + fuel + amort)
const COST_PER_KM: Record<string, { min: number; max: number }> = {
  bache:   { min: 1.40, max: 2.00 },
  frigo:   { min: 1.60, max: 2.30 },
  plateau: { min: 1.50, max: 2.10 },
  citerne: { min: 1.70, max: 2.40 },
  fourgon: { min: 0.90, max: 1.40 },
  mega:    { min: 1.60, max: 2.20 },
};

const EMPTY_RETURN_COST_PER_KM = 0.35; // Fuel + driver cost only (no revenue)

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if (isResponse(auth)) return auth;

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";
  const vehicleType = searchParams.get("vehicleType") ?? "bache";

  const distance = getDistance(from, to);

  if (!distance) {
    // Estimate based on average French long-haul
    const avgDistance = 450;
    const rates = COST_PER_KM[vehicleType] ?? COST_PER_KM.bache;
    return NextResponse.json({
      from,
      to,
      distanceKm: null,
      estimated: true,
      suggestedMin: Math.round(avgDistance * rates.min),
      suggestedMax: Math.round(avgDistance * rates.max),
      emptyReturnCost: Math.round(avgDistance * EMPTY_RETURN_COST_PER_KM),
      savingsMin: Math.round(avgDistance * rates.min - avgDistance * EMPTY_RETURN_COST_PER_KM),
      savingsMax: Math.round(avgDistance * rates.max - avgDistance * EMPTY_RETURN_COST_PER_KM),
    });
  }

  const rates = COST_PER_KM[vehicleType] ?? COST_PER_KM.bache;
  const emptyReturnCost = Math.round(distance * EMPTY_RETURN_COST_PER_KM);

  return NextResponse.json({
    from,
    to,
    distanceKm: distance,
    estimated: false,
    suggestedMin: Math.round(distance * rates.min),
    suggestedMax: Math.round(distance * rates.max),
    emptyReturnCost,
    savingsMin: Math.round(distance * rates.min - emptyReturnCost),
    savingsMax: Math.round(distance * rates.max - emptyReturnCost),
  });
}
