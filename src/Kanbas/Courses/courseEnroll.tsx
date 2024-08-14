import { useEffect, useState } from "react";
import * as client from "./client";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
export default function CourseEnroll() {
    const {currentUser} = useSelector((state: any) => state.accountReducer);
    const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [coursesEnrolled, setCoursesEnrolled] = useState<any[]>([]);
  const fetchCourses = async () => {
    const  courses = await client.fetchAllCourses();
    const coursesEnrolled = await client.fetchEnrolledCourses(currentUser._id);
    const coursesEnrolledId = coursesEnrolled.map((c: any) => c._id);
    setCourses(courses);
    setCoursesEnrolled(coursesEnrolledId);
  };
  
  async function enrollCourse(cid: string){
    try {
        await client.enrollCourse(cid, currentUser._id);
        setCoursesEnrolled([...coursesEnrolled, cid]);
        fetchCourses();
    } catch (error) {
        console.error("Failed to enroll course:", error);
    }
  }
  
  useEffect(() => {
    if(!currentUser){
        navigate("/Kanbas/Account/Signin");
    }
    if(currentUser.role === "FACULTY"){
        navigate("/Kanbas/Dashboard");
    }
    fetchCourses();
  }, []);




  return (
    <div>
        <h1 id="wd-dashboard-title">Courses</h1>
      <div id="wd-dashboard-courses" className="row">
        <div className="row row-cols-1 row-cols-md-5 g-4">
          {courses.map((course) => {
            return (
              <div
                className="wd-dashboard-course col"
                style={{ width: "300px" }}
              >
                  <div className="card rounded-3 overflow-hidden">
                    <img src="/images/react.png" height="{160}" alt="ireact" />
                    <div className="card-body">
                      <span
                        className="wd-dashboard-course-link"
                        style={{
                          textDecoration: "none",
                          color: "navy",
                          fontWeight: "bold",
                        }}
                      >
                        {course.name}
                      </span>
                      <p
                        className="wd-dashboard-course-title card-text"
                        style={{ maxHeight: 53, overflow: "hidden" }}
                      >
                        {course.description}
                      </p>
                      <button
                        onClick={() => enrollCourse(course._id)}
                        className="btn btn-primary w-100"  disabled={coursesEnrolled.includes(course._id)}
                      >
                        {coursesEnrolled.includes(course._id) ? "Enrolled" : "Enroll"}
                      </button>
                    </div>
                  </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
