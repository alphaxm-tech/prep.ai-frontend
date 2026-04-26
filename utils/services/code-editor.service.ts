import api from "../api/axios";
import {
  BASE_API_URL,
  CODEEDITOR,
  GET_CODING_QUESTIONS,
  SUBMIT_CODE,
} from "../api/endpoints";
import {
  GetCodingQuestionsResponse,
  GetQuestionDetailsResponse,
  SubmitCodePayload,
  SubmitCodeResponse,
} from "../api/types/code-editor.types";

export const codeEditorService = {
  getCodingQuestions: async (): Promise<GetCodingQuestionsResponse> => {
    const response = await api.get(
      `${BASE_API_URL}/${CODEEDITOR}/${GET_CODING_QUESTIONS}`,
    );

    return response.data;
  },

  getCodingQuestionDetails: async (
    questionId: number,
  ): Promise<GetQuestionDetailsResponse> => {
    const response = await api.get(
      `${BASE_API_URL}/${CODEEDITOR}/${GET_CODING_QUESTIONS}/${questionId}`,
    );

    return response.data;
  },

  submitCode: async (
    payload: SubmitCodePayload,
  ): Promise<SubmitCodeResponse> => {
    const response = await api.post(
      `${BASE_API_URL}/${CODEEDITOR}/${SUBMIT_CODE}`,
      payload,
    );

    return response.data;
  },
};
