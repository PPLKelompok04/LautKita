import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { lokasiDenganZonaSchema } from "@/lib/validasi/lokasi";

// GET dipakai juga oleh peta (PBI-20), jadi bisa diakses tanpa login.
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const ekosistem = searchParams.get("ekosistem");

  const data = await prisma.lokasiBudidaya.findMany({
    where: {
      nama: { contains: q, mode: "insensitive" },
      ...(ekosistem ? { ekosistem } : {}),
    },
    include: { zona: true },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(data);
}

export async function POST(req) {
  try {
    await requireRole("ADMIN");
  } catch (e) {
    return Response.json({ message: e.message }, { status: 403 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ message: "Data yang dikirim tidak valid" }, { status: 400 });
  }

  const hasil = lokasiDenganZonaSchema.safeParse(body);
  if (!hasil.success) {
    return Response.json(
      { message: hasil.error.issues[0].message },
      { status: 400 }
    );
  }

  const { zona, ...dataLokasi } = hasil.data;

  const lokasi = await prisma.lokasiBudidaya.create({
    data: { ...dataLokasi, zona: { create: zona } },
    include: { zona: true },
  });

  return Response.json(lokasi, { status: 201 });
}
