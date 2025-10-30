// src/components/Common/CustomCheckbox/CustomCheckbox.jsx

import React from 'react';
import './CustomCheckbox.css'; // Importa o CSS

/**
 * Checkbox customizado
 * @param {boolean} checked - Se o checkbox está marcado.
 * @param {function} onChange - Função a ser chamada na mudança de estado.
 * @param {number} [size=15] - Tamanho (altura/largura) do checkbox em pixels.
 */
const CustomCheckbox = ({ checked, onChange, size = 15 }) => {
  // Cria um objeto de estilo para passar o tamanho como uma variável CSS.
  const style = {
    '--checkbox-size': `${size}px`,
    '--checkmark-left': `${size / 4}px`, // Posição X ajustada (ex: 15px/5 = 3px)
    '--checkmark-top': `${size / 15}px`,  // Posição Y ajustada (ex: 15px/15 = 1px)
    '--checkmark-width': `${size / 3.75}px`, // Largura ajustada (ex: 15px/3.75 = 4px)
    '--checkmark-height': `${size / 2.14}px`, // Altura ajustada (ex: 15px/2.14 ≈ 7px)
    '--checkmark-border-width': `${size / 5}px`, // Espessura da borda (ex: 15px/5 = 3px)
  };

  return (
    <div className="custom-checkbox-container" style={style}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <span className="checkmark"></span>
    </div>
  );
};

export default CustomCheckbox;