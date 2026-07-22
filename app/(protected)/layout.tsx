import SubHeaderWrapper from "@/components/SubHeaderWrapper";
import AppBootstrap from "@/components/AppBootstrap";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Providers } from "../provider";
import { BASE_API_URL, HOME, ME } from "@/constants/api-endpoints";
import { UserProvider } from "../context/UserContext";
import { ProtectedHeader } from "@/components/ProtectedHeader";
import ProtectedShell from "@/components/ProtectedShell";
import { getCurrentUser } from "@/lib/get-user-details";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  if (!cookieHeader) {
    redirect("/login");
  }

  // let getMeDetails: any = null;

  // middleware.ts already handles token refresh before this layout runs.
  // By the time we reach here, the cookie header contains a valid access_token
  // (either the original one or a freshly refreshed one injected by middleware).
  // try {
  //   const meResponse = await fetch(`${BASE_API_URL}/${HOME}/${ME}`, {
  //     method: "GET",
  //     headers: { Cookie: cookieHeader },
  //     cache: "no-store",
  //   });

  //   if (!meResponse.ok) {
  //     redirect("/login");
  //   }

  //   getMeDetails = await meResponse.json();

  //   if (!getMeDetails) {
  //     redirect("/login");
  //   }
  // } catch (error) {
  //   console.error("Protected layout auth error:", error);
  //   redirect("/login");
  // }
  const user = await getCurrentUser();

  return (
    <Providers user={user}>
      <UserProvider user={user}>
        <ProtectedHeader user={user} />
        <AppBootstrap />
        <SubHeaderWrapper user={user} />
        <ProtectedShell>{children}</ProtectedShell>
      </UserProvider>
    </Providers>
  );
}
