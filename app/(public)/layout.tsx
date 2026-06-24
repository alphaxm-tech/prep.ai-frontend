import AppBootstrap from "@/components/AppBootstrap";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Providers } from "../provider";
import { UserProvider } from "../context/UserContext";
import { Header } from "@/components/Header";
import { getRoleRedirect } from "@/lib/get-role-redirect";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  // If the user already has a session, redirect to their role-specific dashboard.
  // accessToken carries the role claim; refreshToken-only falls back to /student
  // (middleware will handle the silent refresh + role routing from there).
  if (accessToken) {
    redirect(getRoleRedirect(accessToken));
  } else if (refreshToken) {
    redirect("/student");
  }

  return (
    <Providers>
      <UserProvider>
        <Header />
        <AppBootstrap />
        {children}
      </UserProvider>
    </Providers>
  );
}
