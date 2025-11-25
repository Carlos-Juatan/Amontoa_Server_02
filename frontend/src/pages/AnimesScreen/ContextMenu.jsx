// src/pages/AnimesScreen/ContextMenu.jsx (Novo Arquivo)
import React, { useRef, useEffect } from 'react';

// Use as classes CSS que você já tem para os items: .custom-options e .custom-option
import useClickOutside from '../../hooks/useClickOutside';
import '../../components/Common/CustomDropdown/CustomDropdown.css';

function ContextMenu({ x, y, collectionName, onRename, onDelete, onClose }) {
  const menuRef = useClickOutside(onClose);

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
    <ul className="custom-options" style={menuStyle} ref={menuRef} role="menu">
      {/* Opção Renomear */}
      <li className="custom-option" onClick={() => handleAction(onRename)} role="menuitem">
        Editar
      </li>

      {/* Opção Apagar */}
      <li className="custom-option" onClick={() => handleAction(onDelete)} role="menuitem">
        Apagar
      </li>
    </ul>
  );
}

export default ContextMenu;