import React from 'react';

import { ModalScreen } from '../ModalComponents/ModalComponents';
import TextInputBaseModal from './TextInputBaseModal';
import CustomCheckbox from '../../CustomCheckbox/CustomCheckbox';

function SingleTextInputWithCheckboxModal({ onClose, title, inputValue, handleChangeInput, checkmarkValue, onChangeValue, size, onSubmit }) {
  const customStyle = {
    display: 'flex',
    justifyContent: 'center',
    width: '450px',
    gap: '10px',
    marginTop: '10px'
  }
                 
  return (
    <TextInputBaseModal
    onClose={onClose}
    title={title}
    onSubmit={onSubmit}
    >
      <div className='single-text-input-modal' style={customStyle}>
        <input className='stim-input' style={{marginTop: '0'}} type="text" value={inputValue} onChange={handleChangeInput} />
        
        <CustomCheckbox
          checked={checkmarkValue}
          onChange={onChangeValue}
          size={size}
        />
      </div>
    </TextInputBaseModal>
  );
}

export default SingleTextInputWithCheckboxModal;