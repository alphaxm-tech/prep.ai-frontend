import api from "../api/axios";
import {
  ASSESSMENTS,
  ATTEMPTS,
  BASE_API_URL,
  GET_ATTEMPT_QUESTION,
  GET_QUIZ_SESSION,
  LEADERBOARD,
  QUIZ,
  START_QUIZ,
} from "../api/endpoints";
import {
  GetAttemptQuestion,
  GetAttemptStatusResposne,
  GetLeaderboardResponse,
  StartAssessmentResponse,
} from "../api/types/quiz.types";

export const quizService = {
  startQuiz: async (assessmentId: number): Promise<StartAssessmentResponse> => {
    const response = await api.post(
      `${BASE_API_URL}/${QUIZ}/${START_QUIZ}/${assessmentId}`,
    );
    return response.data;
  },

  getAttemptQuestion: async (params: GetAttemptQuestion) => {
    const resposne = await api.get(
      `${BASE_API_URL}/${QUIZ}/${ATTEMPTS}/${params.AttemptID}/${GET_ATTEMPT_QUESTION}/${params.Index}`,
    );
    return resposne;
  },

  getAttemptStatus: async (
    attemptId: number,
  ): Promise<GetAttemptStatusResposne> => {
    const resposne = await api.get(
      `${BASE_API_URL}/${QUIZ}/${ATTEMPTS}/${attemptId}`,
    );

    return resposne.data;
  },

  getLeaderboard: async (
    assessmentId: number,
  ): Promise<GetLeaderboardResponse> => {
    const response = await api.get(
      `${BASE_API_URL}/${QUIZ}/${ASSESSMENTS}/${assessmentId}/${LEADERBOARD}`,
    );

    return response.data;
  },

  getQuizSession: async (attemptId: number) => {
    const response = await api.get(
      `${BASE_API_URL}/${QUIZ}/${GET_QUIZ_SESSION}/${attemptId}`,
    );

    return response;
  },
};
