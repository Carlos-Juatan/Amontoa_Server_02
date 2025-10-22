// src/pages/AnimesScreen/CollectionContextMenu.jsx (Novo Arquivo)
import React, { useRef, useEffect } from 'react';

// Use as classes CSS que você já tem para os items: .custom-options e .custom-option
import '../../components/Common/CustomDropdown/CustomDropdown.css';

function CollectionContextMenu({ x, y, collectionName, onRename, onDelete, onClose }) {
  const menuRef = useRef(null);

  // Efeito para fechar o menu ao clicar fora OU ao pressionar ESC
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

  // Estilo para posicionar o menu
  const menuStyle = {
    position: 'fixed', // Use fixed para garantir que fique visível, não importa o scroll
    top: y,
    left: x,
    zIndex: 2000, // Alto z-index
  };

  const handleAction = (action) => {
    action(collectionName);
    onClose(); // Fecha o menu após a ação
  };

  return (
    <ul
      className="custom-options"
      style={menuStyle}
      ref={menuRef}
      role="menu"
    >
      {/* Opção Renomear */}
      <li
        className="custom-option"
        onClick={() => handleAction(onRename)}
        role="menuitem"
      >
        Renomear
      </li>

      {/* Opção Apagar */}
      <li
        className="custom-option"
        onClick={() => handleAction(onDelete)}
        role="menuitem"
      >
        Apagar
      </li>
    </ul>
  );
}

export default CollectionContextMenu;
// Lembre-se de exportar e importar isso em AnimesScreen.jsx