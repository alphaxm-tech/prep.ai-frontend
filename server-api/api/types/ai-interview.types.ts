import { AssessmentAttempt, QuestionStatus } from "./quiz.types";

export interface StartInterviewResponse {
  success: boolean;
  attempt: AssessmentAttempt;
}

export interface InterviewQuestion {
  question_id: number;
  question_text: string;
  marks: number;
  max_duration_sec: number;
  already_answered: boolean;
}

export interface GetInterviewQuestionResponse {
  success: boolean;
  question: InterviewQuestion;
}

export interface SubmitInterviewAnswerResponse {
  attempt_id: number;
  question_id: number;
  transcript: string;
  duration_sec: number;
}

export interface SubmitInterviewAnswerApiResponse {
  success: boolean;
  answer: SubmitInterviewAnswerResponse;
}

export interface InterviewSessionResponse {
  attempt_id: number;
  assessment_id: number;
  status: string;
  expires_at: string;
  started_at: string;
  total_questions: number;
  current_index: number;
  last_visited_index: number;
  title: string;
  question_statuses: QuestionStatus[];
}

export interface GetInterviewSessionResponse {
  success: boolean;
  session: InterviewSessionResponse;
}

export interface InterviewQuestionScore {
  question_id: number;
  question_text: string;
  score_awarded: number;
  max_score: number;
  strengths: string[];
  improvements: string[];
}

export interface FinishInterviewResponse {
  attempt_id: number;
  status: string;
  total_score: number;
  max_score: number;
  per_question: InterviewQuestionScore[];
  overall_feedback: string;
}

export interface FinishInterviewApiResponse {
  success: boolean;
  result: FinishInterviewResponse;
}

export interface InterviewStatsResponse {
  average_score?: number | null;
  interviews_taken: number;
  total_time_sec: number;
  improvement_pct?: number | null;
}

export interface GetInterviewStatsResponse {
  success: boolean;
  stats: InterviewStatsResponse;
}
