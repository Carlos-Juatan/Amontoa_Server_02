// src/pages/AnimesScreen/AnimesModal.jsx
import React, { useState, useRef, useEffect } from 'react';

import SingleTextInputModal from '../../components/Common/Modal/TextInputModal/SingleTextInputModal';

import { toTitleCase } from './utils/modalUtils';

import Button from '../../components/Common/Button/Button';
import CustomCheckbox from '../../components/Common/CustomCheckbox/CustomCheckbox';

import './AnimesModal.css';

function AddCollectionModal({ isOpen, onClose, title, onSubmit, initialValue }) {
  const [collectionName, setCollectionName] = useState(initialValue || '');

  const handleChange = (e) => setCollectionName(e.target.value);

  const handleSubmit = () => {
    if (collectionName.trim()) {
      const formattedName = toTitleCase(collectionName); 
      onSubmit(formattedName);
      setCollectionName('');
      onClose();
    }
  };


  return (
    <div className='animes-modal-add-collection'>
      <SingleTextInputModal 
        onClose={onClose}
        title={title}
        onSubmit={handleSubmit}
        inputValue={collectionName}
        handleChangeInput={handleChange}
        handleChange={handleChange}
      />
      {/*
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        onSubmit={handleSubmit}
        submitButtonText={"Criar"}
        modalCustonStyle="item-add-collection-content"
      >
        <input type="text" value={collectionName} onChange={handleChange} />
      </Modal>
      */}
    </div>
  );
}

