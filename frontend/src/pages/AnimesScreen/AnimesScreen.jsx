// src/pages/AnimesScreen/AnimesScreen.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../components/Common/Button/Button';

import './AnimesScreen.css';

function AnimesScreen(){
  //#region ... Variables ...
  const navigate = useNavigate(); // to navegate between pages
  //#endregion
  
  //#region ... Hooks ...
  //#endregion

  //#region ... Functions ...
  const handleBackToDashboard = () => { navigate('/'); };
  //#endregion

  //#region ... Dom Display ...
  return (
    <div className="animes-screen-container">

      {/* Header */}
      <div className="animes-header">
        <Button onClick={handleBackToDashboard} className="back-button">
          <i className="fas fa-arrow-left"></i> Voltar
        </Button>
        <h1 className="animes-title">{'Animes'}</h1>
      </div>

    </div>
  );
  //#endregion
}

export default AnimesScreen;