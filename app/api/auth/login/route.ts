import { NextResponse } from "next/server";
import { BASE_API_URL, AUTH, LOGIN_WITH_PASSWORD } from "@/utils/api/endpoints";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const backendRes = await fetch(
      `${BASE_API_URL}/${AUTH}/${LOGIN_WITH_PASSWORD}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        cache: "no-store", // 🔥 prevent caching issues
      },
    );

    let data: any = null;

    try {
      data = await backendRes.json();
    } catch {
      return NextResponse.json(
        { message: "Invalid backend response" },
        { status: 500 },
      );
    }

    if (!backendRes.ok) {
      return NextResponse.json(data, { status: backendRes.status });
    }

    const response = NextResponse.json(data);

    const isProduction = process.env.NODE_ENV === "production";
    const cookieDomain = isProduction ? ".aiprepbuddy.com" : undefined;

    // 🔥 Clear old cookies (prevents stale session issues)
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");

    // ✅ Set fresh cookies
    if (data?.accessToken) {
      response.cookies.set("access_token", data.accessToken, {
        httpOnly: true,
        path: "/",
        maxAge: 30 * 60,
        sameSite: "lax",
        secure: isProduction,
        domain: cookieDomain,
      });
    }

    if (data?.refreshToken) {
      response.cookies.set("refresh_token", data.refreshToken, {
        httpOnly: true,
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
        sameSite: "lax",
        secure: isProduction,
        domain: cookieDomain,
      });
    }

    return response;
  } catch (error) {
    console.error("Login proxy error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
