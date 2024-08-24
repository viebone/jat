// src/App.js
import React, { useState } from 'react';
import KanbanBoard from './components/KanbanBoard';

function App() {
  // Sample job data
  const [jobs, setJobs] = useState([
    { id: 1, title: 'Software Engineer', company: 'Tech Co.', salary: 120000, status: 'Applied' },
    { id: 2, title: 'Product Manager', company: 'Business Inc.', salary: 90000, status: 'Interviewing' },
    { id: 3, title: 'Designer', company: 'Creative Studio', salary: 70000, status: 'Offer' },
    { id: 4, title: 'Marketing Specialist', company: 'Marketing LLC', salary: 60000, status: 'Rejected' },
  ]);

  return (
    <div className="App">
      <KanbanBoard jobs={jobs} />
    </div>
  );
}

export default App;
