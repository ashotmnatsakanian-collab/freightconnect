import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, isResponse } from "@/lib/middleware";

export async function POST(req: NextRequest) {
  const auth = requireAuth(req, ["driver"]);
  if (isResponse(auth)) return auth;

  const { latitude, longitude, city, address } = await req.json();

  const position = await prisma.driverPosition.create({
    data: {
      userId: auth.userId,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      city,
      address,
    },
  });

  return NextResponse.json(position, { status: 201 });
}

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if (isResponse(auth)) return auth;

  const { searchParams } = new URL(req.url);
  const companyId = auth.role !== "admin" ? auth.companyId : searchParams.get("companyId");

  const drivers = await prisma.user.findMany({
    where: {
      role: "driver",
      isActive: true,
      ...(companyId ? { companyId } : {}),
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      positions: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      missionsAsDriver: {
        where: { status: "in_progress" },
        select: { id: true, deliveryCity: true, status: true },
        take: 1,
      },
    },
  });

  return NextResponse.json(drivers);
}
