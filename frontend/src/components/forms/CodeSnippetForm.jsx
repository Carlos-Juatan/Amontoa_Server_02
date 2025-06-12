// components/forms/CodeSnippetForm.js
import React, { useState, useEffect } from 'react';

function CodeSnippetForm({ item, onChange }) {
  const [language, setLanguage] = useState(item?.language || '');
  const [title, setTitle] = useState(item?.title || '');
  const [code, setCode] = useState(item?.code || '');

  // Sincroniza estado local com a prop 'item'
  useEffect(() => {
    setLanguage(item?.language || '');
    setTitle(item?.title || '');
    setCode(item?.code || '');
  }, [item]);

  const handleLanguageChange = (e) => {
    const newValue = e.target.value;
    setLanguage(newValue);
    onChange({ language: newValue, title, code });
  };

  const handleTitleChange = (e) => {
    const newValue = e.target.value;
    setTitle(newValue);
    onChange({ language, title: newValue, code });
  };

  const handleCodeChange = (e) => {
    const newValue = e.target.value;
    setCode(newValue);
    onChange({ language, title, code: newValue });
  };

  return (
    <div>
      <label htmlFor="code-language">Linguagem:</label>
      <input
        id="code-language"
        type="text"
        value={language}
        onChange={handleLanguageChange}
        placeholder="Ex: javascript, python, bash"
        style={{ width: '100%', marginBottom: '10px' }}
      />

      <label htmlFor="code-title">Título do Trecho (Opcional):</label>
      <input
        id="code-title"
        type="text"
        value={title}
        onChange={handleTitleChange}
        style={{ width: '100%', marginBottom: '10px' }}
      />

      <label htmlFor="code-content">Código:</label>
      <textarea
        id="code-content"
        value={code}
        onChange={handleCodeChange}
        rows="10"
        style={{ width: '100%', fontFamily: 'monospace' }}
      />
    </div>
  );
}

export default CodeSnippetForm;