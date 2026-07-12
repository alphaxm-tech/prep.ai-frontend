import api from "../api/axios";
import {
  ASSESSMENTS,
  ATTEMPTS,
  BASE_API_URL,
  GET_ATTEMPT_QUESTION,
  GET_QUIZ_SESSION,
  LEADERBOARD,
  MARK_FOR_REVIEW,
  QUIZ,
  QUIZ_STATS,
  START_QUIZ,
  SUBMIT,
} from "../../constants/api-endpoints";
import {
  GetAttemptQuestion,
  GetAttemptQuestionResponse,
  GetAttemptStatusResposne,
  GetLeaderboardResponse,
  MarkForReviewRequest,
  QuizSessionResponse,
  QuizStatsResponse,
  SaveAnswerRequest,
  SaveAnswerResponse,
  StartAssessmentResponse,
  SubmitAttemptResponse,
} from "../api/types/quiz.types";

export const quizService = {
  startQuiz: async (assessmentId: number): Promise<StartAssessmentResponse> => {
    const response = await api.post(
      `${BASE_API_URL}/${QUIZ}/${START_QUIZ}/${assessmentId}`,
    );
    return response.data;
  },

  getAttemptQuestion: async (
    params: GetAttemptQuestion,
  ): Promise<GetAttemptQuestionResponse> => {
    const response = await api.get(
      `${BASE_API_URL}/${QUIZ}/${ATTEMPTS}/${params.AttemptID}/${GET_ATTEMPT_QUESTION}/${params.Index}`,
    );
    return response.data;
  },

  getAttemptStatus: async (
    attemptId: number,
  ): Promise<GetAttemptStatusResposne> => {
    const resposne = await api.get(
      `${BASE_API_URL}/${QUIZ}/${ATTEMPTS}/${attemptId}`,
    );

    return resposne.data;
  },

  saveAttemptAnswer: async (
    attemptId: number,
    payload: SaveAnswerRequest,
  ): Promise<SaveAnswerResponse> => {
    const response = await api.put(
      `${BASE_API_URL}/${QUIZ}/${ATTEMPTS}/${attemptId}/answers`,
      payload,
    );
    return response.data.answer;
  },

  submitAttempt: async (attemptId: number): Promise<SubmitAttemptResponse> => {
    const response = await api.post(
      `${BASE_API_URL}/${QUIZ}/${ATTEMPTS}/${attemptId}/${SUBMIT}`,
    );
    return response.data.result;
  },

  markForReview: async (
    attemptId: number,
    questionId: number,
    payload: MarkForReviewRequest,
  ) => {
    const response = await api.put(
      `${BASE_API_URL}/${QUIZ}/${ATTEMPTS}/${attemptId}/${GET_ATTEMPT_QUESTION}/${questionId}/${MARK_FOR_REVIEW}`,
      payload,
    );
    return response.data;
  },

  getLeaderboard: async (
    assessmentId: number,
  ): Promise<GetLeaderboardResponse> => {
    const response = await api.get(
      `${BASE_API_URL}/${QUIZ}/${ASSESSMENTS}/${assessmentId}/${LEADERBOARD}`,
    );

    return response.data;
  },

  getQuizSession: async (attemptId: number): Promise<QuizSessionResponse> => {
    const response = await api.get(
      `${BASE_API_URL}/${QUIZ}/${GET_QUIZ_SESSION}/${attemptId}`,
    );

    return response.data.session;
  },

  getQuizStats: async (): Promise<QuizStatsResponse> => {
    const response = await api.get(`${BASE_API_URL}/${QUIZ}/${QUIZ_STATS}`);
    return response.data.stats;
  },
};
