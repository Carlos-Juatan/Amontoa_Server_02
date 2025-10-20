// src/components/Common/Header/Header.jsx
import React from 'react';

import Button from '../Button/Button';

import './Header.css';

function Header({ children, onBackClick, title }) {
  return (
    <div className="common-header">
      <Button onClick={onBackClick} className="back-button">
        <i className="fas fa-arrow-left"></i> Voltar
      </Button>
      <h1 className="common-title">{title}</h1>
      {children}
    </div>
  );
}

export default Header;