import React from 'react';

import './Modal.css';

function Modal({ isOpen, onClose, title, editTypeSelection, children, onSubmit, submitButtonText = "Salvar", modalCustonStyle = '' }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className={modalCustonStyle}>
        <div className="modal-header">
          <div className='modal-header-content'>
            <h2>{title}</h2>
            {editTypeSelection}
          </div>
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