// components/forms/BlockquoteForm.js
import React, { useState, useEffect } from 'react';

function BlockquoteForm({ item, onChange }) {
  const [content, setContent] = useState(item?.content || '');

  // Sincroniza estado local com a prop 'item'
  useEffect(() => {
    setContent(item?.content || '');
  }, [item]);

  const handleContentChange = (e) => {
    const newValue = e.target.value;
    setContent(newValue);
    onChange({ content: newValue });
  };

  return (
    <div>
      <label htmlFor="blockquote-content">Conteúdo da Citação:</label>
      <textarea
        id="blockquote-content"
        value={content}
        onChange={handleContentChange}
        rows="5"
        style={{ width: '100%' }}
      />
    </div>
  );
}

export default BlockquoteForm;