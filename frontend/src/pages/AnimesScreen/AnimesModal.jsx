// src/pages/AnimesScreen/AnimesModal.jsx
import React, { useState, useEffect } from 'react';

import Modal from '../../components/Common/Modal/Modal';

import './AnimesModal.css';

function AddCollection({ isOpen, onClose, title, onSubmit, initialValue }) {
  const [collectionName, setCollectionName] = useState(initialValue || '');

  const handleChange = (e) => setCollectionName(e.target.value);

  const handleSubmit = () => {
    if (collectionName.trim()) {
      const formattedName = toTitleCase(collectionName); 
      onSubmit(formattedName);
      setCollectionName('');
      onClose();
    }
  };


  return (
    <div className='animes-modal-add-collection'>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        onSubmit={handleSubmit}
        submitButtonText={"Criar"}
        modalCustonStyle="item-add-collection-content"
      >
        <input type="text" value={collectionName} onChange={handleChange}/>
      </Modal>
    </div>
  );
}

export {
  AddCollection,
};


// Função utilitária para converter para Title Case
const toTitleCase = (str) => {
  // 1. Remove espaços em branco do início/fim (como o .trim() faria)
  // 2. Converte para minúsculas para garantir consistência
  // 3. Usa uma expressão regular para encontrar o início da string (\b) ou o espaço (\s) 
  //    seguido por uma letra, e transforma essa letra em maiúscula.
  return str.trim().toLowerCase().split(/\s+/).map(word => {
    // Evita erro se a palavra for vazia
    if (word.length === 0) return ''; 
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
};