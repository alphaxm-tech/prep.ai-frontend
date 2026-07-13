export type AssessmentStatus = "draft" | "published" | "archived";

// Unlike AssessmentResponse (scoped to the caller's own groups + has_taken),
// this spans every group — powers the super-admin "Assessments" tab.
export interface AdminAssessmentResponse {
  assessment_id: number;
  group_id: number;
  group_name: string;
  title: string;
  assessment_type: string;
  duration_sec: number;
  difficulty: string;
  status: AssessmentStatus;
  total_questions: number;
  created_at: string;
}

export interface GetAssessmentsForAdminParams {
  search?: string;
  status?: string;
  pageNo: number;
  count: number;
}

export interface CreateAssessmentAdminRequest {
  group_id: number;
  title: string;
  assessment_type: "MCQ" | "CODING" | "DESCRIPTIVE" | "MIXED";
  duration_seconds: number;
  max_attempts: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  status?: "draft" | "published";
}

export interface AttachQuestionInput {
  question_id: number;
  display_order: number;
  marks: number;
  negative_marking: number;
}

export interface AttachQuestionsToAssessmentRequest {
  assessment_id: number;
  questions: AttachQuestionInput[];
}

export interface UpdateAssessmentStatusRequest {
  status: AssessmentStatus;
}
