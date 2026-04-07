/**
 * S3 Upload Utility
 * ─────────────────────────────────────────────────────────────
 * Handles file uploads to AWS S3 from admin panel.
 *
 * Environment variables required (set in .env.local / SSM):
 *   AWS_REGION          = ap-south-1
 *   AWS_ACCESS_KEY_ID   = (IAM user with S3 write access)
 *   AWS_SECRET_ACCESS_KEY
 *   AWS_S3_BUCKET       = bestcserum-assets
 *   NEXT_PUBLIC_CDN_URL = https://assets.bestcserum.com  (CloudFront)
 */

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const s3 = new S3Client({
  region: process.env.AWS_REGION ?? "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.AWS_S3_BUCKET ?? "bestcserum-assets";
const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL ?? "";

export type UploadFolder = "serums" | "brands" | "ingredients";

/**
 * Upload a file buffer to S3 and return the public CDN URL.
 *
 * @param file    - File from FormData (via `request.formData()`)
 * @param folder  - Which S3 subfolder to use: "serums" | "brands"
 * @returns       - Public URL (CloudFront if configured, else S3 URL)
 */
export async function uploadToS3(
  file: File,
  folder: UploadFolder
): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const key = `${folder}/${randomUUID()}.${ext}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      // Public read — files served via CloudFront
      ACL: "public-read",
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  // Prefer CloudFront URL, fallback to direct S3 URL
  if (CDN_URL) {
    return `${CDN_URL}/${key}`;
  }
  return `https://${BUCKET}.s3.${process.env.AWS_REGION ?? "ap-south-1"}.amazonaws.com/${key}`;
}

/**
 * Delete a file from S3 by its full URL.
 * Safe to call even if the file doesn't exist.
 */
export async function deleteFromS3(fileUrl: string): Promise<void> {
  try {
    // Extract the S3 key from the URL
    const url = new URL(fileUrl);
    const key = url.pathname.replace(/^\//, "");

    await s3.send(
      new DeleteObjectCommand({
        Bucket: BUCKET,
        Key: key,
      })
    );
  } catch {
    // Non-fatal — log and continue
    console.warn("[S3] Failed to delete file:", fileUrl);
  }
}

/**
 * Validate file is an acceptable image type and under size limit.
 * Call this before uploadToS3.
 */
export function validateImageFile(
  file: File,
  maxMB = 5
): { valid: boolean; error?: string } {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "Only JPEG, PNG, WebP, or AVIF images are allowed." };
  }
  const maxBytes = maxMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return { valid: false, error: `Image must be under ${maxMB}MB.` };
  }
  return { valid: true };
}
