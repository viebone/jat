import React, { useState } from 'react';
import axios from 'axios';

function Register({ onRegisterSuccess }) {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    axios.post(`${process.env.REACT_APP_API_URL}/register`, { nickname, email, password })
      .then(response => {
        onRegisterSuccess();
      })
      .catch(error => {
        setError('Registration failed: ' + error.response.data.error);
      });
  };

  return (
    <form onSubmit={handleRegister}>
      <div>
        <label>Nickname:</label>
        <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} required />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <button type="submit">Register</button>
      {error && <p>{error}</p>}
    </form>
  );
}

export default Register;
