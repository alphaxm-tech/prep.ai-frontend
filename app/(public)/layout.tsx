import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { SubHeader } from "@/components/SubHeader";
import AppBootstrap from "@/components/AppBootstrap";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Providers } from "../provider";
import { BASE_API_URL, HOME, ME } from "@/utils/api/endpoints";
import { UserProvider } from "../context/UserContext";
import { ProtectedHeader } from "@/components/ProtectedHeader";
import { Header } from "@/components/Header";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ME endpoint api call
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  // const res = await fetch(`${BASE_API_URL}/${HOME}/${ME}`, {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  //   cache: "no-store",
  // });

  // if (!res.ok) {
  //   redirect("/login");
  // }

  // const getMeDetails = await res.json();
  // console.log(getMeDetails?.role?.name);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <UserProvider>
            <Header />
            <AppBootstrap />
            {children}
          </UserProvider>
        </Providers>
      </body>
    </html>
  );
}
