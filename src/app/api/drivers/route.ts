import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, isResponse } from "@/lib/middleware";
import { hashPassword } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = requireAuth(req, ["admin", "dispatcher"]);
  if (isResponse(auth)) return auth;

  const where: Record<string, unknown> = { role: "driver" };
  if (auth.role !== "admin") where.companyId = auth.companyId;

  const drivers = await prisma.user.findMany({
    where,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      isActive: true,
      companyId: true,
      company: { select: { name: true } },
      positions: { orderBy: { createdAt: "desc" }, take: 1 },
      missionsAsDriver: {
        where: { status: { in: ["planned", "in_progress"] } },
        select: { id: true, status: true, deliveryCity: true, deliveryDate: true },
      },
    },
  });

  return NextResponse.json(drivers);
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req, ["admin", "dispatcher"]);
  if (isResponse(auth)) return auth;

  const data = await req.json();
  const hashed = await hashPassword(data.password || "Transport2024!");

  const driver = await prisma.user.create({
    data: {
      email: data.email,
      password: hashed,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      role: "driver",
      companyId: auth.role === "admin" ? data.companyId : auth.companyId,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      companyId: true,
    },
  });

  return NextResponse.json(driver, { status: 201 });
}
