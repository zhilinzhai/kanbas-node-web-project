import { useEffect, useState } from "react";
import { quiz_t } from "../type";
import { useNavigate, useParams } from "react-router";

import * as client from "../client";
import QuizView from "./QuizView";

const QuizPreview = () => {
  const { qId } = useParams();
  const [quiz, setQuiz] = useState<quiz_t>();
  const navigate = useNavigate();

  const fetchQuiz = async () => {
    try {
      const quiz = await client.getQuizWithId(qId!);
      if (!quiz) {
        throw new Error("Quiz not found");
      }
      quiz.dueDate = quiz.dueDate ? new Date(quiz.dueDate) : undefined;
      quiz.availableDate = quiz.availableDate
        ? new Date(quiz.availableDate)
        : undefined;
      quiz.untilDate = quiz.untilDate ? new Date(quiz.untilDate) : undefined;
      setQuiz(quiz);
    } catch (error) {
      console.error("Error fetching quiz:", error);
      navigate("/Kanbas/Dashboard");
    }
  };

  useEffect(() => {
    fetchQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!quiz) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <QuizView key={quiz._id} quiz={quiz} />
    </>
  );
};
export default QuizPreview;
