import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "./Modal"; // Import Modal Component

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // State to toggle modal visibility
  const [selectedEmployee, setSelectedEmployee] = useState(null); // Store selected employee for modal
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Months are 0-indexed in JS
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          "http://localhost/ems/admin/leave/division_leave.php",
          { withCredentials: true }
        );

        if (response.data.status === "success") {
          setEmployees(response.data.data || []);
        } else {
          setError(response.data.message || "Failed to fetch employees");
        }
      } catch (err) {
        setError("Failed to fetch employees");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Handle edit button click to open modal
  const handleEdit = (employee) => {
    setSelectedEmployee(employee); // Store the selected employee details
    setShowModal(true); // Show the modal
  };

  // Handle modal close
  const closeModal = () => {
    setShowModal(false); // Hide the modal
    setSelectedEmployee(null); // Clear the selected employee
  };

  return (
    <div>
      <h1>Employee List</h1>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Post</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{employee.name}</td>
              <td>{employee.post}</td>
              <td>
                <button
                  onClick={() => handleEdit(employee)} // Open modal with selected employee
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Edit Date Range
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Date Range Form */}
      <Modal showModal={showModal} closeModal={closeModal}>
        <h2 className="text-2xl mb-4">Edit Date Range for {selectedEmployee?.name}</h2>
        <div className="mb-4">
          <form>
            {/* Pass employee id, year, and month to the form */}
            <div className="mb-4">
              <label className="block text-gray-700">Employee ID:</label>
              <input
                type="text"
                value={selectedEmployee?.id || ""}
                readOnly
                className="p-2 border rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Year:</label>
              <input
                type="text"
                value={selectedYear}
                readOnly
                className="p-2 border rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Month:</label>
              <input
                type="text"
                value={selectedMonth}
                readOnly
                className="p-2 border rounded w-full"
              />
            </div>
            {/* Other form fields here */}
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Save Changes
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default EmployeeTable;
