// src/components/NoteTypeSelector/NoteTypeSelector.jsx
import React from 'react';
import { NOTE_TYPES } from '../../constants/noteTypes'; // Certifique-se de que o caminho esteja correto

function NoteTypeSelector({ selectedType, onChange }) {
  return (
    <div className='note-type-select-container'>
      <label htmlFor="note-type-select">Selecione o tipo de item:</label>
      <select id="note-type-select" value={selectedType} onChange={onChange}>
        <option value="">Selecione...</option>
        {NOTE_TYPES.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default NoteTypeSelector;