function AnimeDetailsModal({
  // Abrir e fechar o modal
  hasAnimeModal,
  closeModal,
  handleModalType,

  // Dados do item
  item,
  prevAnime,
  nextAnime,

  // Dados Globais
  globalData,

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
  handleOpenLink
}) {

  if (hasAnimeModal === null) return;

  // Funções temporárias de ação
  const handleOpenEditModal = () => { console.log('Abrindo Modal de editar anime'); }
  const setTimeWatched = (value) => { console.log(`Mudando vezes assistidas em: ${value}`); }
  const addNewSeason = () => { console.log('Adicionando nova temporada na lista'); }
  const addNewEpisode = () => { console.log('Adicionando novo epsódio na lista'); }
  const toggleWatchStatus = (seasonIndex, episodeIndex) => { console.log(`Temporada ${seasonIndex + 1}, Episódio ${episodeIndex + 1}: Status alterado!`);};
  const handleEpisodeMenuToggle = (e) => { console.log('Abrindo menu de episódio'); }
  const addNewLinkToWatch = () => { console.log('Adicionando novo link para assitir'); }

  // Funções temporárias de ação do movies dropdown
  const toggleMovieWatchStatus = (movieTitle) => { console.log(`[Filme] Status de assistido alterado para: ${movieTitle}`); };
  const handleEditMovie = (movieTitle) => { console.log(`[Filme] Abrindo modal de edição para: ${movieTitle}`); };
  const handleDeleteMovie = (movieTitle) => { console.log(`[Filme] Deletando: ${movieTitle}`); };
  const handleAddNewMovie = () => { console.log('[Filme] Adicionando novo filme'); };
  
  // Funções temporárias de ação do colection dropdown
  const handleRemoveFromCollection = (collectionName) => { console.log(`[Coleção] Removendo da coleção: ${collectionName}`); };






  // NOVO: Manipuladores para o fluxo de "Adicionar Nova Coleção"
  const [isNewCollectionInputOpen, setIsNewCollectionInputOpen] = useState(false);

  // 1. Abre o dropdown de coleções globais
  const handleOpenGlobalCollectionsDropdown = () => {
    console.log('[Coleção] Abrindo dropdown de coleções globais');
    handleIsGlobalCollectionsDropdownOpen(true);
    // Certifica-se de que o modal de input de nova coleção está fechado
    setIsNewCollectionInputOpen(false);
  };

  // 2. Adiciona o anime a uma coleção existente
  const handleAddToExistingCollection = (collectionName) => {
    console.log(`[Coleção] Adicionando anime à coleção existente: ${collectionName}`);
    // Após a ação, fechar ambos os dropdowns
    handleIsGlobalCollectionsDropdownOpen(false);
    handleIsCollectionsDropdown(false);
  };

  // 3. Abre o modal de input para criar uma nova coleção
  const handleOpenNewCollectionInput = () => {
    console.log('[Coleção] Abrindo modal de input para nova coleção');
    handleIsGlobalCollectionsDropdownOpen(false); // Fecha o dropdown de seleção
    setIsNewCollectionInputOpen(true); // Abre o modal de input
  };

  // 4. Criação e adição da nova coleção (Função de submissão do modal de input)
  const handleSubmitNewCollection = (collectionName) => {
    console.log(`[Coleção] Criando e adicionando nova coleção: ${collectionName}`);
    // Lógica de salvar no banco e adicionar ao anime...
    setIsNewCollectionInputOpen(false);
    handleIsCollectionsDropdown(false);
  };




  return (
    <div className='animes-modal-overlay'>
      <div className='animes-modal-anime-container'>
        {/* Botão de navegação esquerda */}
        <div className='change-anime-button' onClick={prevAnime}><i className="fa-solid fa-angle-left" /></div>

        {/* Conteúdo principal do modal */}
        <div className='animes-modal-content'>

          {/* Painel Esquerdo: Imagem e Informações Auxiliares */}
          <ModalLeftPanel
            // Dados do item
            item={item} 
            // Dados Globais
            globalData={globalData}
            getMonths={getMonths} 
            // Filmes
            isMoviesDropdownOpen={isMoviesDropdownOpen}
            handleIsMoviesDropdownOpen={handleIsMoviesDropdownOpen}
            moviesDetailsDropdown={moviesDetailsDropdown}
            handleAddNewMovie={handleAddNewMovie}
            handleEditMovie={handleEditMovie}
            handleDeleteMovie={handleDeleteMovie}
            toggleMovieWatchStatus={toggleMovieWatchStatus}
            // Vezes Assistido
            setTimeWatched={setTimeWatched}
            // Coleções
            isCollectionsDropdownOpen={isCollectionsDropdownOpen}
            openCollectionDropdown={openCollectionDropdown}
            handleIsCollectionsDropdown={handleIsCollectionsDropdown}
            handleRemoveFromCollection={handleRemoveFromCollection}
            handleAddNewCollection={handleOpenGlobalCollectionsDropdown}
            isGlobalCollectionsDropdownOpen={isGlobalCollectionsDropdownOpen}
            handleIsGlobalCollectionsDropdownOpen={handleIsGlobalCollectionsDropdownOpen}
            handleAddToExistingCollection={handleAddToExistingCollection}
            handleOpenNewCollectionInput={handleOpenNewCollectionInput}
          />

          {/* Conteúdo Direito: Títulos, Sinopse, Temporadas, Links */}
          <ModalRightPanel
            // Dados
            item={item}
            // Temporadas
            addNewSeason={addNewSeason}
            openSeasonIndex={openSeasonIndex}
            toggleSeason={toggleSeason}
            addNewEpisode={addNewEpisode}
            toggleWatchStatus={toggleWatchStatus}
            handleEpisodeMenuToggle={handleEpisodeMenuToggle}
            // Links
            handleOpenLink={handleOpenLink}
            addNewLinkToWatch={addNewLinkToWatch}
            // Buttons
            handleOpenEditModal={handleOpenEditModal}
            closeModal={closeModal}
          />
        </div>

        {/* Botão de navegação direita */}
        <div className='change-anime-button' onClick={nextAnime}><i className="fa-solid fa-angle-right" /></div>
      </div>
    </div>
  );
}

//#region Lado Esquerdo

