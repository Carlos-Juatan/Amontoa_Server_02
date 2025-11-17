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

    
  const openAnimeOpenModal = (modalType) => setHasAnimeModal(modalType);
  const closeAnimeModal = () => setHasAnimeModal(null);
  
  const handleItemClick = (index) => {
    setCurrentIndex(index);
    openAnimeOpenModal('details');
  }
//#endregion

//#region Lado esqeurdo do modal
  const getMonths = (season) => { 
    return season === 'Inverno' ? 'Jan - Mar' : season === 'Primavera' ? 'Abr - Jun' : season === 'Verão' ? 'Jul - Set' : season === 'Outono' ? 'Out - Dez' : '-'; 
  }

//#region Manipuladores de Dropdown
//#region  Filmes
  const handleIsMoviesDropdownOpen = (value) => { setIsMoviesDropdownOpen(value); }

  // Funções de manipulação do clique
  const moviesDetailsDropdown = (e) => {
    // Para que o dropdown apareça ao lado do link "Detalhes"
    // Pode ser necessário passar as coordenadas se o posicionamento CSS for complexo.
    // Neste exemplo, vamos apenas alternar o estado:
    e.stopPropagation(); // Evita que o evento se propague (se estiver dentro de outro clicável)
    setIsMoviesDropdownOpen(prev => !prev);
    // Garante que o 1° dropdown de coleções está fechado
    if (isCollectionsDropdownOpen) setIsCollectionsDropdownOpen(false);
    // Garante que o 2° dropdown de coleções está fechado
    if (isGlobalCollectionsDropdownOpen) setIsGlobalCollectionsDropdownOpen(false);
  };
//#endregion

//#region Coleções
  const handleIsCollectionsDropdown = (value) => {
    setIsCollectionsDropdownOpen(value); // Fechar o 1° dropdown
    // Fechar o 2° dropdown quando o 1° dropdown for fechado
    if (!value) setIsGlobalCollectionsDropdownOpen(false);
  }

  const openCollectionDropdown = (e) => {
    e.stopPropagation();
    setIsCollectionsDropdownOpen(prev => !prev);
    // Garante que o 1° dropdown filmes está fechado
    if (isMoviesDropdownOpen) setIsMoviesDropdownOpen(false);
    // Garante que o 2° dropdown de coleções também está fechado
    setIsGlobalCollectionsDropdownOpen(false);
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
    openAnimeOpenModal,
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
    isMoviesDropdownOpen, // Primeiro Dropdown dos filmes
    handleIsMoviesDropdownOpen, // 1°
    moviesDetailsDropdown, // 1°
    isCollectionsDropdownOpen, // Primeiro Dropdown das coleções
    openCollectionDropdown, // 1°
    handleIsCollectionsDropdown, // 1°
    isGlobalCollectionsDropdownOpen, // Segundo Dropdown das coleções
    handleIsGlobalCollectionsDropdownOpen, // 2°

    // Lado Direito do modal
    openSeasonIndex,
    toggleSeason,
    handleOpenLink,
  };
}