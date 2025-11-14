import React from 'react';
import ReactDOM from 'react-dom/client';
import LandingPage from './components/LandingPage';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('A cél DOM elem (root) nem található.');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <LandingPage />
  </React.StrictMode>
);