function ModalLeftPanel({ 
  // Dados do item
  item, 

  // Dados Globais
  globalData,

  // Função dos meses da temporada
  getMonths, 

  // Primeiro Dropdown dos filmes
  isMoviesDropdownOpen,
  handleIsMoviesDropdownOpen,
  toggleMovieWatchStatus,
  moviesDetailsDropdown,
  handleAddNewMovie,
  handleEditMovie,
  handleDeleteMovie,

  // Quantidade de vezes assistidas
  setTimeWatched,

  // Primeiro Dropdown das coleções
  isCollectionsDropdownOpen,
  openCollectionDropdown,
  handleIsCollectionsDropdown,
  handleAddNewCollection,
  handleRemoveFromCollection,

  // Segundo Dropdown das coleções
  isGlobalCollectionsDropdownOpen,
  handleIsGlobalCollectionsDropdownOpen,
  handleAddToExistingCollection,
  handleOpenNewCollectionInput,
}) {
  
  return (
    <div className='modal-left-panel'>
      <div className='modal-image-wrapper'>
        <img src={item?.imageUrl} alt='Anime cover' className='anime-cover-image' />
      </div>
      
      <div className='modal-info-details'>
        {/* Data de Lançamento */}
        <div className='info-detail-item'>
          <span className='info-label'>Data:</span>
          <div className='info-value date-value'>
            <span>{`${item?.date?.launched?.season} ${item?.date?.launched?.year}`}</span>
            <span className='date-months'>{`( ${getMonths(item?.date?.launched?.season)} )`}</span>
          </div>
        </div>

        {/* Filmes */}
        <div className='info-detail-item'>
          <span className='info-label'>Filmes:</span>
          <div className='info-value movies-value-wrapper'> {/* Novo wrapper para posicionamento */}
            <div 
              className='info-value movies-value' 
              onClick={(item?.movies?.length > 0) ? moviesDetailsDropdown : handleAddNewMovie} // Usa a nova função
            >
              <span>{item?.movies?.length || 0}</span>
              {item?.movies?.length > 0 && (
                <div className='info-details'>Detalhes</div>
              )}
              {item?.movies?.length == 0 && (
                <div className='info-details'>Adicionar</div>
              )}
            </div>
            
            {/* Renderiza o Dropdown de Filmes condicionalmente */}
            {isMoviesDropdownOpen && (
              <MoviesDropdown 
                movies={item?.movies} 
                onClose={() => handleIsMoviesDropdownOpen(false)} 
                toggleMovieWatchStatus={toggleMovieWatchStatus}
                handleAddNewMovie={handleAddNewMovie}
                handleEditMovie={handleEditMovie}
                handleDeleteMovie={handleDeleteMovie}
              />
            )}
          </div>
        </div>

        {/* Vezes Assistido */}
        <div className='info-detail-item'>
          <span className='info-label'>Vezes Assistido:</span>
          <div className='info-value times-watched-value'>
            <div className='watch-controls'>
              <i className="fa-solid fa-angle-left" onClick={() => setTimeWatched(-1)} />
              <span className='watch-count'>{item?.timeWhatched || 0}</span>
              <i className="fa-solid fa-angle-right" onClick={() => setTimeWatched(1)} />
            </div>
          </div>
        </div>

        {/* Coleções */}
        <div className='info-detail-item'>
          <span className='info-label'>Coleções:</span>
          <div className='info-value collection-value-wrapper'> {/* Novo wrapper para posicionamento */}
            <div 
              className='info-value collection-value' 
              onClick={openCollectionDropdown} // Usa a nova função
            >
              <div className='info-details'>Detalhes</div>
            </div>
            
            {/* Renderiza o Dropdown de Coleções condicionalmente */}
            {isCollectionsDropdownOpen && (
              <CollectionsDropdown 
                collections={item?.collections} 
                onClose={() => handleIsCollectionsDropdown(false)}
                handleAddNewCollection={handleAddNewCollection}
                handleRemoveFromCollection={handleRemoveFromCollection}
                // NOVOS PROPS
                globalCollections={globalData?.globalInfo?.collections || []}
                isGlobalCollectionsDropdownOpen={isGlobalCollectionsDropdownOpen}
                handleIsGlobalCollectionsDropdownOpen={handleIsGlobalCollectionsDropdownOpen}
                handleAddToExistingCollection={handleAddToExistingCollection}
                handleOpenNewCollectionInput={handleOpenNewCollectionInput}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MoviesDropdown({ 
  movies = [], 
  onClose, 
  toggleMovieWatchStatus, 
  handleAddNewMovie, 
  handleEditMovie, 
  handleDeleteMovie 
}) {
  const dropdownRef = useRef(null);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, movieTitle: null });

  // 1. Lógica para fechar ao clicar fora (ou quando `onClose` é chamado)
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose(); // Fecha o dropdown principal
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // 2. Lógica do Menu de Contexto (clique direito)
  const handleContextMenu = (e, movieTitle) => {
    e.preventDefault(); // Impede o menu de contexto padrão do navegador
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      movieTitle,
    });
  };

  const closeContextMenu = () => {
    setContextMenu({ ...contextMenu, visible: false });
  };
  
  // Fecha o menu de contexto ao clicar em qualquer lugar
  useEffect(() => {
      document.addEventListener('click', closeContextMenu);
      return () => document.removeEventListener('click', closeContextMenu);
  }, []);

  return (
    <div className="movies-dropdown-container" ref={dropdownRef}>
      <ul className="movies-list-content">
        {/* Renderiza a lista de Filmes */}
        {movies.length > 0 ? (
          movies.map((movie, index) => (
            <li 
              key={index} 
              className='movie-item-row'
              onContextMenu={(e) => handleContextMenu(e, movie.title)} // Clique direito
            >
              <CustomCheckbox
                checked={movie.hasWatched}
                onChange={() => toggleMovieWatchStatus(movie.title)}
                size={13}
              />
              <span className='movie-title'>{movie.title}</span>
            </li>
          ))
        ) : (
          <li className='no-movies-message'>Nenhum filme cadastrado.</li>
        )}

        {/* Opção para Adicionar Novo Filme */}
        <li className='add-new-item-action' onClick={handleAddNewMovie}>
          <i className="fa-solid fa-plus"></i> Adicionar Novo Filme
        </li>
      </ul>

      {/* Menu de Contexto (Aparece ao clicar com o botão direito) */}
      {contextMenu.visible && (
        <div 
          className="context-menu" 
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onMouseLeave={closeContextMenu} // Opção de fechar ao tirar o mouse
        >
          <div onClick={() => { handleEditMovie(contextMenu.movieTitle); closeContextMenu(); }}>Editar</div>
          <div onClick={() => { handleDeleteMovie(contextMenu.movieTitle); closeContextMenu(); }}>Deletar</div>
        </div>
      )}
    </div>
  );
}

