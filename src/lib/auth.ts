import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "vitaminc-india-super-secret-key-change-in-prod"
);
const COOKIE_NAME = "vitaminc_session";

export type UserPayload = {
  id: string;
  email: string;
  name: string;
  role: "MASTER_ADMIN" | "CONTENT_CREATOR" | "VISITOR";
};

// ── Create signed JWT ─────────────────────────────────────────
export async function signJWT(payload: UserPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

// ── Verify JWT ────────────────────────────────────────────────
export async function verifyJWT(token: string): Promise<UserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as UserPayload;
  } catch {
    return null;
  }
}

// ── Get current user from cookie (Server Component / RouteHandler) ─
export async function getCurrentUser(): Promise<UserPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyJWT(token);
}

// ── Set session cookie ────────────────────────────────────────
export function makeSessionCookie(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  };
}

export function clearSessionCookie() {
  return {
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };
}

// ── Role guards ───────────────────────────────────────────────
export function isAdmin(user: UserPayload | null): boolean {
  return user?.role === "MASTER_ADMIN";
}

export function canEditContent(user: UserPayload | null): boolean {
  return user?.role === "MASTER_ADMIN" || user?.role === "CONTENT_CREATOR";
}
