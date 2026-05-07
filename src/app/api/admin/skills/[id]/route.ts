import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { skillSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";

export const GET = auth(async (req, { params }) => {
  const { id } = await params;
  try {
    const item = await prisma.skill.findUnique({ where: { id } });
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch item" }, { status: 500 });
  }
});

export const PATCH = auth(async (req, { params }) => {
  const { id } = await params;
  try {
    const body = await req.json();
    const result = skillSchema.partial().safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.format() }, { status: 400 });
    }

    const item = await prisma.skill.update({
      where: { id },
      data: result.data,
    });

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
});

export const DELETE = auth(async (req, { params }) => {
  const { id } = await params;
  try {
    await prisma.skill.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
});
