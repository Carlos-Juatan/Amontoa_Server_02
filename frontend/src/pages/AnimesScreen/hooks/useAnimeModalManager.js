// src/pages/AnimesScreen/hooks/useAnimeModalManager.js

import { useState, useMemo } from 'react';

import useSelectionIndex from '../../../hooks/useSelectionIndex'

export default function useAnimeModalManager( itens, globalData ) {
//#region Variables
  // Tipo de Modal de Animes Oberto ou null para fechado
  const [hasAnimeModal, setHasAnimeModal] = useState(null);

  // Controlar a abertura dos dropdowns (Filme e Coleção)
  const [isMoviesDropdownOpen, setIsMoviesDropdownOpen] = useState(false); // 1° Dropdown dos filmes
  const [isCollectionsDropdownOpen, setIsCollectionsDropdownOpen] = useState(false); // 1° Dropdown das coleções
  const [isGlobalCollectionsDropdownOpen, setIsGlobalCollectionsDropdownOpen] = useState(false); // 2° Dropdown das coleções

  // Estado para controlar qual temporada está aberta.
  // Usamos null para nenhuma aberta, ou o índice da temporada.
  const [openSeasonIndex, setOpenSeasonIndex] = useState(null);
//#endregion

//#region Functions

//#region Manipulação do anime selecionado
  // Funcção para abrir o modal ao clicar no item
  const { currentIndex, setCurrentIndex, selectedObject, handleNext, handlePrev } = useSelectionIndex(itens);
    
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