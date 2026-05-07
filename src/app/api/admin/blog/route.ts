import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { blogPostSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";

export const GET = auth(async (req) => {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 });
  }
});

export const POST = auth(async (req) => {
  try {
    const body = await req.json();
    const result = blogPostSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.format() }, { status: 400 });
    }

    const post = await prisma.blogPost.create({
      data: result.data,
    });

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
  }
});
