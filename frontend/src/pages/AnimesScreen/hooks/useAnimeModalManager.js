// src/pages/AnimesScreen/hooks/useAnimeModalManager.js

import { useState, useMemo, use } from 'react';

import useSelectionIndex from '../../../hooks/useSelectionIndex'

export default function useAnimeModalManager(items, globalData, handleCreateItem, handleUpdateItem, handleDeleteItem) {
  //#region Variables
  // Tipo de Modal de Animes Oberto ou null para fechado
  const [hasAnimeModal, setHasAnimeModal] = useState(null);

  // Controlar a abertura dos dropdowns (Filme e Coleção)
  const [isMoviesDropdownOpen, setIsMoviesDropdownOpen] = useState(false); // 1° Dropdown dos filmes
  const [isCollectionsDropdownOpen, setIsCollectionsDropdownOpen] = useState(false); // 1° Dropdown das coleções
  const [isGlobalCollectionsDropdownOpen, setIsGlobalCollectionsDropdownOpen] = useState(false); // 2° Dropdown das coleções

  // Controla os Modais de adicionar e editar
  const [UpdatedItemId, setUpdatedItemId] = useState(null);
  // para o modal de filmes
  const [hasAddEditMovie, setHasAddEditMovie] = useState(false);
  const [hasMovieNamed, setHasMovieNamed] = useState(null);
  const [hasMovieWatched, setHasMovieWatched] = useState(false);
  // para o modal de temporadas
  const [hasAddEditSeason, setHasAddEditSeason] = useState(false);
  const [hasSeasonInfo, setHasSeasonInfo] = useState(null);
  // para o modal de episodios
  const [hasAddEditEpisode, setHasAddEditEpisode] = useState(false);
  const [hasEpisodeInfo, setHasEpisodeInfo] = useState(null);
  // para o modal de links
  const [hasAddEditLink, setHasAddEditLink] = useState(false);
  const [hasLinkInfo, setHasLinkInfo] = useState(null);

  // Estado para controlar qual temporada está aberta.
  // Usamos null para nenhuma aberta, ou o índice da temporada.
  const [openSeasonIndex, setOpenSeasonIndex] = useState(null);
  //#endregion

  //#region Functions

  //#region Manipulação do anime selecionado
  // Funcção para abrir o modal ao clicar no item
  const { currentIndex, setCurrentIndex, selectedObject, handleNext, handlePrev } = useSelectionIndex(items);

  const openAnimeModal = (modalType) => setHasAnimeModal(modalType);
  const closeAnimeModal = () => setHasAnimeModal(null);

  const handleItemClick = (index) => {
    setCurrentIndex(index);
    openAnimeModal('details');
  }
  //#endregion

  //#region Lado esqeurdo do modal
  const getMonths = (season) => {
    return season === 'Inverno' ? 'Jan - Mar' : season === 'Primavera' ? 'Abr - Jun' : season === 'Verão' ? 'Jul - Set' : season === 'Outono' ? 'Out - Dez' : '-';
  }

  const toggleMovieWatchStatus = async (itemId, movieTitle) => {
    const currentItem = items.find(item => item._id === itemId);

    if (currentItem && Array.isArray(currentItem.movies)) {
      // Usa o método MAP para criar um NOVO ARRAY de filmes
      const updatedMovies = currentItem.movies.map(movie => {
        // Ao achar o item a ser modificado ele modifica e retorna um novo array
        if (movie.title === movieTitle) {
          return {
            ...movie,
            hasWatched: !movie.hasWatched
          };
        }

        // Caso o item não seja encontrado ele retorna o array original sem modificações
        return movie;
      });

      // Chama a função de atualização com o novo array completo
      await handleUpdateItem(itemId, { movies: updatedMovies });
    }
  }

  const openAddEditMovie = async (itemId = '', movieTitle = '', checkmarckValue = false) => {
    setHasAddEditMovie(true);
    setUpdatedItemId(itemId);
    setHasMovieNamed(movieTitle);
    setHasMovieWatched(checkmarckValue);

  }

  const closeAddEditMovie = () => {
    setHasAddEditMovie(false);
    setUpdatedItemId(null);
    setHasMovieNamed(null);
    setHasMovieWatched(false);
  };

  const createEditMovie = async (newMovieTile, newCheckmarkValue) => {
    const currentItem = items.find(item => item._id === UpdatedItemId);
    const oldMovieTitle = hasMovieNamed;

    if (!currentItem || !Array.isArray(currentItem.movies)) return;

    // 1. Tenta EDITAR (usa MAP):
    //    Se oldMovieTitle existe, mapeamos e procuramos por ele.
    let isEditing = false;
    const updatedMovies = currentItem.movies.map(movie => {
      if (oldMovieTitle && movie.title === oldMovieTitle) {
        isEditing = true;
        return { // Retorna o objeto EDITADO
          title: newMovieTile,
          hasWatched: newCheckmarkValue
        };
      }
      return movie; // Retorna os filmes inalterados
    });

    let finalMovies = updatedMovies;

    // 2. Se NÃO ESTAVA EDITANDO (ADIÇÃO):
    //    Significa que oldMovieTitle não foi encontrado ou era nulo/vazio (nova adição).
    if (!isEditing) {
      const newMovie = { title: newMovieTile, hasWatched: newCheckmarkValue };

      // Verifica se já existe um filme com o novo título antes de adicionar (opcional, mas recomendado)
      const alreadyExists = updatedMovies.some(movie => movie.title === newMovieTile);

      if (!alreadyExists) {
        finalMovies = [...updatedMovies, newMovie];
      } else {
        // Tratar erro ou apenas retornar se já existir
        console.warn(`Filme "${newMovieTile}" já existe na lista.`);
        return; // Evita a atualização
      }
    }

    // 3. Ordena e Atualiza:
    finalMovies.sort((a, b) => a.title.localeCompare(b.title));

    await handleUpdateItem(UpdatedItemId, { movies: finalMovies });
    closeAddEditMovie(); // Fecha o modal após a atualização bem-sucedida
  };

  const handleDeleteMovie = async (itemId, movieTitle) => {
    const currentItem = items.find(item => item._id === itemId);

    if (currentItem && Array.isArray(currentItem.movies)) {

      // 1. Usa o FILTER para criar um NOVO ARRAY que inclui APENAS os filmes cujo título NÃO É o filme a ser removido.
      const updatedMovies = currentItem.movies.filter(movie => {
        return movie.title !== movieTitle;
      });

      // 2. Chama a função de atualização com o novo array, se o filme foi removido
      if (updatedMovies.length < currentItem.movies.length) {
        await handleUpdateItem(itemId, { movies: updatedMovies });
      }
    }
  }

  const setTimeWatched = async (itemId, value) => {
    const itemToUpdate = items.find(item => item._id === itemId);

    if (itemToUpdate) {
      // Garante o valor atual e copia
      const currentCount = itemToUpdate.timeWhatched || 0;
      const calcValue = currentCount + value;
      const updatedCount = calcValue >= 0 ? calcValue : 0;
      // Chama a função de atualização
      if (updatedCount != currentCount)
        await handleUpdateItem(itemId, { timeWhatched: updatedCount });
    }
  }

  //#region Manipuladores de Dropdown
  // Função auxiliar para fechar todos os dropdowns relacionados
  const closeAllDropdowns = () => {
    setIsMoviesDropdownOpen(false);
    setIsCollectionsDropdownOpen(false);
    setIsGlobalCollectionsDropdownOpen(false);
  };
  //#region  Filmes
  // Funções de manipulação do clique
  const openMoviesDropdown = (e) => {
    e.stopPropagation();
    closeAllDropdowns(); // Fecha todos os dropdowns primeiro
    setIsMoviesDropdownOpen(prev => !prev); // abre o dropdown do filme
  };
  //#endregion

  //#region Coleções
  const openCollectionDropdown = (e) => {
    e.stopPropagation();
    closeAllDropdowns(); // Fecha todos os dropdowns primeiro
    setIsCollectionsDropdownOpen(prev => !prev); // abre o dropdown de coleções
  };

  // Manipula o 2° dropdown de coleções globais
  const handleIsGlobalCollectionsDropdownOpen = (value) => {
    setIsGlobalCollectionsDropdownOpen(value);
    // Se for para abrir, garante que o principal está aberto
    if (value) setIsCollectionsDropdownOpen(true);
  };
  //#endregion
  //#endregion
  
  //#endregion

  //#region Lado Direito do modal
  // Função para alternar o estado de abertura da 'gaveta' de epsódios da temperada
  const toggleSeason = (index) => { setOpenSeasonIndex(openSeasonIndex === index ? null : index); };

  const handleOpenLink = (url) => { window.open(url, '_blank'); };

  // --- FUNÇÕES DE MANIPULAÇÃO DE TEMPORADAS ---

  const openAddEditSeason = (itemId = '', seasonIndex = null, episodes = []) => {
    setHasAddEditSeason(true);
    setUpdatedItemId(itemId);
    setHasSeasonInfo({
      index: seasonIndex,
      episodes: episodes
    });
  }

  const closeAddEditSeason = () => {
    setHasAddEditSeason(false);
    setUpdatedItemId(null);
    setHasSeasonInfo(null);
  }

  const onAddEditSeason = (newSeasonIndex, newEpisodes) => {
    console.log(`Adicionando / Editando o modal de temporada: `);
  }

  const onDeleteSeason = (itemId = '', seasonIndex = null) => {
    console.log(`Deletando o modal de temporada: `);
  }

  // --- FUNÇÕES DE MANIPULAÇÃO DE EPISÓDIOS ---

  const openAddEditEpisode = (itemId = '', seasonIndex = null, episodeTitle = '', hasWatched = false,) => {
    setHasAddEditEpisode(true);
    setUpdatedItemId(itemId);
    setHasEpisodeInfo({
      index: seasonIndex,
      title: episodeTitle,
      hasWatched: hasWatched
    });
  }

  const closeAddEditEpisode = () => {
    setHasAddEditEpisode(false);
    setUpdatedItemId(null);
    setHasEpisodeInfo(null);
  }

  const onAddEditEpisode = (newEpisodeTitle, newEpisodeHasWacthed) => {
    console.log(`Testando as funções de editar episódio: ${UpdatedItemId} - Temporada: ${hasEpisodeInfo.index} - Novo título: ${newEpisodeTitle} - novo hasWatched ${newEpisodeHasWacthed}`)
  }

  const onDeleteEpisode = (itemId = '', seasonIndex = null, episodeTitle = '') => {
    console.log(`Testando as funções de deletar episódio: ${itemId} - Temporada: ${seasonIndex} - título: ${episodeTitle}`)
  }

  // --- FUNÇÕES DE MANIPULAÇÃO DE LINKS ---

  const openAddEditLink = (itemId = '', linkTitle = '', url = '' ) => {
    setHasAddEditLink(true);
    setUpdatedItemId(itemId);
    setHasLinkInfo({ 
      title: linkTitle,
      url: url
    });

  }

  const closeAddEditLink = () => {
    setHasAddEditLink(false);
    setUpdatedItemId(null);
    setHasLinkInfo(null);
  }

  const onEditLink = async (newLinkTitle, newLinkUrl) => {
    const currentItem = items.find(item => item._id === UpdatedItemId);
    const oldLinkTitle = hasLinkInfo.title;

    if (!currentItem || !Array.isArray(currentItem.movies)) return;

    let isEditing = false;
    const updatedLinks = currentItem.links.map(link => {
      if (oldLinkTitle && link.title === oldLinkTitle) {
        isEditing = true;
        return {
          title: newLinkTitle || link.title, // Usa o novo título, se fornecido
          url: newLinkUrl || link.url   // Usa a nova URL, se fornecida
        };
      }
      return link;
    });

    let finalLinks = updatedLinks;

    // Se for uma nova adição
    if (!isEditing) {
      const newLink = { title: newLinkTitle, url: newLinkUrl };

      const alreadyExists = updatedLinks.some(link => link.title === newLinkTitle);

      if (!alreadyExists) {
        finalLinks = [...updatedLinks, newLink];
      } else {
        // Tratar erro ou apenas retornar se já existir
        console.warn(`Links "${newLinkTitle}" já existe na lista.`);
        return; // Evita a atualização
      }
    }

    finalLinks.sort((a, b) => a.title.localeCompare(b.title));

    await handleUpdateItem(UpdatedItemId, { links: finalLinks });
  };

  const onDeleteLink = async (itemId, linkToDelete) => {
    const currentItem = items.find(item => item._id === itemId);

    if (currentItem && Array.isArray(currentItem.links)) {
      const updatedLinks = currentItem.links.filter(link => {
        return link.title !== linkToDelete;
      });

      if (updatedLinks.length < currentItem.links.length) {
        await handleUpdateItem(itemId, { links: updatedLinks });
      }
    }
  };
  //#endregion

  return {
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

    // Lado esquerdo do modal
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

    // Lado Direito do modal
    hasAddEditSeason,
    openAddEditSeason,
    closeAddEditSeason,
    hasSeasonInfo,
    onAddEditSeason,
    onDeleteSeason,
    hasAddEditEpisode,
    openAddEditEpisode,
    closeAddEditEpisode,
    hasEpisodeInfo,
    onAddEditEpisode,
    onDeleteEpisode,
    hasAddEditLink, // Modal de edição de links
    openAddEditLink, // Modal de edição de links
    closeAddEditLink, // Modal de edição de links
    hasLinkInfo, // Modal de edição de links

    setTimeWatched,

    isCollectionsDropdownOpen, // Primeiro Dropdown das coleções
    openCollectionDropdown, // 1°
    isGlobalCollectionsDropdownOpen, // Segundo Dropdown das coleções
    handleIsGlobalCollectionsDropdownOpen, // 2°

    // Lado Direito do modal
    openSeasonIndex,
    toggleSeason,
    handleOpenLink,
    onEditLink,
    onDeleteLink,
  };
}