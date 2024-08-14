import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import assignmentsData from "../../Database/assignments.json";
import { Assignment } from "./AssignmentType";
import { useSelector } from "react-redux";

const submissionTypes = [
  "Website URL",
  "Text Entry",
  "Media Recordings",
  "Student Annotation",
  "File Uploads",
];

const Editor = ({
  addAssignment,
  updateAssignment,
  assignments,
}: {
  addAssignment: Function;
  updateAssignment: Function;
  assignments: Assignment[];
}) => {
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const { id, cid } = useParams<{ id: string; cid: string }>();
  const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(
    id === "new"
      ? {
          _id: "new",
          title: "",
          course: cid!,
          description: "",
          points: 0,
          dueDate: "",
          availableDate: "",
          assignmentGroup: "Assignments",
          submissionType: "online",
        }
      : assignments.find((a) => a._id === id) || null
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setCurrentAssignment((prev) => ({
      ...prev!,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentAssignment!._id === "new") {
      addAssignment(currentAssignment);
    } else {
      updateAssignment(currentAssignment);
    }
    window.location.href = `/Kanbas/Courses/${cid}/Assignments`;
  };

  if (!currentAssignment) {
    return <div>Assignment not found</div>;
  }

  return (
    <div id="wd-assignments-editor" className="container mt-4">
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col">
            <label htmlFor="wd-name" className="form-label">
              Assigment Name
            </label>
            <input disabled={currentUser.role !== "FACULTY"}
              id="wd-name"
              name="title"
              value={currentAssignment.title}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label htmlFor="wd-description" className="form-label">
              Assignment Description
            </label>
            <textarea
              disabled={currentUser.role !== "FACULTY"}
              id="wd-description"
              name="description"
              cols={30}
              rows={10}
              placeholder="Enter the assignment description"
              title="Assignment Description"
              className="form-control"
              value={currentAssignment.description}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-6">
            <label htmlFor="wd-points" className="form-label">
              Points
            </label>
            <input disabled={currentUser.role !== "FACULTY"}
              id="wd-points"
              name="points"
              type="number"
              value={currentAssignment.points}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="col-6">
            <label htmlFor="wd-group" className="form-label">
              Assignment Group
            </label>
            <select
              disabled={currentUser.role !== "FACULTY"}
              id="wd-group"
              name="assignmentGroup"
              className="form-control"
              value={currentAssignment.assignmentGroup}
              onChange={handleChange}
            >
              <option value="Assignments">Assignments</option>
              <option value="Quizzes">Quizzes</option>
              <option value="Tasks">Tasks</option>
              <option value="Exams">Exams</option>
            </select>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-6">
            <label htmlFor="wd-display-grade-as" className="form-label">
              Display Grade as
            </label>
            <select
              id="wd-display-grade-as"
              className="form-control"
              value="points"
              // onChange={handleChange}
              disabled
            >
              <option value="percentage">Percentage</option>
              <option value="points">Points</option>
            </select>
          </div>
          <div className="col-6">
            <label htmlFor="wd-submission-type" className="form-label">
              Submission Type
            </label>
            <select
              disabled={currentUser.role !== "FACULTY"}
              id="wd-submission-type"
              name="submissionType"
              className="form-control"
              value={currentAssignment.submissionType}
              onChange={handleChange}
            >
              <option value="online">Online</option>
            </select>
            <div className="form-check">
              {submissionTypes.map((type, index) => (
                <div key={index} className="form-check">
                  <input
                    type="checkbox"
                    id={`wd-${type}`}
                    className="form-check-input"
                    checked={
                      type !== "Student Annotation" && type !== "File Uploads"
                    }
                    // onChange={handleChange}
                    disabled
                  />
                  <label htmlFor={`wd-${type}`} className="form-check-label">
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label htmlFor="wd-assign-to" className="form-label">
              Assign to
            </label>
            <input
              id="wd-assign-to"
              value="Everyone"
              className="form-control mb-2"
              disabled
            />
            <label htmlFor="wd-due-date" className="form-label">
              Due
            </label>
            <input disabled={currentUser.role !== "FACULTY"}
              type="date"
              id="wd-due-date"
              name="dueDate"
              className="form-control mb-2"
              value={currentAssignment.dueDate}
              onChange={handleChange}
            />
            <label htmlFor="wd-available-from" className="form-label">
              Available from
            </label>
            <input disabled={currentUser.role !== "FACULTY"}
              type="date"
              id="wd-available-from"
              name="availableDate"
              className="form-control mb-2"
              value={currentAssignment.availableDate}
              onChange={handleChange}
            />
            <label htmlFor="wd-available-until" className="form-label">
              Until
            </label>
            <input disabled={currentUser.role !== "FACULTY"}
              type="date"
              id="wd-available-until"
              className="form-control mb-2"
              value={currentAssignment.dueDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row">
          <div className="col text-end">
            <Link
              to={`/Kanbas/Courses/${cid}/Assignments`}
              className="btn btn-secondary float-end me-2"
            >
              Cancel
            </Link>
           {
           currentUser.role === "FACULTY" &&
           <button type="submit" className="btn btn-success float-end">
              Save
            </button>}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Editor;

