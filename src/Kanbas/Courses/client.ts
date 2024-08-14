import axios from "axios";

const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
const COURSES_API = `${REMOTE_SERVER}/api/courses`;

export const fetchAllCourses = async () => {
  const { data } = await axios.get(COURSES_API);
  return data;
};

export const fetchCourseById = async (id: string) => {
  const { data } = await axios.get(`${COURSES_API}/${id}`);
  return data;
}

export const fetchCourseByCreator = async (creatorId: string) => {
  const { data } = await axios.get(`${COURSES_API}/creator/${creatorId}`);
  return data;
};

export const fetchEnrolledCourses = async (studentId: string) => {
  const { data } = await axios.get(`${COURSES_API}/student/${studentId}`);
  return data;
}

export const createCourse = async (course: any) => {
  const response = await axios.post(COURSES_API, course);
  return response.data;
};

export const deleteCourse = async (id: string) => {
    const response = await axios.delete(`${COURSES_API}/${id}`);
    return response.data;
  };
  
  
  export const updateCourse = async (course: any) => {
    const response = await axios.put(`${COURSES_API}/${course._id}`, course);
    return response.data;
  };
  
  export const enrollCourse = async (courseId: string, studentId: string) => {
    const response = await axios.post(`${COURSES_API}/${courseId}/enroll/${studentId}`);
    return response.data;
  }