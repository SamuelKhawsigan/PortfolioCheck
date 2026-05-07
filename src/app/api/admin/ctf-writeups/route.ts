import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ctfWriteupSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";

export const GET = auth(async (req) => {
  try {
    const writeups = await prisma.ctfWriteup.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(writeups);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch writeups" }, { status: 500 });
  }
});

export const POST = auth(async (req) => {
  try {
    const body = await req.json();
    const result = ctfWriteupSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.format() }, { status: 400 });
    }

    const writeup = await prisma.ctfWriteup.create({
      data: result.data,
    });

    return NextResponse.json(writeup);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create writeup" }, { status: 500 });
  }
});
