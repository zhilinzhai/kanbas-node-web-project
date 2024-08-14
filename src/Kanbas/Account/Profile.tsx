import * as client from "./client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
export default function Profile() {
    const [profile, setProfile] = useState<any>({});
    const navigate = useNavigate();
    const fetchProfile = async () => {
        try {
            const account = await client.profile();
            setProfile(account);
          } catch (err: any) {
            if(!localStorage.getItem("currentUser")) {
                navigate("/Kanbas/Account/Signin");
            }else{
                const currentUser = JSON.parse(localStorage.getItem("currentUser") || "");
                setProfile(currentUser);
            }
          }
    };
    useEffect(() => { fetchProfile(); }, []);
    const dispatch = useDispatch();
    const signout = async () => {
      await client.signout();
      dispatch(setCurrentUser(null));
      navigate("/Kanbas/Account/Signin");
    };
  

    return (
        <div className="wd-profile-screen">
            <h1>Profile</h1>
            {profile && (
                <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
                    <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
                        <label style={{width:"150px"}}>Username: </label>
                        <input className="wd-username" value={profile.username}  style={{width:"100%"}}
                            onChange={(e) => setProfile({ ...profile, username: e.target.value })} />
                    </div>
                    <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
                        <label style={{width:"150px"}}>Password: </label>
                        <input className="wd-password" value={profile.password} style={{width:"100%"}}
                            onChange={(e) => setProfile({ ...profile, password: e.target.value })} />
                    </div>
                    <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
                        <label style={{width:"150px"}}>First Name: </label>
                        <input className="wd-firstname" value={profile.firstName} style={{width:"100%"}}
                            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} />
                    </div>
                    <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
                        <label style={{width:"150px"}}>Last Name: </label>
                        <input className="wd-lastname" value={profile.lastName} style={{width:"100%"}}
                            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} />
                    </div>
                    <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
                        <label style={{width:"150px"}}>Date of Birth: </label>
                        <input className="wd-dob" value={profile.dob ? new Date(profile.dob).toISOString().split("T")[0]:''} type="date" style={{width:"100%"}}
                            onChange={(e) => setProfile({ ...profile, dob: e.target.value })} />
                    </div>
                    <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
                        <label style={{width:"150px"}}>Email: </label>
                        <input className="wd-email" value={profile.email} style={{width:"100%"}}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                    </div>
                    <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
                        <label style={{width:"150px"}}>Role: </label>
                        <select className="wd-role" value={profile.role} onChange={(e) => setProfile({ ...profile, role: e.target.value })} style={{width:"100%"}}>
                            <option value="USER">User</option>
                            <option value="ADMIN">Admin</option>
                            <option value="FACULTY">Faculty</option>
                            <option value="STUDENT">Student</option>
                        </select>
                    </div>
                    <button onClick={signout} className="wd-signout-btn btn btn-danger w-100">
                        Sign out
                    </button>
                </div>
            )}
        </div>
    );
}

