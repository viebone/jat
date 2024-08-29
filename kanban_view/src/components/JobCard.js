import React from 'react';
import { useDrag } from 'react-dnd';
import EllipsisMenu from './EllipsisMenu';
import axios from 'axios';

function JobCard({ job, onEdit, onDelete }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'JOB',
    item: { id: job.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`bg-white p-4 rounded-lg shadow-md flex justify-between items-center ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div>
        <h3 className="font-bold">{job.job_title}</h3> {/* Ensure job_title is used correctly */}
        <p className="text-gray-600">{job.company}</p>
        <p className="text-gray-600">${job.salary}</p>
      </div>
      <EllipsisMenu onEdit={() => onEdit(job)} onDelete={() => onDelete(job.id)} />
    </div>
  );
}

export default JobCard;
