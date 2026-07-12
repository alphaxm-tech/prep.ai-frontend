// ===============================
// UI ROUTES (ALWAYS ABSOLUTE)
// ===============================

export const staleTime = 5 * 60 * 1000;

// Base Routes
export const STUDENT_ROUTE = "/student"; // student user route
export const COLLEGE_ADMIN_ROUTE = "/college"; // college admin route
export const PLATFORM_ROUTE = "/platform"; // super admin route
export const UNAUTHORIZED_ROUTE = "/unauthorized";

// auth routes
export const LOGIN = "/login";

// Student Routes
export const HOME_ROUTE = "/"; // root home
export const AI_INTERVIEW_ROUTE = "/student/ai-interview";
export const RESUME_BUILDER_ROUTE = "/student/resume-builder";
export const QUIZ_ROUTE = "/student/quiz";
export const STUDY_MATERIAL_ROUTE = "/student/study-material";
export const CODE_EDITOR_ROUTE = "/student/code-editor";
export const QUIZ_ROUTE_MAIN = "/quiz";
export const QUIZ_TEST = "/test";

// Platform/Super admin Routes
export const ONBOARD_COLLEGE = "/onboard-college";
export const COLLEGE = "/college";
export const COURSE = "/course";
export const GROUP = "/group";

// College admin Routes
export const PLACEMENT = "/placement";
export const INTERVIEWS = "/interviews";
export const COMMUNICATION = "/communication";
export const ROLE = "/role";
export const REPORT = "/report";
export const STUDENTS = "/students";
