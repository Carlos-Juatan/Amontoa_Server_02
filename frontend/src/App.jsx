// src/App.jsx
import React from 'react';
import ScreenManager from './components/ScreenManager/ScreenManager';
import './App.css'; // Estilos globais
import '@fortawesome/fontawesome-free/css/all.min.css'; // Importa Font Awesome

function App() {
  return (
    <div className="app-container">
      <ScreenManager />
    </div>
  );
}

export default App;