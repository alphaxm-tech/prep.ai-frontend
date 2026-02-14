import api from "../api/axios";
import { BASE_API_URL, GET_ASESSMENTS, ASSESSMENT } from "../api/endpoints";
import {
  GetAssessment,
  GetAssessmentParams,
} from "../api/types/assessment.types";
import qs from "qs";

export const assessmentService = {
  getAssessments: async (
    params: GetAssessmentParams,
  ): Promise<GetAssessment> => {
    const response = await api.get(
      `${BASE_API_URL}/${ASSESSMENT}/${GET_ASESSMENTS}`,
      {
        params: {
          groups: params.groups,
          assessment_type: params.assessmentType,
        },
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: "repeat" }),
      },
    );

    return response.data;
  },
};
