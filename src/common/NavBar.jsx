import React from "react";
import { useNavigate } from "react-router-dom"; // For navigation after logout
import axios from "axios"; // For making API requests

function Navbar() {
  const navigate = useNavigate(); // React Router's navigation hook

  const handleLogout = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to logout this user?"
    );
    if (confirmDelete) {
      try {
        // Call the logout API
        const response = await axios.post("http://localhost/ems/admin/Leave/common/logout.php", {}, { withCredentials: true });

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

  return (
    <nav className="bg-gray-800 py-2"> {/* Adjusted padding for compactness */}
      <div className="container mx-auto flex justify-between items-center max-w-7xl"> {/* Limit width */}
        <div className="text-white text-lg font-bold flex items-center"> {/* Ensure the logo and title are aligned */}
          <img
            src={require("../img/logo.png")}
            alt="Government Logo"
            className="mr-2 w-8 h-8" // Adjusts the size of the image
          />
          <span>Prime Minister's Office</span> {/* Optional site title */}
        </div>
        <ul className="flex space-x-4">
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
