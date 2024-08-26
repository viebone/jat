import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Column from './Column';
import FilterPanel from './FilterPanel';
import AddJob from './AddJob';
import EditJob from './EditJob';

const stages = ['Saved', 'Applied', 'Interviewing', 'Offer', 'Rejected'];


function KanbanBoard() {
  const [jobList, setJobList] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [jobToEdit, setJobToEdit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;
  
  useEffect(() => {
    fetchJobs();  // Load jobs initially without filters
  }, []);

  const fetchJobs = (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();  // Convert filters to query string
    axios.get(`${apiUrl}/api/jobs?${queryParams}`)
      .then(response => {
        setJobList(response.data);
        setFilteredJobs(response.data);
      })
      .catch(error => console.error('Error fetching job data:', error));
  };

  const handleFilter = (filters) => {
    // Ensure all filters are included in the query, even if they're empty
    fetchJobs({
      status: filters.status || '',
      job_type: filters.job_type || '',
      location_type: filters.location_type || '',
      salary_min: filters.salary_min || '',
      salary_max: filters.salary_max || '',
      company: filters.company || '',
      date_created: filters.date_created || ''
    });
  };
  

  const handleDrop = (jobId, newStage) => {
    const updatedJob = jobList.find(job => job.id === jobId);
    updatedJob.status = newStage;

    axios.put(`${apiUrl}/api/jobs/${jobId}`, { status: newStage })
      .then(() => {
        setJobList(prevJobs =>
          prevJobs.map(job =>
            job.id === jobId ? { ...job, status: newStage } : job
          )
        );
      })
      .catch(error => console.error('Error updating job:', error));
  };

  const handleJobAdded = () => {
    fetchJobs();  // Refetch jobs after adding a new job
    setIsModalOpen(false);  // Close the modal
  };

  const handleJobEdited = () => {
    fetchJobs();  // Refetch jobs after editing
    setJobToEdit(null);  // Close the edit form
  };

  const handleDeleteJob = (jobId) => {
    axios.delete(`${apiUrl}/api/jobs/${jobId}`)
      .then(() => {
        setJobList(prevJobs => prevJobs.filter(job => job.id !== jobId));  // Remove from local state
        setFilteredJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));  // Update filtered jobs
      })
      .catch(error => console.error('Error deleting job:', error));
  };

  const handleReset = () => {
    fetchJobs();  // Reload all jobs without filters
  };
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-white shadow p-4 rounded-lg mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Job Application Tracker</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          onClick={() => setIsModalOpen(true)}  // Open modal on button click
        >
          Add New Job
        </button>
      </div>

      {/* Add Job Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 relative w-full max-w-lg mx-auto max-h-screen overflow-y-auto pb-4">
            <h2 className="text-xl font-bold mb-4">Add New Job</h2>
            <AddJob onJobAdded={handleJobAdded} />
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={() => setIsModalOpen(false)}  // Close modal on button click
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Filter Panel */}
      <div className="bg-white shadow p-4 rounded-lg mb-4">
        <FilterPanel onFilter={handleFilter} onReset={handleReset} />
      </div>

      {/* Edit Job Form: Only visible if a job is selected for editing */}
      {jobToEdit && (
        <div className="bg-white shadow p-4 rounded-lg mb-4">
          <EditJob job={jobToEdit} onJobEdited={handleJobEdited} />
        </div>
      )}

      {/* Kanban Board Columns */}
      <DndProvider backend={HTML5Backend}>
        <div className="flex space-x-4 overflow-x-auto">
          {stages.map((stage) => (
            <Column
              key={stage}
              stage={stage}
              jobs={filteredJobs.filter((job) => job.status === stage)}
              onDrop={handleDrop}
              onEdit={(job) => setJobToEdit(job)}  // Open edit form when edit is clicked
              onDelete={handleDeleteJob}  // Delete job when delete is clicked
            />
          ))}
        </div>
      </DndProvider>
    </div>
  );
}

export default KanbanBoard;
