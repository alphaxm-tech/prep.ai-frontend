import { College } from "@/utils/dummy-data/college";
import { AddCollegeRequest, Course } from "../api/types/ccg.types";
import {
  CREATE_NEW_COLLEGE,
  BASE_API_URL,
  GET_ALL_COURSES,
  SUPER_ADMIN,
  CCG,
} from "@/utils/api/endpoints";
import api from "@/utils/api/axios";
import { GetAllCoursesResponse } from "../queries/ccg.queries";

export const ccgService = {
  addCollege: async (data: AddCollegeRequest): Promise<College> => {
    const response = await api.post(
      `${BASE_API_URL}/${CCG}/${CREATE_NEW_COLLEGE}`,
      data,
    );
    return response.data;
  },

  getAllCourses: async (): Promise<GetAllCoursesResponse> => {
    const response = await api.get(`${BASE_API_URL}/${CCG}/${GET_ALL_COURSES}`);
    return response.data;
  },
};
