/**
 * POST /api/admin/upload
 * ─────────────────────────────────────────────────────────────
 * Uploads an image to S3 from the admin panel.
 * Requires MASTER_ADMIN or CONTENT_CREATOR role.
 *
 * Request: multipart/form-data
 *   file   - Image file (JPEG, PNG, WebP, AVIF — max 5MB)
 *   folder - "serums" | "brands" | "ingredients"
 *
 * Response: { url: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, canEditContent } from "@/lib/auth";
import { uploadToS3, validateImageFile, type UploadFolder } from "@/lib/s3";

export async function POST(request: NextRequest) {
  // ── Auth check ───────────────────────────────────────────────
  const user = await getCurrentUser();
  if (!user || !canEditContent(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as UploadFolder) ?? "serums";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // ── Validate ─────────────────────────────────────────────
    const { valid, error } = validateImageFile(file, 5);
    if (!valid) {
      return NextResponse.json({ error }, { status: 400 });
    }

    // ── Upload to S3 ─────────────────────────────────────────
    const url = await uploadToS3(file, folder);

    return NextResponse.json({ url }, { status: 200 });
  } catch (err) {
    console.error("[Upload API] Error:", err);
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}


