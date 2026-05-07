import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { certificationSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";

export const GET = auth(async (req) => {
  try {
    const certs = await prisma.certification.findMany({
      orderBy: { dateAcquired: "desc" },
    });
    return NextResponse.json(certs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch certifications" }, { status: 500 });
  }
});

export const POST = auth(async (req) => {
  try {
    const body = await req.json();
    const result = certificationSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.format() }, { status: 400 });
    }

    const cert = await prisma.certification.create({
      data: result.data,
    });

    return NextResponse.json(cert);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create certification" }, { status: 500 });
  }
});
