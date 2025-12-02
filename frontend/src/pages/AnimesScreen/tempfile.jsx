// src/pages/AnimesScreen/AnimesModal.jsx
import React, { useState, useEffect } from 'react';

import { ModalScreen } from '../../components/Common/Modal/ModalComponents/ModalComponents';

function TempAnimeNewEditModal({
//#region 
  hasAnimeModal, // 'new', 'edit', ou null
  closeModal,
  item, // Item do anime para edição (se hasAnimeModal === 'edit')
  globalData, // Contém globalData.globalInfo.tags
  onSave // Função para salvar/atualizar os dados do anime
}) {

//#endregion
  return (
    <ModalScreen closeModal={closeModal}>
      <form className="anime-form" onSubmit={handleSubmit}>
        <h2>{isEditing ? 'Editar Anime' : 'Adicionar Novo Anime'}</h2>
        


        
        {/* Sinopse */}
        <div className="form-group">
          <label htmlFor="sinopse">Sinopse</label>
        </div>
        
        {/* Tags */}
        <div className="form-group">
          <label>Tags</label>
          <div className="tags-container">
            {formData.tags.map(tag => (
              <TagItem key={tag} tag={tag} onRemove={handleRemoveTag} />
            ))}
          </div>
          <TagInputDropdown 
            globalTags={globalData?.globalInfo?.tags || []} // Global tags simuladas
            currentTags={formData.tags}
            onAddTag={handleAddTag}
            onOpenNewTagModal={() => setIsTagModalOpen(true)} 
          />
        </div>

        {/* Botões de Ação */}
        <div className="modal-actions">
          <button type="submit" className="btn-primary">
            {isEditing ? 'Salvar Edição' : 'Adicionar Anime'}
          </button>
          <button type="button" className="btn-secondary" onClick={closeModal}>
            Cancelar
          </button>
        </div>
      </form>

      {/* MUDANÇA 4: Renderizando o Modal de Tag aqui dentro */}
      <AddTagModal 
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        onSave={handleSaveNewTag}
      />
      
    </ModalScreen>
  );
}

// Componente para um item de Tag
const TagItem = ({ tag, onRemove }) => (
  <span className="tag-item">
    {tag}
    <i className="fa-solid fa-xmark tag-remove-icon" onClick={() => onRemove(tag)} />
  </span>
);

// Componente para o dropdown de Tags (simples, pode ser mais complexo)
const TagInputDropdown = ({ globalTags, currentTags, onAddTag, onOpenNewTagModal }) => {
  
  const handleSelectChange = (e) => {
    const value = e.target.value;

    if (value === "NEW_TAG") {
      // MUDANÇA: Dispara a abertura do modal em vez de mostrar input
      onOpenNewTagModal();
    } else if (value && !currentTags.includes(value)) {
      onAddTag(value);
    }
  };
  
  const availableTags = globalTags.filter(tag => !currentTags.includes(tag));

  return (
    <div className="tag-input-dropdown">
      <select value="" onChange={handleSelectChange}>
        <option value="" disabled>Selecione uma tag</option>
        {availableTags.map(tag => (
          <option key={tag} value={tag}>{tag}</option>
        ))}
        {/* Opção especial */}
        <option value="NEW_TAG" style={{ fontWeight: 'bold' }}>+ Adicionar Nova Tag...</option>
      </select>
    </div>
  );
};

const AddTagModal = ({ isOpen, onClose, onSave }) => {
  const [newTagValue, setNewTagValue] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (newTagValue.trim()) {
      onSave(newTagValue.trim());
      setNewTagValue(''); // Limpa o input
    }
  };

  return (
    // Reutilizando a estrutura de overlay para ficar por cima do anterior
    // Nota: O z-index no CSS deve ser maior que o do primeiro modal
    <div className="anime-edit-modal-overlay" style={{ zIndex: 1100 }}>
      <div className="anime-edit-modal-container" style={{ maxWidth: '400px' }}>
        <h3>Adicionar Nova Tag</h3>
        <div className="form-group">
          <input 
            type="text" 
            placeholder="Nome da tag..."
            value={newTagValue}
            onChange={(e) => setNewTagValue(e.target.value)}
            autoFocus
          />
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-primary" onClick={handleConfirm}>
            Adicionar
          </button>
           <button type="button" className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export { 
  TempAnimeNewEditModal,
}