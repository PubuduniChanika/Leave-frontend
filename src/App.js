import LoginForm from "./components/LoginForm";
import LeaveForm from "./components/LeaveForm"
import LeaveView from "./components/LeaveView";
import LeaveViewAdmin from "./components/LeaveViewAdmin"
import LeaveMonthly from "./components/LeaveMonthly"
import LeaveAdminMonthly from "./components/LeaveAdminMonthly"
import LeaveAdminYearly from "./components/LeaveAdminYearly"
import LeaveYearly from "./components/LeaveYearly"
import './index.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Navbar from "./common/NavBar";
import Footer from "./common/Footer";
import axios from "axios";

  

const App = () => {
  const [roleId, setRoleId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Call the PHP API to get the user details and role_id
    axios.get("http://localhost/ems/admin/Leave/common/authorization_check.php", { withCredentials: true })
      .then(response => {
        console.log(response.data);
        if (response.data.status === "success") {
          setRoleId(response.data.data.role_id);
          setUserName(response.data.data.username);
          console.log("Role ID: " + response.data.data.role_id); 
        } else {
          setError(response.data.data.message); // Handle error if any
        }
      })
      .catch(error => {
        setError("An error occurred while fetching the role.");
        console.error("API error:", error);
      });
  }, []);
  return (
    <>
    
    <Router>
    <Navbar roleId={roleId} userName={userName}></Navbar>

      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <Routes>
          {/* Login Page */}
          <Route path="/" element={<LoginForm />} />
          
          {/* Leave Form Page */}
          <Route path="/leave" element={<LeaveView />} />
          <Route path="/leave-admin" element={<LeaveViewAdmin />} />
          <Route path="/leave-monthly" element={<LeaveMonthly />} />
          <Route path="/leave-admin-monthly" element={<LeaveAdminMonthly />} />
          <Route path="/leave-admin-yearly" element={<LeaveAdminYearly />} />
          <Route path="/leave-yearly" element={<LeaveYearly />} />
          <Route path="/leave-form" element={<LeaveForm />} />
          
        </Routes>
      </div>
    </Router>
    <Footer></Footer>
    </>
  );
};

export default App;
