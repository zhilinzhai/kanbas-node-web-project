import { useParams, Link } from "react-router-dom";
import { FaCheckCircle, FaFileAlt, FaPen, FaTrash } from "react-icons/fa";
import { BsGripVertical } from "react-icons/bs";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import assignmentsData from "../../Database/assignments.json";
import { Assignment } from "./AssignmentType";
import { useSelector } from "react-redux";

export default function AssignmentView({
  assignments,
  deleteAssignment,
}: {
  assignments: Assignment[];
  deleteAssignment: Function;
}) {
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const { cid } = useParams<{ cid: string }>();

  const filteredAssignments = assignments.filter(
    (assignment) => assignment.course === cid
  );

  const handleDelete = (id: string) => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure you want to delete this assignment?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteAssignment(id),
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    });
  };

  return (
    <ul id="wd-assignment-list" className="list-group">
      {filteredAssignments.map((assignment) => (
        <li
          key={assignment._id}
          className="wd-assignment-list-item list-group-item d-flex align-items-center"
        >
          <div className="wd-vertical-bar"></div>
          <div className="d-flex align-items-center flex-grow-1">
            <BsGripVertical className="fs-5 text-secondary me-2" />
            <FaFileAlt className="text-success me-2" />
            <div className="assignment-details">
              <Link
                className="wd-assignment-link"
                to={`/Kanbas/Courses/${cid}/Assignments/${assignment._id}`}
              >
                {assignment.title} <br />
              </Link>
              <span className="text-red">
                Multiple Modules <br />
              </span>
              <span className="text-muted">
                Not available until May 6 at 12:00am <br />
                Due May 13 at 11:59pm | 100 pts
              </span>
            </div>
          </div>
         {currentUser.role==="FACULTY" && <div className="wd-assignment-actions ms-auto d-flex align-items-center">
            <FaPen
              className="text-primary me-4"
              style={{ cursor: "pointer" }}
              onClick={() =>
                window.location.href = window.location.href + "/" + assignment._id
              }
            />

            <FaTrash
              className="text-danger me-4"
              style={{ cursor: "pointer" }}
              onClick={() => handleDelete(assignment._id)}
            />
            <FaCheckCircle className="text-success me-2" />
          </div>}
        </li>
      ))}
    </ul>
  );
}
