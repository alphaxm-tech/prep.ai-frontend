import { decodeJwt } from "jose";
import { UserRole } from "@/utils/enums";
import { STUDENT_ROUTE, PLATFORM_ROUTE } from "@/utils/CONSTANTS";

/**
 * Decodes the access token (no verification — caller must ensure the token is
 * already trusted) and returns the dashboard route for that role.
 */
export function getRoleRedirect(accessToken: string): string {
  try {
    const payload = decodeJwt(accessToken);
    const role = payload.role as string;

    switch (role) {
      case UserRole.SUPER_ADMIN:
        return PLATFORM_ROUTE;
      case UserRole.ADMIN:
        return "/college/1";
      case UserRole.STUDENT:
        return STUDENT_ROUTE;
      default:
        return STUDENT_ROUTE;
    }
  } catch {
    return STUDENT_ROUTE;
  }
}
