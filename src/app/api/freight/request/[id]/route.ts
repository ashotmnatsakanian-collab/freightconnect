import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, isResponse } from "@/lib/middleware";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if (isResponse(auth)) return auth;
  const { id } = await params;
  const { status } = await req.json();

  const request = await prisma.freightRequest.update({
    where: { id },
    data: { status },
  });

  if (status === "accepted") {
    await prisma.availability.update({
      where: { id: request.availabilityId },
      data: { status: "booked" },
    });
  }

  return NextResponse.json(request);
}
