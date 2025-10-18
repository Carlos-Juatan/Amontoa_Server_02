// src/hooks/useAnimeFiltering.js
import { useState, useMemo } from 'react';
import { sortItems, getCurrentAnimeSeason } from '../utils/sortFilterUtils';

// Este hook agora gerencia todo o estado e a lógica de filtragem e ordenação
const useAnimeFiltering = (filteredItemsFromSearch) => {
  // Estados
  const [displaySort, setDisplaySort] = useState('AZ');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedLaunches, setSelectedLaunches] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('Tudo');

  // Funções de Manipulação
  const handleCollectionFilter = (filterName) => setSelectedCollection(filterName);
  const handleSortSelect = (event) => setDisplaySort(event.target.value);
  // Lógica para adicionar/remover a tag do estado
  const toggleTags = (tag) => {
    setSelectedTags(prevTags => {  // Assumindo que 'tag' é o nome da tag (ex: 'Ação')
      if (prevTags.includes(tag)) {
        return prevTags.filter(t => t !== tag);  // Se já estiver na lista, remove (desmarca)

      } else {
        return [...prevTags, tag]; // Se não estiver, adiciona (marca)
      }
    });
  };
  // Lógica para adicionar/remover a opção de Lançamento
  const toggleLaunches = (launchOption) => {
    setSelectedLaunches(prevLaunches => { // launchOption será algo como 'Inverno 2025'
      if (prevLaunches.includes(launchOption)) {
        return prevLaunches.filter(o => o !== launchOption);

      } else {
        return [...prevLaunches, launchOption];
      }
    });
  };

  // Filtra os itens com base nas tags selecionadas
  const itemsFilteredByTags = useMemo(() => {
    if (selectedTags.length === 0 || !filteredItemsFromSearch) return filteredItemsFromSearch;


    return filteredItemsFromSearch.filter(item => // Aplica o filtro de múltiplas tags (lógica "AND")
      selectedTags.every(tagSelecionada => item.tags?.includes(tagSelecionada)) // Assumindo que 'item.tags' é um array de strings
    );
  }, [filteredItemsFromSearch, selectedTags]); // Recalcula sempre que a busca ou as tags mudarem

  // Filtra os itens com base nas opções de Lançamento selecionadas
  const itemsFilteredByLaunch = useMemo(() => {
    if (selectedLaunches.length === 0 || !itemsFilteredByTags) return itemsFilteredByTags;

    return itemsFilteredByTags.filter(item => { // Retorna qualuer item que tenha pelo menos uma das datas selecionadas
      return selectedLaunches.some(launchOption => {
        const [season, yearStr] = launchOption.split(' '); // Ex: ['Inverno', '2025']
        const year = parseInt(yearStr);
        return item.date?.launched?.season === season && item.date?.launched?.year === year;
      });
    });
  }, [itemsFilteredByTags, selectedLaunches]);

  // Filtra os itens com base no filtro de coleção/status ativo
  const itemsFilteredByCollection = useMemo(() => {

    if (!itemsFilteredByLaunch) return []; // Se a lista não existir retorna uma lista vazia
    if (selectedCollection === 'Tudo') return itemsFilteredByLaunch; // Se 'Tudo', retorna a lista sem filtro

    // Lógica para 'Temporada Atual' (Outono 2025: Out-Dez)
    if (selectedCollection === 'Temporada Atual') {
      const currentSeason = getCurrentAnimeSeason(); // Use a função importada
      return itemsFilteredByLaunch.filter(item =>
        item.date?.launched?.season === currentSeason.season && item.date?.launched?.year === currentSeason.year
      );
    }

    return itemsFilteredByLaunch.filter(item =>
      item.collections?.includes(selectedCollection)
    );

  }, [itemsFilteredByLaunch, selectedCollection]); // Recalcula quando o filtro de coleção ou a lista anterior mudar.


  // finalSortedItems
  const finalSortedItems = useMemo(() => {
    if (!itemsFilteredByCollection || itemsFilteredByCollection.length === 0) return [];
    return sortItems(itemsFilteredByCollection, displaySort); // Use a função importada
  }, [itemsFilteredByCollection, displaySort]);

  // 4. Retorno
  return {
    finalSortedItems,
    displaySort,
    handleSortSelect,
    selectedTags,
    toggleTags,
    selectedLaunches,
    toggleLaunches,
    selectedCollection,
    handleCollectionFilter,
    // ... outros estados/funções que o AnimesScreen precisa ...
  };
};

export default useAnimeFiltering;