import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Column from './Column';
import FilterPanel from './FilterPanel';

const stages = ['Applied', 'Interviewing', 'Offer', 'Rejected'];

function KanbanBoard() {
  const [jobList, setJobList] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);

  useEffect(() => {
    // Fetch job data from Flask API
    const apiUrl = process.env.REACT_APP_API_URL;    
    axios.get(`${apiUrl}/api/jobs`)

      .then(response => {
        setJobList(response.data);
        setFilteredJobs(response.data);  // Initially, all jobs are displayed
      })
      .catch(error => console.error('Error fetching job data:', error));
  }, []);

  const handleDrop = (jobId, newStage) => {
    // Update job status in back-end
    const updatedJob = jobList.find(job => job.id === jobId);
    updatedJob.status = newStage;

    axios.put(`/api/jobs/${jobId}`, { status: newStage })
      .then(() => {
        setJobList(prevJobs =>
          prevJobs.map(job =>
            job.id === jobId ? { ...job, status: newStage } : job
          )
        );
      })
      .catch(error => console.error('Error updating job:', error));
  };

  return (
    <div>
      <FilterPanel onFilter={(filters) => {
        // Apply filtering logic
      }} />
      <DndProvider backend={HTML5Backend}>
        <div className="flex space-x-4 overflow-x-auto p-4">
          {stages.map((stage) => (
            <Column
              key={stage}
              stage={stage}
              jobs={filteredJobs.filter((job) => job.status === stage)}
              onDrop={handleDrop}
            />
          ))}
        </div>
      </DndProvider>
    </div>
  );
}

export default KanbanBoard;
