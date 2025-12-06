// src/pages/AnimesScreen/AnimeActionsMenu.jsx (Novo Arquivo)
import React, { useState, useRef, useEffect } from 'react';
import ActionDropdownContainer from '../../components/Common/ActionDropdownContainer/ActionDropdownContainer';
import '../../components/Common/CustomDropdown/CustomDropdown.css'; // Reutilizando os estilos


function AnimeActionsMenu({ itemId, itemColections, collections, onEdit, onDelete, onAddToCollection, onRemoveCollection, onAddNewCollection, onClose }) {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  const isAlreadyAddOnColection = (col) => {
    return itemColections.includes(col);
  }

  // Função para fechar o sub-menu ao selecionar uma coleção ou adicionar uma nova
  const handleCloseSubMenu = () => {
    setIsSubMenuOpen(false);
    onClose(); // Fecha também o menu principal
  }

  return (
    <ActionDropdownContainer onClose={onClose} className="custom-select-wrapper">
      <ul className="custom-options" role="menu">
        {/* 1. Editar */}
        <li
          className="custom-option"
          onClick={(e) => { e.stopPropagation(); onEdit(itemId); onClose(); }}
          role="menuitem"
        >
          Editar
        </li>

        {/* 2. Adicionar aos Favoritos */}
        <li
          className="custom-option"
          onClick={(e) => { e.stopPropagation(); isAlreadyAddOnColection('Favoritos') ? onRemoveCollection(itemId, 'Favoritos') : onAddToCollection(itemId, 'Favoritos'); onClose(); }}
          role="menuitem"
        >
          {isAlreadyAddOnColection('Favoritos') ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
        </li>

        {/* 3. Adicionar à Coleção (Com Sub-Menu) */}
        <li
          className="custom-option"
          onClick={(e) => { 
            e.stopPropagation(); // Impede o fechamento do menu pai
            setIsSubMenuOpen(prev => !prev);
          }} 
          role="menuitem"
          style={{ position: 'relative' }}
        >
          Adicionar à Coleção
          {isSubMenuOpen && (
            <CollectionSubMenu
              collections={collections}
              onAddToCollection={(col) => onAddToCollection(itemId, col)}
              isAlreadyAddOnColection={isAlreadyAddOnColection}
              onRemoveCollection={(col) => onRemoveCollection(itemId, col)}
              onAddNewCollection={() => onAddNewCollection(itemId)}
              onClose={handleCloseSubMenu}
            />
          )}
        </li>

        {/* 4. Apagar */}
        <li
          className="custom-option"
          onClick={(e) => { e.stopPropagation(); onDelete( { _id: itemId }); onClose(); }}
          role="menuitem"
        >
          Apagar
        </li>
      </ul>
    </ActionDropdownContainer>
  );
}

// Sub-componente (necessário para o menu de coleções)
function CollectionSubMenu({ collections, onAddToCollection, isAlreadyAddOnColection, onRemoveCollection, onAddNewCollection, onClose }) {
  return (
    <ul 
      className="custom-options"
      style={{ 
          position: 'absolute', // CHAVE
          left: '100%',         // CHAVE: 100% da largura do pai (li)
          top: 0,               // Alinha ao topo do pai
          marginLeft: '5px',
          zIndex: 2001 // Z-index ligeiramente maior que o menu pai
      }}
    >
      {collections.map(col => (
        <li
          key={col}
          className="custom-option"
          onClick={(e) => { e.stopPropagation(); isAlreadyAddOnColection(col) ? onRemoveCollection(col) : onAddToCollection(col); onClose(); }}
        >
          {isAlreadyAddOnColection(col) ? "Remover de " : "Adicionar à "}{col}
        </li>
      ))}
      <li
        className="custom-option"
        onClick={(e) => { e.stopPropagation(); onAddNewCollection(); onClose(); }}
        style={{ fontWeight: 'bold' }}
      >
        + Nova Coleção
      </li>
    </ul>
  );
}

export default AnimeActionsMenu;