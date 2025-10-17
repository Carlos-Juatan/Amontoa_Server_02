// src/pages/AnimesScreen/AnimesScreen.jsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useDataOperations from '../../hooks/useDataOperations';
import useSearchFilter from '../../hooks/useSearchFilter';

import { AnimesItemGrid, AnimesItemList, CollapsibleMenu } from './AnimesStructures';
import Button from '../../components/Common/Button/Button';
import SearchBar from '../../components/Common/SearchBar/SearchBar';

import './AnimesScreen.css';

function AnimesScreen(){
  //#region ... Variables ...
  const collectionName = 'animes';
  const navigate = useNavigate(); // to navegate between pages
  const [displaySort, setDisplaySort] = useState('AZ');
  const [displayStyle, setDisplayStyle] = useState('grid');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedLaunches, setSelectedLaunches] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('Tudo');
  //#endregion
  
  //#region ... Hooks ...
  const { data, loading, error, fetchData, createRecord, updateRecord, deleteRecord, isMutating, mutationError } = useDataOperations(collectionName);
  const globalData = data?.length > 0 ? data[0].globalInfo : null;
  const items = data?.length > 1 ? data.slice(1) : []; // Usamos o 'slice(1)' para pegar todos os elementos A PARTIR do índice 1.
  const { searchTerm, setSearchTerm, filteredItems, handleSearchChange } = useSearchFilter(items, '', ['name.english', 'name.japonese', 'description', 'tags']);
  //Formata as opções de lançamento para o CollapsibleMenu
  const launchOptions = useMemo(() => {
    if (!globalData?.seassons) return [];

    return globalData.seassons
      .map(item => {
        const monthMap = mapSeasonToOrder(item.season);
        const months = monthMap === 1 ? 'Jan-Mar' : monthMap === 2 ? 'Abr-Jun' : monthMap === 3 ? 'Jul-Set' : monthMap === 4 ? 'Out-Dez' : 'N/A';
        
        const filterKey = `${item.season} ${item.year}`; // Opção de filtro real (usada no selectedList e no toggle)

        const displayLabel = `${filterKey} (${months})`; // Texto de exibição no CollapsibleMenu

        return { filterKey, displayLabel };
      });
  }, [globalData]);
  //#endregion

  //#region ... Functions ...
  const handleBackToDashboard = () => navigate('/');
  
  //#region ... Display Sort / Filtering Chain ...
  const handleCollectionFilter = (filterName) => {
    setSelectedCollection(filterName);
    console.log(`Filtro de coleção ativo: ${filterName}`);
  }

  const handleSortSelect = (event) => {
    const value = event.target.value;
    setDisplaySort(value);
    console.log(`Trocando o valor de ordem para: ${value}`);
  }

  const handleDisplayStyle = (value) => setDisplayStyle(value);

  // Filtra os itens com base nas tags selecionadas
  const itemsFilteredByTags = useMemo(() => {
    // Se nenhuma tag estiver selecionada, ou se o filteredItems for nulo, retorna a lista da busca.
    if (selectedTags.length === 0 || !filteredItems) {
      return filteredItems;
    }

    // Aplica o filtro de múltiplas tags (lógica "AND")
    return filteredItems.filter(item =>
      selectedTags.every(tagSelecionada =>
        // Assumindo que o campo de tags no seu objeto 'item' é um array de strings chamado 'tags'
        item.tags?.includes(tagSelecionada)
      )
    );
  }, [filteredItems, selectedTags]); // Recalcula sempre que a busca ou as tags mudarem

  // NOVO: Filtra os itens com base nas opções de Lançamento selecionadas
  const itemsFilteredByLaunch = useMemo(() => {
    // Se nenhum filtro de lançamento estiver ativo, retorna a lista anterior.
    if (selectedLaunches.length === 0 || !itemsFilteredByTags) {
      return itemsFilteredByTags;
    }

    return itemsFilteredByTags.filter(item => {
      // O item é incluído se o seu lançamento (`date.launched`) corresponder a QUALQUER
      // uma das opções selecionadas (lógica OR entre opções de lançamento).
      return selectedLaunches.some(launchOption => {
        const [season, yearStr] = launchOption.split(' '); // Ex: ['Inverno', '2025']
        const year = parseInt(yearStr);

        return item.date?.launched?.season === season && item.date?.launched?.year === year;
      });
    });
  }, [itemsFilteredByTags, selectedLaunches]);

  // Filtra os itens com base no filtro de coleção/status ativo
  const itemsFilteredByCollection = useMemo(() => {
    if (!itemsFilteredByLaunch) return [];

    // Se 'Tudo', retorna a lista sem filtro
    if (selectedCollection === 'Tudo') {
      return itemsFilteredByLaunch;
    }

    // Lógica para 'Temporada Atual' (Outono 2025: Out-Dez)
    if (selectedCollection === 'Temporada Atual') {
      const currentSeason = getCurrentAnimeSeason();
      
      return itemsFilteredByLaunch.filter(item => 
        item.date?.launched?.season === currentSeason.season && item.date?.launched?.year === currentSeason.year
      );
    }

    // Lógica para 'Favoritos' (assumindo que seja uma tag ou um campo 'isFavorite')
    // Como não há um campo 'isFavorite', podemos assumir que 'Favoritos' é uma tag.
    if (selectedCollection === 'Favoritos') {
        return itemsFilteredByLaunch.filter(item => 
          item.tags?.includes('Favoritos') // Se 'Favoritos' for uma tag (não parece ser pelo seu globalInfo)
          // Se você tiver um campo 'isFavorite' no item: item.isFavorite === true
        );
    }

    // Lógica para Coleções Personalizadas
    // Assumimos que a coleção é uma tag ou uma entrada no array 'collections' do item.
    return itemsFilteredByLaunch.filter(item => 
      item.collections?.includes(selectedCollection)
    );

  }, [itemsFilteredByLaunch, selectedCollection]); // Recalcula quando o filtro de coleção ou a lista anterior mudar.

  // 4. Atualiza o `finalSortedItems` para usar a lista mais recente: itemsFilteredByCollection
  const finalSortedItems = useMemo(() => {
    // Usa itemsFilteredByCollection como a nova fonte
    if (!itemsFilteredByCollection || itemsFilteredByCollection.length === 0) {
      return [];
    }
    // Aplica a ordenação
    return sortItems(itemsFilteredByCollection, displaySort);
  }, [itemsFilteredByCollection, displaySort]);
  //#endregion
  
  //#region ... Animes ...
  const seasonInfo = (date) => {

    if (!date || typeof date !== 'object') {
      return { season: "-", year: "-", months: "-" };
    }

    const monthMap = mapSeasonToOrder(date.season)
    const month = monthMap === 1 ? 'Jan-Mar' : monthMap === 2 ? 'Abr-Jun' : monthMap === 3 ? 'Jul-Set' : monthMap === 4 ? 'Out-Dez' : 'N/A';

    const launched = {
      season: date.season || "-",
      year: date.year || 0,
      months: month
    }
    return launched;
  }
  //#endregion

  //#region ... Sidebar
  // Lógica para adicionar/remover a tag do estado
  const toggleTags = (tag) => {
    // Assumindo que 'tag' é o nome da tag (ex: 'Ação')
    setSelectedTags(prevTags => {
      if (prevTags.includes(tag)) {
        // Se já estiver na lista, remove (desmarca)
        return prevTags.filter(t => t !== tag);
      } else {
        // Se não estiver, adiciona (marca)
        return [...prevTags, tag];
      }
    });
  };
  
  // Lógica para adicionar/remover a opção de Lançamento
  const toggleLaunches = (launchOption) => {
    // launchOption será algo como 'Inverno 2025'
    setSelectedLaunches(prevLaunches => {
      if (prevLaunches.includes(launchOption)) {
        return prevLaunches.filter(o => o !== launchOption);
      } else {
        return [...prevLaunches, launchOption];
      }
    });
  };
  //#endregion

  //#endregion

  //#region ... Dom Display ...
  return (
    <div className="animes-screen-container">

      {/* Header */}
      <div className="animes-header">
        <Button onClick={handleBackToDashboard} className="back-button">
          <i className="fas fa-arrow-left"></i> Voltar
        </Button>
        <h1 className="animes-title">{'Animes'}</h1>
      </div>

      {/* Animes Container */}
      <div className='animes-container'>
        <div className='anime-collections'> 
          <span onClick={() => handleCollectionFilter('Tudo')} className={selectedCollection === 'Tudo' ? 'selected-collection' : ''}>
            Tudo
          </span>
          <span onClick={() => handleCollectionFilter('Temporada Atual')} className={selectedCollection === 'Temporada Atual' ? 'selected-collection' : ''}>
            Temporada Atual
          </span>
          <span onClick={() => handleCollectionFilter('Favoritos')} className={selectedCollection === 'Favoritos' ? 'selected-collection' : ''}>
            Favoritos
          </span>
          {globalData?.collections?.map(item => (
            <span key={item} onClick={() => handleCollectionFilter(item)} className={selectedCollection === item ? 'selected-collection' : ''}>
              {item}
            </span>
          ))}
          <i className="fa-solid fa-plus" onClick={() => undefined}></i>
        </div>
        <div className='animes-content'>
          <div className='animes-display'>
            <div className='animes-organization'>
              <div className='animes-organization-left'>
                <span>Classificar por:</span>
                  <select 
                    name="sort" 
                    value={displaySort}
                    onChange={handleSortSelect}
                  >
                    <option value="AZ">Alfabético A-Z</option>
                    <option value="ZA">Alfabético Z-A</option>
                    <option value="MN">Maior Nota</option>
                    <option value="MM">Menor Nota</option>
                    <option value="LMR">Lançamento Mais Recente</option>
                    <option value="LMA">Lançamento Mais Antigo</option>
                    <option value="PM">Primeiras Modificadas</option>
                    <option value="UM">Últimas Modificadas</option>
                    <option value="MQE">Maior Quantidades de Episódios</option>
                    <option value="MQM">Menor Quantidades de Episódios</option>
                  </select>
              </div>
              <div className='animes-organization-right'>
                <i className="fa-solid fa-table-cells-large" onClick={() => handleDisplayStyle('grid')}></i>
                <i className="fa-solid fa-list-ul" onClick={() => handleDisplayStyle('list')}></i>
              </div>
            </div>
            <div className='animes-list'>
              {/* Display Grid */}
              {displayStyle === 'grid' && (
                <ul className='animes-list-grid'>
                  {finalSortedItems.length === 0 && !loading && (
                      <p>Nenhum item corresponde à sua busca.</p>
                  )}

                  {finalSortedItems.map(item => (
                    <li className='animes-item-grid' key={item._id}>
                      <AnimesItemGrid
                      id={item._id}
                      imageUrl={item.imageUrl || "N/A"}
                      japoneseTitle={item.name?.japonese || "N/A"}
                      englishTitle={item.name?.english || "N/A"}
                      ></AnimesItemGrid>
                    </li>
                  ))}
                </ul>
              )}
              {/* Display List */}
              {displayStyle === 'list' && (
                <>
                  <div className='animes-list-header'>
                    <span className='animes-list-header-option animes-list-header-title'>Título</span>
                    <span className='animes-list-header-option'>Temporadas</span>
                    <span className='animes-list-header-option'>Vezes Assistidas</span>
                    <span className='animes-list-header-option'>Nota</span>
                    <span className='animes-list-header-option '>Lançamento</span>
                  </div>

                  <ul className='animes-list-list'>
                    {finalSortedItems.length === 0 && !loading && (
                        <p>Nenhum item corresponde à sua busca.</p>
                    )}

                    {finalSortedItems.map(item => (
                      <li className='animes-item-list' key={item._id}>
                        <AnimesItemList
                          id={item._id}
                          imageUrl={item.imageUrl || "N/A"}
                          japoneseTitle={item.name?.japonese || "N/A"}
                          englishTitle={item.name?.english || "N/A"}
                          seasons={item.seasons?.length || "-"}
                          timeWhatched={item.timeWhatched?.length || "-"}
                          score={item.score?.personal || "-"}
                          launcheData={seasonInfo(item.date?.launched)}
                        ></AnimesItemList>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
          <div className='animes-sidebar'>
            <div className='animes-sidebar-title'>
              <h3>Filtros</h3>
            </div>
            
            <div className='animes-sidebar-research'>
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                placeholder={`Pesquisar em ${'Animes'}...`}
              />
            </div>

            <div className='animes-sidebar-content'>
              <div className='animes-sidebar-option'>
                <div onClick={ () => undefined }>
                  <span>Adicionar Anime</span>
                </div>
              </div>

              <CollapsibleMenu
                title={"Gênero"}
                options={globalData?.tags}
                selectedList={selectedTags}
                onToggle={toggleTags}
              ></CollapsibleMenu>

              <CollapsibleMenu
                title={"Lançamento"}
                // Passamos o array de filterKey's para o CollapsibleMenu
                options={launchOptions.map(o => o.displayLabel)}
                selectedList={selectedLaunches} // O estado que armazena as chaves
                onToggle={toggleLaunches} // CHAMA toggleLaunches
              ></CollapsibleMenu>
                
            </div>
          </div>
        </div>
      </div>

    </div>
  );
  //#endregion
}

export default AnimesScreen;

//#region ... Others Functions ...

// Função auxiliar para determinar a temporada atual do ano.
const getCurrentAnimeSeason = () => {
    // 1. Obtém a data atual do sistema
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // getMonth() retorna 0-11
    const currentYear = now.getFullYear();

    let season = '';
    // Mapeamento:
    // 1 (Jan) - 3 (Mar) = Inverno
    // 4 (Abr) - 6 (Jun) = Primavera
    // 7 (Jul) - 9 (Set) = Verão
    // 10 (Out) - 12 (Dez) = Outono
    
    if (currentMonth >= 10 && currentMonth <= 12) {
        season = 'Outono';
    } else if (currentMonth >= 7 && currentMonth <= 9) {
        season = 'Verão';
    } else if (currentMonth >= 4 && currentMonth <= 6) {
        season = 'Primavera';
    } else {
        season = 'Inverno';
    }

    return { 
        season: season, 
        year: currentYear 
    };
};

// Função auxiliar para mapear estações para um número
const mapSeasonToOrder = (season) => {
  switch (season) {
    case 'Inverno':
      return 1; // Jan-Mar
    case 'Primavera':
      return 2; // Abr-Jun
    case 'Verão':
      return 3; // Jul-Set
    case 'Outono':
      return 4; // Out-Dez
    default:
      return 0;
  }
}

// Função para calcular a quantidade total de episódios de um item
const countTotalEpisodes = (item) => {
  return item.seasons?.reduce((total, season) => {
    // Adiciona o número de episódios de cada temporada
    return total + (season.episodes?.length || 0);
  }, 0) || 0; // Retorna 0 se não houver temporadas
};

// Função principal de ordenação
const sortItems = (items, sortKey) => {
  // 1. Cria uma cópia do array para não modificar o estado original
  const sorted = [...items]; 

  sorted.sort((a, b) => {
    switch (sortKey) {
      // ORDENAÇÃO ALFABÉTICA
      case 'AZ': // Alfabético A-Z
        return (a.name?.english || '').localeCompare(b.name?.english || '');

      case 'ZA': // Alfabético Z-A
        return (b.name?.english || '').localeCompare(a.name?.english || '');

      // ORDENAÇÃO POR NOTA PESSOAL
      case 'MN': // Maior Nota (10 -> 0)
        return (b.score?.personal || 0) - (a.score?.personal || 0);

      case 'MM': // Menor Nota (0 -> 10)
        return (a.score?.personal || 0) - (b.score?.personal || 0);

      case 'LMR': { // Lançamento mais recente (novos) -> ORDEM DECRESCENTE
        const yearA = a.date?.launched?.year || 0;
        const yearB = b.date?.launched?.year || 0;
        const monthA = mapSeasonToOrder(a.date?.launched?.season);
        const monthB = mapSeasonToOrder(b.date?.launched?.season);

        // 1. Compara o ano: B - A (para ter o mais recente primeiro)
        if (yearA !== yearB) {
          return yearB - yearA;
        }

        // 2. Se o ano for igual, compara a estação: B - A
        return monthB - monthA;
      }

      case 'LMA': { // Lançamento mais antigos (velhos) -> ORDEM CRESCENTE
        const yearA = a.date?.launched?.year || 0;
        const yearB = b.date?.launched?.year || 0;
        const monthA = mapSeasonToOrder(a.date?.launched?.season);
        const monthB = mapSeasonToOrder(b.date?.launched?.season);

        // 1. Compara o ano: A - B (para ter o mais antigo primeiro)
        if (yearA !== yearB) {
          return yearA - yearB;
        }

        // 2. Se o ano for igual, compara a estação: A - B
        return monthA - monthB;
      }
        
      // ORDENAÇÃO POR DATA DE EDIÇÃO
      case 'PM': { // Primeiras Modificadas (Mais Antigas)
        // OBS: Se a data não for formato ISO (e.g., '14/10/2025'), 
        // a conversão pode falhar.
        const dateA = new Date(a.date?.lastEdit || 0);
        const dateB = new Date(b.date?.lastEdit || 0);
        return dateA.getTime() - dateB.getTime();
      }

      case 'UM': { // Últimas Modificadas (Mais Recentes)
        const dateA = new Date(a.date?.lastEdit || 0);
        const dateB = new Date(b.date?.lastEdit || 0);
        return dateB.getTime() - dateA.getTime();
      }

      // ORDENAÇÃO POR EPISÓDIOS
      case 'MQE': // Maior Quantidade de Episódios
        return countTotalEpisodes(b) - countTotalEpisodes(a);

      case 'MQM': // Menor Quantidade de Episódios
        return countTotalEpisodes(a) - countTotalEpisodes(b);
        
      default:
        return 0; // Ordem padrão ou nenhuma alteração
    }
  });

  return sorted;
};

//#endregion