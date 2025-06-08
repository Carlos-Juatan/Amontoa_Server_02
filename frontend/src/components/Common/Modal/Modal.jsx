import React from 'react';

import './Modal.css';

function Modal({ isOpen, onClose, title, children, onSubmit, submitButtonText = "Salvar" }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        <div className="modal-footer">
          {/* Mudei a ordem aqui: Botão de submit primeiro, depois o de cancelar */}
          {onSubmit && (
            <button className="modal-submit-button" onClick={onSubmit}>
              {submitButtonText}
            </button>
          )}
          <button className="modal-cancel-button" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default Modal;