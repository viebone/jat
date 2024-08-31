import React from 'react';
import { useDrop } from 'react-dnd';
import JobCard from './JobCard';

function Column({ stage, jobs, onDrop, onEdit, onDelete }) {
  const [{ isOver }, drop] = useDrop({
    accept: 'JOB',
    drop: (item) => {
      console.log('Dropping item:', item);
      onDrop(item.id, stage);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`bg-gray-100 w-80 min-h-screen p-4 rounded-md shadow-md min-w-[320px] ${
        isOver ? 'bg-blue-100' : ''
      }`}
    >
      <h2 className="text-xl font-bold mb-4">{stage}</h2>
      <div className="space-y-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
}

export default Column;
