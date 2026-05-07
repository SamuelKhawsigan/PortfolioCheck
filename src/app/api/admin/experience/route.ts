import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { experienceSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";

export const GET = auth(async (req) => {
  try {
    const experience = await prisma.experience.findMany({
      orderBy: { startDate: "desc" },
    });
    return NextResponse.json(experience);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch experience" }, { status: 500 });
  }
});

export const POST = auth(async (req) => {
  try {
    const body = await req.json();
    const result = experienceSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.format() }, { status: 400 });
    }

    const experience = await prisma.experience.create({
      data: result.data,
    });

    return NextResponse.json(experience);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create experience" }, { status: 500 });
  }
});
