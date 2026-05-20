import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, isResponse } from "@/lib/middleware";

export async function GET(req: NextRequest) {
  const auth = requireAuth(req, ["admin"]);
  if (isResponse(auth)) return auth;

  const companies = await prisma.company.findMany({
    include: {
      _count: { select: { users: true, missions: true } },
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(companies);
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req, ["admin"]);
  if (isResponse(auth)) return auth;

  const data = await req.json();

  const company = await prisma.company.create({
    data: {
      name: data.name,
      siret: data.siret,
      address: data.address,
      city: data.city,
      phone: data.phone,
      email: data.email,
    },
  });

  return NextResponse.json(company, { status: 201 });
}
