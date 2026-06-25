import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/get-user-details";
import { UserRole } from "@/utils/enums";
import { LOGIN, UNAUTHORIZED_ROUTE } from "@/utils/CONSTANTS";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(LOGIN);
  }

  if (user.role.name !== UserRole.ADMIN) {
    redirect(UNAUTHORIZED_ROUTE);
  }

  return <>{children}</>;
}
