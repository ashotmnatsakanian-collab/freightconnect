import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, isResponse } from "@/lib/middleware";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if (isResponse(auth)) return auth;
  const { id } = await params;

  const mission = await prisma.mission.findUnique({
    where: { id },
    include: {
      driver: { select: { id: true, firstName: true, lastName: true, phone: true } },
      company: { select: { id: true, name: true } },
      documents: { include: { uploadedBy: { select: { firstName: true, lastName: true } } } },
    },
  });

  if (!mission) return NextResponse.json({ error: "Mission introuvable" }, { status: 404 });
  return NextResponse.json(mission);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if (isResponse(auth)) return auth;
  const { id } = await params;
  const data = await req.json();

  const updateData: Record<string, unknown> = {};

  if (data.status) {
    updateData.status = data.status;
    if (data.status === "in_progress" && !data.inRouteAt) updateData.inRouteAt = new Date();
    if (data.status === "delivered" && !data.deliveredAt) updateData.deliveredAt = new Date();
  }
  if (data.loadingConfirmedAt) updateData.loadingConfirmedAt = new Date(data.loadingConfirmedAt);
  if (data.inRouteAt) updateData.inRouteAt = new Date(data.inRouteAt);
  if (data.arrivedAt) updateData.arrivedAt = new Date(data.arrivedAt);
  if (data.deliveredAt) updateData.deliveredAt = new Date(data.deliveredAt);
  if (data.driverId !== undefined) updateData.driverId = data.driverId;
  if (data.notes !== undefined) updateData.notes = data.notes;
  if (data.loadingAddress) updateData.loadingAddress = data.loadingAddress;
  if (data.loadingCity) updateData.loadingCity = data.loadingCity;
  if (data.deliveryAddress) updateData.deliveryAddress = data.deliveryAddress;
  if (data.deliveryCity) updateData.deliveryCity = data.deliveryCity;

  const prevMission = await prisma.mission.findUnique({ where: { id }, select: { status: true, driverId: true, deliveryCity: true, reference: true, companyId: true } });

  const mission = await prisma.mission.update({
    where: { id },
    data: updateData,
    include: {
      driver: { select: { id: true, firstName: true, lastName: true } },
    },
  });

  // Empty-return alert: notify all company dispatchers when a mission is delivered
  if (data.status === "delivered" && prevMission?.status !== "delivered" && prevMission?.driverId) {
    const deliveryCity = prevMission.deliveryCity;
    const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").split(/[\s-]/)[0];

    const availableFreight = await prisma.availability.findMany({
      where: { status: "active", departureCity: { contains: normalize(deliveryCity) } },
      take: 5,
    });

    const dispatchers = await prisma.user.findMany({
      where: { companyId: prevMission.companyId, role: "dispatcher" },
      select: { id: true },
    });

    const driverName = `${mission.driver?.firstName ?? ""} ${mission.driver?.lastName ?? ""}`.trim();
    const freightNote = availableFreight.length > 0
      ? ` — ${availableFreight.length} fret${availableFreight.length > 1 ? "s" : ""} disponible${availableFreight.length > 1 ? "s" : ""} au départ de ${deliveryCity}, agissez maintenant !`
      : "";

    await prisma.notification.createMany({
      data: dispatchers.map((d) => ({
        userId: d.id,
        type: "empty_return",
        title: "Retour à vide détecté",
        body: `${driverName} vient de livrer à ${deliveryCity}${freightNote}`,
        data: JSON.stringify({ missionId: id, city: deliveryCity }),
      })),
    });
  }

  return NextResponse.json(mission);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req, ["admin", "dispatcher"]);
  if (isResponse(auth)) return auth;
  const { id } = await params;

  await prisma.mission.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
