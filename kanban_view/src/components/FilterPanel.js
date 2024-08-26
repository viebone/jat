// src/components/FilterPanel.js
import React, { useState } from 'react';

function FilterPanel({ onFilter }) {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [status, setStatus] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [open, setOpen] = useState(false);

  const handleApplyFilters = (e) => {
    e.preventDefault();
    onFilter({ title, company, status, salaryMin, salaryMax });
  };

  const handleResetFilters = () => {
    setTitle('');
    setCompany('');
    setStatus('');
    setSalaryMin('');
    setSalaryMax('');
    onFilter({});
  };

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {open ? 'Hide Filters' : 'Show Filters'}
      </button>

      {open && (
        <form onSubmit={handleApplyFilters} className="bg-gray-100 p-4 rounded mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium">Job Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                placeholder="Job Title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Company</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                placeholder="Company"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                <option value="">All</option>
                <option value="Applied">Applied</option>
                <option value="Interviewing">Interviewing</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Salary Min</label>
              <input
                type="number"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                placeholder="Min Salary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Salary Max</label>
              <input
                type="number"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                placeholder="Max Salary"
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded mr-2"
            >
              Apply Filters
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Reset Filters
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default FilterPanel;
