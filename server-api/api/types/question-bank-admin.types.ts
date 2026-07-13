export type QuestionType = "MCQ" | "CODING" | "DESCRIPTIVE";

export interface TagOption {
  tag_id: number;
  name: string;
}

// One question parsed out of an uploaded file — not persisted yet.
export interface ExtractedQuestionCandidate {
  title?: string;
  question_text: string;
  difficulty: string;

  // MCQ only
  options?: string[];
  correct_option?: number;

  // Coding only
  languages_allowed?: string[];
  time_limit_ms?: number;
  memory_limit_mb?: number;
  evaluation_mode?: string;

  // AI-suggested matches against the existing tags table
  suggested_tag_names?: string[];
}

export interface UploadJobResponse {
  job_id: number;
  status: string;
}

export type UploadJobStatus = "processing" | "completed" | "failed" | "committed";

export interface UploadJobStatusResponse {
  job_id: number;
  question_type: QuestionType;
  file_name: string;
  file_type: "xlsx" | "docx" | "pdf";
  status: UploadJobStatus;
  extracted_questions?: ExtractedQuestionCandidate[];
  error_message?: string;
  target_assessment_id?: number | null;
  created_at: string;
  updated_at: string;
}

// The admin-confirmed (possibly hand-edited) version of a candidate,
// ready to commit. tag_ids must reference real rows in the tags table.
export interface ReviewedQuestionInput {
  title?: string;
  question_text: string;
  difficulty: string;
  tag_ids: number[];

  options?: string[];
  correct_option?: number;

  languages_allowed?: string[];
  time_limit_ms?: number;
  memory_limit_mb?: number;
  evaluation_mode?: string;
}

export interface AcceptUploadJobRequest {
  questions: ReviewedQuestionInput[];
}

export interface AcceptUploadJobResponse {
  imported: number;
}

export interface CreateQuestionRequest extends ReviewedQuestionInput {
  question_type: QuestionType;
}

// ── Question bank browsing (GET /question-bank/questions) ──

export interface QuestionRow {
  question_id: number;
  title: string;
  question_text: string;
  question_type: string;
  difficulty: string;
  status: string;
}

export interface GetQuestionsParams {
  type?: string;
  difficulty?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface GetQuestionsResponse {
  questions: QuestionRow[];
  total_count: number;
  page: number;
  limit: number;
}

