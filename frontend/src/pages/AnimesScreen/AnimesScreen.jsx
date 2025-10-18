// src/pages/AnimesScreen/AnimesScreen.jsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useDataOperations from '../../hooks/useDataOperations';
import useSearchFilter from '../../hooks/useSearchFilter';
import useAnimeFiltering from '../../hooks/useAnimeFiltering';

import { mapSeasonToOrder } from '../../utils/sortFilterUtils';

import { AnimesHeader, AnimeCollectionsFilter, AnimeOrganizationControls, AnimeDisplayList, AnimeSidebar } from './AnimesComponents';

import './AnimesScreen.css';

function AnimesScreen(){
  //#region ... Variables ...
  const collectionName = 'animes';
  const navigate = useNavigate(); // to navegate between pages
  const [displayStyle, setDisplayStyle] = useState('grid');
  //#endregion
  
  //#region ... Hooks ...
  // Dados importados do backend
  const { data, loading, error, fetchData, createRecord, updateRecord, deleteRecord, isMutating, mutationError } = useDataOperations(collectionName);
  const globalData = data?.length > 0 ? data[0].globalInfo : null;
  const items = data?.length > 1 ? data.slice(1) : []; // Usamos o 'slice(1)' para pegar todos os elementos A PARTIR do índice 1.
  // Primeira camada de filtragem usando a barra de pesquisa
  const { searchTerm, setSearchTerm, filteredItems, handleSearchChange } = useSearchFilter(items, '', ['name.english', 'name.japonese', 'description', 'tags']);
  
  // 3. Filtros e Ordenação 
  const { finalSortedItems, displaySort, handleSortSelect, selectedTags, toggleTags, selectedLaunches, toggleLaunches, selectedCollection, handleCollectionFilter } = 
  useAnimeFiltering( filteredItems ); // Passamos os itens filtrados pela busca da barra de pesquisa

  //Formata as opções de lançamento para o CollapsibleMenu
  const launchOptions = useMemo(() => {
    if (!globalData?.seassons) return [];

    return globalData.seassons
      .map(item => {
        const monthMap = mapSeasonToOrder(item.season); // mapSeasonToOrder vem de utils
        const months = monthMap === 1 ? 'Jan-Mar' : monthMap === 2 ? 'Abr-Jun' : monthMap === 3 ? 'Jul-Set' : monthMap === 4 ? 'Out-Dez' : 'N/A';
        const filterKey = `${item.season} ${item.year}`; // Opção de filtro real (usada no selectedList e no toggle)
        const displayLabel = `${filterKey} (${months})`; // Texto de exibição no CollapsibleMenu
        return { filterKey, displayLabel };
      });
  }, [globalData]);
  //#endregion

  //#region ... Functions ...
  const handleBackToDashboard = () => navigate('/');
  const handleDisplayStyle = (value) => setDisplayStyle(value);
  
  //#region ... Animes ...
  const seasonInfo = (date) => {

    if (!date || typeof date !== 'object') return { season: "-", year: "-", months: "-" };

    const monthMap = mapSeasonToOrder(date.season)
    const month = monthMap === 1 ? 'Jan-Mar' : monthMap === 2 ? 'Abr-Jun' : monthMap === 3 ? 'Jul-Set' : monthMap === 4 ? 'Out-Dez' : 'N/A';

    return { 
      season: date.season || "-",
      year: date.year || 0,
      months: month
    }
  }
  //#endregion

  //#endregion

  //#region ... Dom Display ...
  return (
    <div className="animes-screen-container">

      {/* Header */}
      <AnimesHeader
        onBackClick={handleBackToDashboard}
        title={'Animes'}
      />

      {/* Animes Container */}
      <div className='animes-container'>
        <AnimeCollectionsFilter
          globalCollections={globalData?.collections}
          selectedCollection={selectedCollection}
          onCollectionFilter={handleCollectionFilter}
          addNewCollection={() => undefined}
        />
        
        <div className='animes-content'>
          <div className='animes-display'>
            <AnimeOrganizationControls
              displaySort={displaySort}
              handleSortSelect={handleSortSelect}
              handleDisplayStyle={handleDisplayStyle}
            />

            <div className='animes-list'>
              <AnimeDisplayList
                displayStyle={displayStyle}
                finalSortedItems={finalSortedItems}
                loading={loading}
                seasonInfo={seasonInfo} // Função utilitária para formatação da data
              />
            </div>
          </div>

          {/* Sidebar Menu */}
          <AnimeSidebar
            searchTerm={searchTerm}
            handleSearchChange={handleSearchChange}
            globalData={globalData}
            selectedTags={selectedTags}
            toggleTags={toggleTags}
            launchOptions={launchOptions}
            selectedLaunches={selectedLaunches}
            toggleLaunches={toggleLaunches}
          />
        </div>
      </div>

    </div>
  );
  //#endregion
}

export default AnimesScreen;