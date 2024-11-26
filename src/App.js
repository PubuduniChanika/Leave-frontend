import React from "react";
import LoginForm from "./components/LoginForm";
import LeaveView from "./components/LeaveView";
import L from "./components/LeaveForm"
import LeaveFormModal from "./components/LeaveFormModal"
import './index.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./common/NavBar";
import Footer from "./common/Footer";

const App = () => {
  return (
    <>
    
    <Router>
    <Navbar></Navbar>
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <Routes>
          {/* Login Page */}
          <Route path="/" element={<LoginForm />} />
          
          {/* Leave Form Page */}
          <Route path="/leave" element={<LeaveView />} />
          <Route path="/leave-form" element={<L />} />
          <Route path="/leave-form-modal" element={<LeaveFormModal />} />
        </Routes>
      </div>
    </Router>
    <Footer></Footer>
    </>
  );
};

export default App;
