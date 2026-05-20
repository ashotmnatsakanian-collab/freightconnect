import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, isResponse } from "@/lib/middleware";
import * as XLSX from "xlsx";

export async function POST(req: NextRequest) {
  const auth = requireAuth(req, ["dispatcher"]);
  if (isResponse(auth)) return auth;

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const wb = XLSX.read(buffer, { type: "buffer", cellDates: true });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws);

  const created: string[] = [];
  const errors: string[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const ref = String(row["Référence"] ?? row["Reference"] ?? row["reference"] ?? `IMP-${Date.now()}-${i}`);
    const loadingCity = String(row["Ville chargement"] ?? row["Loading City"] ?? "");
    const deliveryCity = String(row["Ville livraison"] ?? row["Delivery City"] ?? "");
    const goodsType = String(row["Marchandise"] ?? row["Goods"] ?? "Import");

    if (!loadingCity || !deliveryCity) {
      errors.push(`Ligne ${i + 2}: Villes manquantes`);
      continue;
    }

    const parseDate = (val: unknown): Date => {
      if (val instanceof Date) return val;
      if (typeof val === "string") return new Date(val);
      if (typeof val === "number") return new Date((val - 25569) * 86400000); // Excel serial
      return new Date();
    };

    const loadingDate = parseDate(row["Date chargement"] ?? row["Loading Date"]);
    const deliveryDate = parseDate(row["Date livraison"] ?? row["Delivery Date"] ?? new Date(loadingDate.getTime() + 86400000));

    try {
      const existing = await prisma.mission.findUnique({ where: { reference: ref } });
      if (existing) { errors.push(`Ligne ${i + 2}: Référence ${ref} déjà existante`); continue; }

      await prisma.mission.create({
        data: {
          reference: ref,
          loadingAddress: String(row["Adresse chargement"] ?? "—"),
          loadingCity,
          loadingDate,
          deliveryAddress: String(row["Adresse livraison"] ?? "—"),
          deliveryCity,
          deliveryDate,
          goodsType,
          weight: row["Poids"] ? parseFloat(String(row["Poids"])) : null,
          volume: row["Volume"] ? parseFloat(String(row["Volume"])) : null,
          price: row["Prix"] ? parseFloat(String(row["Prix"])) : null,
          companyId: auth.companyId!,
        },
      });
      created.push(ref);
    } catch (e) {
      errors.push(`Ligne ${i + 2}: Erreur — ${e instanceof Error ? e.message : "inconnue"}`);
    }
  }

  return NextResponse.json({ created: created.length, errors });
}
