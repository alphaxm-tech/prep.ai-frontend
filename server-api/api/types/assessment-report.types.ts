export interface AssessmentSummaryItem {
  assessment_id: number;
  title: string;
  assessment_type: string;
  created_at: string;
}

export interface AttemptedStudent {
  user_id: number;
  name: string;
  email: string;
  roll_number: string;
  total_score: number;
  max_score: number;
  status: string;
  started_at: string;
  submitted_at: string | null;
}

export interface NotAttemptedStudent {
  user_id: number;
  name: string;
  email: string;
  roll_number: string;
}

export interface AssessmentReportSummary {
  total_eligible: number;
  attempted_count: number;
  not_attempted_count: number;
  avg_score: number;
}

export interface AssessmentReportResponse {
  assessment_id: number;
  title: string;
  assessment_type: string;
  summary: AssessmentReportSummary;
  attempted: AttemptedStudent[];
  not_attempted: NotAttemptedStudent[];
}
