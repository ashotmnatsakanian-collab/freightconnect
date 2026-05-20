import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, isResponse } from "@/lib/middleware";

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if (isResponse(auth)) return auth;

  const notifications = await prisma.notification.findMany({
    where: { userId: auth.userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json(notifications);
}

export async function PATCH(req: NextRequest) {
  const auth = requireAuth(req);
  if (isResponse(auth)) return auth;

  await prisma.notification.updateMany({
    where: { userId: auth.userId, read: false },
    data: { read: true },
  });

  return NextResponse.json({ ok: true });
}
