import { decodeJwt } from "jose";
import { UserRole } from "@/enums/enums";
import {
  COLLEGE,
  STUDENTS,
  STUDENT_ROUTE,
  PLATFORM_ROUTE,
  UNAUTHORIZED_ROUTE,
} from "@/constants/ui-routes";

/**
 * Maps a role string (from the login API response or a decoded token) to the
 * dashboard route that role should land on. Unrecognized roles go to
 * UNAUTHORIZED_ROUTE.
 */
export function getRoleRedirectPath(
  role: string | undefined,
  data?: any,
): string {
  switch (role) {
    case UserRole.ADMIN: {
      const collegeId = data?.userRole?.college_id;
      return collegeId ? `${COLLEGE}/${collegeId}${STUDENTS}` : UNAUTHORIZED_ROUTE;
    }
    case UserRole.STUDENT:
    case UserRole.DEVELOPER:
    case UserRole.TESTER:
      return STUDENT_ROUTE;
    case UserRole.SUPER_ADMIN:
      return PLATFORM_ROUTE;
    default:
      return UNAUTHORIZED_ROUTE;
  }
}

/**
 * Decodes the access token (no verification — caller must ensure the token is
 * already trusted) and returns the dashboard route for that role. Unlike
 * getRoleRedirectPath, an unrecognized/undecodable role falls back to
 * STUDENT_ROUTE here rather than UNAUTHORIZED_ROUTE — this is used to redirect
 * already-logged-in users away from public pages, where sending them to
 * /student is preferable to /unauthorized.
 */
export function getRoleRedirect(accessToken: string): string {
  try {
    const payload = decodeJwt(accessToken);
    const path = getRoleRedirectPath(payload.role as string);

    return path === UNAUTHORIZED_ROUTE ? STUDENT_ROUTE : path;
  } catch {
    return STUDENT_ROUTE;
  }
}
