import React from 'react';
import ReactDOM from 'react-dom/client';
import BuildingCalculatorComponent from './components/BuildingCalculator';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BuildingCalculatorComponent />
  </React.StrictMode>
);

