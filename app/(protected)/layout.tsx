import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import SubHeaderWrapper from "@/components/SubHeaderWrapper";
import AppBootstrap from "@/components/AppBootstrap";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Providers } from "../provider";
import { AUTH, BASE_API_URL, HOME, ME, REFRESH } from "@/utils/api/endpoints";
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

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  // Send ALL cookies, not just access token
  const cookieHeader = cookieStore.toString();

  // If no cookies at all -> login
  if (!cookieHeader) {
    redirect("/login");
  }

  let getMeDetails: any = null;

  /**
   * Helper function to fetch current user
   */
  const fetchMe = async () => {
    return fetch(`${BASE_API_URL}/${HOME}/${ME}`, {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });
  };

  try {
    /**
     * STEP 1:
     * Try fetching user with current access token
     */
    let meResponse = await fetchMe();

    /**
     * STEP 2:
     * If access token expired -> try refresh
     */
    if (meResponse.status === 401) {
      const refreshResponse = await fetch(
        `${BASE_API_URL}/${AUTH}/${REFRESH}`,
        {
          method: "POST",
          headers: {
            Cookie: cookieHeader,
          },
          cache: "no-store",
        },
      );

      /**
       * If refresh token also failed
       * -> user session is dead
       */
      if (!refreshResponse.ok) {
        redirect("/login");
      }

      /**
       * IMPORTANT:
       * Get updated cookies returned by refresh endpoint
       */
      const setCookieHeader = refreshResponse.headers.get("set-cookie");

      /**
       * Retry /me using refreshed cookies
       */
      meResponse = await fetch(`${BASE_API_URL}/${HOME}/${ME}`, {
        method: "GET",
        headers: {
          Cookie: setCookieHeader || cookieHeader,
        },
        cache: "no-store",
      });
    }

    /**
     * Final validation
     */
    if (!meResponse.ok) {
      redirect("/login");
    }

    getMeDetails = await meResponse.json();

    if (!getMeDetails) {
      redirect("/login");
    }
  } catch (error) {
    console.error("Protected layout auth error:", error);
    redirect("/login");
  }

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
