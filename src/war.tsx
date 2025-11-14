import React from 'react';
import ReactDOM from 'react-dom/client';
import WarCalculatorComponent from './components/WarCalculator';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <WarCalculatorComponent />
  </React.StrictMode>
);

