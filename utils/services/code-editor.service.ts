import api from "../api/axios";
import {
  BASE_API_URL,
  CODE_EDITOR_ASSESSMENTS,
  CODEEDITOR,
  GET_CODING_QUESTIONS,
  RUN_JOBS,
  SUBMISSIONS,
} from "../api/endpoints";
import {
  FinalizeAssessmentResponse,
  GetAssessmentQuestionsResponse,
  GetAssessmentResultResponse,
  GetCodingQuestionsResponse,
  GetQuestionDetailsResponse,
  GetRunJobResponse,
  GetSubmissionResponse,
  RunCodePayload,
  RunCodeResponse,
  StartAssessmentResponse,
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

  runCode: async (
    questionId: number,
    payload: RunCodePayload,
  ): Promise<RunCodeResponse> => {
    const response = await api.post(
      `${BASE_API_URL}/${CODEEDITOR}/${GET_CODING_QUESTIONS}/${questionId}/run`,
      payload,
    );
    return response.data;
  },

  submitCode: async (
    questionId: number,
    payload: SubmitCodePayload,
  ): Promise<SubmitCodeResponse> => {
    const response = await api.post(
      `${BASE_API_URL}/${CODEEDITOR}/${GET_CODING_QUESTIONS}/${questionId}/submit`,
      payload,
    );
    return response.data;
  },

  getRunJob: async (jobId: string): Promise<GetRunJobResponse> => {
    const response = await api.get(
      `${BASE_API_URL}/${CODEEDITOR}/${RUN_JOBS}/${jobId}`,
    );
    return response.data;
  },

  getSubmission: async (submissionId: number): Promise<GetSubmissionResponse> => {
    const response = await api.get(
      `${BASE_API_URL}/${CODEEDITOR}/${SUBMISSIONS}/${submissionId}`,
    );
    return response.data;
  },

  startAssessment: async (assessmentId: number): Promise<StartAssessmentResponse> => {
    const response = await api.post(
      `${BASE_API_URL}/${CODEEDITOR}/${CODE_EDITOR_ASSESSMENTS}/${assessmentId}/start`,
    );
    return response.data;
  },

  getAssessmentQuestions: async (
    assessmentId: number,
  ): Promise<GetAssessmentQuestionsResponse> => {
    const response = await api.get(
      `${BASE_API_URL}/${CODEEDITOR}/${CODE_EDITOR_ASSESSMENTS}/${assessmentId}/questions`,
    );
    return response.data;
  },

  finalizeAssessment: async (assessmentId: number): Promise<FinalizeAssessmentResponse> => {
    const response = await api.post(
      `${BASE_API_URL}/${CODEEDITOR}/${CODE_EDITOR_ASSESSMENTS}/${assessmentId}/finalize`,
    );
    return response.data;
  },

  getAssessmentResult: async (
    assessmentId: number,
  ): Promise<GetAssessmentResultResponse> => {
    const response = await api.get(
      `${BASE_API_URL}/${CODEEDITOR}/${CODE_EDITOR_ASSESSMENTS}/${assessmentId}/result`,
    );
    return response.data;
  },
};
