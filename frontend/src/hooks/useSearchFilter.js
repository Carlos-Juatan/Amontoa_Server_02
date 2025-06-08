// src/hooks/useSearchFilter.js
import { useMemo, useState } from 'react';

const useSearchFilter = (items, initialSearchTerm = '', searchKeys = []) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  const filteredItems = useMemo(() => {
    // 1. Verificações de robustez
    if (!items || !Array.isArray(items)) {
      console.warn("useDynamicSearchFilter: 'items' provided is not a valid array.", items);
      return []; // Retorna um array vazio para evitar erros
    }

    if (!searchTerm || searchTerm.trim() === '') {
      return items; // Retorna os itens originais se não houver termo de pesquisa
    }

    const lowercasedSearchTerm = searchTerm.toLowerCase().trim();

    return items.filter(item => {
      if (searchKeys.length === 0) {
        return true; // Retorna todos os itens se não houver chaves para filtrar || False para não retornar nenhum item
      }

      // Verifica cada chave de pesquisa para correspondência
      return searchKeys.some(key => {
        const value = item[key];
        // Garante que o valor existe e é uma string antes de tentar toLowerCase() e includes()
        return typeof value === 'string' && value.toLowerCase().includes(lowercasedSearchTerm);
      });
    });
  }, [items, searchTerm, searchKeys]); // Dependências: items originais, termo de pesquisa, chaves

  const handleSearchChange = (eventOrValue) => {
        let newValue;
        // Verifica se é um objeto de evento (geralmente tem um 'target' e 'target.value')
        if (eventOrValue && typeof eventOrValue === 'object' && 'target' in eventOrValue && 'value' in eventOrValue.target) {
            newValue = eventOrValue.target.value;
        } else if (typeof eventOrValue === 'string') {
            // Se for uma string direta (como o '' do botão de limpar)
            newValue = eventOrValue;
        } else {
            // Caso receba algo inesperado
            console.warn('handleSearchChange recebeu um argumento inesperado:', eventOrValue);
            newValue = ''; // Ou trate de outra forma
        }
        setSearchTerm(newValue);
    };

  return {
    searchTerm,
    setSearchTerm, // Permite que o componente externo resete ou defina o termo programaticamente
    filteredItems,
    handleSearchChange,
  };
};

export default useSearchFilter;