// src/components/Column.js
import React from 'react';
import JobCard from './JobCard';

function Column({ stage, jobs }) {
  return (
    <div className="bg-gray-100 w-80 min-h-screen p-4 rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">{stage}</h2>
      <div className="space-y-4">
        {jobs.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}

export default Column;
