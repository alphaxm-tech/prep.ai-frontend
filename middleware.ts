import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  // ==========================================
  // ROTUE PROTECTION
  // ==========================================
  // try {
  //   const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);

  //   const { payload } = await jwtVerify(accessToken as string, secret);
  //   console.log(payload);

  //   // const role = payload.role as string;
  //   // console.log(role);
  // } catch (error) {
  //   // return NextResponse.redirect(new URL("/login", request.url));
  // }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);

    const { payload } = await jwtVerify(accessToken as string, secret);

    console.log("PAYLOAD:", payload);
  } catch (error) {
    console.error("JWT VERIFY FAILED");
    console.error(error);
  }

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/" ||
    pathname === "" ||
    pathname === "/forgot-password";

  const dashboardPath = "/student";

  // ==========================================
  // AUTH PAGES
  // ==========================================
  // User already has a session (or can refresh)
  // Don't allow visiting login/register pages
  // ==========================================
  if (isAuthPage && (accessToken || refreshToken)) {
    return NextResponse.redirect(new URL(dashboardPath, request.url));
  }

  // ==========================================
  // PUBLIC AUTH PAGES
  // ==========================================
  // User not logged in -> allow login/register
  // ==========================================
  if (isAuthPage) {
    return NextResponse.next();
  }

  // ==========================================
  // PROTECTED ROUTES
  // ==========================================

  // Valid access token exists
  if (accessToken) {
    return NextResponse.next();
  }

  // No access token and no refresh token
  if (!refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ==========================================
  // SILENT REFRESH
  // ==========================================
  try {
    const refreshRes = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        Cookie: `refresh_token=${refreshToken}`,
      },
      cache: "no-store",
    });

    if (!refreshRes.ok) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const setCookie = refreshRes.headers.get("set-cookie");

    if (!setCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const match = setCookie.match(/access_token=([^;]+)/);

    if (!match) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const newAccessToken = match[1];

    // Build updated cookie header for SSR
    const existingCookies = request.headers.get("cookie") ?? "";

    const strippedCookies = existingCookies
      .split(";")
      .filter((cookie) => !cookie.trim().startsWith("access_token="))
      .join(";")
      .trim();

    const updatedCookieHeader = strippedCookies
      ? `${strippedCookies}; access_token=${newAccessToken}`
      : `access_token=${newAccessToken}`;

    const requestHeaders = new Headers(request.headers);

    requestHeaders.set("cookie", updatedCookieHeader);

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    // Persist fresh access token in browser
    response.headers.set("set-cookie", setCookie);

    return response;
  } catch (error) {
    console.error("Refresh failed:", error);

    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    // Auth pages
    "/",
    "/login",
    "/register",
    "/forgot-password",

    // Protected pages
    "/student/:path*",
    "/admin/:path*",
    "/platform/:path*",
    "/placement/:path*",
  ],
};
