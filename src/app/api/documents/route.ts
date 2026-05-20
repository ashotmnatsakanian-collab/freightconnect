import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, isResponse } from "@/lib/middleware";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if (isResponse(auth)) return auth;

  const { searchParams } = new URL(req.url);
  const missionId = searchParams.get("missionId");

  const docs = await prisma.document.findMany({
    where: missionId ? { missionId } : {},
    include: {
      uploadedBy: { select: { firstName: true, lastName: true } },
      mission: { select: { reference: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(docs);
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (isResponse(auth)) return auth;

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const missionId = formData.get("missionId") as string;
  const type = formData.get("type") as string;
  const notes = formData.get("notes") as string;

  if (!file || !missionId) {
    return NextResponse.json({ error: "Fichier et mission requis" }, { status: 400 });
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const filepath = path.join(uploadsDir, filename);
  await writeFile(filepath, buffer);

  const doc = await prisma.document.create({
    data: {
      name: file.name,
      type: type || "other",
      url: `/uploads/${filename}`,
      size: file.size,
      mimeType: file.type,
      notes,
      missionId,
      uploadedById: auth.userId,
    },
    include: {
      uploadedBy: { select: { firstName: true, lastName: true } },
    },
  });

  return NextResponse.json(doc, { status: 201 });
}
