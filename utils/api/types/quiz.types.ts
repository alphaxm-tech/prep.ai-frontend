export interface AssessmentAttempt {
  AttemptID: number;
  AssessmentID: number;
  UserID: number;
  TotalScore: number;
  StartedAt: string; // ISO date string
  ExpiresAt: string; // ISO date string
  SubmittedAt: string | null;
  EvaluatedAt: string | null;
  Status: "in_progress" | "submitted" | "expired";
}

export interface StartAssessmentResponse {
  attempt: AssessmentAttempt;
}

export interface GetAttemptQuestion {
  AttemptID: number;
  Index: number;
}
