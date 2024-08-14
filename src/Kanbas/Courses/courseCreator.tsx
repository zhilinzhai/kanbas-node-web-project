import { useNavigate, useParams } from "react-router";
import * as client from "./client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const CourseForm = () => {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { type,id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState({
    name: "",
    number: "",
    startDate: "",
    endDate: "",
    department: "",
    credits: 0,
    description: "",
    createdBy: currentUser._id,
  });

  const fetchCourseWithId = async (id: string) => {
    const course = await client.fetchCourseById(id);
    setCourse({...course, startDate: course.startDate.split("T")[0], endDate: course.endDate.split("T")[0]});
  };

  useEffect(() => {
    if(id==="new"){
      return;
    }
    if (type === "Edit" && id) {
      fetchCourseWithId(id);
    }
  }, [type]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (type === "Edit") {
      try {
        await client.updateCourse(course);
      } catch (error) {
        console.error("Failed to update course:", error);
      }
    } else {
      try {
        await client.createCourse(course);
      } catch (error) {
        console.error("Failed to add new course:", error);
      }
    }
    navigate("/Kanbas/Dashboard");
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setCourse({
      ...course,
      [name]: value,
    });
  };

  return (
    <div className="container">
      <h2>{type === "Edit" ? "Edit Course" : "Create a New Course"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Course Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={course.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="number" className="form-label">
            Course Number
          </label>
          <input
            type="text"
            className="form-control"
            id="number"
            name="number"
            value={course.number}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="startDate" className="form-label">
            Start Date
          </label>
          <input
            type="date"
            className="form-control"
            id="startDate"
            name="startDate"
            value={course.startDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="endDate" className="form-label">
            End Date
          </label>
          <input
            type="date"
            className="form-control"
            id="endDate"
            name="endDate"
            value={course.endDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="department" className="form-label">
            Department
          </label>
          <input
            type="text"
            className="form-control"
            id="department"
            name="department"
            value={course.department}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="credits" className="form-label">
            Credits
          </label>
          <input
            type="number"
            className="form-control"
            id="credits"
            name="credits"
            value={course.credits}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Course Description
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            rows={3}
            value={course.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          {type === "Edit" ? "Update Course" : "Create Course"}
        </button>
      </form>
    </div>
  );
};

export default CourseForm;
