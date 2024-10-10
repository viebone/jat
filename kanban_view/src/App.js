import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';  // Import BrowserRouter
import Register from './components/Register';
import Login from './components/Login';
import KanbanBoard from './components/KanbanBoard';

import axios from 'axios'; // Import axios for HTTP requests

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';  // Use a fallback URL if env var is missing

// Define fetchCsrfToken function here
const fetchCsrfToken = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/get-csrf-token`, { withCredentials: true });
    return response.data.csrf_token;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    return null;
  }
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);  // Add loading state
  const [isRegister, setIsRegister] = useState(false); // Add toggle for login/register

  const handleRegisterSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };
  

  useEffect(() => {
    
    // Check authentication status on page load/refresh
    axios.get(`${apiUrl}/api/user-details`, { withCredentials: true })
      .then(response => {
        setIsAuthenticated(true);
        setLoading(false);
      })
      .catch(() => {
        setIsAuthenticated(false);
        setLoading(false);
      });
  }, []);

  // Fetch the CSRF token when your app initializes
  useEffect(() => {
    const setAxiosDefaults = async () => {
      const csrfToken = await fetchCsrfToken();
      if (csrfToken) {
        // Set Axios default headers to include the CSRF token for all requests
        axios.defaults.headers.common['X-CSRFToken'] = csrfToken;
      }
    };

    setAxiosDefaults();
  }, []);  // Fetch and set CSRF token on component mount

  if (loading) {
    return <div>Loading...</div>;  // Optional: Show a loading spinner while checking auth status
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
        {isAuthenticated ? (
          // Set max-width and overflow for KanbanBoard
          <div className="w-full max-w-full h-full overflow-y-auto">
            <KanbanBoard fetchCsrfToken={fetchCsrfToken}/>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between mb-4">
              <h1 className="text-2xl font-bold">
                {isRegister ? 'Register' : 'Login'}
              </h1>
              <button 
                onClick={() => setIsRegister(!isRegister)}
                className="text-blue-600 hover:underline"
              >
                {isRegister ? 'Switch to Login' : 'Switch to Register'}
              </button>
            </div>
            
            {isRegister ? (
              <Register onRegisterSuccess={handleRegisterSuccess} fetchCsrfToken={fetchCsrfToken}  />
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )}
          </div>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
