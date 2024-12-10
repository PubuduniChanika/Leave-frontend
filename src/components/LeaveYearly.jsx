import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const EmployeeTable = () => {
  const [groupedEmployees, setGroupedEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedEmployeeId, setExpandedEmployeeId] = useState(null);
  const [selectedYear, setSelectedYear] = useState(
    String(new Date().getFullYear())
  );
  const toggleEmployeeDetails = (employeeId) => {
    setExpandedEmployeeId((prevId) => (prevId === employeeId ? null : employeeId));
  };
  const navigate = useNavigate();

  const handleYearChange = (e) => setSelectedYear(e.target.value);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `http://localhost/ems/admin/Leave/fetch_division_leave_yearly.php?year=${selectedYear}`,
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
            const days = parseFloat(record.number_of_days);

            if (!acc[id]) {
              acc[id] = {
                id,
                name,
                post,
                leaves: [],
                leaveSummary: {},
              };
            }

            acc[id].leaves.push({
              from_date,
              to_date,
              number_of_days,
              leave_type,
            });

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
  }, [selectedYear]);

  if (loading) {
    return (
      <div className="text-gray-700">
        Loading leave records for {selectedYear}...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Employee Leave Records</h1>
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
        <p className="text-gray-700">
          No leave records found for {selectedYear}.
        </p>
      )}
    </div>
  );
};

export default EmployeeTable;
