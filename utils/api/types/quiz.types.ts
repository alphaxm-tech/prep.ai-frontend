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

export interface GetAttemptStatusResposne {
  AttemptID: number;
  AssessmentID: number;
  Status: string;
  StartedAt: string;
  ExpiredAt: string;
  SubmittedAt: string;
  TotalQuestions: number;
  Answered: number;
  Remaining: number;
  TotalScore: number;
}

export interface GetLeaderboardResponse {
  Rank: number;
  UserID: number;
  AttemptID: number;
  Score: number;
  SubmittedAt: string;
}
