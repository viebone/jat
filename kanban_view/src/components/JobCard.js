import React from 'react';
import { useDrag } from 'react-dnd';
import EllipsisMenu from './EllipsisMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip, faTasks } from '@fortawesome/free-solid-svg-icons';

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
      className={`bg-white p-4 rounded-lg shadow-md flex flex-col justify-between space-y-2 min-w-[280px] ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex justify-between items-center">
      <h3 className="font-bold text-lg">
          <button
            onClick={() => onEdit(job)} // Call onEdit when title is clicked
            className="text-blue-500 hover:text-blue-700 focus:outline-none"
            aria-label={`Edit job: ${job.job_title}`}
          >
            {job.job_title}
          </button>
        </h3>
        <EllipsisMenu onEdit={() => onEdit(job)} onDelete={() => onDelete(job.id)} />
      </div>
      <p className="text-gray-600 font-semibold text-sm">{job.company}</p>
      <p className="text-gray-600 text-sm">Salary: {job.salary ? `$${job.salary}` : 'Unknown'}</p>
      <p className="text-gray-600 text-sm">Location type: {job.location_type}</p>
      <p className="text-gray-600 text-sm">Location: {job.location}</p>
      <p className="text-gray-600 text-sm">Type: {job.job_type}</p>
      <div className="text-gray-600 text-xs mt-2">
        <span>Status: {job.status}</span>
        <span className="ml-4">Date added: {new Date(job.date_created).toLocaleDateString()}</span>
      </div>
      <div className="flex space-x-2 text-gray-600 text-xs">
        <span className="flex items-center">
          <FontAwesomeIcon icon={faPaperclip} className="mr-1" /> ({job.documents && job.documents.length ? job.documents.length : 0})
        </span>
        <span className="flex items-center">
          <FontAwesomeIcon icon={faTasks} className="mr-1" /> ({job.notes ? job.notes.length : 0})
        </span>
      </div>
    </div>
  );
}

export default JobCard;
