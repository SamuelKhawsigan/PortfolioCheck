import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { profileSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";

export const GET = auth(async (req) => {
  try {
    let profile = await prisma.profile.findFirst();
    if (!profile) {
      // Create a default profile if none exists
      profile = await prisma.profile.create({
        data: {
          name: "Default Name",
          bio: "Default bio",
          email: "admin@example.com",
        },
      });
    }
    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
});

export const PATCH = auth(async (req) => {
  try {
    const body = await req.json();
    const result = profileSchema.partial().safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.format() }, { status: 400 });
    }

    const profile = await prisma.profile.findFirst();
    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const updatedProfile = await prisma.profile.update({
      where: { id: profile.id },
      data: result.data,
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
});
