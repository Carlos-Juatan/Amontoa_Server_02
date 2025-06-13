// components/forms/HeadingForm.js
import React, { useState, useEffect } from 'react';

function HeadingForm({ item, onChange }) {
  const [level, setLevel] = useState(item?.level || 1);
  const [content, setContent] = useState(item?.content || '');

  // Sincroniza estado local com a prop 'item'
  useEffect(() => {
    setLevel(item?.level || 1);
    setContent(item?.content || '');
  }, [item]);

  const handleLevelChange = (e) => {
    // Quando o valor vem de um <select>, ele já é uma string.
    // Converte para número antes de atualizar o estado e chamar onChange.
    const newValue = Number(e.target.value);
    setLevel(newValue);
    onChange({ level: newValue, content });
  };

  const handleContentChange = (e) => {
    const newValue = e.target.value;
    setContent(newValue);
    onChange({ level, content: newValue });
  };

  // As opções para o dropdown do nível do título (H1 a H6)
  const headingLevels = [1, 2, 3, 4, 5, 6, 7]; // H1 a H6 são os mais comuns e semanticamente relevantes

  return (
    <div className='heading-level'>
      <div className='heading-level-header'>
        <label htmlFor="heading-content">Conteúdo do Título:</label>

        <div className='heading-level-select-group'>
          <label htmlFor="heading-level" className='heading-level-text'>Nível do Título:</label>
          {/* Input Type Number substituído por um Dropdown (Select) */}
          <select
            id="heading-level"
            value={level}
            onChange={handleLevelChange}
            // Adicione uma classe CSS aqui para estilizar o dropdown
            // Você pode reutilizar estilos de .form-input de NoteEditScreenElements.module.css
            className='heading-level-select' // Nova classe para estilização específica
          >
            {headingLevels.map((lvl) => (
              <option key={lvl} value={lvl}>
                H{lvl}
              </option>
            ))}
          </select>
        </div>
      </div>
      <input
        id="heading-content"
        type="text"
        value={content}
        onChange={handleContentChange}
        style={{ width: '100%' }}
      />
    </div>
  );
}

export default HeadingForm;