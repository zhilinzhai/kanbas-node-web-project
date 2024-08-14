import axios from "axios";
export const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
export const QUIZ_API = `${REMOTE_SERVER}/api/quizzes`;
export const QUIZ_ATTEMPT_API = `${REMOTE_SERVER}/api/quizAttempts`;

export const getQuizWithCourseId = async (cid:string) => {
    const response = await axios.get(`${QUIZ_API}/course/${cid}`);
    return response.data;
}

export const getQuizWithId = async (quizId: string) => {
    const response = await axios.get(`${QUIZ_API}/quiz/${quizId}`);
    return response.data;
}

export const deleteQuiz = async (quizId: string) => {
    const response = await axios.delete(`${QUIZ_API}/${quizId}`);
    return response.data;
}

export const publishOrUnpublishQuiz = async (quizId: string) => {
    const response = await axios.get(`${QUIZ_API}/publish/${quizId}`);
    return response.data;
}

export const createQuiz = async (quiz: any) => {
    const response = await axios.post(`${QUIZ_API}`, quiz);
    return response.data;
}

export const updateQuiz = async (quiz: any, quizId: string) => {
    const response = await axios.put(`${QUIZ_API}/${quizId}`, quiz);
    return response.data;
}

export const getQuizAttemptsByUserIdQuizId = async(userId: string, quizId: string) => {
    const response = await axios.get(`${QUIZ_ATTEMPT_API}/user/${userId}/quiz/${quizId}`);
    return response.data;
}

export const getQuizAttemptsByUserId = async(userId: string) => {
    const response = await axios.get(`${QUIZ_ATTEMPT_API}/user/${userId}`);
    return response.data;
}

export const createQuizAttempt = async (quizAttempt: any) => {
    const response = await axios.post(`${QUIZ_ATTEMPT_API}`, quizAttempt);
    return response.data;
}

export const updateQuizAttempt = async (quizAttempt: any, quizAttemptId: string) => {
    const response = await axios.put(`${QUIZ_ATTEMPT_API}/${quizAttemptId}`, quizAttempt);
    return response.data;
}