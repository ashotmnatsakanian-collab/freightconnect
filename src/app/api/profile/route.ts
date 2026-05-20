import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, isResponse } from "@/lib/middleware";
import { comparePassword, hashPassword } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if (isResponse(auth)) return auth;

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: { id: true, firstName: true, lastName: true, email: true, phone: true, role: true, company: { select: { name: true } } },
  });

  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const auth = requireAuth(req);
  if (isResponse(auth)) return auth;

  const data = await req.json();
  const updates: Record<string, unknown> = {};

  if (data.firstName) updates.firstName = data.firstName;
  if (data.lastName) updates.lastName = data.lastName;
  if (data.phone !== undefined) updates.phone = data.phone;

  if (data.currentPassword && data.newPassword) {
    const user = await prisma.user.findUnique({ where: { id: auth.userId } });
    if (!user) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    const ok = await comparePassword(data.currentPassword, user.password);
    if (!ok) return NextResponse.json({ error: "Mot de passe actuel incorrect" }, { status: 400 });
    updates.password = await hashPassword(data.newPassword);
  }

  const updated = await prisma.user.update({
    where: { id: auth.userId },
    data: updates,
    select: { id: true, firstName: true, lastName: true, email: true, phone: true, role: true },
  });

  return NextResponse.json(updated);
}
