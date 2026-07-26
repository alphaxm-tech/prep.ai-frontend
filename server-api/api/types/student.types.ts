export interface StudentListItem {
  user_id: number;
  name: string;
  email: string;
  roll_number: string;
  branch: string;
  year: number;
  group: string;
  status: string;
}

export interface ListStudentsParams {
  college_id: number;
  search?: string;
  branch?: string;
  group_id?: number;
  year?: number;
  status?: string;
  page_no?: number;
  count?: number;
}

export interface ListStudentsResponse {
  students: StudentListItem[];
  total_count: number;
  page_no: number;
  count: number;
}

export interface StudentFilterOptions {
  branches: string[];
  years: number[];
}

export interface StudentAssessmentAttempt {
  attempt_id: number;
  assessment_id: number;
  title: string;
  assessment_type: string;
  total_score: number;
  status: string;
  started_at: string;
  submitted_at: string | null;
}

export interface StudentProfile {
  user_id: number;
  name: string;
  email: string;
  roll_number: string;
  resume_count: number;
  assessments: StudentAssessmentAttempt[] | null;
}
