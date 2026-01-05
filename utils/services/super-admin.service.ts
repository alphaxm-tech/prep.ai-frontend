import { College } from "@/lib/college";
import { AddCollegeRequest, Course } from "../api/types/super-admin.types";
import {
  ADD_COLLEGE,
  BASE_API_URL,
  GET_ALL_COURSES,
  SUPER_ADMIN,
} from "@/utils/api/endpoints";
import api from "@/utils/api/axios";
import { GetAllCoursesResponse } from "../queries/super-admin.queries";

export const superAdminService = {
  addCollege: async (data: AddCollegeRequest): Promise<College> => {
    const response = await api.post(
      `${BASE_API_URL}/${SUPER_ADMIN}/${ADD_COLLEGE}`,
      data
    );
    return response.data;
  },

  getAllCourses: async (): Promise<GetAllCoursesResponse> => {
    const response = await api.get(
      `${BASE_API_URL}/${SUPER_ADMIN}/${GET_ALL_COURSES}`
    );
    return response.data;
  },
};
