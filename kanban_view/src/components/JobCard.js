// src/components/JobCard.js
import React from 'react';

function JobCard({ job }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="font-bold">{job.title}</h3>
      <p className="text-gray-600">{job.company}</p>
      <p className="text-gray-600">${job.salary}</p>
    </div>
  );
}

export default JobCard;
