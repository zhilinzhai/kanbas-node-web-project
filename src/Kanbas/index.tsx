import { Provider } from "react-redux";
import { Routes, Route, Navigate } from "react-router";
import ProtectedRoute from "./ProtectedRoute";
import store from "./store";
import Account from "./Account";
import Dashboard from "./Dashboard";
import KanbasNavigation from "./Navigation";
import Courses from "./Courses";
import "./styles.css";
import CoursesCreator from "./Courses/courseCreator";
import CourseEnroll from "./Courses/courseEnroll";

export default function Kanbas() {
  return (
    <Provider store={store}>
      <div id="wd-kanbas" className="h-100">
        <div className="d-flex h-100">
          <div className="d-none d-md-block bg-black">
            <KanbasNavigation />
          </div>
          <div className="flex-fill p-4">
            <Routes>
              <Route path="/" element={<Navigate to="Dashboard" />} />
              <Route path="/Account/*" element={<Account />} />
              <Route path="Dashboard" element={
                <ProtectedRoute>
                <Dashboard/>
                </ProtectedRoute>
              } />
              <Route path="Course/:type/:id" element={<ProtectedRoute><CoursesCreator/></ProtectedRoute>} />
              <Route path="Course/enroll" element={<ProtectedRoute><CourseEnroll/></ProtectedRoute>} />
              <Route path="Courses/:cid/*" element={<ProtectedRoute><Courses/></ProtectedRoute>} />
              <Route path="Calendar" element={<h1>Calendar</h1>} />
              <Route path="Inbox" element={<h1>Inbox</h1>} />
            </Routes>
          </div>
        </div>
      </div>
    </Provider>
  );
}
