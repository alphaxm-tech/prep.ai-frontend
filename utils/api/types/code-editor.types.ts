interface questions {
  question_id: number;
  title: string;
  difficulty: string;
  question_type: string;
  display_order: number;
  marks: number;
}

interface assessment {
  assessment_id: number;
  title: string;
  questions: questions[];
}

export interface GetCodingQuestionsResponse {
  response: { assessments: assessment[] };
}

type difficulty = "easy" | "medium" | "hard";
type evaluationMode = "private" | "public" | "mixed";

interface testCase {
  test_case_id: number;
  input_data: string;
  expected_output: string;
}

interface questionDetail {
  question_id: number;
  title: string;
  question_text: string;
  difficulty: difficulty;
  time_limit_ms: number;
  memory_limit_mb: number;
  languages_allowed: string[];
  starter_code: {};
  evaluation_mode: evaluationMode;
  test_cases: testCase[];
}

export interface GetQuestionDetailsResponse {
  question: questionDetail;
  success: boolean;
}

export interface SubmitCodePayload {
  question_id: number;
  code: string;
  language: string;
}

export interface SubmitCodeResponse {
  job_id: string;
}
