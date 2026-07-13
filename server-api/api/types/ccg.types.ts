export interface AddCollegeRequest {
  name: string;
  code: string;
  website: string | undefined;
  contact_email: string | undefined;
  contact_number: String | undefined;
  address: String | undefined;
  notes: string | undefined;
}

export interface College {
  college_id: number;
  name: string;
  code: string;
  website: string;
  contact_email: string;
  contact_number: string;
  address: string;
  notes: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface Course {
  course_id: number;
  name: string;
  code: string | null;
  type: string | null;
  description: string | null;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  stream: string;
  level: string;
  status: string;
}

export interface CreateCourseRequest {
  name: string;
  code: string;
  type: string;
  description: string;
}

export interface Group {
  group_id: number;
  college_id: number | null;
  name: string;
  description: string | null;
  group_type: string;
  visibility: string;
  created_by: number;
  status: string;
  created_at: string;
  updated_at: string;
}
