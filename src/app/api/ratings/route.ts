import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, isResponse } from "@/lib/middleware";

export async function POST(req: NextRequest) {
  const auth = requireAuth(req, ["dispatcher"]);
  if (isResponse(auth)) return auth;

  const { missionId, score, comment } = await req.json();

  if (!missionId || !score || score < 1 || score > 5) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const mission = await prisma.mission.findFirst({
    where: { id: missionId, companyId: auth.companyId ?? undefined, status: "delivered" },
  });

  if (!mission || !mission.driverId) {
    return NextResponse.json({ error: "Mission introuvable ou non livrée" }, { status: 404 });
  }

  const existing = await prisma.rating.findUnique({ where: { missionId } });
  if (existing) return NextResponse.json({ error: "Déjà noté" }, { status: 409 });

  const rating = await prisma.rating.create({
    data: { missionId, score, comment, authorId: auth.userId, driverId: mission.driverId },
  });

  // Notify driver
  await prisma.notification.create({
    data: {
      userId: mission.driverId,
      type: "rating",
      title: "Nouvelle évaluation",
      body: `Vous avez reçu une note de ${score}/5 pour la mission ${mission.reference}.`,
      data: JSON.stringify({ missionId }),
    },
  });

  return NextResponse.json(rating, { status: 201 });
}

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if (isResponse(auth)) return auth;

  const { searchParams } = new URL(req.url);
  const driverId = searchParams.get("driverId");

  const ratings = await prisma.rating.findMany({
    where: driverId ? { driverId } : { driverId: auth.userId },
    include: { mission: { select: { reference: true, deliveryCity: true } }, author: { select: { firstName: true, lastName: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(ratings);
}
