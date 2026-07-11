export interface AssessmentQuestion {
  question_id: number;
  title: string;
  difficulty: string;
  question_type: string;
  display_order: number;
  marks: number;
}

export interface Assessment {
  assessment_id: number;
  title: string;
  questions: AssessmentQuestion[];
}

export interface GetCodingQuestionsResponse {
  success: boolean;
  response: { assessments: Assessment[] };
}

export type QuestionStatus =
  | "not_started"
  | "pending"
  | "running"
  | "accepted"
  | "wrong_answer"
  | "runtime_error"
  | "tle"
  | "compilation_error";

export interface AssessmentSessionQuestion {
  question_id: number;
  title: string;
  marks: number;
  status: QuestionStatus;
}

export interface StartAssessmentResponse {
  success: boolean;
  data: {
    attempt_id: number;
    expires_at: string;
    duration_sec: number;
    questions: AssessmentSessionQuestion[];
    assessment_title?: string;
  };
}

export interface GetAssessmentQuestionsResponse {
  success: boolean;
  data: {
    questions: AssessmentSessionQuestion[];
  };
}

export interface FinalizeAssessmentResponse {
  success: boolean;
  data: { message: string };
}

export interface AssessmentResultQuestion {
  question_id: number;
  title: string;
  score: number;
  max_score: number;
  status: QuestionStatus;
}

export interface GetAssessmentResultResponse {
  success: boolean;
  data: {
    assessment_title: string;
    total_score: number;
    max_score: number;
    questions: AssessmentResultQuestion[];
  };
}

type Difficulty = "easy" | "medium" | "hard";

interface TestCase {
  test_case_id: number;
  input_data: string;
  expected_output: string;
}

interface QuestionDetail {
  question_id: number;
  title: string;
  question_text: string;
  difficulty: Difficulty;
  time_limit_ms: number;
  memory_limit_mb: number;
  languages_allowed: string[];
  starter_code: Record<string, string>;
  evaluation_mode: string;
  test_cases: TestCase[];
}

export interface GetQuestionDetailsResponse {
  success: boolean;
  question: QuestionDetail;
}

export interface RunCodePayload {
  language: string;
  source_code: string;
}

export interface RunCodeResponse {
  success: boolean;
  data: {
    job_id: string;
    status: string;
  };
}

export interface SubmitCodePayload {
  language: string;
  source_code: string;
}

export interface SubmitCodeResponse {
  success: boolean;
  submission: {
    submission_id: number;
    status: string;
    score_awarded: number;
  };
}

export type ExecutionStatus =
  | "pending"
  | "running"
  | "Accepted"
  | "Wrong Answer"
  | "Runtime Error"
  | "TLE"
  | "Compilation Error";

export interface ExecutionResult {
  status: ExecutionStatus;
  test_cases_passed: number;
  total_test_cases: number;
  output: string;
  error: string;
  execution_time_ms: number;
}

export interface GetRunJobResponse {
  success: boolean;
  data: {
    job_id: string;
    status: ExecutionStatus;
    execution_result?: ExecutionResult;
  };
}

export interface GetSubmissionResponse {
  success: boolean;
  data: {
    submission_id: number;
    status: ExecutionStatus;
    score_awarded: number;
    execution_result?: ExecutionResult;
  };
}
