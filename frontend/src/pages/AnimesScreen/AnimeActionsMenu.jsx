// src/pages/AnimesScreen/AnimeActionsMenu.jsx (Novo Arquivo)
import React, { useState, useRef, useEffect } from 'react';
import '../../components/Common/CustomDropdown/CustomDropdown.css'; // Reutilizando os estilos


function AnimeActionsMenu({ itemId, collections, onEdit, onDelete, onAddToCollection, onAddNewCollection, onClose }) {
  const menuRef = useRef(null);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  // Fecha o menu principal e sub-menu ao clicar fora/Escape
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    }
    function handleKey(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  return (
    <div className="custom-select-wrapper" ref={menuRef}>
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
          onClick={(e) => { e.stopPropagation(); onAddToCollection(itemId, 'Favoritos'); onClose(); }}
          role="menuitem"
        >
          Adicionar aos Favoritos
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
              onAddNewCollection={() => onAddNewCollection(itemId)}
              onClose={onClose}
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
    </div>
  );
}

// Sub-componente (necessário para o menu de coleções)
function CollectionSubMenu({ collections, onAddToCollection, onAddNewCollection, onClose }) {
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
          onClick={(e) => { e.stopPropagation(); onAddToCollection(col); onClose(); }}
        >
          {col}
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