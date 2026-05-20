import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, isResponse } from "@/lib/middleware";

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if (isResponse(auth)) return auth;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const driverId = searchParams.get("driverId");

  const where: Record<string, unknown> = {};
  if (auth.role !== "admin") where.companyId = auth.companyId;
  if (auth.role === "driver") where.driverId = auth.userId;
  if (status) where.status = status;
  if (driverId && auth.role !== "driver") where.driverId = driverId;

  const missions = await prisma.mission.findMany({
    where,
    include: {
      driver: { select: { id: true, firstName: true, lastName: true, phone: true } },
      company: { select: { id: true, name: true } },
      documents: true,
    },
    orderBy: { loadingDate: "asc" },
  });

  return NextResponse.json(missions);
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req, ["admin", "dispatcher"]);
  if (isResponse(auth)) return auth;

  const data = await req.json();
  const reference = `MIS-${Date.now()}`;

  const mission = await prisma.mission.create({
    data: {
      reference,
      companyId: auth.companyId!,
      loadingAddress: data.loadingAddress,
      loadingCity: data.loadingCity,
      loadingDate: new Date(data.loadingDate),
      loadingContact: data.loadingContact,
      deliveryAddress: data.deliveryAddress,
      deliveryCity: data.deliveryCity,
      deliveryDate: new Date(data.deliveryDate),
      deliveryContact: data.deliveryContact,
      goodsType: data.goodsType,
      weight: data.weight ? parseFloat(data.weight) : null,
      volume: data.volume ? parseFloat(data.volume) : null,
      specialInstructions: data.specialInstructions,
      price: data.price ? parseFloat(data.price) : null,
      priceUnit: data.priceUnit,
      driverId: data.driverId || null,
      notes: data.notes,
    },
    include: {
      driver: { select: { id: true, firstName: true, lastName: true } },
    },
  });

  return NextResponse.json(mission, { status: 201 });
}
