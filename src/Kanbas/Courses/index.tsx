import { addAssignment, deleteAssignment, updateAssignment , setAssignment} from "./Assignments/reducer";
import CoursesNavigation from "./Navigation";
import Modules from "./Modules";
import Home from "./Home";
import Assignments from "./Assignments";
import AssignmentEditor from "./Assignments/Editor";
import Grades from "./Grades/Grades";
import PeopleTable from './People/Table';
import { Navigate, Route, Routes, useParams, useLocation } from "react-router";
import { FaAlignJustify } from "react-icons/fa";
import { courses } from "../Database";
import { useDispatch, useSelector } from "react-redux";
import {useEffect} from 'react';
import client from "./Assignments/client";
export default function Courses({ courses }: { courses: any[] }) {
  const { assignments } = useSelector((state: any) => state.assignmentreducer);
  const dispatch = useDispatch();
  const { cid } = useParams();
  const { pathname } = useLocation();
  const course = courses.find((course) => course._id === cid);

  async function fetchNewDatas(){
    try {
      const modules = await client.findAssignmentsForCourse(cid as string);
      dispatch(setAssignment(modules));
    } catch (error) {
      console.error("Error fetching assgnments:", error);
    }
  }
  
  useEffect(()=>{
    fetchNewDatas();
  },[]);

  return (
    <div id="wd-courses">
      <h2 className="text-danger">
        <FaAlignJustify className="me-4 fs-4 mb-1" />
        {course && course.name} &gt; {pathname.split("/")[4]}
      </h2>
      <hr />
      <div className="d-flex">
        <div className="d-none d-md-block">
          <CoursesNavigation cid={cid ?? ""} />
        </div>
        <div className="flex-fill">
          <Routes>
            <Route path="/" element={<Navigate to="Home" />} />
            <Route path="Home" element={<Home />} />
            <Route path="Modules" element={<Modules />} />
            <Route
              path="Assignments"
              element={
                <Assignments
                  assignments={assignments}
                  deleteAssignment={async (assignmentId: string) => {
                    try {
                      await client.deleteAssignment(assignmentId);
                      dispatch(deleteAssignment(assignmentId))
                    } catch (error) {
                      console.log(error);
                    }
                  }
                  }
                />
              }
            />
            <Route
              path="Assignments/:id"
              element={
                <AssignmentEditor
                  addAssignment={async (assignment: any) => {
                    try {
                      const newAssignment = await client.createAssignment(assignment.course, assignment);
                      dispatch(addAssignment(newAssignment))
                    } catch (error) {
                      console.log(error);
                    }
                  }
                  }
                  updateAssignment={async (modifiedAssigment: any) => {
                    try {
                      await client.updateAssignment(modifiedAssigment);
                      dispatch(updateAssignment(modifiedAssigment))
                    } catch (error) {
                      console.log(error);
                    }
                  }
                  }
                  assignments={assignments}
                />
              }
            />
            <Route path="Grades" element={<Grades />} />
            <Route path="People" element={<PeopleTable />} />
            <Route path="People/:uid" element={<PeopleTable />} />

          </Routes>
        </div>
      </div>
    </div>
  );
}

