// src/App.js
import React, { useState } from 'react';
import KanbanBoard from './components/KanbanBoard';

function App() {
  // Sample job data
  const [jobs, setJobs] = useState([]);

  return (
    <div className="App">
      <KanbanBoard jobs={jobs} />
    </div>
  );
}

export default App;
