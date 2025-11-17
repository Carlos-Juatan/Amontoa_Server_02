import React from 'react';

import { ModalScreen } from '../ModalComponents/ModalComponents';
import Button from '../../Button/Button';

import './TextInputBaseModal.css';

function TextInputBaseModal({ children, onClose, title, onSubmit, submitButtonText = "Salvar" }) {
  return (
    <ModalScreen>
      <div className='text-input-base-modal'>

        {/* Header */}
        <div className="stib-modal-header">
          <div className='stib-modal-header-content'>
            <h2>{title}</h2>
          </div>
          <button className="stib-modal-close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="stib-modal-body">
          {children}
        </div>

        {/* Footer */}
        <div className="stib-modal-footer">
          {/* Mudei a ordem aqui: Botão de submit primeiro, depois o de cancelar */}
          {onSubmit && (
            <Button className="stib-modal-submit-button" onClick={onSubmit}>
              {submitButtonText}
            </Button>
          )}
          <Button className="stib-modal-cancel-button" onClick={onClose}>
              Cancelar
          </Button>
        </div>
      </div>
    </ModalScreen>
  );
}

export default TextInputBaseModal;