import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/get-user-details";
import { UserRole } from "@/utils/enums";
import { LOGIN, UNAUTHORIZED_ROUTE } from "@/utils/CONSTANTS";

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(LOGIN);
  }

  if (user.role.name !== UserRole.SUPER_ADMIN) {
    redirect(UNAUTHORIZED_ROUTE);
  }

  return <>{children}</>;
}
