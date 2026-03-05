import { NextResponse } from "next/server";

const DEMO_EMAIL = "vm.prepai@gmail.com";
const DEMO_PASSWORD = "admin@12345";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  if (
    email?.toLowerCase().trim() !== DEMO_EMAIL ||
    password?.trim() !== DEMO_PASSWORD
  ) {
    return NextResponse.json(
      { success: false, message: "Invalid demo credentials" },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ success: true });

  // Set access_token cookie (httpOnly so the protected layout SSR can read it)
  response.cookies.set("access_token", "demo_session", {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
    sameSite: "lax",
  });

  // Set demo_mode flag so the protected layout skips the real backend call
  response.cookies.set("demo_mode", "true", {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
    sameSite: "lax",
  });

  return response;
}
