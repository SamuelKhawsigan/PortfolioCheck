import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { skillSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";

export const GET = auth(async (req) => {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: [{ category: "asc" }, { proficiencyLevel: "desc" }],
    });
    return NextResponse.json(skills);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 });
  }
});

export const POST = auth(async (req) => {
  try {
    const body = await req.json();
    const result = skillSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.format() }, { status: 400 });
    }

    const skill = await prisma.skill.create({
      data: result.data,
    });

    return NextResponse.json(skill);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 });
  }
});
