import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Select, MenuItem, TextField, IconButton } from '@mui/material';
import { useLocation } from 'react-router-dom';

const LeaveForm = () => {
  const [dateRanges, setDateRanges] = useState([
    { fromDate: '', toDate: '', numberOfDays: '', leaveType: '' },
  ]);
  const [totalDays, setTotalDays] = useState(0);
  const location = useLocation();

  // Calculate the previous month's range
  const today = new Date();
  const firstDayOfPreviousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastDayOfPreviousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
  const minDate = firstDayOfPreviousMonth.toISOString().split('T')[0];
  const maxDate = lastDayOfPreviousMonth.toISOString().split('T')[0];

  const queryParams = new URLSearchParams(location.search);
  const emp_id = queryParams.get('id');
  const emp_name = queryParams.get('name');
  const year = queryParams.get('year');
  const month = queryParams.get('month');

  // Fetch leave data
  useEffect(() => {
    if (emp_id && year && month) {
      fetch(`http://localhost/ems/admin/Leave/fetch_individual_leave.php?id=${emp_id}&year=${year}&month=${month}`, {
        method: 'GET',
        credentials: 'include', // Ensure credentials are included in the request
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 'success') {
            const fetchedData = data.data.map((item) => ({
              fromDate: item.from_date,
              toDate: item.to_date,
              numberOfDays: item.number_of_days,
              leaveType: item.leave_type,
            }));
            setDateRanges(fetchedData);
          } else {
            alert('No leave data found for this employee.');
          }
        })
        .catch((error) => {
          console.error('Error fetching leave data:', error);
          alert('Failed to load leave data.');
        });
    }
  }, [emp_id, year, month]);

  const handleAddRow = () => {
    setDateRanges([
      ...dateRanges,
      { fromDate: '', toDate: '', numberOfDays: '', leaveType: '' },
    ]);
  };

  const handleRemoveRow = (index) => {
    const updatedDateRanges = dateRanges.filter((_, i) => i !== index);
    setDateRanges(updatedDateRanges);
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedDateRanges = [...dateRanges];
    updatedDateRanges[index][name] = value;

    if (name === 'fromDate' || name === 'toDate') {
      const fromDate = new Date(updatedDateRanges[index].fromDate);
      const toDate = new Date(updatedDateRanges[index].toDate);

      if (fromDate && toDate && fromDate <= toDate) {
        const timeDifference = toDate - fromDate;
        const daysDifference = (timeDifference / (1000 * 3600 * 24)).toFixed(2);
        updatedDateRanges[index].numberOfDays = daysDifference;
      } else {
        updatedDateRanges[index].numberOfDays = '';
      }
    }

    setDateRanges(updatedDateRanges);
  };

  useEffect(() => {
    const total = dateRanges.reduce((sum, range) => {
      return sum + (parseFloat(range.numberOfDays) || 0);
    }, 0);
    setTotalDays(total);
  }, [dateRanges]);

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
      if (!emp_id || !year || !month) {
        alert('Missing required parameters in the URL.');
        return;
      }

      const response = await fetch(
        `http://localhost/ems/admin/Leave/submit_leave.php?emp_id=${emp_id}&year=${year}&month=${month}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dateRanges),
          credentials: 'include', // Ensure credentials are included in the request
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert(result.message || 'Leave submitted successfully!');
        window.location.href = '/leave';
      } else if (result.status === 'error' && result.message === 'User ID not found in session.') {
        alert('Session expired or user not logged in. Please log in again.');
        window.location.href = '/';
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
      <h3>{emp_name}</h3>
      <hr></hr>
      <br></br>
      <form onSubmit={handleSubmit}>
        {dateRanges.map((range, index) => (
          <div key={index} className="mb-4 flex space-x-4 items-center">
            <div>
              <TextField
                type="date"
                label="From Date"
                name="fromDate"
                value={range.fromDate}
                onChange={(e) => handleChange(e, index)}
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: minDate, max: maxDate }}
              />
            </div>
            <div>
              <TextField
                type="date"
                label="To Date"
                name="toDate"
                value={range.toDate}
                onChange={(e) => handleChange(e, index)}
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: minDate, max: maxDate }}
              />
            </div>
            <div>
              <TextField
                type="number"
                label="Number of Days"
                name="numberOfDays"
                value={range.numberOfDays}
                onChange={(e) => handleChange(e, index)}
                variant="outlined"
                fullWidth
              />
            </div>
            <div>
              <Select
                name="leaveType"
                value={range.leaveType}
                onChange={(e) => handleChange(e, index)}
                displayEmpty
                variant="outlined"
                fullWidth
                style={{ width: '200px', maxWidth: '100%' }}
              >
                <MenuItem value="" disabled>
                  Select Leave Type
                </MenuItem>
                <MenuItem value="Casual">Casual</MenuItem>
                <MenuItem value="Sick">Sick</MenuItem>
                <MenuItem value="Duty">Duty</MenuItem>
              </Select>
            </div>
            <IconButton onClick={() => handleRemoveRow(index)} color="error">
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
