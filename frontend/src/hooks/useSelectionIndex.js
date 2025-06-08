// src/hooks/useObjectSelection.js
import { useState, useEffect, useCallback } from 'react';

const useSelectionIndex = (items) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  // Resetar a seleção se a lista de itens mudar ou ficar vazia
  useEffect(() => {
    if (items.length === 0 || selectedIndex >= items.length) {
      setSelectedIndex(null);
    }
  }, [items, selectedIndex]);

  // Inicia com o primeiro index
  const selectIndex = selectedIndex === null && items.length > 0
    ? setSelectedIndex(0)
    : null;

  // Objeto atualmente selecionado
  const selectedObject = selectedIndex !== null && items.length > 0
    ? items[selectedIndex]
    : null;

  // Função para avançar para o próximo item
  const handleNext = () => {
    if (items.length === 0) {
      setSelectedIndex(null);
      return;
    }

    setSelectedIndex(prevIndex => {
      if (prevIndex === null || prevIndex === items.length - 1) {
        return items.length - 1; // Se for o primeiro ou nenhum selecionado, vai para o último
        //return 0; // Se for o último ou nenhum selecionado, volta para o primeiro
      }
      return prevIndex + 1; // Avança para o próximo
    });
  };

  // Função para voltar para o item anterior
  const handlePrev = () => {
    if (items.length === 0) {
      setSelectedIndex(null);
      return;
    }

    setSelectedIndex(prevIndex => {
      if (prevIndex === null || prevIndex === 0) {
        //return items.length - 1; // Se for o primeiro ou nenhum selecionado, vai para o último
        return 0; // Se for o último ou nenhum selecionado, volta para o primeiro
      }
      return prevIndex - 1; // Volta para o anterior
    });
  };

  
  const handleItemSelect = useCallback((itemIdToSelect) => {
    const index = items.findIndex(item => item._id === itemIdToSelect);
    if (index !== -1) {
      setSelectedIndex(index);
    }
  }, [items]);

  return {
    selectedIndex,
    setSelectedIndex, // Útil para resetar a seleção de fora (e.g., ao pesquisar)
    selectedObject,
    handleNext,
    handlePrev,
    handleItemSelect,
  };
};

export default useSelectionIndex;