import { FaPlus } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import * as client from "./client";
import PeopleDetails from "./Details"; 
import { useSelector } from "react-redux";

export default function PeopleTable() {
  const [users, setUsers] = useState<any[]>([]);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { cid } = useParams();
  const createUser = async () => {
    const user = await client.createUser({
      firstName: "New",
      lastName: `User${users.length + 1}`,
      username: `newuser${Date.now()}`,
      password: "password123",
      section: "S101",
      role: "STUDENT",
    });
    setUsers([...users, user]);
  };

  const filterUsersByName = async (name: string) => {
    setName(name);
    if (name) {
      const users = await client.findUsersByPartialName(name);
      setUsers(users);
    } else {
      fetchUsers();
    }
  }

  const filterUsersByRole = async (role: string) => {
    setRole(role);
    if (role) {
      const users = await client.findUsersByRole(role);
      setUsers(users);
    } else {
      fetchUsers();
    }
  };

  const fetchUsers = async () => {
    const users = await client.findAllUsers();
    setUsers(users);
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  return (
    <div id="wd-people-table">
      {
        currentUser.role === "FACULTY" &&
        <button onClick={createUser} className="float-end btn btn-danger wd-add-people">
      <FaPlus className="me-2" />
      People
    </button>
      }  <input onChange={(e) => filterUsersByName(e.target.value)} placeholder="Search people"
        className="form-control float-start w-25 me-2 wd-filter-by-name" />
        <select value={role} onChange={(e) =>filterUsersByRole(e.target.value)}
        className="form-select float-start w-25 wd-select-role" >
        <option value="">All Roles</option>        <option value="STUDENT">Students</option>
        <option value="TA">Assistants</option>     <option value="FACULTY">Faculty</option>
      </select>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th><th>Login ID</th><th>Section</th><th>Role</th><th>Last Activity</th><th>Total Activity</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: any) => (
            <tr key={user._id}>
              <td style={{cursor:"pointer"}} className="wd-full-name text-nowrap " onClick={()=> { navigate(`/Kanbas/Courses/${cid}/People/${user._id}`)}}>
                <span className="wd-first-name">{user.firstName}</span>
                <span className="wd-last-name">{user.lastName}</span>
              </td>
              <td className="wd-login-id">{user.username}</td>
              <td className="wd-section">{user.section}</td>
              <td className="wd-role">{user.role}</td>
              <td className="wd-last-activity">{user.lastActivity}</td>
              <td className="wd-total-activity">{user.totalActivity}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <PeopleDetails fetchUsers={fetchUsers} />
    </div>
  );
}

