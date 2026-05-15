export interface GetAssessment {
  assessments: AssessmentResponse[];
}

export const ASSESSMENT_TYPES = {
  MCQ: "MCQ",
  CODING: "CODING",
  DESCRIPTIVE: "DESCRIPTIVE",
  MIXED: "MIXED",
} as const;

export interface GetAssessmentParams {
  assessmentType: (typeof ASSESSMENT_TYPES)[keyof typeof ASSESSMENT_TYPES];
  hasTaken: boolean;
  pageNo: number;
  count: number;
}

export type QuizDifficulty = "EASY" | "MEDIUM" | "HARD" | "";

export interface AssessmentResponse {
  assessment_id: number;
  group_id: number;
  title: string;
  assessment_type: (typeof ASSESSMENT_TYPES)[keyof typeof ASSESSMENT_TYPES]; // keep extensible
  duration_sec: number;
  max_attempts: number;
  created_at: string; // ISO string
  total_questions: number;
  difficulty: QuizDifficulty;
  has_taken: boolean;
}
