import React, { useState } from 'react';
import axios from 'axios';

function Register({ onRegisterSuccess, fetchCsrfToken }) {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);  // Track form submission state

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Sanitize input
    const sanitizedNickname = nickname.trim();
    const sanitizedEmail = email.trim();
    const sanitizedPassword = password.trim();

    if (!sanitizedNickname || !sanitizedEmail || !sanitizedPassword) {
      setError('All fields are required');
      setIsSubmitting(false);
      return;
    }

    try {
      const csrfToken = await fetchCsrfToken();  // Use the fetchCsrfToken prop
      await axios.post(`${process.env.REACT_APP_API_URL}/register`, 
        { nickname: sanitizedNickname, email: sanitizedEmail, password: sanitizedPassword }, 
        {
          headers: {
            'X-CSRFToken': csrfToken,  // Include the CSRF token in the headers
          },
          withCredentials: true,
        }
      );
      onRegisterSuccess();
    } catch (error) {
      setError('Registration failed: ' + (error.response?.data?.error || 'Unexpected error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg space-y-4">
      <h2 className="text-2xl font-bold text-center">Register</h2>

      <div>
        <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">Nickname</label>
        <input 
          type="text" 
          id="nickname" 
          value={nickname} 
          onChange={(e) => setNickname(e.target.value)} 
          required 
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

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
        className={`w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`} 
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}

export default Register;
