import { User } from "./auth.types";

export interface GetUserDetailsAlldResponse {
  success: boolean;
  user: User;
  userServices: UserService[];
}

export interface UserService {
  college_service_id: number;
  ccg_id: number;
  service_id: number;
  services_config: Record<string, unknown>;
  start_date: string;
  notes: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
