// src/pages/AnimesScreen/AnimesScreen.jsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useDataCRUD from '../../hooks/useDataCRUD';
import useSearchFilter from '../../hooks/useSearchFilter';
import useAnimeFiltering from '../../hooks/useAnimeFiltering';

import { mapSeasonToOrder } from '../../utils/sortFilterUtils';

import { AddCollection } from './AnimesModal';
import CollectionContextMenu from './CollectionContextMenu';

import Header from '../../components/Common/Header/Header';
import { AnimeCollectionsFilter, AnimeOrganizationControls, AnimeDisplayList, AnimeSidebar } from './AnimesComponents';

import './AnimesScreen.css';

function AnimesScreen() {
  //#region ... Variables ...
  const collectionName = 'animes';
  const navigate = useNavigate(); // to navegate between pages
  const [displayStyle, setDisplayStyle] = useState('grid');
  const [hasAddCollection, setHasAddColletion] = useState(false);
  const [openActionMenuId, setOpenActionMenuId] = useState(null);
  const [addItemToNewCollection, setAddItemToNewCollection] = useState(null);
  //#endregion

  //#region ... Hooks ...
  // Dados importados do backend
  const { data, loading, handleCreateItem, handleUpdateItem, handleDeleteItem } = useDataCRUD(collectionName);
  const globalData = data?.length > 0 ? data[0] : null;
  const items = data?.length > 1 ? data.slice(1) : []; // Usamos o 'slice(1)' para pegar todos os elementos A PARTIR do índice 1.
  // Primeira camada de filtragem usando a barra de pesquisa
  const { searchTerm, setSearchTerm, filteredItems, handleSearchChange } = useSearchFilter(items, '', ['name.english', 'name.japonese', 'description', 'tags']);

  // 3. Filtros e Ordenação 
  const { finalSortedItems, displaySort, handleSortSelect, selectedTags, toggleTags, selectedLaunches, toggleLaunches, selectedCollection, handleCollectionFilter } =
    useAnimeFiltering(filteredItems); // Passamos os itens filtrados pela busca da barra de pesquisa

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

  //#region ... Data ...
  const handleDeleteAnime = async (item) => {
    // Simplificando o try/catch pelo .then() e .catch()
    await handleDeleteItem(item).catch((e) => { /* Tratar Erro: Opcional */ });
    setOpenActionMenuId(null);
  };
  /* // Forma alternativa de Escrever a mesma função 'handleDeleteAnime'
  const handleDeleteAnime = async (item) => {
    try { await handleDeleteItem(item); } catch (e) { }
    setOpenActionMenuId(null);
  };
  */
  //#endregion

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

  const handleEditAnime = (itemId) => {
    console.log(`Editando Anime: ${itemId}`);
    setOpenActionMenuId(null);
  };

  const handleAddToExistingCollection = async (itemId, collectionName) => {
    const itemToUpdate = items.find(item => item._id === itemId);

    if (itemToUpdate) {
      const newCollections = [...(itemToUpdate.collections || [])];
      if (!newCollections.includes(collectionName)) {
        newCollections.push(collectionName);
      }

      // Chama a função de atualização (collectionName é 'animes' do hook)
      await handleUpdateItem(itemId, { collections: newCollections });
    }
    setOpenActionMenuId(null);
  };

  const handleAddNewCollection = (itemId) => {
    setAddItemToNewCollection(itemId); // Salva o ID do anime para adicionar após a criação da coleção
    openAddColletion();
    setOpenActionMenuId(null);
  };
  //#endregion

  //#region ... Modals ...
  const [isRenaming, setIsRenaming] = useState(null); // Armazena o nome da coleção a ser renomeada

  const openAddColletion = () => setHasAddColletion(true);
  const closeAddColletion = () => {
    setHasAddColletion(false);
    setIsRenaming(null); // Limpa o estado de renomear ao fechar
  };

  const createCollection = (newCollectionName) => {
    const existingGlobalInfo = globalData?.globalInfo || {};
    let updatedCollections = [...(existingGlobalInfo.collections || [])];

    // Lógica de Renomear
    if (isRenaming) {
      const index = updatedCollections.indexOf(isRenaming);
      if (index !== -1) {
        updatedCollections[index] = newCollectionName; // Substitui o nome antigo
      }
    } else {
      // Lógica de Criar Novo
      if (newCollectionName && !updatedCollections.includes(newCollectionName)) {
        updatedCollections.push(newCollectionName);
      }
    }

    updatedCollections.sort((a, b) => a.localeCompare(b));

    const payload = {
      globalInfo: {
        ...existingGlobalInfo,
        collections: updatedCollections
      }
    };

    handleUpdateItem(globalData._id, payload);
  };

  // Função que será passada para o ContextMenu (Renomear)
  const handleRenameCollection = (oldName) => {
    setIsRenaming(oldName); // Abre o modal, preenche com o nome antigo
    openAddColletion();
  };

  // Função que será passada para o ContextMenu (Apagar)
  const handleDeleteCollection = (collectionToDelete) => {
    // Implemente a lógica de exclusão aqui
    console.log(`Apagando coleção: ${collectionToDelete}`);
    // Exemplo:
    // 1. Obter a lista atualizada (filtrando o item)
    // 2. Criar o payload (como em createCollection)
    // 3. Chamar handleUpdateItem
  };
  //#endregion

  //#region ... Later
  const addNewAnime = () => { console.log('Adicionando novo Anime'); }
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
          onRenameCollection={handleRenameCollection}
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
            addNewAnime={addNewAnime}
          />
        </div>
      </div>

      {hasAddCollection && (
        <AddCollection
          isOpen={openAddColletion}
          onClose={closeAddColletion}
          title={isRenaming === null ? "Dê um nome à sua coleção" : "Altere o nome desta coleção"}
          onSubmit={createCollection}
          initialValue={isRenaming}
        />
      )}

    </div>
  );
  //#endregion
}

export default AnimesScreen;