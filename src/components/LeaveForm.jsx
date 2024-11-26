import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Select, MenuItem, TextField, IconButton } from '@mui/material';

const DateRangeForm = () => {
  const [dateRanges, setDateRanges] = useState([
    { fromDate: '', toDate: '', numberOfDays: '', leaveType: '' },
  ]);
  const [totalDays, setTotalDays] = useState(0);

  // Handle adding a new row
  const handleAddRow = () => {
    setDateRanges([
      ...dateRanges,
      { fromDate: '', toDate: '', numberOfDays: '', leaveType: '' },
    ]);
  };

  // Handle removing a row
  const handleRemoveRow = (index) => {
    const updatedDateRanges = dateRanges.filter((_, i) => i !== index);
    setDateRanges(updatedDateRanges);
  };

  // Handle field changes for each row
  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedDateRanges = [...dateRanges];
    updatedDateRanges[index][name] = value;

    // If "From Date" or "To Date" is updated, calculate the number of days
    if (name === 'fromDate' || name === 'toDate') {
      const fromDate = new Date(updatedDateRanges[index].fromDate);
      const toDate = new Date(updatedDateRanges[index].toDate);
      if (fromDate && toDate) {
        const timeDifference = toDate - fromDate;
        const daysDifference = timeDifference / (1000 * 3600 * 24);
        updatedDateRanges[index].numberOfDays = daysDifference >= 0 ? daysDifference : '';
      }
    }

    setDateRanges(updatedDateRanges);
  };

  // Update total days when dateRanges changes
  useEffect(() => {
    const total = dateRanges.reduce((sum, range) => {
      return sum + (parseFloat(range.numberOfDays) || 0);
    }, 0);
    setTotalDays(total);
  }, [dateRanges]);

  // Handle editing the "Number of Days" directly
  const handleNumberOfDaysChange = (e, index) => {
    const { value } = e.target;
    const updatedDateRanges = [...dateRanges];
    updatedDateRanges[index].numberOfDays = value;
    setDateRanges(updatedDateRanges);
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Date Range Form</h2>
      <form>
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
              />
            </div>
            <div>
              <TextField
                type="number"
                label="Number of Days"
                name="numberOfDays"
                value={range.numberOfDays}
                onChange={(e) => handleNumberOfDaysChange(e, index)}
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
      </form>

      {/* Total Days */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Total Number of Days: {totalDays}</h3>
      </div>
    </div>
  );
};

export default DateRangeForm;
