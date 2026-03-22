import { NextRequest, NextResponse } from "next/server";
import { getDefaultDashboardRoute, getRouteOwner, isAuthRoute, isPublicRoute, UserRole } from "./lib/authUtils";

function decodeJWT(token: string) {
  try {
    const base64Payload = token.split(".")[1];
    const payload = Buffer.from(base64Payload, "base64").toString("utf-8");
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  try {
    const decoded = decodeJWT(token);
    if (!decoded?.exp) return true;
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    const accessToken = request.cookies.get("accessToken")?.value;
    const sessionToken = request.cookies.get("better-auth.session_token")?.value;

    const isLoggedIn = accessToken && sessionToken && !isTokenExpired(accessToken);

    let userRole: UserRole | null = null;

    if (isLoggedIn) {
      const decoded = decodeJWT(accessToken);
      userRole = decoded?.role as UserRole;
    }

    const routeOwner = getRouteOwner(pathname);

    // Rule-1: Auth route এ logged in user গেলে dashboard এ redirect
    if (isAuthRoute(pathname) && isLoggedIn) {
      return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(userRole!), request.url)
      );
    }

    // Rule-2: Public route — সবাই access করতে পারবে
    if (isPublicRoute(pathname)) {
      return NextResponse.next();
    }

    // Rule-3: Auth route — সবাই access করতে পারবে
    if (isAuthRoute(pathname)) {
      return NextResponse.next();
    }

    // Rule-4: Protected route এ না থাকলে login এ redirect
    if (routeOwner !== null && !isLoggedIn) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Rule-5: Common protected route — logged in হলেই হবে
    if (routeOwner === "COMMON" && isLoggedIn) {
      return NextResponse.next();
    }

    // Rule-6: Role based route — role match না করলে নিজের dashboard এ redirect
    if (
      routeOwner === "ADMIN" ||
      routeOwner === "OWNER" ||
      routeOwner === "STUDENT"
    ) {
      if (routeOwner !== userRole) {
        return NextResponse.redirect(
          new URL(getDefaultDashboardRoute(userRole!), request.url)
        );
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};