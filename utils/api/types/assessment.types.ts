export interface GetAssessment {
  assessment_id: number;
  group_id: number;
  title: string;
  assessment_type: string;
  duration_sec: number;
  max_attempts: number;
  created_at: string; // ISO string from backend
}

export interface GetAssessmentParams {
  groups: number[];
  assessmentType: string;
}
