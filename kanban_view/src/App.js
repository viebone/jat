// src/App.js
import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import KanbanBoard from './components/KanbanBoard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const handleRegisterSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  // Sample job data
  const [jobs, setJobs] = useState([]);

  return (
    <div>
      {isAuthenticated ? (
        <KanbanBoard />
      ) : (
        <>
          <h1>Register or Login</h1>
          <Register onRegisterSuccess={handleRegisterSuccess} />
          <Login onLoginSuccess={handleLoginSuccess} />
        </>
      )}
    </div>
  );
}

export default App;
