export interface GetAssessment {
  assessments: AssessmentResponse[];
}

export interface GetAssessmentParams {
  assessmentType: string;
}

export type AssessmentType = "MCQ";

export type QuizDifficulty = "EASY" | "MEDIUM" | "HARD" | "";

export interface AssessmentResponse {
  assessment_id: number;
  group_id: number;
  title: string;
  assessment_type: "MCQ" | string; // keep extensible
  duration_sec: number;
  max_attempts: number;
  created_at: string; // ISO string
  total_questions: number;
  difficulty: QuizDifficulty;
  has_taken: boolean;
}
