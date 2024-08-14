import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";
import { useState,useEffect } from "react";
import { Link, useLocation } from "react-router-dom";


export default function KanbasNavigation() {
  const { pathname } = useLocation();
  const links = [
    { label: "Dashboard", path: "/Kanbas/Dashboard", icon: AiOutlineDashboard },
    { label: "Courses",   path: "/Kanbas/Dashboard", icon: LiaBookSolid },
    { label: "Calendar",  path: "/Kanbas/Calendar",  icon: IoCalendarOutline },
    { label: "Inbox",     path: "/Kanbas/Inbox",     icon: FaInbox },
    { label: "Labs",      path: "/Labs",             icon: LiaCogSolid },
  ];


  const [currHash,setCurrHash] = useState(window.location.hash);

  useEffect(()=>{
    const onHashChange = ()=>{
      setCurrHash(window.location.hash);
    }

    window.addEventListener('hashchange', onHashChange);

    return()=>{
      window.removeEventListener('hashchange',onHashChange);
    }

  },[]);


  function currentNav(choosenNav:string){
    if(currHash === choosenNav){
      return "bg-white text-danger"
    }
    return "bg-black text-white"
  }


  return (
    <div id="wd-kanbas-navigation" className="list-group rounded-0" style={{ width: '110px', backgroundColor: 'black' }}>
      <a id="wd-neu-link"  href="/"
        className="list-group-item bg-black border-0 text-center">
        <img src="/images/NEU.png" width="75px" alt="Northeastern Logo" />
      </a>
      <Link key="/Kanbas/Account" to="/Kanbas/Account" className={`list-group-item text-center border-0 bg-black
            ${pathname.includes("Account") ? "bg-white text-danger" : "bg-black text-white"}`}>
        <FaRegCircleUser className={`fs-1 ${pathname.includes("Account") ? "text-danger" : "text-white"}`} />
        <br />
        Account
      </Link>
      {links.map((link) => (
        <Link key={link.path} to={link.path} className={`list-group-item bg-black text-center border-0
              ${pathname.includes(link.label) ? "text-danger bg-white" : "text-white bg-black"}`}>
          {link.icon({ className: "fs-1 text-danger"})}
          <br />
          {link.label}
        </Link>
      ))}

      
      {/* <a id="wd-account-link" href="#/Kanbas/Account"
        className="list-group-item text-white bg-black text-center border-0">
        <FaRegCircleUser className="fs-1 text-white" /><br />
        Account 
      </a>

      <a id="wd-dashboard-link" href="#/Kanbas/Dashboard"
        className={`list-group-item text-center border-0 ${currentNav("#/Kanbas/Dashboard")}`}>
        <AiOutlineDashboard className="fs-1 text-danger" /><br />
        Dashboard 
      </a>

      <a id="wd-course-link" href="#/Kanbas/Courses"
        className={`list-group-item text-center border-0 ${currentNav("#/Kanbas/Courses")}`}>
        <LiaBookSolid className="fs-1 text-danger" /><br />
        Courses 
      </a>

      <a id="wd-calendar-link" href="#/Kanbas/Calendar"
        className={`list-group-item text-center border-0 ${currentNav("#/Kanbas/Calendar")}`}>
        <IoCalendarOutline className="fs-1 text-danger" /><br />
        Calendar 
      </a>

      <a id="wd-inbox-link" href="#/Kanbas/Inbox"
        className={`list-group-item text-center border-0 ${currentNav("#/Kanbas/Inbox")}`}>
        <FaInbox className="fs-1 text-danger" /><br />
        Inbox 
      </a>

      <a id="wd-labs-link" href="#/Kanbas/Labs"
        className={`list-group-item text-center border-0 ${currentNav("#/Kanbas/Labs")}`}>
        <LiaCogSolid className="fs-1 text-danger" /><br />
        Labs 
      </a> */}
    </div>
  );
}
