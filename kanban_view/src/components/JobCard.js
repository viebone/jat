// src/components/JobCard.js
import React from 'react';
import { useDrag } from 'react-dnd';
import EllipsisMenu from './EllipsisMenu';

function JobCard({ job, onEdit, onDelete }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'JOB',
    item: { id: job.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleDelete = (jobId) => {
    axios.delete(`${process.env.REACT_APP_API_URL}/api/jobs/${jobId}`)
      .then(() => {
        setJobList(jobList.filter(job => job.id !== jobId));  // Remove the job from the state
      })
      .catch(error => console.error('Error deleting job:', error));
  };
  

  return (
    <div
      ref={drag}
      className={`bg-white p-4 rounded-lg shadow-md flex justify-between items-center ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div>
        <h3 className="font-bold">{job.title}</h3>
        <p className="text-gray-600">{job.company}</p>
        <p className="text-gray-600">${job.salary}</p>
      </div>
      <EllipsisMenu onEdit={() => onEdit(job)} onDelete={() => onDelete(job)} />
    </div>
  );
}

export default JobCard;
