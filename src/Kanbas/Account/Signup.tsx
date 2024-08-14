import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import * as client from "./client";
export default function Signup() {
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signup = async () => {
    try {
      if (!user.username || !user.password || !user.role) {
        setError("All fields are required");
        return;
      }
      const currentUser = await client.signup(user);
      dispatch(setCurrentUser(currentUser));
        navigate("/Kanbas/Account/Profile");
      } catch (err: any) {
        setError(err.response.data.message);
      }
  
  };
  return (
    <div className="wd-signup-screen">
      <h1>Sign up</h1>
      {error && <div className="wd-error alert alert-danger">{error}</div>}
      <input value={user.firstName} onChange={(e) => setUser({ ...user, firstName: e.target.value })}
             className="wd-firstName form-control mb-2" placeholder="First Name" />
      <input value={user.lastName} onChange={(e) => setUser({ ...user, lastName: e.target.value })}
              className="wd-lastName form-control mb-2" placeholder="Last Name" />
      <input value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="wd-email form-control mb-2" placeholder="email" />
      <input value={user.dob} onChange={(e) => setUser({ ...user, dob: e.target.value })}
              className="wd-dob form-control mb-2" type="date" placeholder="Date of Birth" /> 
      <input value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })}
             className="wd-username form-control mb-2" placeholder="username" />
      <input value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} type="password"
             className="wd-password form-control mb-2" placeholder="password" />
            {/*  radio button with role */}
      <div style={{display:"flex", gap:"20px",marginBottom:"10px"}}>
        <div>
        <input type="radio" id="student" name="role" value="STUDENT" onChange={(e) => setUser({ ...user, role: e.target.value })} />
        <label htmlFor="student">Student</label>
        </div>
        <div>
        <input type="radio" id="teacher" name="role" value="FACULTY" onChange={(e) => setUser({ ...user, role: e.target.value })} />
        <label htmlFor="teacher">Teacher</label>
        </div>
      </div>


      <button onClick={signup} className="wd-signup-btn btn btn-primary mb-2"> Sign up </button><br />
      <Link to="/Kanbas/Account/Signin" className="wd-signin-link">Sign in</Link>
    </div>
  );
}
