import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { firstName, lastName, email, password, companyName, companyCity, companyPhone, companyEmail, siret } = await req.json();

  if (!firstName || !lastName || !email || !password || !companyName) {
    return NextResponse.json({ error: "Tous les champs obligatoires doivent être remplis" }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Le mot de passe doit contenir au moins 8 caractères" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Un compte existe déjà avec cet email" }, { status: 409 });
  }

  const company = await prisma.company.create({
    data: {
      name: companyName,
      siret: siret || `SIRET-${Date.now()}`,
      address: "À compléter",
      city: companyCity || "À compléter",
      phone: companyPhone || "À compléter",
      email: companyEmail || email,
    },
  });

  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      firstName,
      lastName,
      role: "dispatcher",
      companyId: company.id,
    },
    include: { company: true },
  });

  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    companyId: user.companyId ?? undefined,
    firstName: user.firstName,
    lastName: user.lastName,
  });

  return NextResponse.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      companyId: user.companyId,
      company: user.company,
    },
  }, { status: 201 });
}
