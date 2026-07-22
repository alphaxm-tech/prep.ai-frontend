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
  ExpiresAt: string;
  SubmittedAt: string | null;
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

export interface OptionResponse {
  option_id: number;
  option_text: string;
  display_order: number;
}

export interface QuestionResponse {
  question_id: number;
  question_text: string;
  question_type: string;
  marks: number;
  negative_marks: number;
  marked_option_id?: number | null;
  options: OptionResponse[];
}

export interface GetAttemptQuestionResponse {
  success: boolean;
  question: QuestionResponse;
  assessment_answer: {
    answer_id: number;
    attempt_id: number;
    question_id: number;
    marked_for_review: boolean;
  };
}

export interface SaveAnswerRequest {
  question_id: number;
  selected_option_id: number;
}

export interface SaveAnswerResponse {
  attempt_id: number;
  question_id: number;
  selected_option_id: number;
}

export interface SubmitAttemptResponse {
  attempt_id: number;
  score: number;
  total: number;
  correct: number;
  wrong: number;
  unanswered: number;
}

export interface QuestionStatus {
  index: number;
  visited: boolean;
  answered: boolean;
  marked_for_review: boolean;
}

export interface QuizSessionResponse {
  attempt_id: number;
  assessment_id: number;
  status: string;
  expires_at: string;
  total_questions: number;
  current_index: number;
  question_statuses: QuestionStatus[];
  title: string;
  last_visited_index: number;
}

export interface QuizStatsResponse {
  best_score?: number | null;
  average_score?: number | null;
}

export interface MarkForReviewRequest {
  marked_for_review: boolean;
}

export interface CollegeLeaderboardEntry {
  rank: number;
  user_id: number;
  full_name: string;
  avg_percentile: number;
  quizzes_taken: number;
  is_you: boolean;
}

export interface QuizResultOption {
  option_id: number;
  option_text: string;
  is_correct: boolean;
}

export interface QuizResultQuestion {
  question_id: number;
  question_text: string;
  options: QuizResultOption[];
  selected_option_id?: number | null;
  correct_option_id?: number | null;
  answered: boolean;
  is_correct: boolean;
  score_awarded: number;
  max_score: number;
  marked_for_review: boolean;
}

export interface QuizResultsResponse {
  attempt_id: number;
  assessment_id: number;
  title: string;
  status: string;
  started_at: string;
  submitted_at?: string | null;
  evaluated_at?: string | null;
  total_score: number;
  max_score: number;
  correct: number;
  wrong: number;
  unanswered: number;
  questions: QuizResultQuestion[];
}
