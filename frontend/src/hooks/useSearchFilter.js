// src/hooks/useSearchFilter.js (Corrigido)
import { useMemo, useState } from 'react';

// Função auxiliar para obter valores, suportando aninhamento (ex: 'name.english')
// e transformando arrays (tags) em uma única string para pesquisa.
const getSearchableValue = (item, key) => {
  // 1. Lida com chaves aninhadas (ex: 'name.english')
  if (key.includes('.')) {
    const parts = key.split('.');
    let value = item;
    for (const part of parts) {
      value = value ? value[part] : undefined;
    }
    return value;
  }

  // 2. Lida com chaves de nível superior
  let value = item[key];

  // 3. Lida com arrays de strings (como 'tags')
  if (Array.isArray(value)) {
    // Converte o array em uma única string, separada por espaços, para pesquisa
    value = value.join(' ');
  }

  return value;
};


const useSearchFilter = (items, initialSearchTerm = '', searchKeys = []) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  const filteredItems = useMemo(() => {
    if (!items || !Array.isArray(items) || !searchTerm || searchTerm.trim() === '') {
      return items || [];
    }

    const lowercasedSearchTerm = searchTerm.toLowerCase().trim();

    return items.filter(item => {
      if (searchKeys.length === 0) {
        return true; // Retorna todos os itens
      }

      // Verifica se ALGUMA das chaves (incluindo tags e aninhadas) corresponde
      return searchKeys.some(key => {
        const value = getSearchableValue(item, key); // <--- USANDO A NOVA FUNÇÃO

        // Garante que o valor é uma string antes de comparar
        return typeof value === 'string' && value.toLowerCase().includes(lowercasedSearchTerm);
      });
    });
  }, [items, searchTerm, searchKeys]);


  const handleSearchChange = (eventOrValue) => {
    // (Sua lógica de handler permanece a mesma)
    let newValue;
    if (eventOrValue && typeof eventOrValue === 'object' && 'target' in eventOrValue && 'value' in eventOrValue.target) {
      newValue = eventOrValue.target.value;
    } else if (typeof eventOrValue === 'string') {
      newValue = eventOrValue;
    } else {
      console.warn('handleSearchChange recebeu um argumento inesperado:', eventOrValue);
      newValue = '';
    }
    setSearchTerm(newValue);
  };

  return {
    searchTerm,
    setSearchTerm,
    filteredItems,
    handleSearchChange,
  };
};

export default useSearchFilter;