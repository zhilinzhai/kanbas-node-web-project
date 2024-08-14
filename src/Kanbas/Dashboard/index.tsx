import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as client from "../Courses/client";
import { useSelector } from "react-redux";
export default function Dashboard() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [courses, setCourses] = useState<any[]>([]);
  const navigate = useNavigate();
  const fetchCourses = async () => {
    if (currentUser.role === "FACULTY") {
      const courses = await client.fetchCourseByCreator(currentUser._id);
      setCourses(courses);
    } else {
      const courses = await client.fetchEnrolledCourses(currentUser._id);
      setCourses(courses);
    }
  };

  useEffect(() => {
    if(!currentUser){
      navigate("/Kanbas/Account/Signin");
    }
    fetchCourses();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteCourse = async (courseId: string) => {
    try {
      await client.deleteCourse(courseId);
      setCourses(courses.filter((c) => c._id !== courseId));
    } catch (error) {
      console.error("Failed to delete course:", error);
    }
  };

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      {courses.length > 0 ? (
        <>
          <div className="d-flex justify-content-between">
            <h2 id="wd-dashboard-published">
              {currentUser.role === "FACULTY"
                ? "Courses Created by You"
                : "Courses Enrolled by You"}{" "}
              ({courses.length})
            </h2>
            {currentUser.role === "FACULTY" ? (
              <button
                className="btn btn-primary"
                onClick={() =>
                  (window.location.href = "/Kanbas/Course/Create/new")
                }
              >
                Create a course
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() =>
                  (window.location.href = "/Kanbas/Course/Enroll")
                }
              >
                Enroll in a course
              </button>
            )}
          </div>
          <hr />
          <div id="wd-dashboard-courses" className="row">
            <div className="row row-cols-1 row-cols-md-5 g-4">
              {courses.map((course) => {
                return (
                  <div
                    className="wd-dashboard-course col"
                    style={{ width: "300px" }}
                  >
                    <Link
                      to={`/Kanbas/Courses/${course.cid}/Home`}
                      className="text-decoration-none"
                    >
                      <div className="card rounded-3 overflow-hidden">
                        <img
                          src="/images/react.png"
                          height="{160}"
                          alt="ireact"
                        />
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
                          <Link
                            to={`/Kanbas/Courses/${course.cid}/Home`}
                            className="btn btn-primary"
                          >
                            Go
                          </Link>
                          {currentUser.role === "FACULTY" && (
                            <>
                              <button
                                onClick={(event) => {
                                  event.preventDefault();
                                  deleteCourse(course._id);
                                }}
                                className="btn btn-danger float-end"
                                id="wd-delete-course-click"
                              >
                                Delete
                              </button>
                              <button
                                id="wd-edit-course-click"
                                onClick={(event) => {
                                  event.preventDefault();
                                  navigate(`/Kanbas/Course/Edit/${course._id}`);
                                }}
                                className="btn btn-warning me-2 float-end"
                              >
                                Edit
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <div
          id="wd-dashboard-no-courses"
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            marginTop: "100px",
          }}
        >
          {currentUser.role === "FACULTY" ? (
            <div className="text-center">
              <h3>You have not created any courses yet.</h3>
              <a href="/Kanbas/Course/Create/new" className="btn btn-primary mt-3">
                Create a course
              </a>
            </div>
          ) : (
            <div className="text-center">
            <h3>You have not enrolled in any courses yet.</h3>
            <a href="/Kanbas/Course/Enroll" className="btn btn-primary mt-3">
              Enroll in a course
            </a>
          </div>
          )}
        </div>
      )}
    </div>
  );
}
