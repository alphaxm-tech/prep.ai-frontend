import { GetAllCoursesResponse } from "@/server-api/api/types/super-admin.types";
import {
  BASE_API_URL,
  GET_ALL_COURSES,
  SUPER_ADMIN,
} from "@/constants/api-endpoints";
import api from "@/server-api/api/axios";

export const superAdminService = {
  getAllCourses2: async (): Promise<GetAllCoursesResponse> => {
    const response = await api.get(
      `${BASE_API_URL}/${SUPER_ADMIN}/${GET_ALL_COURSES}`,
    );
    return response.data;
  },
};

// addCollege is kept commented out until the endpoint constant ADD_COLLEGE is defined
// export const addCollege = async (data: AddCollegeRequest): Promise<College> => { ... }
