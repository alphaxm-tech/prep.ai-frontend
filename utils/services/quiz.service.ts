import api from "../api/axios";
import { BASE_API_URL, QUIZ, START_QUIZ } from "../api/endpoints";
import { StartAssessmentResponse } from "../api/types/quiz.types";

export const quizService = {
  startQuiz: async (assessmentId: number): Promise<StartAssessmentResponse> => {
    const response = await api.post(
      `${BASE_API_URL}/${QUIZ}/${START_QUIZ}/${assessmentId}`,
    );

    return response.data;
  },
};
