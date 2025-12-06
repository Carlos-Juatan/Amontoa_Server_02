import React from 'react';
import useClickOutside from '../../../hooks/useClickOutside'; 
import './ActionDropdownContainer.css';

function ActionDropdownContainer({ children, onClose, className = '', direction, style = {} }) {
  // Hook para fechar ao clicar fora ou pressionar ESC
  const containerRef = useClickOutside(onClose); 

  return (
    <div 
      className={`floating-container ${className} direction-${direction}`} 
      ref={containerRef} 
      style={style}
    >
      {children}
    </div>
  );
}

export default ActionDropdownContainer;