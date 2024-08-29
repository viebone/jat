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
  const [jobToEdit, setJobToEdit] = useState(null);  // State to track job to edit
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);  // State for AddJob modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);  // State for EditJob modal
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    let isMounted = true; // Track if the component is still mounted

    const initializeJobs = () => {
      fetchJobs();
    };

    initializeJobs();

    return () => {
      isMounted = false;  // Cleanup to prevent state updates if the component unmounts
    };
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
    console.log('Dropped job ID:', jobId, 'to stage:', newStage);
    const updatedJob = jobList.find(job => job.id === jobId);
  
    if (updatedJob) {  // Ensure the job exists
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
    setIsAddModalOpen(false);  // Close the AddJob modal
  };

  const handleJobEdited = () => {
    fetchJobs();  // Refetch jobs after editing
    setIsEditModalOpen(false);  // Close the EditJob modal
  };

  const handleDeleteJob = (jobId) => {
    console.log('Deleting job ID:', jobId); // Verify the job ID is correct
    axios.delete(`${apiUrl}/api/jobs/${jobId}`)
      .then(() => {
        setJobList(prevJobs => prevJobs.filter(job => job.id !== jobId));  // Remove from local state
        setFilteredJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));  // Update filtered jobs
      })
      .catch(error => console.error('Error deleting job:', error));
  };
  
  

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-white shadow p-4 rounded-lg mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Job Application Tracker</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          onClick={() => setIsAddModalOpen(true)}  // Open AddJob modal
        >
          Add New Job
        </button>
      </div>

      {/* Add Job Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 relative w-full max-w-lg mx-auto max-h-screen overflow-y-auto pb-4">
            <h2 className="text-xl font-bold mb-4">Add New Job</h2>
            <AddJob onJobAdded={handleJobAdded} />
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={() => setIsAddModalOpen(false)}  // Close AddJob modal
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
              onClick={() => setIsEditModalOpen(false)}  // Close EditJob modal
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Filter Panel */}
      <div className="bg-white shadow p-4 rounded-lg mb-4">
        <FilterPanel onFilter={handleFilter} onReset={() => fetchJobs()} />
      </div>

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
                if (job) {  // Ensure jobToEdit is fully populated before opening the modal
                  setIsEditModalOpen(true);  // Open EditJob modal
                }
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
