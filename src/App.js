// src/App.js

// src/App.js
import './App.css';

// src/App.js

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import PlayingTime from './pages/PlayingTime';
import Authentication from './pages/Authentication';

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const npssoCode = localStorage.getItem('npsso_code');
    
    // Check if NPSSO code is already stored in localStorage and navigate accordingly
    if (npssoCode) {
      navigate('/playing-time');
    } else {
      navigate('/authenticate');
    }
  }, [navigate]);

  return (
      <Routes>
        <Route path="/authenticate" element={<Authentication />} />
        <Route path="/playing-time" element={<PlayingTime />} />
      </Routes>
  );
};

export default App;