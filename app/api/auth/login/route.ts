import { NextResponse } from "next/server";
import { BASE_API_URL, AUTH, LOGIN_WITH_PASSWORD } from "@/utils/api/endpoints";

export async function POST(request: Request) {
  const body = await request.json();

  const backendRes = await fetch(
    `${BASE_API_URL}/${AUTH}/${LOGIN_WITH_PASSWORD}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  const data = await backendRes.json();

  if (!backendRes.ok) {
    return NextResponse.json(data, { status: backendRes.status });
  }

  const response = NextResponse.json(data);

  const isProduction = process.env.NODE_ENV === "production";

  const cookieDomain = isProduction ? ".aiprepbuddy.com" : undefined;

  if (data.accessToken) {
    response.cookies.set("access_token", data.accessToken, {
      httpOnly: true,
      path: "/",
      maxAge: 30 * 60, // 30 minutes
      sameSite: "lax",
      secure: isProduction,
      domain: cookieDomain,
    });
  }

  if (data.refreshToken) {
    response.cookies.set("refresh_token", data.refreshToken, {
      httpOnly: true,
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      sameSite: "lax",
      secure: isProduction,
      domain: cookieDomain,
    });
  }

  return response;
}
