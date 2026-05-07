import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const certs = await prisma.certification.findMany({
      orderBy: { dateAcquired: "desc" },
    });
    return NextResponse.json(certs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch certifications" }, { status: 500 });
  }
}
