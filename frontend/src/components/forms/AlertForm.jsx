// components/forms/AlertForm.js
import React, { useState, useEffect } from 'react';

function AlertForm({ item, onChange }) {
  const [level, setLevel] = useState(item?.level || 'NOTE');
  const [content, setContent] = useState(item?.content || '');

  // Sincroniza estado local com a prop 'item'
  useEffect(() => {
    setLevel(item?.level || 'NOTE');
    setContent(item?.content || '');
  }, [item]);

  const handleLevelChange = (e) => {
    const newValue = e.target.value;
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
      <label htmlFor="alert-level">Nível do Alerta:</label>
      <select
        id="alert-level"
        value={level}
        onChange={handleLevelChange}
        style={{ width: '100%', marginBottom: '10px' }}
      >
        <option value="NOTE">Nota</option>
        <option value="WARNING">Aviso</option>
        <option value="DANGER">Perigo</option>
        <option value="INFO">Informação</option>
        <option value="SUCCESS">Sucesso</option>
      </select>

      <label htmlFor="alert-content">Conteúdo do Alerta:</label>
      <textarea
        id="alert-content"
        value={content}
        onChange={handleContentChange}
        rows="4"
        style={{ width: '100%' }}
      />
    </div>
  );
}

export default AlertForm;