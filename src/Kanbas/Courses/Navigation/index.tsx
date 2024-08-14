import "./index.css";
import {useLocation } from "react-router";
export default function CoursesNavigation({cid}:{cid:string}) {
   const links = ["Home", "Modules", "Piazza", "Zoom", "Assignments", "Quizzes", "Grades", "People"];
   const {pathname} = useLocation();
   const currentLocation = pathname.split("/")[4];

  return (
    <div id="wd-courses-navigation" className="list-group fs-5 rounded-0">
      {
         links.map((item) => (
            <a id={`wd-courses-${item}-link`} href={`#/Kanbas/Courses/${cid}/${item}`} 
            className={`list-group-item border border-0 ${currentLocation === item ? "active" : "text-danger"}`}>
               {item}
            </a>
         ))
      }
    </div>
  );
}


  
  