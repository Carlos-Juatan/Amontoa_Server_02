// src/components/Common/CustomDropdown/CustomDropdown.jsx
import React, { useState, useRef, useEffect } from 'react';
import useClickOutside from '../../../hooks/useClickOutside';
import './CustomDropdown.css'; 
// Use a tag "Dropdown.css" ou "CustomDropdown.css" para o arquivo de estilos

function CustomDropdown({ options = [], value, onChange, placeholder = "Selecione..." }) {
  // Estado para controlar se o menu de opções está aberto ou fechado
  const [isOpen, setIsOpen] = useState(false);
  
  // Referência para o container do dropdown. Usado para fechar o menu ao clicar fora.
  const dropdownRef = useClickOutside(() => setIsOpen(false));

  // Encontra o item selecionado para exibir no campo
  const selectedOption = options.find(opt => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  // Função para fechar o dropdown ao selecionar uma opção
  const handleSelect = (optionValue) => {
    onChange(optionValue); // Envia o novo valor para o componente pai
    setIsOpen(false);      // Fecha o dropdown
  };

  return (
    <div className="custom-select-wrapper" ref={dropdownRef}>
      
      {/* 1. O Gatilho (Botão) */}
      <div 
        className="custom-select-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen} // Acessibilidade: indica se o menu está aberto
        role="button"         // Acessibilidade: define como botão
      >
        <span>{displayLabel}</span>
        {/* Ícone de seta (use o do Font Awesome que você tem ou um SVG) */}
        <i className={`fa-solid fa-chevron-down ${isOpen ? 'open' : ''}`}></i>
      </div>

      {/* 2. O Menu de Opções */}
      {isOpen && (
        <ul className="custom-options" role="listbox">
          {options.map((option) => (
            <li
              key={option.value}
              className={`custom-option ${option.value === value ? 'selected' : ''}`}
              onClick={() => handleSelect(option.value)}
              role="option" // Acessibilidade: define como uma opção de lista
              aria-selected={option.value === value}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CustomDropdown;