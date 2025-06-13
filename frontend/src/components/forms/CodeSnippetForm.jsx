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

  // --- Lista de linguagens para o dropdown ---
  const availableLanguages = [
    '', // Opção vazia/default
    'javascript',
    'python',
    'html',
    'css',
    'java',
    'csharp',
    'c++',
    'php',
    'ruby',
    'typescript',
    'go',
    'rust',
    'bash',
    'json',
    'markdown',
    'sql',
    'xml',
    'yaml',
    // Adicione mais linguagens conforme necessário
  ];
  // ----------------------------------------

  return (
    <div>
      <label htmlFor="code-language">Linguagem:</label>
      {/* Input Type Text substituído por um Dropdown (Select) */}
      <select
        id="code-language"
        value={language}
        onChange={handleLanguageChange}
        // Adicione uma classe CSS para estilização (pode ser a mesma de outros selects)
        className='code-language-select' // Nova classe para estilização específica
        style={{ width: '100%', marginBottom: '10px' }} // Estilos inline temporários ou migrar para CSS Module
      >
        <option value="" disabled>Selecione uma linguagem</option> {/* Placeholder */}
        {availableLanguages.map((lang) => (
          <option key={lang} value={lang}>
            {lang === '' ? 'Nenhum' : lang.charAt(0).toUpperCase() + lang.slice(1)} {/* Capitaliza a primeira letra */}
          </option>
        ))}
      </select>

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