import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROLE_ROUTES: Record<string, string> = {
  admin: "/dash/admin",
  operator: "/dash/operator",
  oem_partner: "/dash/partner",
  cert_authority: "/dash/cert",
  print_center: "/dash/center",
};

const PUBLIC_PATHS = ["/login", "/api/auth"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (token && pathname === "/login") {
      const dash = ROLE_ROUTES[token.role as string] || "/dash/admin";
      return NextResponse.redirect(new URL(dash, request.url));
    }
    if (pathname === "/login" || pathname.startsWith("/api/auth")) {
      return NextResponse.next();
    }
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const userRole = token.role as string;
  const targetDash = ROLE_ROUTES[userRole] || "/dash/admin";

  if (pathname === "/" || pathname === "/dashboard") {
    return NextResponse.redirect(new URL(targetDash, request.url));
  }

  if (pathname.startsWith("/dash/")) {
    const urlRole = pathname.split("/")[2];
    const expectedDash = ROLE_ROUTES[userRole];
    if (expectedDash && !expectedDash.endsWith(`/${urlRole}`)) {
      return NextResponse.redirect(new URL(expectedDash, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.json|.*\\.(?:png|svg|ico|json|webmanifest)$).*)"],
};
