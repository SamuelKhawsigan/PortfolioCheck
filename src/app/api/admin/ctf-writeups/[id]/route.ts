import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ctfWriteupSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";

export const GET = auth(async (req, { params }) => {
  const { id } = await params;
  try {
    const writeup = await prisma.ctfWriteup.findUnique({ where: { id } });
    if (!writeup) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(writeup);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch writeup" }, { status: 500 });
  }
});

export const PATCH = auth(async (req, { params }) => {
  const { id } = await params;
  try {
    const body = await req.json();
    const result = ctfWriteupSchema.partial().safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.format() }, { status: 400 });
    }

    const writeup = await prisma.ctfWriteup.update({
      where: { id },
      data: result.data,
    });

    return NextResponse.json(writeup);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update writeup" }, { status: 500 });
  }
});

export const DELETE = auth(async (req, { params }) => {
  const { id } = await params;
  try {
    await prisma.ctfWriteup.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete writeup" }, { status: 500 });
  }
});
