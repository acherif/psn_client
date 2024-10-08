// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

// Wrap the App with BrowserRouter
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);