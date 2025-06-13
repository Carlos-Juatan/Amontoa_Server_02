// components/forms/AlertForm.js
import React, { useState, useEffect } from 'react';

function AlertForm({ item, onChange }) {
  const [level, setLevel] = useState(item?.level || 'note'); // Usar 'note' como padrão (minúsculas)
  const [content, setContent] = useState(item?.content || '');

  // Sincroniza estado local com a prop 'item'
  useEffect(() => {
    // Certifique-se de que o nível inicial também seja tratado em minúsculas
    setLevel(item?.level ? item.level.toLowerCase() : 'note');
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

  // --- Mapeamento de ícones para os níveis de alerta ---
  const getAlertIconClass = (alertLevel) => {
    switch (alertLevel.toLowerCase()) { // Garante que a comparação é case-insensitive
      case 'info':
        return 'fa-info-circle';
      case 'note':
        return 'fa-sticky-note';
      case 'tip':
        return 'fa-lightbulb';
      case 'important':
        return 'fa-exclamation-circle';
      case 'warning':
        return 'fa-exclamation-triangle';
      case 'caution':
        return 'fa-hand-paper';
      default:
        return 'fa-bell'; // Ícone padrão se nenhum corresponder
    }
  };

  // --- Opções de alerta para o dropdown ---
  const alertOptions = [
    { value: 'note', label: 'Nota', icon: 'fa-sticky-note' },
    { value: 'info', label: 'Informação', icon: 'fa-info-circle' },
    { value: 'tip', label: 'Dica', icon: 'fa-lightbulb' },
    { value: 'important', label: 'Importante', icon: 'fa-exclamation-circle' },
    { value: 'warning', label: 'Aviso', icon: 'fa-exclamation-triangle' },
    { value: 'caution', label: 'Cuidado', icon: 'fa-hand-paper' },
    // Adicione mais se necessário e atualize getAlertIconClass
  ];
  // ------------------------------------------

  return (
    <div className='alert-level-container'>
      <div className='alert-level-header'>
        <label htmlFor="alert-level">Nível do Alerta:</label>
        <select
          id="alert-level"
          value={level}
          onChange={handleLevelChange}
          // Adicione uma classe CSS para estilização (se ainda não tiver)
          className='alert-level-select' // Exemplo de classe
        >
          {alertOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <label htmlFor="alert-content">Conteúdo do Alerta:</label>

      <div className='alert-level-content' >
        {/* Ícone dinâmico ao lado do textarea */}
        <i className={`alert-icon fas ${getAlertIconClass(level)}`} 
           style={{ fontSize: '2rem', marginTop: '5px', color: 'var(--highlight-blue)' }} // Exemplo de estilo
        ></i>
        <textarea
          id="alert-content"
          value={content}
          onChange={handleContentChange}
          rows="4"
          style={{ flexGrow: 1, width: 'auto', fontFamily: 'sans-serif' }} // flexGrow para ocupar espaço restante
        />
      </div>
    </div>
  );
}

export default AlertForm;