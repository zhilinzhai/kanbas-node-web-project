import { Row, Col, Button, Form } from "react-bootstrap";
import ReactQuill from "react-quill";
import { quiz_t } from "../type";
import { useNavigate } from "react-router";
import { publishOrUnpublishQuiz } from "../client";

export default function DetailsEditor({
  quiz,
  handleChange,
  handleSave,
  create,
  handleSaveAndPublish,
}: {
  handleSave: () => Promise<false | undefined>;
  quiz: quiz_t;
  handleChange: (e: any) => void;
  create: Boolean;
  handleSaveAndPublish: (e: any) => Promise<void>;
}) {
    const navigate = useNavigate();
    const handleCancel = () => navigate(-1);

  return (
    <Form className="p-3" onSubmit={(e)=>{e.preventDefault(); handleSave()}}>
      <Form.Group controlId="title" className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control
          required
          type="text"
          name="title"
          value={quiz.title}
          onChange={handleChange as any}
        />
      </Form.Group>

      <Form.Group
        controlId="description"
        className="mb-3 overflow-hidden"
        style={{ minHeight: "200px" }}
      >
        <Form.Label>Quiz Instruction :</Form.Label>
        <ReactQuill
          theme="snow"
          style={{ height: "125px" }}
          value={quiz.description}
          onChange={(value) =>
            handleChange({
              target: { name: "description", value },
            })
          }
        />
      </Form.Group>
      <Form.Group controlId="quizType" className="mb-3">
        <Form.Label>Quiz Type</Form.Label>
        <Form.Select
          name="quizType"
          value={quiz.quizType}
          onChange={handleChange}
        >
          <option value="Graded Quiz">Graded Quiz</option>
          <option value="Practice Quiz">Practice Quiz</option>
          <option value="Graded Survey">Graded Survey</option>
          <option value="Ungraded Survey">Ungraded Survey</option>
        </Form.Select>
      </Form.Group>

      <Form.Group controlId="assignmentGroup" className="mb-3">
        <Form.Label>Assignment Group</Form.Label>
        <Form.Select
          name="assignmentGroup"
          value={quiz.assignmentGroup}
          onChange={handleChange}
        >
          <option value="Quizzes">Quizzes</option>
          <option value="Exams">Exams</option>
          <option value="Assignments">Assignments</option>
          <option value="Project">Project</option>
        </Form.Select>
      </Form.Group>

      <Form.Group controlId="shuffleAnswers" className="mb-3">
        <Form.Check
          type="checkbox"
          name="shuffleAnswers"
          label="Shuffle Answers"
          checked={quiz.shuffleAnswers}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId="timeLimit" className="mb-3">
        <Form.Check
          type="checkbox"
          name="timeLimit"
          label="Time Limit"
          checked={quiz.timeLimit > 0}
          onChange={(e) => handleChange(e as any)}
        />
        {quiz.timeLimit > 0 && (
          <div className="mt-2 d-flex align-items-center">
            <Form.Control
              type="number"
              name="timeLimit"
              min={1}
              value={quiz.timeLimit}
              onChange={handleChange as any}
              style={{ width: "100px" }}
            />
            <p className="ms-2 m-0">minutes</p>
          </div>
        )}
      </Form.Group>

      <Form.Group controlId="multipleAttempts" className="mb-3">
        <Form.Check
          type="checkbox"
          name="multipleAttempts"
          label="Allow Multiple Attempts"
          checked={quiz.multipleAttempts}
          onChange={(e) => handleChange(e as any)}
        />
        {quiz.multipleAttempts && (
          <div className="mt-2 d-flex align-items-center">
            <p className="m-0">Number of Attempts</p>
            <Form.Control
              type="number"
              name="numberOfAttempts"
              min={1}
              value={quiz.numberOfAttempts}
              onChange={handleChange as any}
              className="ms-2"
              style={{ width: "100px" }}
            />
          </div>
        )}
      </Form.Group>

      <Row className="mb-3">
        <Col>
          <Form.Group controlId="dueDate">
            <Form.Label>Due Date</Form.Label>
            <Form.Control
              required
              type="date"
              name="dueDate"
              value={
                quiz.dueDate
                  ? new Date(quiz.dueDate).toISOString().split("T")[0]
                  : ""
              }
              onChange={handleChange as any}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="availableDate">
            <Form.Label>Available Date</Form.Label>
            <Form.Control
              required
              type="date"
              name="availableDate"
              value={
                quiz.availableDate
                  ? new Date(quiz.availableDate).toISOString().split("T")[0]
                  : ""
              }
              onChange={handleChange as any}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="untilDate">
            <Form.Label>Until Date</Form.Label>
            <Form.Control
              required
              type="date"
              name="untilDate"
              value={
                quiz.untilDate
                  ? new Date(quiz.untilDate).toISOString().split("T")[0]
                  : ""
              }
              onChange={handleChange as any}
            />
          </Form.Group>
        </Col>
      </Row>

      <div className="d-flex justify-content-end gap-3">
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          variant="outline"
          className="bg-danger text-white"
          type="submit"
        >
          {!create ? "Save" : "Create"}
        </Button>
        {!quiz.isPublished || create ? (
          <Button
            variant="outline"
            className="bg-success text-white"
            onClick={handleSaveAndPublish}
          >
            {!create ? "Save" : "Create"} & Publish
          </Button>
        ) : (
          <Button variant="outline" className="bg-danger text-white" 
          onClick = {(e) => {
            try{
                publishOrUnpublishQuiz(quiz._id!);
                handleChange({target: {name: "isPublished", value: false}});
            }catch(error){
                console.log(error);
            }
          }}
          >
            Unpublish
          </Button>
        )}
      </div>
    </Form>
  );
}
