import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useHistory } from "react-router-dom"; // Add history for redirection

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    division_id: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  // const history = useHistory(); // Use history for page navigation

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost/ems/admin/leave/index.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include" // Ensure cookies are sent for session management
      });

      const result = await response.json();

      if (result.status === "success") {
        setMessage(`Welcome ${result.data.username}, Division: ${result.data.division}`);
        navigate("/leave"); 
        // Redirect to another page after successful login
        // history.push("/dashboard"); // Assuming you're redirecting to a dashboard page
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage("An error occurred while trying to log in.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">Division Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
};

export default LoginForm;
