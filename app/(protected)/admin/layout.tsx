import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/get-user-details";
import { UserRole } from "@/enums/enums";
import { LOGIN, UNAUTHORIZED_ROUTE } from "@/constants/ui-routes";
import { CollegeAdminRoles } from "@/lib/allowed-roles";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(LOGIN);
  }

  if (!CollegeAdminRoles.includes(user?.role?.name)) {
    redirect(UNAUTHORIZED_ROUTE);
  }

  return <>{children}</>;
}
