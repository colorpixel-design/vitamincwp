/**
 * POST /api/admin/upload-local
 * Saves uploaded image to /home/ubuntu/vitaminc-uploads/ (persists across deploys)
 * Nginx serves this directory at /uploads/
 */

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, canEditContent } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join, extname } from "path";
import { randomBytes } from "crypto";

// Always save to public/uploads — in production this is a symlink → /home/ubuntu/vitaminc-uploads/
// Next.js serves public/ automatically, no nginx config needed.
const UPLOAD_DIR = join(process.cwd(), "public", "uploads", "serums");

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_SIZE_MB = 5;

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !canEditContent(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WebP, or AVIF images allowed" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return NextResponse.json(
        { error: `File too large. Max ${MAX_SIZE_MB}MB` },
        { status: 400 }
      );
    }

    // Ensure upload directory exists
    await mkdir(UPLOAD_DIR, { recursive: true });

    // Generate unique filename
    const ext = extname(file.name) || ".jpg";
    const name = `${Date.now()}-${randomBytes(6).toString("hex")}${ext}`;
    const dest = join(UPLOAD_DIR, name);

    // Write file
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(dest, buffer);

    // Return URL path (nginx or next.js serves it)
    const url =
      process.env.NODE_ENV === "production"
        ? `/uploads/serums/${name}`
        : `/uploads/serums/${name}`;

    return NextResponse.json({ url }, { status: 200 });
  } catch (err) {
    console.error("[Upload Local] Error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
