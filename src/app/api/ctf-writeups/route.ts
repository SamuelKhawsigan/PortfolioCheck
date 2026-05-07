import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const writeups = await prisma.ctfWriteup.findMany({
      where: { publishedAt: { not: null } },
      orderBy: { publishedAt: "desc" },
    });
    return NextResponse.json(writeups);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch writeups" }, { status: 500 });
  }
}
