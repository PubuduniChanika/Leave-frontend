import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Select, MenuItem, TextField, IconButton } from '@mui/material';
import { useLocation } from 'react-router-dom';

const LeaveForm = () => {
  const [dateRanges, setDateRanges] = useState([]);
  const [totalDays, setTotalDays] = useState(0);
  const [employeeDetails, setEmployeeDetails] = useState({ id: '', name: '', post: '' });
  const location = useLocation();

  // Extract query parameters
  const queryParams = new URLSearchParams(location.search);
  const emp_id = queryParams.get('id');
  const year = queryParams.get('year');
  const month = queryParams.get('month');

  // Fetch employee and leave data
  useEffect(() => {
    if (emp_id && year && month) {
      fetch(`http://localhost/ems/admin/Leave/fetch_individual_leave.php?id=${emp_id}&year=${year}&month=${month}`, {
        method: 'GET',
        credentials: 'include', // Include session credentials
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 'success') {
            // Update employee details
            setEmployeeDetails(data.employee);

            // Update leave records
            const fetchedRecords = data.leave_records.map((record) => ({
              fromDate: record.from_date,
              toDate: record.to_date,
              numberOfDays: record.number_of_days,
              leaveType: record.leave_type,
            }));
            setDateRanges(fetchedRecords);
          } else {
            alert('Failed to fetch employee or leave data.');
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          alert('Error loading data.');
        });
    }
  }, [emp_id, year, month]);

  // Add a new row
  const handleAddRow = () => {
    setDateRanges([
      ...dateRanges,
      { fromDate: '', toDate: '', numberOfDays: '', leaveType: '' },
    ]);
  };

  // Remove a row
  const handleRemoveRow = (index) => {
    const updatedDateRanges = dateRanges.filter((_, i) => i !== index);
    setDateRanges(updatedDateRanges);
  };

  // Handle input change
  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedDateRanges = [...dateRanges];
    updatedDateRanges[index][name] = value;

    if (name === 'fromDate' || name === 'toDate') {
      const fromDate = new Date(updatedDateRanges[index].fromDate);
      const toDate = new Date(updatedDateRanges[index].toDate);

      if (fromDate && toDate && fromDate <= toDate) {
        const timeDifference = toDate - fromDate;
        const daysDifference = (timeDifference / (1000 * 3600 * 24) + 1).toFixed(2);
        updatedDateRanges[index].numberOfDays = daysDifference;
      } else {
        updatedDateRanges[index].numberOfDays = '';
      }
    }

    setDateRanges(updatedDateRanges);
  };

  // Calculate total days
  useEffect(() => {
    const total = dateRanges.reduce((sum, range) => {
      return sum + (parseFloat(range.numberOfDays) || 0);
    }, 0);
    setTotalDays(total);
  }, [dateRanges]);

  // Submit leave data
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = dateRanges.every(
      (range) =>
        range.fromDate &&
        range.toDate &&
        range.numberOfDays &&
        range.leaveType
    );

    if (!isValid) {
      alert('Please fill all fields for each row before submitting.');
      return;
    }

    try {
      const response = await fetch(
        `http://localhost/ems/admin/Leave/submit_leave.php?emp_id=${emp_id}&year=${year}&month=${month}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dateRanges),
          credentials: 'include',
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert(result.message || 'Leave submitted successfully!');
        window.location.href = '/leave';
      } else {
        alert(result.error || 'An error occurred!');
      }
    } catch (error) {
      console.error('Error submitting leave:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Leave Form</h2>
      {employeeDetails.name && (
        <h3 className="text-xl font-medium mb-4">
          Employee: {employeeDetails.name} (Post: {employeeDetails.post})
        </h3>
      )}
      <form onSubmit={handleSubmit}>
  {dateRanges.map((range, index) => (
    <div
      key={index}
      className="mb-4 flex flex-wrap sm:flex-nowrap gap-4 items-center"
    >
      <TextField
        type="date"
        label="From Date"
        name="fromDate"
        value={range.fromDate}
        onChange={(e) => handleChange(e, index)}
        variant="outlined"
        className="flex-1 min-w-[200px] max-w-[300px]"
      />
      <TextField
        type="date"
        label="To Date"
        name="toDate"
        value={range.toDate}
        onChange={(e) => handleChange(e, index)}
        variant="outlined"
        className="flex-1 min-w-[200px] max-w-[300px]"
      />
      <TextField
        type="number"
        label="Number of Days"
        name="numberOfDays"
        value={range.numberOfDays}
        onChange={(e) => handleChange(e, index)}
        variant="outlined"
        className="flex-1 min-w-[200px] max-w-[300px]"
      />
      <Select
        name="leaveType"
        value={range.leaveType}
        onChange={(e) => handleChange(e, index)}
        displayEmpty
        variant="outlined"
        className="flex-1 min-w-[200px] max-w-[300px]"
      >
        <MenuItem value="" disabled>
          Select Leave Type
        </MenuItem>
        <MenuItem value="Casual">Casual</MenuItem>
        <MenuItem value="Sick">Sick</MenuItem>
        <MenuItem value="Duty">Duty</MenuItem>
      </Select>
      <IconButton
        onClick={() => handleRemoveRow(index)}
        color="error"
        className="flex-shrink-0"
      >
        <RemoveIcon />
      </IconButton>
    </div>
  ))}
  <div className="mt-4">
    <IconButton onClick={handleAddRow} color="primary">
      <AddIcon />
    </IconButton>
  </div>
  <button
    type="submit"
    className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
  >
    Submit
  </button>
</form>

      <div className="mt-6">
        <h3 className="text-lg font-semibold">Total Number of Days: {totalDays}</h3>
      </div>
    </div>
  );
};

export default LeaveForm;
