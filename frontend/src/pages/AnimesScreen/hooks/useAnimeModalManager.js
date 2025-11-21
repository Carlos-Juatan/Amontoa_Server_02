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
  const [hasAddEditMovie, setHasAddEditMovie] = useState(false);
  const [hasMovieItemId, setHasMovieItemId] = useState(null);
  const [hasMovieNamed, setHasMovieNamed] = useState(null);
  const [hasMovieWatched, setHasMovieWatched] = useState(false);

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
    setHasMovieItemId(itemId);
    setHasMovieNamed(movieTitle);
    setHasMovieWatched(checkmarckValue);

  }

  const closeAddEditMovie = () => {
    setHasAddEditMovie(false);
    setHasMovieItemId(null);
    setHasMovieNamed(null);
    setHasMovieWatched(false);
  };

  const createEditMovie = async (newMovieTile, newCheckmarkValue) => {
    const currentItem = items.find(item => item._id === hasMovieItemId);
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

    await handleUpdateItem(hasMovieItemId, { movies: finalMovies });
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

  //#region Lado Direito do modal
  // Função para alternar o estado de abertura da 'gaveta' de epsódios da temperada
  const toggleSeason = (index) => { setOpenSeasonIndex(openSeasonIndex === index ? null : index); };

  const handleOpenLink = (url) => { window.open(url, '_blank'); };
  //#endregion

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
  };
}