function CollectionsDropdown({ 
  collections = [], 
  onClose, 
  handleAddNewCollection, 
  handleRemoveFromCollection,
  // NOVOS PROPS
  globalCollections,
  isGlobalCollectionsDropdownOpen,
  handleIsGlobalCollectionsDropdownOpen,
  handleAddToExistingCollection,
  handleOpenNewCollectionInput
}) {
  const dropdownRef = useRef(null);

  // Lógica para fechar ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="collections-dropdown-container" ref={dropdownRef}>
      <ul className="collections-list-content">
        {/* Renderiza a lista de Coleções */}
        {collections.length > 0 ? (
          collections.map((collectionName, index) => (
            <li key={index} className='collection-item-row'>
              <span 
                className='remove-collection-action' 
                onClick={() => handleRemoveFromCollection(collectionName)}
              >
                Remover da coleção {collectionName}
              </span>
            </li>
          ))
        ) : (
          <li className='no-collections-message'>Não está em nenhuma coleção.</li>
        )}

        {/* Opção para Adicionar Nova Coleção */}
        <li className='add-new-item-action' onClick={handleAddNewCollection}>
          <i className="fa-solid fa-plus"></i> Adicionar Nova Coleção
        </li>
      </ul>

      {/* NOVO: Renderiza o Dropdown de Seleção Global condicionalmente */}
      {isGlobalCollectionsDropdownOpen && (
        <GlobalCollectionsDropdown
          currentCollections={collections}
          globalCollections={globalCollections}
          onClose={() => handleIsGlobalCollectionsDropdownOpen(false)}
          onSelectCollection={handleAddToExistingCollection}
          onNewCollection={handleOpenNewCollectionInput}
        />
      )}
    </div>
  );
}

