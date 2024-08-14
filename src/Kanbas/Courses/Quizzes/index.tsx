/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Button,
  InputGroup,
  FormControl,
  Dropdown,
} from "react-bootstrap";
import {
  FaRocket,
  FaCheckCircle,
  FaEllipsisV,
  FaPlus,
  FaChevronDown,
} from "react-icons/fa";
import { quiz_t } from "./type";
import * as client from "./client";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { formatDate } from "./utils";

const QuizList = () => {
    const { cid } = useParams();
  const [quizzes, setQuizzes] = useState<quiz_t[]>([]);
  const [loading , setLoading] = useState<boolean>(false);
  const [quizAttempts, setQuizAttempts] = useState<any[]>([]);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
const navigate = useNavigate();
  const addQuiz = () => {
    navigate("Creator/"+cid);
  };

  const deleteQuiz = async (index: number) => {
    try{
        await client.deleteQuiz(quizzes[index]._id!);
        const updatedQuizzes = quizzes.filter((_, i) => i !== index);
        setQuizzes(updatedQuizzes);
    }catch(error){
    }
  };

  const togglePublish = async (index: number) => {
    const updatedQuizzes = quizzes.map((quiz, i) =>
      i === index ? { ...quiz, isPublished: !quiz.isPublished } : quiz
    );
    try{
        await client.publishOrUnpublishQuiz(updatedQuizzes[index]._id!);
        setQuizzes(updatedQuizzes);
    }catch(error){
        console.error("Error publishing/unpublishing quiz:", error);
    }
  };

  const renderAvailability = (quiz: quiz_t) => {
    const currentDate = new Date();
    const availDate = new Date(quiz.availableDate!);
    const untilDate = new Date(quiz.untilDate!);
    if (currentDate > untilDate) {
      return "Closed";
    }
    if (currentDate < availDate) {
      return `Not available until ${availDate!.toLocaleDateString()}`;
    }
    if (currentDate >= availDate && currentDate <= untilDate) {
      return "Available";
    }
    return "No dates set";
  };

  const fetchAllQuiz = async () => {
    setLoading(true);
    const quizzesJson = await client.getQuizWithCourseId(cid!);
    const quizAttempts = await client.getQuizAttemptsByUserId(currentUser._id);
    if(quizAttempts){
      setQuizAttempts(quizAttempts);
    }
    if(currentUser.role === "STUDENT"){
        setQuizzes(quizzesJson.filter((quiz: quiz_t) => quiz.isPublished));
    }else{
        setQuizzes(quizzesJson);
    }
    setLoading(false);
  };


  useEffect(() => {
    fetchAllQuiz();
  }, []);

  return (
    <Container>
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Search for Quiz"
          aria-label="Search for Quiz"
        />
        {currentUser.role === "FACULTY" && <Button variant="danger" onClick={addQuiz}>
          <FaPlus /> Quiz
        </Button>}
      </InputGroup>
      {loading && <p className="text-center">Loading...</p>}

      {!loading && quizzes.length === 0 ? (
        currentUser.role === "FACULTY" ? (
        <p className="text-center">No quizzes available. Click the + Quiz button to add a new quiz.</p>) :(
        <p className="text-center">No quizzes available. Please check back later.</p>
        )
      ) : !loading && (
        <ListGroup>
          <ListGroup.Item variant="light">
            <Row>
              <Col>
                <FaChevronDown style={{ marginRight: "10px" }} />
                <b>Assignment Quizzes</b>
              </Col>
            </Row>
          </ListGroup.Item>
          {quizzes.map((quiz, index) => {
            return (<ListGroup.Item
              key={index}
              className="d-flex align-items-center"
              style={{ borderLeft: "5px solid green" }}
            >
              <Row className="w-100">
                <Col xs={1}>
                  <FaRocket color="green" />
                </Col>
                <Col style={{ padding: "" }}>
                  <strong style={{ cursor:"pointer"}}
                    onClick={() => {
                      currentUser.role === "FACULTY" ? 
                      navigate(`Details/${quiz._id}`) : 
                      navigate(`Preview/${quiz._id}`);
                    }}
                  >
                    {quiz.title}
                  </strong>
                  <br />
                  <small style={{ color: "grey", fontWeight: "500" }}>
                    {`${renderAvailability(quiz)}  |  Due 
                    ${formatDate(new Date(quiz.dueDate!))}  |  ${
                      quiz.points
                    } pts  | 
                    ${quiz.questions.length} Questions`}
                  </small>
                </Col>
{
                currentUser.role === "STUDENT" &&
                <Col xs={2} className="text-right">
                  {quizAttempts.length > 0 &&
                  quizAttempts.filter((attempt) => attempt.quiz === quiz._id).length > 0 ?                  
                  (
                    <div className="d-flex flex-column gap-1">
                    <small>
                    Attempts left : 
                      {quiz.numberOfAttempts - quizAttempts.filter(
                        (attempt) => attempt.quiz === quiz._id
                      )[0]?.attemptNumber}
                    </small>
                    <small>
                      Score:{" "}
                      {quizAttempts
                        .filter((attempt) => attempt.quiz === quiz._id)
                        .map((attempt) => attempt.score)
                        .reduce((a, b) => a + b, 0)}/{quiz.points}
                    </small>
                      </div>
                  )
                : (
                    <small>
                      Attempts left : {quiz.numberOfAttempts}
                    </small>
                  )
                }
                </Col>
}
                {currentUser.role === "FACULTY" && (
                  <>
                    <Col xs={1} className="text-right">
                      <Button
                        variant="link"
                        onClick={() => togglePublish(index)}
                      >
                        {quiz.isPublished ? (
                          <FaCheckCircle color="green" />
                        ) : (
                          <FaCheckCircle color="green" opacity={"30%"} />
                        )}
                      </Button>
                    </Col>
                    <Col xs={1} className="text-right">
                      <Dropdown>
                        <Dropdown.Toggle
                          as={Button}
                          variant="link"
                          className="text-muted custom-dropdown-toggle"
                        >
                          <FaEllipsisV />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() => {
                              navigate(`Editor/${quiz._id}`);
                            }}
                          >
                            Edit
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => deleteQuiz(index)}>
                            Delete
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => togglePublish(index)}>
                            {quiz.isPublished ? "Unpublish" : "Publish"}
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Col>
                  </>
                )}
              </Row>
            </ListGroup.Item>)
})}
        </ListGroup>
      )}
    </Container>
  );
};

export default QuizList;
