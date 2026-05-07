import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { projectSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";

export const GET = auth(async (req, { params }) => {
  const { id } = await params;
  try {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
});

export const PATCH = auth(async (req, { params }) => {
  const { id } = await params;
  try {
    const body = await req.json();
    const result = projectSchema.partial().safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.format() }, { status: 400 });
    }

    const project = await prisma.project.update({
      where: { id },
      data: result.data,
    });

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
});

export const DELETE = auth(async (req, { params }) => {
  const { id } = await params;
  try {
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
});
