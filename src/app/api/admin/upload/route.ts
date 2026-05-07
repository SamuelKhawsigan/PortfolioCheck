import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import prisma from "@/lib/prisma";

// Maximum allowed file size: 5 MB
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

// Only these MIME types are accepted
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
]);

export const POST = auth(async (req) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    // --- Validation ---

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: `File type "${file.type}" is not allowed. Accepted: images and PDFs.` },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File is too large. Maximum size is 5 MB." },
        { status: 400 }
      );
    }

    // --- Storage ---

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize the filename: strip spaces and special characters
    const safeFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const uniqueFilename = `${Date.now()}-${safeFilename}`;

    const uploadDir = path.join(process.cwd(), "public/uploads");
    await mkdir(uploadDir, { recursive: true }); // creates folder if it doesn't exist

    await writeFile(path.join(uploadDir, uniqueFilename), buffer);

    const fileUrl = `/uploads/${uniqueFilename}`;

    // --- Database Record ---

    const media = await prisma.media.create({
      data: {
        fileUrl,
        altText: file.name, // store the original name as alt text
      },
    });

    return NextResponse.json(media, { status: 201 });
  } catch (error) {
    console.error("[Upload Error]:", error);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
});
