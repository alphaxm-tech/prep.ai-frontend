import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import SubHeaderWrapper from "@/components/SubHeaderWrapper";
import AppBootstrap from "@/components/AppBootstrap";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Providers } from "../provider";
import { BASE_API_URL, HOME, ME } from "@/utils/api/endpoints";
import { UserProvider } from "../context/UserContext";
import { ProtectedHeader } from "@/components/ProtectedHeader";
import ProtectedShell from "@/components/ProtectedShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Fake user data for UI-only demo session
const DEMO_USER = {
  full_name: "VM PrepAI",
  role: { name: "ADMIN" },
  user: { full_name: "VM PrepAI" },
  college: { code: "VM" },
};

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ME endpoint api call
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) {
    redirect("/login");
  }

  // Demo mode: skip backend call and use hardcoded user data
  const isDemoMode =
    token === "demo_session" &&
    cookieStore.get("demo_mode")?.value === "true";

  let getMeDetails: any;

  if (isDemoMode) {
    getMeDetails = DEMO_USER;
  } else {
    let fetchFailed = false;

    try {
      const res = await fetch(`${BASE_API_URL}/${HOME}/${ME}`, {
        headers: {
          Cookie: `access_token=${token}`,
        },
        cache: "no-store",
      });

      if (!res.ok) {
        fetchFailed = true;
      } else {
        getMeDetails = await res.json();
      }
    } catch {
      fetchFailed = true;
    }

    if (fetchFailed || !getMeDetails) {
      redirect("/login");
    }
  }
  // console.log(getMeDetails?.role?.name);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers user={getMeDetails}>
          <UserProvider user={getMeDetails}>
            <ProtectedHeader user={getMeDetails} />
            <AppBootstrap />
            <SubHeaderWrapper user={getMeDetails} />
            <ProtectedShell>{children}</ProtectedShell>
          </UserProvider>
        </Providers>
      </body>
    </html>
  );
}
