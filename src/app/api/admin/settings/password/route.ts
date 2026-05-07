import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  currentPassword: z.string().min(1, "Current password is required."),
  newPassword: z.string().min(8, "New password must be at least 8 characters."),
});

export const PATCH = auth(async (req) => {
  // Ensure the user is authenticated
  if (!req.auth?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const result = schema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { currentPassword, newPassword } = result.data;

    // Find the admin user by their session name
    const admin = await prisma.admin.findUnique({
      where: { username: req.auth.user.name as string },
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin user not found." }, { status: 404 });
    }

    // Verify the current password before allowing the change
    const isCorrect = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!isCorrect) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
    }

    // Hash and save the new password
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.admin.update({
      where: { id: admin.id },
      data: { passwordHash },
    });

    return NextResponse.json({ message: "Password changed successfully." });
  } catch (error) {
    console.error("[Password Change Error]:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
});
