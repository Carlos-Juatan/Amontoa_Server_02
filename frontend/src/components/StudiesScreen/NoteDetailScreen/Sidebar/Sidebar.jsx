// src/components/StudiesScreen/NoteDetailScreen/Sidebar/Sidebar.jsx
import React, { useState } from 'react';

import Button from '../../../Common/Button/Button';
import SearchBar from '../../../Common/SearchBar/SearchBar';
import SidebarHierarchy from './SidebarHierarchy';

import './Sidebar.css';

function Sidebar({ searchTerm, onSearchChange, filteredItems, currentLesson, dbCollection, onItemSelect, onAddOrEdit, onModelEdit, onModelDelete }) {
  const [editMode, setEditMode] = useState(false);

  return (
    <aside className="note-detail-sidebar">
      <h2 className="sidebar-title">Aulas</h2>
      <div className="sidebar-controls">
        {/* Botão "Adicionar" principal - agora só para módulos */}
        <Button onClick={() => onAddOrEdit(null)} className="add-button">
          <i className="fas fa-plus"></i> Adicionar
        </Button>
        <Button onClick={() => setEditMode(!editMode)} className={`edit-toggle-button ${editMode ? 'active' : ''}`}>
          <i className="fas fa-edit"></i> {editMode ? 'Sair do Modo Edição' : 'Editar'}
        </Button>
      </div>
      
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        placeholder="Pesquisar aulas e conteúdo..."
        className="sidebar-search-bar"
      />

      <SidebarHierarchy
        searchTerm={searchTerm}
        filteredItems={filteredItems}
        currentLesson={currentLesson} // Ensure currentLesson is passed
        dbCollection={dbCollection}
        
        onItemSelect={onItemSelect}
        
        editMode={editMode}

        onAddOrEdit={onAddOrEdit}
        onModelEdit={onModelEdit}
        onModelDelete={onModelDelete}
      />
    </aside>
  );
}
export default Sidebar;