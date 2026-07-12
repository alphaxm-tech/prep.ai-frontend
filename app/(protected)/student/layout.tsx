import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/get-user-details";
import { UserRole } from "@/enums/enums";
import { LOGIN, UNAUTHORIZED_ROUTE } from "@/constants/ui-routes";
import { InterviewPrepRoles } from "@/lib/allowed-roles";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(LOGIN);
  }

  if (!InterviewPrepRoles.includes(user?.role?.name)) {
    redirect(UNAUTHORIZED_ROUTE);
  }

  return <>{children}</>;
}
