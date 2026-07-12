import api from "../api/axios";
import {
  AIINTERVIEW,
  ANSWER,
  ATTEMPTS,
  BASE_API_URL,
  FINISH,
  GET_ATTEMPT_QUESTION,
  INTERVIEW_STATS,
  SESSION,
  START,
} from "../../constants/api-endpoints";
import {
  FinishInterviewResponse,
  GetInterviewQuestionResponse,
  GetInterviewSessionResponse,
  GetInterviewStatsResponse,
  InterviewSessionResponse,
  InterviewStatsResponse,
  StartInterviewResponse,
  SubmitInterviewAnswerApiResponse,
  SubmitInterviewAnswerResponse,
} from "../api/types/ai-interview.types";

export const aiInterviewService = {
  startInterview: async (
    assessmentId: number,
  ): Promise<StartInterviewResponse> => {
    const response = await api.post(
      `${BASE_API_URL}/${AIINTERVIEW}/${START}/${assessmentId}`,
    );
    return response.data;
  },

  getQuestion: async (
    attemptId: number,
    index: number,
  ): Promise<GetInterviewQuestionResponse["question"]> => {
    const response = await api.get<GetInterviewQuestionResponse>(
      `${BASE_API_URL}/${AIINTERVIEW}/${ATTEMPTS}/${attemptId}/${GET_ATTEMPT_QUESTION}/${index}`,
    );
    return response.data.question;
  },

  submitAnswer: async (
    attemptId: number,
    questionId: number,
    audio: Blob,
    durationSec: number,
  ): Promise<SubmitInterviewAnswerResponse> => {
    const formData = new FormData();
    formData.append("audio", audio, "answer.webm");
    formData.append("duration_sec", String(Math.round(durationSec)));

    const response = await api.post<SubmitInterviewAnswerApiResponse>(
      `${BASE_API_URL}/${AIINTERVIEW}/${ATTEMPTS}/${attemptId}/${GET_ATTEMPT_QUESTION}/${questionId}/${ANSWER}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data.answer;
  },

  finishInterview: async (
    attemptId: number,
  ): Promise<FinishInterviewResponse> => {
    const response = await api.post<{ success: boolean; result: FinishInterviewResponse }>(
      `${BASE_API_URL}/${AIINTERVIEW}/${ATTEMPTS}/${attemptId}/${FINISH}`,
    );
    return response.data.result;
  },

  getSession: async (attemptId: number): Promise<InterviewSessionResponse> => {
    const response = await api.get<GetInterviewSessionResponse>(
      `${BASE_API_URL}/${AIINTERVIEW}/${ATTEMPTS}/${attemptId}/${SESSION}`,
    );
    return response.data.session;
  },

  getInterviewStats: async (): Promise<InterviewStatsResponse> => {
    const response = await api.get<GetInterviewStatsResponse>(
      `${BASE_API_URL}/${AIINTERVIEW}/${INTERVIEW_STATS}`,
    );
    return response.data.stats;
  },
};
