import { GetAllCoursesResponse } from "@/utils/api/types/super-admin.types";
import { BASE_API_URL, GET_ALL_COURSES, SUPER_ADMIN } from "@/utils/api/endpoints";
import api from "@/utils/api/axios";

export const superAdminService = {
  getAllCourses: async (): Promise<GetAllCoursesResponse> => {
    const response = await api.get(
      `${BASE_API_URL}/${SUPER_ADMIN}/${GET_ALL_COURSES}`,
    );
    return response.data;
  },
};

// addCollege is kept commented out until the endpoint constant ADD_COLLEGE is defined
// export const addCollege = async (data: AddCollegeRequest): Promise<College> => { ... }
