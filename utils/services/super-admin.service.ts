import { College } from "@/lib/college";
import { AddCollegeRequest } from "../api/types/super-admin.types";
import { ADD_COLLEGE, BASE_API_URL, SUPER_ADMIN } from "@/utils/api/endpoints";
import api from "@/lib/axios";

export const superAdminService = {
  addCollege: async (data: AddCollegeRequest): Promise<College> => {
    const response = await api.post(
      `${BASE_API_URL}/${SUPER_ADMIN}/${ADD_COLLEGE}`,
      data
    );
    return response.data;
  },
};
