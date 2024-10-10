import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);  // Track form submission state

  const handleLogin = (e) => {
    e.preventDefault();
    setIsSubmitting(true);  // Show loading state
    setError('');  // Clear previous errors

     // Trim and sanitize inputs
    const sanitizedEmail = email.trim();
    const sanitizedPassword = password.trim();

    if (!sanitizedEmail || !sanitizedPassword) {
      setError('Both fields are required');
      setIsSubmitting(false);
      return;
    }
    axios.post(`${process.env.REACT_APP_API_URL}/login`, { email: sanitizedEmail, password: sanitizedPassword }, { withCredentials: true })
      .then(response => {
        onLoginSuccess();
      })
      .catch(error => {
        setError('Login failed: ' + (error.response?.data?.error || 'Unexpected error'));
      })
      .finally(() => {
        setIsSubmitting(false);  // Reset submission state
      });
  };

  return (
    <form onSubmit={handleLogin} className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg space-y-4">
      <h2 className="text-2xl font-bold text-center">Login</h2>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input 
          type="email" 
          id="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <input 
          type="password" 
          id="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <button 
        type="submit" 
        className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`} 
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

export default Login;
