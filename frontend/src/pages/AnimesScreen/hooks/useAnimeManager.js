// src/pages/AnimesScreen/hooks/useAnimeManager.js

import { useState, useMemo } from 'react';

export default function useAnimeManager(collectionName = 'animes', items, globalData, handleCreateItem, handleUpdateItem, handleDeleteItem) {

//#region --- 1. ESTADOS DE AÇÃO/MODAL ---
  const [openActionMenuId, setOpenActionMenuId] = useState(null);
  const [hasAddCollection, setHasAddColletion] = useState(false);
  const [isRenaming, setIsRenaming] = useState(null); // Armazena o nome da coleção a ser renomeada
  const [addItemToNewCollection, setAddItemToNewCollection] = useState(null);
//#endregion

//#region --- 2. FUNÇÕES DO MODAL COLEÇÃO ---
//#region --- 2 - 1. FUNÇÕES DE ABRIR E FECHAR A MODAL DE ADICIONAR COLEÇÃO ---
  const openAddColletion = () => setHasAddColletion(true);
  const closeAddColletion = () => {
      setHasAddColletion(false);
      setIsRenaming(null);
      setAddItemToNewCollection(null);
  }; 

  // Função que abre o modal de criar coleção com dados do nome da coleção que será atualizada
  const openRenameCollection = (oldName) => {
    setIsRenaming(oldName); // Abre o modal, preenche com o nome antigo
    setHasAddColletion(true);
  };

  // Abre o modal de criar a coleção e marca ou não um item para adicionar a essa coleção
  const handleAddNewCollection = (itemId) => {
    setAddItemToNewCollection(itemId); // Salva o ID do anime para adicionar após a criação da coleção
    setHasAddColletion(true);
    setOpenActionMenuId(null);
  };
//#endregion

//#region --- 2 - 2. LÓGICA DE COLEÇÕES ---

    // Handler para criar ou renomear coleção
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
  
  // Função que irá deletar a coleção do banco de dados
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

  // Função de remover a coleção de todos os itens que estavam na coleção que será deletada
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
//#endregion

//#region --- 3. FUNÇÃO DOS MODAL DOS ANIMES ---
//#region --- 3 - 1. FUNÇÕES DE ABRIR OU FECHAR MODAL DOS ANIMES ---
//#endregion

//#region --- 3 - 2. FUNÇÕES DOS ANIMES ---
  const handleAddNewAnime = () => {
    console.log('Adicionando novo Anime');
  }

  const handleEditAnime = (itemId) => {
    console.log(`Editando Anime: ${itemId}`);
    setOpenActionMenuId(null);
  };

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
//#endregion

  return {
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
    
    // Funções de Item
    handleAddNewAnime,
    handleEditAnime,
    handleDeleteAnime,
    handleAddToExistingCollection,
  };
}