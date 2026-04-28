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

  // ✅ Create response FIRST
  const response = NextResponse.json({
    success: true,
    message: "Demo login successful",
    userRole: {
      name: "ADMIN", // or STUDENT if needed
    },
  });

  const isProduction = process.env.NODE_ENV === "production";
  const cookieDomain = isProduction ? ".aiprepbuddy.com" : undefined;

  // ✅ Set cookies correctly
  response.cookies.set("access_token", "demo_session", {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
    sameSite: "lax",
    secure: isProduction,
    domain: cookieDomain,
  });

  response.cookies.set("demo_mode", "true", {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 8,
    sameSite: "lax",
    secure: isProduction,
    domain: cookieDomain,
  });

  return response;
}
