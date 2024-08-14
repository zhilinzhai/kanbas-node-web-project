import React, { useEffect, useState } from "react";
import { Card, Button, Form, Alert } from "react-bootstrap";
import { quiz_t } from "../type";
import { useSelector } from "react-redux";
import * as client from "../client";
import { FaBan, FaCheck, FaPen } from "react-icons/fa";
import { compareObjects } from "../utils";
import { useNavigate } from "react-router";

type QuizProps = {
  quiz: quiz_t;
};

type Answer = {
  questionId: String;
  answer: String;
  points: number;
  isCorrect: Boolean;
};

type QuizAttempt = {
  _id?: string;
  user: string;
  quiz: string;
  answers: Answer[];
  score: number;
  attemptNumber: number;
  startTime: Date;
  endTime?: Date;
};

const QuizComponent: React.FC<QuizProps> = ({ quiz }) => {
    const navigate = useNavigate();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const [quizAttempt, setQuizAttempt] = useState<QuizAttempt | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const currentAnswer = answers.find(
    (answer) => answer.questionId === currentQuestion._id
  );
  const exhaustedAttempts =
    currentUser.role === "FACULTY" ? false :
    (quizAttempt ? quizAttempt?.attemptNumber >= quiz.numberOfAttempts : false);

  const fetchQuizAttempt = async () => {
    const response = await client.getQuizAttemptsByUserIdQuizId(
      currentUser._id,
      quiz._id!
    );
    if (response.length > 0) {
      const currentQuizAttempt = response.find(
        (attempt: QuizAttempt) => attempt.quiz === quiz._id
      );
      if (currentQuizAttempt) {
        setQuizAttempt(currentQuizAttempt);
        setAnswers(currentQuizAttempt.answers);
      }
    }
  };

  const handleSubmit = async () => {
    if(answers.length !== quiz.questions.length){
        alert("Please answer all questions before submitting the quiz");
        return;
    }
    if(compareObjects(answers, quizAttempt?.answers || [])){
        alert("No changes made to the quiz");
        return;
        }
    if (!quizAttempt) {
      const QuizAttempt: QuizAttempt = {
        user: currentUser._id,
        quiz: quiz._id!,
        answers: answers,
        score: answers.reduce((acc, answer) => acc + answer.points, 0),
        attemptNumber: 1,
        startTime: new Date(),
        endTime: new Date(),
      };
      try {
        await client.createQuizAttempt(QuizAttempt);
      } catch (error) {
        console.error("Error submitting quiz:", error);
      }
    } else {
      const updatedQuizAttempt: QuizAttempt = {
        ...quizAttempt,
        attemptNumber: quizAttempt.attemptNumber + 1,
        answers: answers,
        score: answers.reduce((acc, answer) => acc + answer.points, 0),
        endTime: new Date(),
      };
      try {
        await client.updateQuizAttempt(
          updatedQuizAttempt,
          updatedQuizAttempt._id!
        );
      } catch (error) {
        console.error("Error submitting quiz:", error);
      }
    }
    window.location.reload();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentQuestion) return;
    let correct = false;
    if (currentQuestion.possibleAnswers!.length > 0) {
      correct = currentQuestion.possibleAnswers!.includes(
        e.target.value.trim()
      );
    } else {
      correct = e.target.value === currentQuestion.correctAnswer;
    }

    const updatedAnswer = {
      questionId: currentQuestion._id,
      answer: e.target.value,
      isCorrect: correct,
      points:
        e.target.value === currentQuestion.correctAnswer
          ? currentQuestion.points
          : 0,
    };
    const updatedAnswers = answers.filter(
      (answer) => answer.questionId !== currentQuestion._id
    );
    setAnswers([...updatedAnswers, updatedAnswer]);
    setLastSavedTime(new Date());
  };

  const handleNext = () => {
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex((prev) => prev - 1);
  };

  useEffect(() => {
    fetchQuizAttempt();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {currentUser.role === "FACULTY" && (
        <Alert variant="warning">
          This is a preview of the published version of the quiz
        </Alert>
      )}

      <Card className="mb-3 w-100 border-0 d-flex align-items-center p-0">
        <Card.Body className="w-75">
          <Card.Title style={{ fontWeight: "bold", fontSize: "25px" }} className="d-flex justify-content-between">
            {quiz.title}
            { 
                quizAttempt?.score &&
                <span className="ms-3">
                  {exhaustedAttempts ? "Scored: " : "Last Score: "} 
                  {quizAttempt.score}
                </span>    
            }
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            Quiz Instructions
          </Card.Subtitle>
          <div className="d-flex align-items-center justify-content-center flex-column">
            <Card key={currentQuestion._id} className="mb-3 w-100">
              <Card.Header className="d-flex justify-content-between">
                <span>Question {currentQuestionIndex + 1}</span>
                <span>
                  {exhaustedAttempts &&
                    (currentAnswer?.isCorrect ? (
                      <span className="text-success me-2">
                        <FaCheck color="green" className="me-2" />
                        Correct
                      </span>
                    ) : (
                      <span className="text-danger me-2">
                        <FaBan className="text-danger me-2" />
                        Incorrect
                      </span>
                    ))}
                  {currentQuestion.points} pts
                </span>
              </Card.Header>
              <Card.Body>
                <Card.Text>{currentQuestion.questionText}</Card.Text>
                <Form>
                  {currentQuestion.questionType === "Multiple Choice" &&
                    currentQuestion.choices && (
                      <>
                        {currentQuestion.choices.map((choice, i) => (
                          <Form.Check
                            disabled={exhaustedAttempts}
                            key={i}
                            type="radio"
                            label={choice}
                            name={`question-${currentQuestion._id}`}
                            id={`choice-${currentQuestion._id}-${i}`}
                            value={choice}
                            onChange={handleChange}
                            checked={currentAnswer?.answer === choice}
                          />
                        ))}
                      </>
                    )}

                  {currentQuestion.questionType === "True/False" && (
                    <>
                      <Form.Check
                        disabled={exhaustedAttempts}
                        type="radio"
                        label="True"
                        name={`question-${currentQuestion._id}`}
                        id={`true-${currentQuestion._id}`}
                        onChange={handleChange}
                        value="true"
                        checked={currentAnswer?.answer === "true"}
                      />
                      <Form.Check
                        disabled={exhaustedAttempts}
                        type="radio"
                        label="False"
                        name={`question-${currentQuestion._id}`}
                        id={`false-${currentQuestion._id}`}
                        onChange={handleChange}
                        value="false"
                        checked={currentAnswer?.answer === "false"}
                      />
                    </>
                  )}

                  {currentQuestion.questionType === "Fill in Blank" &&
                    currentQuestion.possibleAnswers && (
                      <Form.Group>
                        <Form.Control
                          disabled={exhaustedAttempts}
                          type="text"
                          placeholder="Enter your answer"
                          onChange={handleChange}
                          value={currentAnswer?.answer as string}
                        />
                      </Form.Group>
                    )}
                </Form>
                {exhaustedAttempts && (
                  <Alert variant="success" style={{ marginTop: "10px" }}>
                    Answer :{" "}
                    {quiz.questions[currentQuestionIndex].correctAnswer}
                  </Alert>
                )}
              </Card.Body>
            </Card>
            <div className="d-flex w-100 justify-content-end gap-3">
              {currentQuestionIndex > 0 && (
                <Button variant="secondary" onClick={handlePrevious}>
                  Previous
                </Button>
              )}
              {currentQuestionIndex < quiz.questions.length - 1 && (
                <Button variant="secondary" onClick={handleNext}>
                  Next
                </Button>
              )}
            </div>
          </div>

          {/* <hr style={{borderTop: "1px solid grey"}}/> */}
          {!exhaustedAttempts && (
            <div className="my-3 py-3 p-2 d-flex w-100 justify-content-end align-items-center gap-3 border">
              {lastSavedTime && (
                <small className="text-muted">
                  Quiz Saved at {lastSavedTime.toLocaleString()}
                </small>
              )}
              <Button
                variant="secondary"
                style={{ borderRadius: "3px" }}
                onClick={handleSubmit}
              >
                Submit Quiz
              </Button>
            </div>
          )}

          {
            currentUser.role === "FACULTY" && (
                <div className="d-flex w-100 justify-content-start gap-3">
                    <Button variant="secondary" onClick={() => navigate(`/Kanbas/Courses/${quiz.courseId}/EditQuiz/${quiz._id}`)}>
                        <FaPen/> Keep Editing this Quiz
                    </Button>
                    </div>
            )
          }

        </Card.Body>
      </Card>
    </div>
  );
};

export default QuizComponent;
