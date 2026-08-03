// "https://api.aiprepbuddy.com/api/v1";
export const BASE_API_URL = "https://api.aiprepbuddy.com/api/v1";
// export const BASE_API_URL = "http://localhost:8080/api/v1";

export const RESUME = `resume`;
export const AIINTERVIEW = `ai-interview`;
export const AUTH = `auth`;
export const HOME = `home`;
export const SUPER_ADMIN = `super-admin`;
export const ASSESSMENT = `assessment`;
export const QUIZ = `quiz`;
export const CCG = `ccg`;
export const CODEEDITOR = "code-editor";
export const LOGIN = "login";
export const LOGOUT = "logout";

/// RESUME endpoints ///
export const GET_RESUME_FORMATS = `get-resume-formats`;
export const GET_SKILLS_MASTER = `get-skills-master`;
export const POST_SAVE_RESUME = `save-resume`;
export const GET_USERS_ALL_RESUMES = `get-users-all-resumes`;
export const GET_COMPLETE_RESUME_BY_ID = `get-complete-resume-by-id`;

/// AUTH endpoints ///
export const VERIFY_USER_EMAIL = `verify-user-email`;
export const ADD_USER_DETAILS = `add-user-details`;
export const LOGIN_WITH_PASSWORD = `login-with-password`;
export const REFRESH = `refresh`;
export const SET_PASSWORD = `set-password`;
export const RESET_PASSWORD = `reset-password`;

/// AUTH endpoints ///
export const GOOGLE = `google`;

export const REGISTER = `register`;
export const LOGIN_WITH_OTP = `auth/login-with-otp`;
export const VERIFY_LOGIN_OTP = `auth/verify-login-otp`;

/// HOME endpoints ///
export const GET_USER_DETAILS_ALL = `get-user-details-all`;
export const ME = `me`;

/// Super Admin endpoints ///
export const CREATE_NEW_COLLEGE = `create-new-college`;
export const CREARE_NEW_COURSE = `create-new-course`;
export const GET_ALL_COURSES = `get-all-courses`;

/// Assessments ///
export const GET_ASESSMENTS = "get-assessments";

/// Quiz  ///
export const START_QUIZ = "start-quiz";
export const ATTEMPTS = "attempts";
export const GET_ATTEMPT_QUESTION = "questions";
export const SUBMIT = "submit";
export const ASSESSMENTS = "assessments";
export const LEADERBOARD = "leaderboard";
export const GET_QUIZ_SESSION = "get-quiz-session";
export const QUIZ_STATS = "quiz-stats";
export const MARK_FOR_REVIEW = "mark-for-review";
export const QUIZ_RESULTS = "results";
export const ABANDON = "abandon";
export const COLLEGE_LEADERBOARD = "leaderboard/college";

/// Code editor ///
export const GET_CODING_QUESTIONS = "questions";
export const RUN_JOBS = "run-jobs";
export const SUBMISSIONS = "submissions";
export const CODE_EDITOR_ASSESSMENTS = "assessments";
export const CODE_EDITOR_STATS = "stats";

/// AI Interview ///
export const START = "start";
export const FINISH = "finish";
export const SESSION = "session";
export const INTERVIEW_STATS = "interview-stats";
export const ANSWER = "answer";
export const REVIEW = "review";

/// Question Bank + Assessment Management (super admin) ///
export const QUESTION_BANK = "question-bank";
export const ADMIN = "admin";
export const TAGS = "tags";
export const UPLOAD = "upload";
export const UPLOADS = "uploads";
export const ACCEPT = "accept";
export const QB_QUESTIONS = "questions";
export const GROUPS = "groups";
export const STATUS = "status";

/// Students (college admin) ///
export const STUDENTS = "students";
export const FILTER_OPTIONS = "filter-options";
export const PROFILE = "profile";

/// Assessment Reports (college admin) — reuses ASSESSMENTS from Quiz above ///
export const ASSESSMENT_REPORTS = "assessment-reports";
export const EXPORT = "export";
