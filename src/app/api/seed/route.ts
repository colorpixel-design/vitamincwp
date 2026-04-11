import { NextResponse } from "next/server";

// This endpoint is no longer needed in Headless WordPress mode.
// Data is now managed via WordPress Dashboard + ACF fields.
// Use scripts/migrate-to-wp.ts to import data into WordPress.

export async function POST() {
  return NextResponse.json(
    {
      message: "Seed endpoint is deprecated. Data is now managed via WordPress Dashboard.",
      docs: "See WORDPRESS_SETUP.md for setup instructions.",
      migrate: "Run: npm run migrate-to-wp",
    },
    { status: 410 } // 410 Gone
  );
}

export async function GET() {
  return NextResponse.json(
    {
      message: "Seed endpoint is deprecated. Data is now managed via WordPress Dashboard.",
      docs: "See WORDPRESS_SETUP.md for setup instructions.",
    },
    { status: 410 }
  );
}
