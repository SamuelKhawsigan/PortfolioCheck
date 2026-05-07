import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { blogPostSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";

export const GET = auth(async (req, { params }) => {
  const { id } = await params;
  try {
    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
});

export const PATCH = auth(async (req, { params }) => {
  const { id } = await params;
  try {
    const body = await req.json();
    const result = blogPostSchema.partial().safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.format() }, { status: 400 });
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: result.data,
    });

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
});

export const DELETE = auth(async (req, { params }) => {
  const { id } = await params;
  try {
    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
});
