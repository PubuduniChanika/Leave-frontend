import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null); 

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

  const closeModal = () => {
    setShowModal(false); // Hide the modal
    setSelectedEmployee(null); // Clear the selected employee
  };

  const handleYearChange = (e) => setSelectedYear(e.target.value);
  const handleMonthChange = (e) => setSelectedMonth(e.target.value);


    const handleEdit = (employeeId) => {
        navigate(`/leave-form?id=${employeeId}&year=${selectedYear}&month=${selectedMonth}`);
      };


      


  if (loading) {
    return <div className="text-gray-700">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Employee List</h1>
      <div className="mb-4 flex gap-4">
        <div>
          <label htmlFor="year" className="block text-gray-700 mb-1">Year</label>
          <select
            id="year"
            value={selectedYear}
            onChange={handleYearChange}
            className="p-2 border rounded"
          >
            <option value="">-- Select Year --</option>
            {[...Array(20)].map((_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <label htmlFor="month" className="block text-gray-700 mb-1">Month</label>
          <select
            id="month"
            value={selectedMonth}
            onChange={handleMonthChange}
            className="p-2 border rounded"
          >
            <option value="">-- Select Month --</option>
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {employees.length > 0 ? (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2 text-left">#</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Post</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee, index) => (
              <tr key={index} className="even:bg-gray-100 odd:bg-white">
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{employee.name}</td>
                <td className="border border-gray-300 px-4 py-2">{employee.post}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => handleEdit(employee.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    <CalendarMonthIcon></CalendarMonthIcon>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-700">No employees found.</p>
      )}
     
    </div>
  );
};

export default EmployeeTable;
