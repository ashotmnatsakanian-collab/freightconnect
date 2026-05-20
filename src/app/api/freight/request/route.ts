import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, isResponse } from "@/lib/middleware";

export async function POST(req: NextRequest) {
  const auth = requireAuth(req, ["dispatcher", "admin"]);
  if (isResponse(auth)) return auth;

  const { availabilityId, message } = await req.json();

  const availability = await prisma.availability.findUnique({
    where: { id: availabilityId },
    include: { user: true },
  });

  if (!availability) {
    return NextResponse.json({ error: "Disponibilité introuvable" }, { status: 404 });
  }

  const existing = await prisma.freightRequest.findFirst({
    where: { availabilityId, senderId: auth.userId },
  });

  if (existing) {
    return NextResponse.json({ error: "Demande déjà envoyée" }, { status: 409 });
  }

  const request = await prisma.freightRequest.create({
    data: {
      availabilityId,
      senderId: auth.userId,
      receiverId: availability.userId,
      message,
    },
  });

  return NextResponse.json(request, { status: 201 });
}

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if (isResponse(auth)) return auth;

  const requests = await prisma.freightRequest.findMany({
    where: auth.role === "driver"
      ? { receiverId: auth.userId }
      : { senderId: auth.userId },
    include: {
      availability: {
        include: {
          user: { select: { firstName: true, lastName: true, phone: true } },
          company: { select: { name: true } },
        },
      },
      sender: { select: { firstName: true, lastName: true, company: { select: { name: true } } } },
      receiver: { select: { firstName: true, lastName: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(requests);
}
