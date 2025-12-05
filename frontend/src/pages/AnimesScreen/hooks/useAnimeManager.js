// src/pages/AnimesScreen/hooks/useAnimeManager.js

import { useState, useMemo } from 'react';

export default function useAnimeManager(dataCollectionName = 'animes', items, globalData, handleCreateItem, handleUpdateItem, handleDeleteItem) {

  //#region --- ESTADOS DE AÇÃO/MODAL ---
  const [openActionMenuId, setOpenActionMenuId] = useState(null);
  const [hasAddCollection, setHasAddColletion] = useState(false);
  const [isRenaming, setIsRenaming] = useState(null); // Armazena o nome da coleção a ser renomeada
  const [addItemToNewCollection, setAddItemToNewCollection] = useState(null);
  //#endregion

  //#region --- FUNÇÕES DO MODAL COLEÇÃO ---
  //#region --- FUNÇÕES DE ABRIR E FECHAR A MODAL DE ADICIONAR COLEÇÃO ---
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

  //#region --- LÓGICA DE COLEÇÕES ---

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
    if (!addItemToNewCollection) return;

    await handleAddToExistingCollection(addItemToNewCollection, newCollectionName);
    setAddItemToNewCollection(null);
  };

  // Função que irá deletar a coleção do banco de dados
  const handleDeleteCollection = async (collectionToDelete) => {
    // Removendo a coleção dos itens que possam ter a coleção
    await handleRemoveCollectionFromAllItems(collectionToDelete);

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
  const handleRemoveCollectionFromAllItems = async (collectionToDelete) => {
    if (!collectionToDelete) return;

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

  const handleAddCollectionToSingleItem = async (itemId, colectionToAdd) => {
    const itemToUpdate = items.find(item => item._id === itemId);

    if (itemToUpdate) {
      // Garante que é um array e o copia
      const updatedCollections = [...(itemToUpdate.collections || [])]; 

      // Verifica se a coleção existe
      if (!updatedCollections.includes(colectionToAdd)) { 
        // Adicionar a nova coleção e reorganizar as coleções em ordem alfabética
        updatedCollections.push(colectionToAdd); 
        updatedCollections.sort((a, b) => a.localeCompare(b));
        // Chama a função de atualização
        await handleUpdateItem(itemId, { collections: updatedCollections }); 
      }
    }
  }

  const handleRemoveCollectionFromSingleItem = async (itemId, colectionToRemove) => {
    const itemToUpdate = items.find(item => item._id === itemId);

    if (itemToUpdate) {
      // Garante que a lista de coleções é um array, senão usa um vazio
      const currentCollections = itemToUpdate.collections || [];
      const initialLength = currentCollections.length;

      // Filtra a coleção a ser removida
      const updatedCollections = currentCollections.filter(
        (collection) => collection !== colectionToRemove
      );

      // Só atualiza se a coleção foi realmente removida (o tamanho do array mudou)
      if (updatedCollections.length < initialLength) {
        await handleUpdateItem(itemId, { collections: updatedCollections });
      }
    }
  }
  //#endregion
  
  //#region  --- LÓGICA DE COLEÇÕES

  const handleCreateTag = async (newTagName) => {
    const existingGlobalInfo = globalData?.globalInfo || {};
    let updatedTags = [...(existingGlobalInfo.tags || [])];
    
    if (newTagName && !updatedTags.includes(newTagName)) {
      updatedTags.push(newTagName);
      updatedTags.sort((a, b) => a.localeCompare(b));
      const payload = {
        globalInfo: {
          ...existingGlobalInfo,
          tags: updatedTags
        }
      };
      await handleUpdateItem(globalData._id, payload);
    }
  }

  //#endregion

  //#region --- FUNÇÃO DOS MODAL DOS ANIMES ---

  //#region --- FUNÇÕES DOS ANIMES ---

  const animeEmptyData = {
    imageUrl: "http://localhost:3000/assets/images/placeholder.avif",
    name: {
      japonese: "",
      english: ""
    },
    seasons: [],
    movies: [],
    links: [],
    description: "",
    score: null,
    tags: [],
    collections: [],
    date: {
      launched: {
        season: "Inverno", // Melhor ter um padrão aqui
        year: new Date().getFullYear() // Melhor ter um padrão aqui
      },
      lastEdit: null
    },
    timeWhatched: 0
  }

  const handleAddEditAnime = async (formData) => {
    const currentItem = items.find(item => item._id === formData?._id) || animeEmptyData;

    // Geração do timestamp de última edição (pega a data e hora atuais)
    const formatedTime = new Date().toISOString();
    // Saída de exemplo: "2025-12-04T13:27:24.123Z"

    // Converte o score para um número. Se for uma string vazia ou inválida, resultará em NaN.
    const scoreValue = Number(formData?.score);
    
    // Começa com todos os dados do item original (preserva seasons, movies, links, etc.)
    const payload = {
      ...currentItem,

      // Sobrescreve campos do formulário
      imageUrl: formData?.imageUrl || animeEmptyData.imageUrl,
      name: {
        japonese: formData?.title_jp || "",
        english: formData?.title_en || ""
      },
      description: formData?.sinopse || "",
      score: isNaN(scoreValue) ? null : scoreValue,
      tags: formData?.tags || [],
      date: {
        launched: formData?.date?.launched || animeEmptyData.date.launched,
        lastEdit: formatedTime
      }
    }

    if (formData?._id != null) {
      await handleUpdateItem(formData._id, payload);
    } else {
      await handleCreateItem(payload);
    }
    // Salva no banco de dados e abre o modal de animes com o index do novo item
    // (index) => openAnimeModal(index, 'edit')
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
    handleAddCollectionToSingleItem,
    handleRemoveCollectionFromSingleItem,

    // Funções de tags
    handleCreateTag,

    // Funções de Item
    handleAddEditAnime,
    handleDeleteAnime,
    handleAddToExistingCollection,
  };
}