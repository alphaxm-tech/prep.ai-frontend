import api from "../api/axios";
import {
  ATTEMPTS,
  BASE_API_URL,
  GET_ATTEMPT_QUESTION,
  QUIZ,
  START_QUIZ,
} from "../api/endpoints";
import {
  GetAttemptQuestion,
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
};
