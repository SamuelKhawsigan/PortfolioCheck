import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";

// Basic in-memory rate limiting (use Redis for production)
const rateLimitMap = new Map<string, number>();

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const now = Date.now();
    const lastRequest = rateLimitMap.get(ip) || 0;

    if (now - lastRequest < 60000) { // 1 minute limit
      return NextResponse.json({ error: "Too many requests. Please wait a minute." }, { status: 429 });
    }

    const body = await req.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.format() }, { status: 400 });
    }

    const message = await prisma.contactMessage.create({
      data: result.data,
    });

    rateLimitMap.set(ip, now);

    return NextResponse.json({ message: "Message sent successfully", id: message.id });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
