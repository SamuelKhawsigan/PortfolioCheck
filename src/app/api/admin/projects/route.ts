import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { projectSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";

export const GET = auth(async (req) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
});

export const POST = auth(async (req) => {
  try {
    const body = await req.json();
    const result = projectSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.format() }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: result.data,
    });

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
});
