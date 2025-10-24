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

  const createCollection = async (newCollectionName) => {
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

    await handleUpdateItem(globalData._id, payload);

    // Se tiver Anime para adicionar a uma nova coleção
    if(!addItemToNewCollection) return;

    await handleAddToExistingCollection(addItemToNewCollection, newCollectionName);
    setAddItemToNewCollection(null);
  };

  // Função que será passada para o ContextMenu (Renomear)
  const handleRenameCollection = (oldName) => {
    setIsRenaming(oldName); // Abre o modal, preenche com o nome antigo
    openAddColletion();
  };

  // Função que será passada para o ContextMenu (Apagar)
  const handleDeleteCollection = async (collectionToDelete) => {
    // Removendo a coleção dos itens que possam ter a coleção
    await handleRemoveCollectionFromItem(collectionToDelete);

    // Removendo a coleção do banco de dados
    const existingGlobalInfo = globalData?.globalInfo || {};
    let currentCollections = [...(existingGlobalInfo.collections || [])];
    
    if (!collectionToDelete && !currentCollections.includes(newCollectionName)) return;

    // 1. Remover o 'collectionToDelete' da lista atualizada de itens 'currentCollections'
    const updatedCollections = currentCollections.filter(
      (collection) => collection !== collectionToDelete
    );

    // 2. Criar o payload (como em createCollection)
    const payload = {
      globalInfo: {
        ...existingGlobalInfo, // Mantém as outras propriedades (tags, seassons)
        collections: updatedCollections
      }
    };

    // 3. Chamar handleUpdateItem
    await handleUpdateItem(globalData._id, payload);
  };

  const handleRemoveCollectionFromItem = async (collectionToDelete) => {
    if(!collectionToDelete) return;

    // 1. Filtrar os itens que contêm a coleção a ser deletada
    const listToRemoveCollection = items.filter(e => {
       return Array.isArray(e.collections) && e.collections.includes(collectionToDelete);
    })

    // Se não houver itens para atualizar, encerra a função
    if (listToRemoveCollection.length === 0) return;

    // 2. Preparar os payloads de atualização para cada item
    const updatePromises = listToRemoveCollection.map(item => {
      // Cria um novo array de coleções, excluindo a coleção a ser deletada
      const newCollections = item.collections.filter(
        (collection) => collection !== collectionToDelete
      );

      // Cria o payload de atualização
      const payload = {
        ...item, // Mantém todos os outros dados do item
        collections: newCollections // Sobrescreve o campo 'collections'
      };

      // Retorna a Promise da função de atualização do item
      // Assumimos que 'handleUpdateItem' pode lidar com um ID de item e o payload completo/parcial
      return handleUpdateItem(item._id, payload); 
    });

    // 3. Executar todas as atualizações simultaneamente
    try {
      await Promise.all(updatePromises);
      console.log(`Coleção '${collectionToDelete}' removida de ${updatePromises.length} itens com sucesso.`);
    } catch (error) {
      console.error("Erro ao remover a coleção dos itens:", error);
      // Você pode adicionar um tratamento de erro mais sofisticado aqui
    }
  }
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