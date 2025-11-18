// src/hooks/useClickOutside.js

import { useEffect, useRef } from 'react';

/**
 * Hook personalizado para detectar cliques fora de um elemento DOM específico.
 * * @param {function} callback - Função a ser chamada quando ocorrer um clique fora do elemento.
 * @returns {React.RefObject} - A referência (ref) a ser anexada ao elemento DOM.
 */
export default function useClickOutside(callback) {
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      // Verifica se a referência existe E se o clique não está dentro do elemento.
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }

    // Adiciona o listener de evento
    document.addEventListener("mousedown", handleClickOutside);
    
    // Cleanup: Remove o listener quando o componente for desmontado ou a função for alterada
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback]); // O callback é uma dependência para garantir que a função mais recente seja usada.

  return ref;
}