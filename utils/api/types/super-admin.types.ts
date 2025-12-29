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
