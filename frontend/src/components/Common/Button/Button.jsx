// src/components/Common/Button.jsx
import React from 'react';
import './Button.css'; // Crie este arquivo CSS depois

function Button({ children, onClick, className = '', disabled = false }) {
  return (
    <button className={`common-button ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export default Button;