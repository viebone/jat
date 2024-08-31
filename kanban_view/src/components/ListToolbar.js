import React, { useState } from 'react';
import FilterPanel from './FilterPanel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

function ListToolbar({ onAddNewJob, filters, onFilter, onReset }) {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Create a copy of the filters object to manipulate
  const removeFilter = (key) => {
    const updatedFilters = { ...filters };
    delete updatedFilters[key];
    onFilter(updatedFilters);  // Apply the updated filters
  };

  const appliedFilters = Object.keys(filters).filter(key => filters[key]);

  return (
    <div className="bg-white shadow p-4 rounded-lg mb-4 flex flex-wrap items-center space-x-2 min-w-[320px]">
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        onClick={onAddNewJob}  // Trigger the add new job modal
      >
        Add New Job
      </button>

      <button
        className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
        onClick={() => setIsFilterModalOpen(true)}  // Open the filter modal
      >
        Filters
      </button>

      {/* Display applied filters as pills immediately to the right of the Filters button */}
      <div className="flex flex-wrap items-center space-x-2 space-y-2">
        {appliedFilters.map(filterKey => (
          <span key={filterKey} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center space-x-2">
            <span>{filterKey}: {filters[filterKey]}</span>
            <button onClick={() => removeFilter(filterKey)} className="focus:outline-none">
              <FontAwesomeIcon icon={faTimes} className="ml-1 text-blue-700" />
            </button>
          </span>
        ))}
      </div>

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 relative w-full max-w-lg mx-auto max-h-screen overflow-y-auto pb-4">
            <h2 className="text-xl font-bold mb-4">Filter Jobs</h2>
            <FilterPanel onFilter={onFilter} onReset={onReset} />
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={() => setIsFilterModalOpen(false)}  // Close the filter modal
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListToolbar;