function GlobalCollectionsDropdown({ currentCollections = [], globalCollections, onClose, onSelectCollection, onNewCollection }) {

  const dropdownRef = useRef(null);

  // Lista as coleções que o anime NÃO tem
  const availableCollections = globalCollections.filter(
    (globalName) => !currentCollections.includes(globalName)
  );

  // Lógica para fechar ao clicar fora (deste dropdown específico)
  useEffect(() => {
    function handleClickOutside(event) {
      // Usa event.stopPropagation no item pai (CollectionsDropdown) para evitar fechar ambos com um clique
      // Aqui, garante que fechemos apenas se o clique não for dentro deste dropdown.
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    // Classe para posicionamento, deve ser estilizada para aparecer ao lado/acima do 'Adicionar Nova Coleção'
    <div className="global-collections-dropdown-container" ref={dropdownRef}>
      <ul className="global-collections-list-content">
        <li className='dropdown-title-header'>Adicionar a uma Coleção:</li>
        <hr />

        {/* Opção para Criar Nova Coleção (Abre o modal de input) */}
        <li className='create-new-collection-action' onClick={onNewCollection}>
          <i className="fa-solid fa-folder-plus"></i> Criar Nova Coleção
        </li>

        <hr />

        {/* Lista de Coleções Disponíveis */}
        {availableCollections.length > 0 ? (
          availableCollections.map((collectionName, index) => (
            <li
              key={index}
              className='available-collection-item'
              onClick={() => onSelectCollection(collectionName)} // Seleciona a coleção
            >
              {collectionName}
            </li>
          ))
        ) : (
          <li className='no-available-collections-message'>Todas as coleções já estão incluídas.</li>
        )}
      </ul>
    </div>
  );
}
//#endregion

//#region Lado Direito
function ModalRightPanel ({ 
  item,
  addNewSeason,
  openSeasonIndex,
  toggleSeason,
  addNewEpisode,
  toggleWatchStatus,
  handleEpisodeMenuToggle,
  handleOpenLink,
  addNewLinkToWatch,
  handleOpenEditModal,
  closeModal
}) {

  return(
    <div className='modal-right-content'>
      
      {/* Bloco de Título e Nota */}
      <div className='anime-header-block'>
        <div className='anime-titles'>
          <span className='title-japanese'>{item?.name?.japonese}</span>
          <span className='title-english'>{item?.name?.english}</span>
        </div>

        <div className='anime-score-wrapper'>
          <div className='anime-score'>
            <div className='score-label'>Nota:</div>
            <div className='score-value'>{item?.score || '-'}</div>
          </div>
        </div>
      </div>

      {/* Bloco de Informações: Sinopse, Tags, Coleções */}
      <div className='anime-info-block'>

        {/* Sinopse */}
        <div className='info-section synopsis-section'>
          <div className='section-label'>Sinopse:</div>
          <p className='synopsis-text'>{item?.description || 'Undefined'}</p>
        </div>

        {/* Tags */}
        <div className='info-section tags-section'>
          <span className='section-label'>tags:</span>
          <div className='tags-list'>
            {(item?.tags || 'Undefined').map(tag => (
              <span key={tag} className='tag-item'>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Bloco de Temporadas e Links */}
      <div className='seasons-and-links-block'>

        {/* Seção de Temporadas */}
        <div className='seasons-section'>
          <div className='section-title-wrapper'>
            <span className='section-title'>Temporadas</span>
            <span className='add-new-button' onClick={addNewSeason}><i className="fa-solid fa-plus"></i></span>
          </div>
          <hr className='section-divider' />


          <ul className='season-list'>
            {(item?.seasons || []).map((season, index) => {
              const isSeasonOpen = openSeasonIndex === index; // Varifica se o índice atual for o índice aberto

              return (
                <li key={index} className='season-list-item'>
                  <div className='season-header'>
                    <div className='season-title-wrapper' onClick={() => toggleSeason(index)}>
                      <i className={`fa-solid season-toggle-icon ${isSeasonOpen ? 'fa-angle-up' : 'fa-angle-down'}`}></i>
                      <span className='season-title'>{season.season}</span>
                    </div>
                    <span className='add-episode-button' onClick={addNewEpisode}><i className="fa-solid fa-plus"></i></span>
                  </div>

                  {/* Lista de Episódios (condicional) */}
                  {isSeasonOpen && (
                    <div className='episodes-list-wrapper'>
                      {(season.episodes || []).map((ep, epIndex) => (
                        <div key={epIndex} className='episode-item'>
                          <CustomCheckbox
                            checked={ep.hasWacth}
                            onChange={() => toggleWatchStatus(index, epIndex)}
                            size={13}
                          />
                          <span className='episode-title'>{ep.title}</span>
                          <span className='episode-menu-button'><i className="fa-solid fa-ellipsis" onClick={handleEpisodeMenuToggle} /></span>
                        </div>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Seção de Links para Assistir */}
        <div className='watch-links-section'>
          <div className='section-title-wrapper'>
            <span className='section-title'>Links para assistir</span>
            <span className='add-new-button' onClick={addNewLinkToWatch}><i className="fa-solid fa-plus" /></span>
          </div>
          <hr className='section-divider' />
          <ul className='links-list'>
            {(item?.links || []).map((link, index) => (
              <li key={`${link.title}-${index}`} className='link-list-item'>
                <span className='link-title'>{link.title}</span>
                <Button className='link-open-button' onClick={() => handleOpenLink(link.url)}>Abrir</Button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Botões de Ação do Modal */}
      <div className='modal-action-buttons'>
        <Button className='action-button button-edit' onClick={handleOpenEditModal}>Editar</Button>
        <Button className='action-button button-close' onClick={closeModal}>Fechar</Button>
        {/*
        <span className='action-button button-edit' onClick={handleOpenEditModal}>Editar</span>
        <span className='action-button button-close' onClick={closeModal}>Fechar</span>
        */}
      </div>
    </div>
  );
}
//#endregion

export {
  AddCollectionModal,
  AnimeDetailsModal,
};
