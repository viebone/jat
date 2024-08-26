import React, { useState } from 'react';

function FilterPanel({ onFilter, onReset }) {
  const [filters, setFilters] = useState({
    status: '',
    job_type: '',
    location_type: '',
    salary_min: '',
    salary_max: '',
    company: '',
    date_created: ''
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);  // Pass filters back to KanbanBoard
  };

  const handleReset = () => {
    // Clear the filter state
    setFilters({
      status: '',
      job_type: '',
      location_type: '',
      salary_min: '',
      salary_max: '',
      company: '',
      date_created: ''
    });
    onReset();  // Call the reset function from the parent component
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-4">
      <select name="status" value={filters.status} onChange={handleChange}>
        <option value="">All Statuses</option>
        <option value="Saved">Saved</option>
        <option value="Applied">Applied</option>
        <option value="Interviewing">Interviewing</option>
        <option value="Offer">Offer</option>
        <option value="Rejected">Rejected</option>
      </select>

      <select name="job_type" value={filters.job_type} onChange={handleChange}>
        <option value="">All Job Types</option>
        <option value="Full-time">Full-time</option>
        <option value="Half-time">Half-time</option>
      </select>

      <select name="location_type" value={filters.location_type} onChange={handleChange}>
        <option value="">All Locations</option>
        <option value="Remote">Remote</option>
        <option value="Hybrid">Hybrid</option>
        <option value="Office based">Office based</option>
      </select>

      <input
        type="number"
        name="salary_min"
        placeholder="Min Salary"
        value={filters.salary_min}
        onChange={handleChange}
      />
      <input
        type="number"
        name="salary_max"
        placeholder="Max Salary"
        value={filters.salary_max}
        onChange={handleChange}
      />

      <input
        type="text"
        name="company"
        placeholder="Company"
        value={filters.company}
        onChange={handleChange}
      />

      <input
        type="date"
        name="date_created"
        value={filters.date_created}
        onChange={handleChange}
      />

      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        Apply Filters
      </button>
      <button
        type="button"  // Change type to "button" so it doesn't trigger form reset automatically
        onClick={handleReset}  // Trigger the custom reset logic
        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
      >
        Reset
      </button>
    </form>
  );
}

export default FilterPanel;
