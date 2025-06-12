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
    const newValue = Number(e.target.value); // Garante que é um número
    setLevel(newValue);
    onChange({ level: newValue, content });
  };

  const handleContentChange = (e) => {
    const newValue = e.target.value;
    setContent(newValue);
    onChange({ level, content: newValue });
  };

  return (
    <div>
      <label htmlFor="heading-level">Nível do Título (H1-H6):</label>
      <input
        id="heading-level"
        type="number"
        min="1"
        max="6"
        value={level}
        onChange={handleLevelChange}
        style={{ width: '100%', marginBottom: '10px' }}
      />

      <label htmlFor="heading-content">Conteúdo do Título:</label>
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