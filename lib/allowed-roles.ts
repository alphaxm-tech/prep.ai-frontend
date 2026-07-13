import { UserRole } from "@/enums/enums";

// Roles that can freely switch between the student / college / super admin
// sections via the header dropdown (see ProtectedHeader).
export const SectionSwitcherRoles = [
  UserRole.DEVELOPER,
  UserRole.TESTER,
  UserRole.SUPER_ADMIN,
];

export const InterviewPrepRoles = [
  UserRole.STUDENT,
  UserRole.DEVELOPER,
  UserRole.TESTER,
  UserRole.SUPER_ADMIN,
];
export const CollegeAdminRoles = [
  UserRole.ADMIN,
  UserRole.DEVELOPER,
  UserRole.TESTER,
  UserRole.SUPER_ADMIN,
];
export const SuperAdminRoles = [
  UserRole.SUPER_ADMIN,
  UserRole.DEVELOPER,
  UserRole.TESTER,
];
