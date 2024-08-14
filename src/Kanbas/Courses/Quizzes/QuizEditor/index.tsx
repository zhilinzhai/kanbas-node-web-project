import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { quiz_t } from "../type";
import * as client from "../client";
import "react-quill/dist/quill.snow.css";
import {Question} from '../type';

import { Tab, Tabs, Button } from "react-bootstrap";
import { FaBan, FaCheck, FaInfoCircle } from "react-icons/fa";
import QuestionEditor from "./QuestionEditor";
import DetailsEditor from "./DetailsEditor";
import mongoose from "mongoose";

const QuizEditor = ({create}:{create:Boolean}) => {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { qId } = useParams();
  const navigate = useNavigate();
  const initialQuiz: quiz_t = {
    title: "",
    description: "",
    courseId: create ? qId! : "",
    createdBy: currentUser._id,
    quizType: "Graded Quiz",
    points: 0,
    assignmentGroup: "Quizzes",
    shuffleAnswers: false,
    timeLimit: 0,
    multipleAttempts: false,
    numberOfAttempts: 1,
    showCorrectAnswers: false,
    accessCode: "",
    oneQuestionAtATime: false,
    webcamRequired: false,
    lockQuestionsAfterAnswering: false,
    dueDate: undefined,
    availableDate: undefined,
    untilDate: undefined,
    isPublished: false,
    questions: [],
  };
  const [quiz, setQuiz] = useState<quiz_t>(initialQuiz);
  const [navTab, setNavTab] = useState<string>("details");
  const [activeQuestion, setActiveQuestion] = useState<string>("0");
  const [questionsChanged, setQuestionsChanged] = useState<boolean>(false);

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      _id: new mongoose.Types.ObjectId().toString(),
      questionType: 'Multiple Choice',
      title: '',
      points: 0,
      questionText: '',
      choices: [],
      correctAnswer: '',
      possibleAnswers: [],
    };
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      questions: [...prevQuiz.questions, newQuestion],
    }));
    setActiveQuestion((quiz.questions.length).toString());
  };

  const handleDeleteQuestion = (index: number) => {
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      questions: prevQuiz.questions.filter((q, i) => i !== index),
      points: prevQuiz.points - prevQuiz.questions[index].points,
    }));
    setActiveQuestion((quiz.questions.length-2).toString());
    setQuestionsChanged(true);
  }

  const handleSaveQuestion = (updatedQuestion: Question) => {
    const prevPoints = quiz.points;
    const prevQuestionPoints = quiz.questions.find((q) => q._id === updatedQuestion._id)?.points || 0;
    const newPoints =Number(updatedQuestion.points);
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      questions: prevQuiz.questions.map((q) => (q._id === updatedQuestion._id ? updatedQuestion : q)),
      points: (prevPoints - prevQuestionPoints) + newPoints,
    }));
    setQuestionsChanged(true);
  };

  const handleDetailSave = async (updatedQuiz: quiz_t) => {
    try {
      if(updatedQuiz.questions.length === 0){
        alert("Please add questions to the quiz");
        return false;
      }
      
      if(new Date(updatedQuiz.dueDate!).getTime() < new Date(updatedQuiz.availableDate!).getTime()){
        alert("Due date cannot be before available date");
        return false;
      }
      if(new Date(updatedQuiz.untilDate!).getTime() < new Date(updatedQuiz.dueDate!).getTime()){
        alert("Until date cannot be before due date");
        return false;
      }
      if(new Date(updatedQuiz.untilDate!).getTime() < new Date(updatedQuiz.availableDate!).getTime()){
        alert("Until date cannot be before available date");
        return false;
      }

      if (create) {
        await client.createQuiz(updatedQuiz);
      } else {
        await client.updateQuiz(updatedQuiz, qId!);
      }
      navigate(`/Kanbas/Courses/${updatedQuiz.courseId}/Quizzes`);
    } catch (error) {
      console.error("Error saving quiz:", error);
    }
  };

  const handleSaveAndPublish = async (e:any) => {
    try {
      const updatedQuiz = {...quiz, isPublished: true};
      await handleDetailSave(updatedQuiz);
    } catch (error) {
      console.error("Error saving quiz:", error);
      setQuiz((prevQuiz) => ({...prevQuiz, isPublished: false}));
    }
  }

  const handleDetailsChange = (e: any) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? e.target.checked : false;
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

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
    if (currentUser.role !== "FACULTY") {
      navigate("/Kanbas/Dashboard");
    }
    if (!create) {
      fetchQuiz();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-end align-items-center">
        <h5>
          Points : <span>{quiz.points}</span>
        </h5>
        <h5 className="ms-3">
          {quiz.isPublished ? (
            <span className="text-success d-flex align-items-center gap-2">
              <FaCheck /> Published
            </span>
          ) : (
            <span className="text-danger d-flex align-items-center gap-2">
              <FaBan /> Not Published
            </span>
          )}
        </h5>
      </div>
      <Tabs
        id="quiz-tabs"
        activeKey={navTab}
        onSelect={(k) => setNavTab(k || "details")}
        className="custom-tabs"
      >
        <Tab eventKey="details" title="Details">
          <DetailsEditor 
          quiz={quiz}
          handleChange={handleDetailsChange}
          handleSave={()=>handleDetailSave(quiz)}
          handleSaveAndPublish={handleSaveAndPublish}
          create={create}
          />
        </Tab>
        <Tab eventKey="questions" title="Questions">
        <div>
      <div className="mt-3 d-flex justify-content-between align-items-center">
        <h5>Total Points: {quiz.points}</h5>
      <Button onClick={handleAddQuestion}>New Question</Button>
      </div>
      {questionsChanged && <h5 style={{color:"orange"}} className="d-flex justify-content-center align-items-center">
        <FaInfoCircle className="me-2"/>
        Save the quiz to reflect the changes in the questions
        
        </h5>}
      <Tabs
        id="questions-tabs"
        activeKey={activeQuestion}
        onSelect={(k) => setActiveQuestion(k || "0")}
        className="custom-tabs mt-3"
      >
        {quiz.questions.map((question,index) => (
          <Tab eventKey={index.toString()} title={`Q${index+1}`}>
           <QuestionEditor
           index={index+1}
           question={question}
           onSave={handleSaveQuestion}
           onDelete={() => handleDeleteQuestion(index)}
         />
          </Tab>
        ))}
      </Tabs>
    </div>
        </Tab>
      </Tabs>
    </div>
  );
};
export default QuizEditor;

