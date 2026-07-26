import api from "@/server-api/api/axios";
import {
  BASE_API_URL,
  STUDENTS,
  FILTER_OPTIONS,
  PROFILE,
} from "@/constants/api-endpoints";
import {
  ListStudentsParams,
  ListStudentsResponse,
  StudentFilterOptions,
  StudentProfile,
} from "@/server-api/api/types/student.types";

export const studentService = {
  listStudents: async (
    params: ListStudentsParams,
  ): Promise<ListStudentsResponse> => {
    const response = await api.get<{
      success: boolean;
      data: ListStudentsResponse;
    }>(`${BASE_API_URL}/${STUDENTS}`, { params });
    return response.data.data;
  },

  getFilterOptions: async (
    collegeId: number,
  ): Promise<StudentFilterOptions> => {
    const response = await api.get<{
      success: boolean;
      data: StudentFilterOptions;
    }>(`${BASE_API_URL}/${STUDENTS}/${FILTER_OPTIONS}`, {
      params: { college_id: collegeId },
    });
    return response.data.data;
  },

  getStudentProfile: async (
    collegeId: number,
    userId: number,
  ): Promise<StudentProfile> => {
    const response = await api.get<{ success: boolean; data: StudentProfile }>(
      `${BASE_API_URL}/${STUDENTS}/${PROFILE}/${userId}`,
      { params: { college_id: collegeId } },
    );
    return response.data.data;
  },
};
