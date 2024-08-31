import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Column from './Column';
import FilterPanel from './FilterPanel';
import AddJob from './AddJob';
import EditJob from './EditJob';
import ListToolbar from './ListToolbar';  // Import the new ListToolbar component

const stages = ['Saved', 'Applied', 'Interviewing', 'Offer', 'Rejected'];

function KanbanBoard() {
  const [jobList, setJobList] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [jobToEdit, setJobToEdit] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});  // Store active filters
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchJobs();  // Load jobs initially without filters
  }, []);

  const fetchJobs = (filters = {}) => {
    setActiveFilters(filters);  // Update active filters
    const queryParams = new URLSearchParams(filters).toString();
    axios.get(`${apiUrl}/api/jobs?${queryParams}`)
      .then(response => {
        setJobList(response.data);
        setFilteredJobs(response.data);
      })
      .catch(error => console.error('Error fetching job data:', error));
  };

  const handleFilter = (filters) => {
    fetchJobs(filters);
  };

  const handleDrop = (jobId, newStage) => {
    const updatedJob = jobList.find(job => job.id === jobId);
    if (updatedJob) {
      updatedJob.status = newStage;
      axios.put(`${apiUrl}/api/jobs/${jobId}`, { status: newStage })
        .then(() => {
          setJobList(prevJobs =>
            prevJobs.map(job =>
              job.id === jobId ? { ...job, status: newStage } : job
            )
          );
          setFilteredJobs(prevJobs =>
            prevJobs.map(job =>
              job.id === jobId ? { ...job, status: newStage } : job
            )
          );
        })
        .catch(error => console.error('Error updating job:', error));
    } else {
      console.error('Job not found:', jobId);
    }
  };

  const handleJobAdded = () => {
    fetchJobs();  // Refetch jobs after adding a new job
    setIsAddModalOpen(false);
  };

  const handleJobEdited = () => {
    fetchJobs();  // Refetch jobs after editing
    setIsEditModalOpen(false);
  };

  const handleDeleteJob = (jobId) => {
    axios.delete(`${apiUrl}/api/jobs/${jobId}`)
      .then(() => {
        setJobList(prevJobs => prevJobs.filter(job => job.id !== jobId));
        setFilteredJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
      })
      .catch(error => console.error('Error deleting job:', error));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-white shadow p-4 rounded-lg mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Job Application Tracker</h1>
      </div>

      {/* List Toolbar */}
      <ListToolbar
        onAddNewJob={() => setIsAddModalOpen(true)}
        filters={activeFilters}
        onFilter={handleFilter}
        onReset={() => fetchJobs({})}
      />

      {/* Add Job Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 relative w-full max-w-lg mx-auto max-h-screen overflow-y-auto pb-4">
            <h2 className="text-xl font-bold mb-4">Add New Job</h2>
            <AddJob onJobAdded={handleJobAdded} />
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={() => setIsAddModalOpen(false)}
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 relative w-full max-w-lg mx-auto max-h-screen overflow-y-auto pb-4">
            <h2 className="text-xl font-bold mb-4">Edit Job</h2>
            {jobToEdit && <EditJob job={jobToEdit} onJobEdited={handleJobEdited} />}
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={() => setIsEditModalOpen(false)}
            >
              &times;
            </button>
          </div>
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
              onEdit={(job) => {
                setJobToEdit(job);
                setIsEditModalOpen(true);
              }}
              onDelete={handleDeleteJob}
            />
          ))}
        </div>
      </DndProvider>
    </div>
  );
}

export default KanbanBoard;
