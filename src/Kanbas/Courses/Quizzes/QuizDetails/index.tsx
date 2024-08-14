import { useNavigate, useParams } from "react-router";
import * as client from "../client"
import { useEffect, useState } from "react";
import { quiz_t } from "../type";
import { useSelector } from "react-redux";
import { Button, Container, Table } from "react-bootstrap";
import { formatDate } from "../utils";
import { FaPencil } from "react-icons/fa6";

const QuizDetails = () => {
    const { qId } = useParams();
    const [quiz, setQuiz] = useState<quiz_t>();
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const navigate = useNavigate();

    async function fetchQuizDetails() {
        try {
            const quiz = await client.getQuizWithId(qId!);
            if(!quiz){
                navigate("/404");
                return;
            }
            setQuiz(quiz);
        } catch (error) {
            navigate("/404");
            console.error("Error fetching quiz details:", error);
        }
    }

    useEffect(() => {
        if(currentUser.role !=="FACULTY"){
            navigate("/");
            return;
        }
        fetchQuizDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    if(!quiz){
        return <div>Loading...</div>;
    }
    return (
        <div>
          <h2>{quiz.title}</h2>
          <Container className="d-flex justify-content-center gap-2 mt-3 mb-3">
          <Button variant="outline-secondary" onClick={() => navigate(`/Kanbas/Courses/${quiz.courseId}/Quizzes/Preview/${quiz._id}`)}>
            Preview
            </Button>
            <Button variant="outline-secondary" onClick={() => navigate(`/Kanbas/Courses/${quiz.courseId}/Quizzes/Editor/${quiz._id}`)}>
              <FaPencil size={15}/>
              <span className="ms-2">
              Edit 
              </span>
            </Button>
            </Container>

          <Table striped bordered hover>
            <tbody>
              <tr>
                <td>Quiz Type</td>
                <td>{quiz.quizType}</td>
              </tr>
              <tr>
                <td>Points</td>
                <td>{quiz.points}</td>
              </tr>
              <tr>
                <td>Assignment Group</td>
                <td>{quiz.assignmentGroup}</td>
              </tr>
              <tr>
                <td>Shuffle Answers</td>
                <td>{quiz.shuffleAnswers ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td>Time Limit</td>
                <td>{quiz.timeLimit} Minutes</td>
              </tr>
              <tr>
                <td>Multiple Attempts</td>
                <td>{quiz.multipleAttempts ? "Yes":"No"}</td>
              </tr>
              <tr>
                <td>How many Attempts</td>
                <td>{quiz.numberOfAttempts}</td>
              </tr>
              <tr>
                <td>Show Correct Answers</td>
                <td>{quiz.showCorrectAnswers ? "Immediately" : "No"}</td>
              </tr>
              <tr>
                <td>Access Code</td>
                <td>{quiz.accessCode}</td>
              </tr>
              <tr>
                <td>One Question at a Time</td>
                <td>{quiz.oneQuestionAtATime ? "Yes":"No"}</td>
              </tr>
              <tr>
                <td>Webcam Required</td>
                <td>{quiz.webcamRequired ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td>Lock Questions After Answering</td>
                <td>{quiz.lockQuestionsAfterAnswering ? "Yes" :"No"}</td>
              </tr>
            </tbody>
          </Table>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Due</th>
                <th>For</th>
                <th>Available from</th>
                <th>Until</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{formatDate(new Date(quiz.dueDate!))}</td>
                <td>Everyone</td>
                <td>{formatDate(new Date(quiz.availableDate!))}</td>
                <td>{formatDate(new Date(quiz.untilDate!))}</td>
              </tr>
            </tbody>
          </Table>
        </div>
      );
    
}
export default QuizDetails;