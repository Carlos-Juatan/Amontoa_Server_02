// src/pages/AnimesScreen/AnimesScreen.jsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// Global Hooks and Utils
import useDataCRUD from '../../hooks/useDataCRUD';
import useSearchFilter from '../../hooks/useSearchFilter';

// Private Hooks and Utils
import useAnimeFiltering from './hooks/useAnimeFiltering';
import useAnimeManager from './hooks/useAnimeManager';
import useAnimeModalManager from './hooks/useAnimeModalManager';
import { mapSeasonToOrder } from './utils/sortFilterUtils';

// Modals (DOM)
import { AddCollectionModal, AddMovieModal, AnimeDetailsModal } from './AnimesModal';
import CollectionContextMenu from './CollectionContextMenu';

// Components (DOM)
import Header from '../../components/Common/Header/Header';
import { AnimeCollectionsFilter, AnimeOrganizationControls, AnimeDisplayList, AnimeSidebar } from './AnimesComponents';

// Styles
import './AnimesScreen.css';

function AnimesScreen() {
  
//#region ... Variables ...
  const collectionName = 'animes';
  const navigate = useNavigate(); // to navegate between pages
  const [displayStyle, setDisplayStyle] = useState('grid');
//#endregion

//#region ... Hooks ...
  // Dados importados do backend
  const { data, loading, handleCreateItem, handleUpdateItem, handleDeleteItem } = useDataCRUD(collectionName);
  const globalData = data?.length > 0 ? data[0] : null;
  const items = data?.length > 1 ? data.slice(1) : []; // Usamos o 'slice(1)' para pegar todos os elementos A PARTIR do índice 1.
  // Primeira camada de filtragem usando a barra de pesquisa
  const { searchTerm, setSearchTerm, filteredItems, handleSearchChange } = useSearchFilter(items, '', ['name.english', 'name.japonese', 'description', 'tags']);

  // 3. Filtros e Ordenação 
  const {
    finalSortedItems,
    displaySort,
    handleSortSelect,
    selectedTags,
    toggleTags,
    selectedLaunches,
    toggleLaunches,
    selectedCollection,
    handleCollectionFilter
  } = useAnimeFiltering(filteredItems); // Passamos os itens filtrados pela busca da barra de pesquisa

  // Lógica de Gerenciamento de Animes e Coleções
  const { 
    // Estados de UI
    openActionMenuId, 
    setOpenActionMenuId,
    hasAddCollection, 
    isRenaming, 
    
    // Funções de Coleção
    openAddColletion,
    closeAddColletion,
    openRenameCollection,
    handleAddNewCollection,
    createCollection,
    handleDeleteCollection,
    handleAddCollectionToSingleItem,
    handleRemoveCollectionFromSingleItem,
    
    // Funções de Item
    handleAddNewAnime,
    handleEditAnime,
    handleDeleteAnime,
    handleAddToExistingCollection,
  } = useAnimeManager(collectionName, items, globalData, handleCreateItem, handleUpdateItem, handleDeleteItem);

  // Lógica para o modal de detalhes de animes
  const { 
    // Abrir ou fechar o modal de animeModal de anime
    openAnimeModal,
    closeAnimeModal,
    hasAnimeModal,
    handleItemClick, // Abrir o modal ao clicar no item

    // Anime selecionado e funções de seleção
    currentIndex,
    selectedObject,
    handlePrev,
    handleNext,

    // Lado esqeurdo do modal
    getMonths,
    closeAllDropdowns,
    isMoviesDropdownOpen, // Primeiro Dropdown dos filmes
    openMoviesDropdown, // 1°
    toggleMovieWatchStatus, // 1°
    handleDeleteMovie, // Segundo Dropdown dos filmes

    hasAddEditMovie, // Modal de edição dos filmes
    openAddEditMovie, // Modal de edição dos filmes
    closeAddEditMovie, // Modal de edição dos filmes
    hasMovieNamed, // Modal de edição dos filmes
    hasMovieWatched, // Modal de edição dos filmes
    createEditMovie, // Modal de edição dos filmes

    setTimeWatched,

    isCollectionsDropdownOpen, // Primeiro Dropdown das coleções
    openCollectionDropdown, // 1°
    isGlobalCollectionsDropdownOpen, // Segundo Dropdown das coleções
    handleIsGlobalCollectionsDropdownOpen, // 2°

    // Lado Direito do modal
    openSeasonIndex,
    toggleSeason,
    handleOpenLink,
   } = useAnimeModalManager( finalSortedItems, globalData, handleCreateItem, handleUpdateItem, handleDeleteItem );

  //Formata as opções de lançamento para o CollapsibleMenu
  const launchOptions = useMemo(() => {
    if (!globalData?.globalInfo?.seassons) return [];

    return globalData.globalInfo.seassons
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
      <Header onBackClick={handleBackToDashboard} title={'Animes'} />

      {/* Animes Container */}
      <div className='animes-container'>
        <AnimeCollectionsFilter
          globalCollections={globalData?.globalInfo?.collections}
          selectedCollection={selectedCollection}
          onCollectionFilter={handleCollectionFilter}
          addNewCollection={openAddColletion}
          onRenameCollection={openRenameCollection}
          onDeleteCollection={handleDeleteCollection}
          ContextMenuComponent={CollectionContextMenu}
        />

        <div className='animes-content'>
          <div className='animes-display'>
            <AnimeOrganizationControls
              displaySort={displaySort}
              handleSortSelect={handleSortSelect}
              displayStyle={displayStyle}
              handleDisplayStyle={handleDisplayStyle}
            />

            <div className='animes-list'>
              <AnimeDisplayList
                displayStyle={displayStyle}
                finalSortedItems={finalSortedItems}
                loading={loading}
                seasonInfo={seasonInfo}
                globalCollections={globalData?.globalInfo?.collections || []}
                openActionMenuId={openActionMenuId}
                setOpenActionMenuId={setOpenActionMenuId}
                onEditAnime={handleEditAnime}
                onDeleteAnime={handleDeleteAnime}
                onAddToExistingCollection={handleAddToExistingCollection}
                onAddNewCollection={handleAddNewCollection}
                handleItemClick={handleItemClick}
              />
            </div>
          </div>

          {/* Sidebar Menu */}
          <AnimeSidebar
            searchTerm={searchTerm}
            handleSearchChange={handleSearchChange}
            globalData={globalData?.globalInfo}
            selectedTags={selectedTags}
            toggleTags={toggleTags}
            launchOptions={launchOptions}
            selectedLaunches={selectedLaunches}
            toggleLaunches={toggleLaunches}
            onAddNewAnime={handleAddNewAnime}
          />
        </div>
      </div>

      <AnimeDetailsModal
        // Abrir e fechar o modal
        hasAnimeModal={hasAnimeModal}
        closeModal={closeAnimeModal}
        handleModalType={openAnimeModal}

        // Dados do item
        item={selectedObject}
        prevAnime={handlePrev}
        nextAnime={handleNext}

        // Dados Globais
        globalData={globalData}
        
        // Lado esqeurdo do modal
        getMonths={getMonths}
        closeAllDropdowns={closeAllDropdowns}
        isMoviesDropdownOpen={isMoviesDropdownOpen} // Primeiro Dropdown dos filmes
        openMoviesDropdown={openMoviesDropdown} // 1°
        toggleMovieWatchStatus={toggleMovieWatchStatus} // 1°
        handleAddNewMovie={openAddEditMovie} // 1°
        handleDeleteMovie={handleDeleteMovie} // Segundo Dropdown dos filmes
        
        setTimeWatched={setTimeWatched}

        isCollectionsDropdownOpen={isCollectionsDropdownOpen} // Primeiro Dropdown das coleções
        openCollectionDropdown={openCollectionDropdown} // 1°
        isGlobalCollectionsDropdownOpen={isGlobalCollectionsDropdownOpen} // Segundo Dropdown das coleções
        handleIsGlobalCollectionsDropdownOpen={handleIsGlobalCollectionsDropdownOpen} // 2°
        addNewCollection={handleAddNewCollection}
        onAddCollection={handleAddCollectionToSingleItem}
        onRemoveCollection={handleRemoveCollectionFromSingleItem}
        
        // Lado Direito do modal
        openSeasonIndex={openSeasonIndex}
        toggleSeason={toggleSeason}
        handleOpenLink={handleOpenLink}
      />

      {hasAddCollection && (
        <AddCollectionModal
          onClose={closeAddColletion}
          title={isRenaming === null ? "Dê um nome à sua coleção" : "Altere o nome desta coleção"}
          onSubmit={createCollection}
          initialValue={isRenaming}
        />
      )}

      {hasAddEditMovie && (
        <AddMovieModal
          onClose={closeAddEditMovie}
          title={hasMovieNamed === null ? "Dê um nome ao filme" : "Altere o nome do filme"}
          initialMovieName={hasMovieNamed}
          initialMovieValue={hasMovieWatched}
          checkmarkSize={20}
          onSubmit={createEditMovie}
        />
      )}
    </div>
  );
//#endregion
}

export default AnimesScreen;