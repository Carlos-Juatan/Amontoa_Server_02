import React from 'react';

import './ModalComponents.css';

function BackgroundBloor({ children }) {
  return (
    <div className="modal-overlay">{children}</div>
  );
}

function ModalScreen({ children }) {
  return (
    <BackgroundBloor>
      <div className="modal-screen">{children}</div>
    </BackgroundBloor>
  );
}

export {
  BackgroundBloor,
  ModalScreen,
}