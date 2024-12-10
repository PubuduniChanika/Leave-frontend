import React from "react";
import { useNavigate } from "react-router-dom"; // For navigation after logout
import axios from "axios"; // For making API requests

function Navbar({ roleId, userName }) {
  const navigate = useNavigate(); // React Router's navigation hook

  const handleLogout = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to logout this user?"
    );
    if (confirmDelete) {
      try {
        // Call the logout API
        const response = await axios.post(
          "http://localhost/ems/admin/Leave/common/logout.php",
          {},
          { withCredentials: true }
        );

        if (response.data.success) {
          alert(response.data.message); // Show success message
          navigate("/"); // Redirect to login page
        } else {
          alert(response.data.message); // Show error message
        }
      } catch (error) {
        console.error("Logout failed:", error);
        alert("An error occurred during logout. Please try again.");
      }
    }
  };

  const handleThisMonthClick = () => {
    if (roleId === 6) {
      navigate("/leave-admin");
    } else {
      navigate("/leave");
    }
  };

  const handleMonthlyReportClick = () => {
    if (roleId === 6||roleId === 7) {
      navigate("/leave-admin-monthly");
    } else {
      navigate("/leave-monthly");
    }
  };

  const handleYearlyReportClick = () => {
    if (roleId === 6||roleId === 7) {
      navigate("/leave-admin-yearly");
    } else {
      navigate("/leave-yearly");
    }
  };

  return (
    <nav className="bg-gray-800 py-2">
      {" "}
      {/* Adjusted padding for compactness */}
      <div className="container mx-auto flex justify-between items-center max-w-7xl">
        {" "}
        {/* Limit width */}
        <div className="text-white text-lg font-bold flex items-center">
          {" "}
          {/* Ensure the logo and title are aligned */}
          <img
            src={require("../img/logo.png")}
            alt="Government Logo"
            className="mr-2 w-8 h-8" // Adjusts the size of the image
          />
          <span>Prime Minister's Office</span>
        </div>
        <ul className="flex space-x-4 items-center">
          <li>
            <span className="text-green-500 font-semibold">
              {" "}
              {/* Adjust the color class for better clarity */}
              Welcome, {userName || "Guest"}{" "}
              {/* Provide a fallback in case userName is undefined */}
            </span>
          </li>

          {roleId !== 7 && (
          <li>
            <button
              onClick={handleThisMonthClick}
              className="text-white hover:text-green-400 focus:outline-none"
            >
              This Month
            </button>
          </li>)}
          <li>
            <button
              onClick={handleMonthlyReportClick}
              className="text-white hover:text-green-400 focus:outline-none"
            >
              Monthly Report
            </button>
          </li>
          <li>
            <button
              onClick={handleYearlyReportClick}
              className="text-white hover:text-green-400 focus:outline-none"
            >
              Anual Report
            </button>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="text-white hover:text-red-400 focus:outline-none"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
