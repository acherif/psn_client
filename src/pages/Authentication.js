// src/pages/Authentication.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Authentication = () => {
  const [npssoCode, setNpssoCode] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  const handleAuthenticate = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/authenticate', { npsso_code: npssoCode });
      localStorage.setItem('npsso_code', npssoCode); // Store the NPSSO code in localStorage
      navigate('/playing-time'); // Redirect to PlayingTime page after successful login
    } catch (err) {
      setError('Authentication failed. Please check your NPSSO code.');
    }
  };

  return (
    <div>
      <h1>Authenticate with NPSSO Code</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        value={npssoCode}
        onChange={(e) => setNpssoCode(e.target.value)}
        placeholder="Enter NPSSO code"
      />
      <button onClick={handleAuthenticate}>Submit</button>
    </div>
  );
};

export default Authentication;