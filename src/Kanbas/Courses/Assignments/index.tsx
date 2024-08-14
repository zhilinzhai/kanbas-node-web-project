import { FaPlus } from "react-icons/fa";
import { IoEllipsisVertical } from "react-icons/io5";
import LessonControlButtons from "./LessonControlButtons";
import ModulesControlButtons from "./ModulesControlButtons";
import AssignmentSearch from "./AssignmentSearch";
import AssignmentView from "./AssignmentView";
import "../../styles.css";
import { Assignment } from "./AssignmentType";
import { useSelector } from "react-redux";

export default function Assignments({
  assignments,
  deleteAssignment,
}: {
  assignments: Assignment[];
  deleteAssignment: Function;
}) {
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  return (
    <div id="wd-assignments" className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <AssignmentSearch />
        {currentUser.role === "FACULTY" && <div>
          <button
            id="wd-add-assignment-group"
            className="btn me-2 btn-secondary"
          >
            <FaPlus /> Group
          </button>
          <button id="wd-add-assignment" className="btn btn-danger" onClick={
            () => {
                window.location.href = window.location.href + "/new";
            }
          }>
            <FaPlus /> Assignment
          </button>
        </div>}
      </div>
      <div className="wd-assignments-header d-flex justify-content-between align-items-center mb-4">
        <h3 id="wd-assignments-title">ASSIGNMENTS</h3>
        <div className="d-flex align-items-center">
          <span className="wd-assignment-percentage">40% of Total</span>
          <IoEllipsisVertical className="fs-4" />
        </div>
      </div>
      <AssignmentView
        assignments={assignments}
        deleteAssignment={deleteAssignment}
      />
    </div>
  );
}
