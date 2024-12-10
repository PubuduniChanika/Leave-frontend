import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EmployeeTable = () => {
  const [groupedEmployees, setGroupedEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(
    String(new Date().getFullYear())
  );
  const [selectedDivision, setSelectedDivision] = useState("6");
  const [divisions, setDivisions] = useState([]);
  const [expandedEmployeeId, setExpandedEmployeeId] = useState(null);

  const navigate = useNavigate();

  const handleYearChange = (e) => setSelectedYear(e.target.value);
  const handleDivisionChange = (e) => setSelectedDivision(e.target.value);

  const toggleEmployeeDetails = (employeeId) => {
    setExpandedEmployeeId((prevId) => (prevId === employeeId ? null : employeeId));
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `http://localhost/ems/admin/Leave/fetch_leave_yearly.php?year=${selectedYear}&division_id=${selectedDivision}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data.status === "success") {
          const grouped = data.data.reduce((acc, record) => {
            const {
              id,
              name,
              post,
              from_date,
              to_date,
              number_of_days,
              leave_type,
            } = record;

            const days = parseFloat(number_of_days);

            if (!acc[id]) {
              acc[id] = {
                id,
                name,
                post,
                leaves: [],
                leaveSummary: {},
              };
            }

            acc[id].leaves.push({ from_date, to_date, number_of_days, leave_type });

            if (acc[id].leaveSummary[leave_type]) {
              acc[id].leaveSummary[leave_type] += days;
            } else {
              acc[id].leaveSummary[leave_type] = days;
            }

            return acc;
          }, {});

          setGroupedEmployees(Object.values(grouped));
        } else {
          throw new Error(
            data.message || "An error occurred while fetching data."
          );
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [selectedYear, selectedDivision]);

  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const response = await fetch(
          "http://localhost/ems/admin/Leave/fetch_divisions.php",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch divisions.");
        }

        const result = await response.json();
        if (result.status === "success") {
          setDivisions(result.data);
        } else {
          throw new Error("Failed to fetch division data.");
        }
      } catch (error) {
        console.error("Error fetching divisions:", error);
      }
    };

    fetchDivisions();
  }, []);

  if (loading) {
    return <div>Loading leave records...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Employee Leave Records</h1>

      <div className="mb-4">
        <label htmlFor="division" className="block text-gray-700 mb-1">
          Division
        </label>
        <select
          id="division"
          value={selectedDivision}
          onChange={handleDivisionChange}
          className="p-2 border rounded"
        >
          <option value="">-- Select Division --</option>
          {divisions.map((division) => (
            <option key={division.id} value={division.id}>
              {division.division}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="year" className="block text-gray-700 mb-1">
          Year
        </label>
        <select
          id="year"
          value={selectedYear}
          onChange={handleYearChange}
          className="p-2 border rounded"
        >
          <option value="">-- Select Year --</option>
          {[...Array(6)].map((_, i) => {
            const year = new Date().getFullYear() - i;
            return (
              <option key={year} value={String(year)}>
                {year}
              </option>
            );
          })}
        </select>
      </div>

      {groupedEmployees.length > 0 ? (
        <div>
          {groupedEmployees.map((employee) => (
            <div key={employee.id} className="border rounded mb-4">
              <div
                className="p-4 cursor-pointer bg-gray-200"
                onClick={() => toggleEmployeeDetails(employee.id)}
              >
                <h2 className="text-lg font-semibold">
                  {employee.name} -{" "}
                  {Object.entries(employee.leaveSummary).map(
                    ([type, totalDays], idx) => (
                      <span key={idx}>
                        {type}: {totalDays} days{" "}
                      </span>
                    )
                  )}
                </h2>
              </div>
              {expandedEmployeeId === employee.id && (
                <div className="p-4 bg-white">
                  <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-4 py-2">From Date</th>
                        <th className="border border-gray-300 px-4 py-2">To Date</th>
                        <th className="border border-gray-300 px-4 py-2">Days</th>
                        <th className="border border-gray-300 px-4 py-2">Leave Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employee.leaves.map((leave, leaveIndex) => (
                        <tr key={leaveIndex}>
                          <td className="border border-gray-300 px-4 py-2">
                            {leave.from_date}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {leave.to_date}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {leave.number_of_days}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {leave.leave_type}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No leave records found for the selected criteria.</p>
      )}
    </div>
  );
};

export default EmployeeTable;
