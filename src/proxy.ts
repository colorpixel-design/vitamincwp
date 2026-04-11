import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Next.js 16: Function must be named 'proxy' (not default export)
// Authentication is handled by WordPress Dashboard.
// No protected routes needed in Headless WordPress mode.

export function proxy(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  // Empty matcher = proxy runs on no routes (effectively disabled)
  matcher: [],
};
