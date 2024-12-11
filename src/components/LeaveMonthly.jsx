import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const EmployeeTable = () => {
  const [groupedEmployees, setGroupedEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(
    String(new Date().getFullYear())
  );
  const [selectedMonth, setSelectedMonth] = useState(
    String(new Date().getMonth()).padStart(2, "0")
  );
  const [selectedStatus, setSelectedStatus] = useState("");
  const [role, setRole] = useState("");
  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("");

  const navigate = useNavigate();

  const handleYearChange = (e) => setSelectedYear(e.target.value);
  const handleMonthChange = (e) => setSelectedMonth(e.target.value);
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setSelectedStatus(newStatus);

    if (newStatus) {
      try {
        const response = await fetch(
          "http://localhost/ems/admin/Leave/leave_status.php",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              year: selectedYear,
              month: selectedMonth,
              status: newStatus,
            }),
          }
        );

        const result = await response.json();

        alert(result.message);
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while updating status.");
      }
    }
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `http://localhost/ems/admin/Leave/fetch_division_leave.php?year=${selectedYear}&month=${selectedMonth}`,
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
          setSelectedStatus(data.status_data?.status || "0");
          setRole(data.role_id);
          setSelectedDivision(data.division_id);
          console.log(data.role_id);
          console.log(data);

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
                leaveSummary: {}, // Initialize leaveSummary object
              };
            }

            // Add the leave record
            acc[id].leaves.push({
              from_date,
              to_date,
              number_of_days,
              leave_type,
            });

            // Calculate total days by leave type
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
  }, [selectedYear, selectedMonth]);

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

  if (loading) {
    return (
      <div className="text-gray-700">
        Loading leave records for {selectedYear}-{selectedMonth}...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Employee Leave Records</h1>
      <div>
        <label htmlFor="division" className="block text-gray-700 mb-1">
          Division
        </label>
        <select
          id="division"
          value={selectedDivision}
          // onChange={handleDivisionChange}
          className="p-2 border rounded"
          disabled
        >
          <option value="">-- Select Division --</option>
          {divisions.map((division) => (
            <option key={division.id} value={division.id}>
              {division.division}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4 flex gap-4">
        <div>
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
              const year = new Date().getFullYear() + i; // Start from the current year and go up to the next 5 years
              return (
                <option key={year} value={String(year)}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <label htmlFor="month" className="block text-gray-700 mb-1">
            Month
          </label>
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
        <div className="ml-auto">
          <label htmlFor="status" className="block text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            value={selectedStatus}
            onChange={handleStatusChange}
            className="p-2 border rounded"
            disabled
          >
            <option value="1" disabled={selectedStatus > 2}>
              -- Select Status --
            </option>
            <option value="2" disabled={role !== 4 || selectedStatus > 2}>
              Done
            </option>
            <option value="3" disabled={role !== 5 || selectedStatus > 3}>
              Recommended
            </option>
            <option value="4" disabled={role !== 6}>
              Approved
            </option>
          </select>
        </div>
      </div>

      {groupedEmployees.length > 0 ? (
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">S.No</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Post</th>
              <th className="border border-gray-300 px-4 py-2">From Date</th>
              <th className="border border-gray-300 px-4 py-2">To Date</th>
              <th className="border border-gray-300 px-4 py-2">Days</th>
              <th className="border border-gray-300 px-4 py-2">Leave Type</th>
              <th className="border border-gray-300 px-4 py-2">
                Total Leave Days
              </th>
            </tr>
          </thead>
          <tbody>
            {groupedEmployees.map((employee, index) => {
              return employee.leaves.map((leave, leaveIndex) => (
                <tr key={`${index}-${leaveIndex}`}>
                  {leaveIndex === 0 && (
                    <>
                      <td
                        className="border border-gray-300 px-4 py-2"
                        rowSpan={employee.leaves.length}
                      >
                        {index + 1}
                      </td>
                      <td
                        className="border border-gray-300 px-4 py-2"
                        rowSpan={employee.leaves.length}
                      >
                        {employee.name}
                      </td>
                      <td
                        className="border border-gray-300 px-4 py-2"
                        rowSpan={employee.leaves.length}
                      >
                        {employee.post}
                      </td>
                    </>
                  )}
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
                  {leaveIndex === 0 && (
                    <>
                      <td
                        className="border border-gray-300 px-4 py-2"
                        rowSpan={employee.leaves.length}
                      >
                        {Object.entries(employee.leaveSummary).map(
                          ([type, totalDays]) => (
                            <div key={type}>
                              <strong>{type}:</strong> {totalDays} days
                            </div>
                          )
                        )}
                      </td>
                    </>
                  )}
                </tr>
              ));
            })}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-700">
          No leave records found for {selectedYear}-{selectedMonth}.
        </p>
      )}
    </div>
  );
};

export default EmployeeTable;
