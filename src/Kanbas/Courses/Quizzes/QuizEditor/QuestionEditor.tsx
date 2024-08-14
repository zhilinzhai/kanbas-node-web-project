import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { Question } from '../type';
import { compareObjects } from '../utils';
import { FaTrash } from 'react-icons/fa';

const QuestionEditor: React.FC<{
  question: Question;
  onSave: (question: Question) => void;
  onDelete: () => void;
  index: number;
}> = ({ question, onSave,onDelete,index }) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question>(question);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let { name, value } = e.target;
    setCurrentQuestion({
      ...currentQuestion,
      [name]: value,
    });
  };

  const handleSave = () => {
    onSave(currentQuestion);
  };

  const handleReset = () => {
    setCurrentQuestion(question);
  }

  return (
    <Card style={{border:"none"}}>
      <Card.Body>
        <h3 style={{ marginBottom: '20px' }}>Question Number {index} </h3>
        <Form>
          <Form.Group controlId="questionTitle" style={{ marginBottom: '20px' }}>
            <Form.Label style={{ fontWeight: 'bold' }}>Question Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={currentQuestion.title}
              onChange={handleInputChange}
              style={{ padding: '10px' }}
            />
          </Form.Group>
          <Form.Group controlId="questionPoints" style={{ marginBottom: '20px' }}>
            <Form.Label style={{ fontWeight: 'bold' }}>Points</Form.Label>
            <Form.Control
              type="number"
              name="points"
              value={currentQuestion.points}
              onChange={handleInputChange}
              style={{ padding: '10px' }}
            />
          </Form.Group>
          <Form.Group controlId="questionText" style={{ marginBottom: '20px' }}>
            <Form.Label style={{ fontWeight: 'bold' }}>Question</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="questionText"
              value={currentQuestion.questionText}
              onChange={handleInputChange}
              style={{ padding: '10px' }}
            />
          </Form.Group>
          <Form.Group controlId="questionType" style={{ marginBottom: '20px' }}>
            <Form.Label style={{ fontWeight: 'bold' }}>Question Type</Form.Label>
            <Form.Select
              name="questionType"
              value={currentQuestion.questionType}
              onChange={handleInputChange as any}
              style={{ padding: '10px' }}
            >
              <option value="Multiple Choice">Multiple Choice</option>
              <option value="True/False">True/False</option>
              <option value="Fill in Blank">Fill in Blank</option>
            </Form.Select>
          </Form.Group>

          {currentQuestion.questionType === 'Multiple Choice' && (
            <>
              <Form.Label style={{ fontWeight: 'bold' }}>Choices</Form.Label>
              {currentQuestion.choices?.map((choice, index) => (
                <Form.Group key={index} controlId={`choice-${index}`} style={{ marginBottom: '10px' }} className='d-flex align-items-center gap-2'>
                  <Form.Control
                    type="text"
                    placeholder='Enter Choice'
                    value={choice}
                    onChange={(e) => {
                      const newChoices = currentQuestion.choices?.map((c, i) =>
                        i === index ? e.target.value : c,
                      );
                      setCurrentQuestion({
                        ...currentQuestion,
                        choices: newChoices,
                      });
                    }}
                    style={{ padding: '10px' }}
                  />
                  <FaTrash className='text-danger' onClick={() => {
                    const newChoices = currentQuestion.choices?.filter((c, i) => i !== index);
                    setCurrentQuestion({
                      ...currentQuestion,
                      choices: newChoices,
                    });
                  }} style={{ cursor: 'pointer', marginLeft: '10px' }} />
                </Form.Group>
              ))}
              <Button
                variant="link"
                onClick={() =>
                  setCurrentQuestion({
                    ...currentQuestion,
                    choices: [...(currentQuestion.choices || []), ''],
                  })
                }
              >
                Add Choice
              </Button>
              <Form.Group controlId="correctAnswer" style={{ marginBottom: '20px' }}>
                <Form.Label style={{ fontWeight: 'bold' }}>Correct Answer</Form.Label>
                <Form.Control
                  type="text"
                  name="correctAnswer"
                  value={currentQuestion.correctAnswer}
                  onChange={handleInputChange}
                  style={{ padding: '10px' }}
                />
              </Form.Group>
            </>
          )}

          {currentQuestion.questionType === 'True/False' && (
            <Form.Group controlId="correctAnswer" style={{ marginBottom: '20px' }}>
              <Form.Label style={{ fontWeight: 'bold' }}>Correct Answer</Form.Label>
              <div style={{ paddingLeft: '10px' }}>
                <Form.Check
                  type="radio"
                  name="correctAnswer"
                  label="True"
                  value="true"
                  checked={currentQuestion.correctAnswer === 'true'}
                  onChange={handleInputChange}
                  style={{ marginBottom: '10px' }}
                />
                <Form.Check
                  type="radio"
                  name="correctAnswer"
                  label="False"
                  value="false"
                  checked={currentQuestion.correctAnswer === 'false'}
                  onChange={handleInputChange}
                  style={{ marginBottom: '10px' }}
                />
              </div>
            </Form.Group>
          )}

          {currentQuestion.questionType === 'Fill in Blank' && (
            <>
              <Form.Label style={{ fontWeight: 'bold' }}>Possible Answers</Form.Label>
              {currentQuestion.possibleAnswers?.map((answer, index) => (
                <Form.Group key={index} controlId={`possibleAnswer-${index}`} style={{ marginBottom: '10px' }} className='d-flex align-items-center gap-2'>
                  <Form.Control
                    type="text"
                    value={answer}
                    onChange={(e) => {
                      const newAnswers = currentQuestion.possibleAnswers?.map((a, i) =>
                        i === index ? e.target.value : a,
                      );
                      setCurrentQuestion({
                        ...currentQuestion,
                        possibleAnswers: newAnswers,
                      });
                    }}
                    style={{ padding: '10px' }}
                  />
                  <FaTrash className='text-danger' onClick={() => {
                    const newAnswers = currentQuestion.possibleAnswers?.filter((a, i) => i !== index);
                    setCurrentQuestion({
                      ...currentQuestion,
                      possibleAnswers: newAnswers,
                    });
                  }} style={{ cursor: 'pointer', marginLeft: '10px' }} />
                </Form.Group>
              ))}
              <Button
                variant="link"
                onClick={() =>
                  setCurrentQuestion({
                    ...currentQuestion,
                    possibleAnswers: [...(currentQuestion.possibleAnswers || []), ''],
                  })
                }
              >
                Add Possible Answer
              </Button>
              <Form.Group controlId="correctAnswer" style={{ marginBottom: '20px' }}>
                <Form.Label style={{ fontWeight: 'bold' }}>Correct Answer</Form.Label>
                <Form.Control
                  type="text"
                  name="correctAnswer"
                  value={currentQuestion.correctAnswer}
                  onChange={handleInputChange}
                  style={{ padding: '10px' }}
                />
              </Form.Group>
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'end',gap:"10px" }}>
            <Button variant="danger" style={{ padding: '10px 20px' }} onClick={onDelete}>
              Delete
            </Button>
           {
           !compareObjects(currentQuestion,question) &&
           <Button variant="secondary" style={{ padding: '10px 20px' }} onClick={handleReset}>
              Reset
            </Button>}
            <Button variant="primary" onClick={handleSave} style={{ padding: '10px 20px' }} 
            disabled={compareObjects(currentQuestion,question)}
            >
              Update Question
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default QuestionEditor;
