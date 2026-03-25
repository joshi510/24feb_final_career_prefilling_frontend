import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Force light mode globally
localStorage.setItem('theme', 'light');
document.documentElement.classList.remove('dark');

const root = ReactDOM.createRoot(document.getElementById('root'));

// Only use StrictMode in development to avoid double renders in production
const AppWrapper = import.meta.env.DEV ? (
  <React.StrictMode>
    <App />
  </React.StrictMode>
) : (
  <App />
);

root.render(AppWrapper);

