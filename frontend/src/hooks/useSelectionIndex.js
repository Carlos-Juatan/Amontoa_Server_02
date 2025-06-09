// src/hooks/useObjectSelection.js
import { useState, useEffect, useCallback } from 'react';

const useSelectionIndex = (items) => {
  const [currentIndex, setCurrentIndex] = useState(null);

  // Resetar a seleção se a lista de itens mudar ou ficar vazia
  useEffect(() => {
    if (items.length === 0 || currentIndex >= items.length) {
      setCurrentIndex(null);
    }
  }, [items, currentIndex]);

  // Inicia com o primeiro index
  const selectIndex = currentIndex === null && items.length > 0
    ? setCurrentIndex(0)
    : null;

  // Objeto atualmente selecionado
  const selectedObject = currentIndex !== null && items.length > 0
    ? items[currentIndex]
    : null;

  // Função para avançar para o próximo item
  const handleNext = () => {
    if (items.length === 0) {
      setCurrentIndex(null);
      return;
    }

    setCurrentIndex(prevIndex => {
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
      setCurrentIndex(null);
      return;
    }

    setCurrentIndex(prevIndex => {
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
      setCurrentIndex(index);
    }
  }, [items]);

  return {
    currentIndex,
    setCurrentIndex, // Útil para resetar a seleção de fora (e.g., ao pesquisar)
    selectedObject,
    handleNext,
    handlePrev,
    handleItemSelect,
  };
};

export default useSelectionIndex;