import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/auth";

const PUBLIC_PATHS = ["/", "/serums", "/ingredients", "/quiz", "/compare", "/about", "/methodology", "/contact", "/privacy", "/login", "/register"];
const ADMIN_PATHS = ["/admin"];
const CONTENT_CREATOR_PATHS = ["/admin/serums", "/admin/ingredients", "/admin/categories", "/admin/brands"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let public API and asset paths through
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("vitaminc_session")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/login?redirect=/admin", request.url));
    }
    const user = await verifyJWT(token);
    if (!user) {
      return NextResponse.redirect(new URL("/login?redirect=/admin", request.url));
    }
    // /admin/users only for MASTER_ADMIN
    if (pathname.startsWith("/admin/users") && user.role !== "MASTER_ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    // All other /admin paths need at least CONTENT_CREATOR
    if (user.role === "VISITOR") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
