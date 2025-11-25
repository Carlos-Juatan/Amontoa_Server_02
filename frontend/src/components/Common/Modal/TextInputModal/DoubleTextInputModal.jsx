import React from 'react';

import { ModalScreen } from '../ModalComponents/ModalComponents';
import TextInputBaseModal from './TextInputBaseModal';

function DoubleTextInputModal({ onClose, title, inputTitleValue, handleChangeTitleInput, inputURLValue, handleChangeURLInput, onSubmit }) {
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
      <div className='double-text-input-modal' style={customStyle}>
        <div className='double-text-input-item'>
          <span className='stim-span'>Título:</span>
          <input className='stim-input' type="text" value={inputTitleValue} onChange={handleChangeTitleInput} />
        </div>
        <div className='double-text-input-item'>
          <span className='stim-span'>URL:</span>
          <input className='stim-input' type="text" value={inputURLValue} onChange={handleChangeURLInput} />
        </div>
      </div>
    </TextInputBaseModal>
  );
}

export default DoubleTextInputModal;