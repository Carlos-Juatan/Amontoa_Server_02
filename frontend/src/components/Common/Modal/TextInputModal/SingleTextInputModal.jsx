import React from 'react';

import { ModalScreen } from '../ModalComponents/ModalComponents';
import TextInputBaseModal from './TextInputBaseModal';

function SingleTextInputModal({ onClose, title, inputValue, handleChangeInput, onSubmit }) {
  const customStyle = {
    display: 'flex',
    justifyContent: 'center'
  }
                 
  return (
    <TextInputBaseModal
    onClose={onClose}
    title={title}
    onSubmit={onSubmit}
    >
      <div className='single-text-input-modal' style={customStyle}>
        <input className='stim-input' type="text" value={inputValue} onChange={handleChangeInput} />
      </div>
    </TextInputBaseModal>
  );
}

export default SingleTextInputModal;