// src/pages/AnimesScreen/AnimesModal.jsx
import React, { useState, useRef, useEffect } from 'react';

import useClickOutside from '../../hooks/useClickOutside'; 

import { toTitleCase } from './utils/modalUtils';

import SingleTextInputModal from '../../components/Common/Modal/TextInputModal/SingleTextInputModal';
import SingleTextInputWithCheckboxModal from '../../components/Common/Modal/TextInputModal/SingleTextInputWithCheckboxModal';

import Button from '../../components/Common/Button/Button';
import CustomCheckbox from '../../components/Common/CustomCheckbox/CustomCheckbox';

import './AnimesModal.css';

function AddCollectionModal({ onClose, title, onSubmit, initialValue }) {
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
    </div>
  );
}

function AddMovieModal({ onClose, title, onSubmit, initialMovieName, initialMovieValue, checkmarkSize }) {
  const [movieName, setMovieName] = useState(initialMovieName || '');
  const [movieValue, setMovieValue] = useState(initialMovieValue || false);
  
  const handleChangeName = (e) => setMovieName(e.target.value);
  const handleChangeValue = () => setMovieValue(!movieValue);

  const handleSubmit = () => {
    if (movieName.trim()) {
      const formattedName = toTitleCase(movieName); 
      onSubmit(formattedName, movieValue);
      setMovieName('');
      setMovieValue(false);
      onClose();
    }
  };

  return (
    <div className='animes-modal-add-collection'>
      <SingleTextInputWithCheckboxModal 
        onClose={onClose}
        title={title}
        inputValue={movieName}
        handleChangeInput={handleChangeName}
        handleChange={handleChangeName}
        checkmarkValue={movieValue}
        onChangeValue={handleChangeValue}
        size={checkmarkSize}
        onSubmit={handleSubmit}
      />
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
  closeAllDropdowns,
  isMoviesDropdownOpen, // Primeiro Dropdown dos filmes
  openMoviesDropdown, // 1°
  toggleMovieWatchStatus, // 1°
  handleAddNewMovie, // 1°
  handleDeleteMovie, // Segundo Dropdown dos filmes

  setTimeWatched,

  isCollectionsDropdownOpen, // Primeiro Dropdown das coleções
  openCollectionDropdown, // 1°
  isGlobalCollectionsDropdownOpen, // Segundo Dropdown das coleções
  handleIsGlobalCollectionsDropdownOpen, // 2°
  addNewCollection,
  onAddCollection,
  onRemoveCollection,

  // Lado Direito do modal
  openSeasonIndex,
  toggleSeason,
  handleOpenLink
}) {

  if (hasAnimeModal === null) return;

  // Funções temporárias de ação
  const handleOpenEditModal = () => { console.log('Abrindo Modal de editar anime'); }
  const addNewSeason = () => { console.log('Adicionando nova temporada na lista'); }
  const addNewEpisode = () => { console.log('Adicionando novo epsódio na lista'); }
  const toggleWatchStatus = (seasonIndex, episodeIndex) => { console.log(`Temporada ${seasonIndex + 1}, Episódio ${episodeIndex + 1}: Status alterado!`);};
  const handleEpisodeMenuToggle = (e) => { console.log('Abrindo menu de episódio'); }
  const addNewLinkToWatch = () => { console.log('Adicionando novo link para assitir'); }
  





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
            closeAllDropdowns={closeAllDropdowns}
            // Filmes
            isMoviesDropdownOpen={isMoviesDropdownOpen}
            openMoviesDropdown={openMoviesDropdown}
            handleAddNewMovie={handleAddNewMovie}
            handleDeleteMovie={handleDeleteMovie}
            toggleMovieWatchStatus={toggleMovieWatchStatus}
            // Vezes Assistido
            setTimeWatched={setTimeWatched}
            // Coleções
            isCollectionsDropdownOpen={isCollectionsDropdownOpen}
            openCollectionDropdown={openCollectionDropdown}
            onRemoveCollection={onRemoveCollection}
            handleAddNewCollection={() => handleIsGlobalCollectionsDropdownOpen(true)}
            isGlobalCollectionsDropdownOpen={isGlobalCollectionsDropdownOpen}
            handleIsGlobalCollectionsDropdownOpen={handleIsGlobalCollectionsDropdownOpen}
            onAddCollection={onAddCollection}
            addNewCollection={addNewCollection}
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
  closeAllDropdowns,
  toggleMovieWatchStatus,
  openMoviesDropdown,
  handleAddNewMovie,
  handleEditMovie,
  handleDeleteMovie,

  // Quantidade de vezes assistidas
  setTimeWatched,

  // Primeiro Dropdown das coleções
  isCollectionsDropdownOpen,
  openCollectionDropdown,
  handleAddNewCollection,
  onRemoveCollection,

  // Segundo Dropdown das coleções
  isGlobalCollectionsDropdownOpen,
  handleIsGlobalCollectionsDropdownOpen,
  onAddCollection,
  addNewCollection,
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
          <div className='info-value movies-value-wrapper'> {/* wrapper para posicionamento */}
            <div 
              className='info-value movies-value' 
              onClick={openMoviesDropdown} // Usa a nova função
            >
              <span>{item?.movies?.length || 0}</span>
              <div className='info-details'>Detalhes</div>
            </div>
            
            {/* Renderiza o Dropdown de Filmes condicionalmente */}
            {isMoviesDropdownOpen && (
              <MoviesDropdown 
                movies={item?.movies} 
                onClose={closeAllDropdowns} 
                toggleMovieWatchStatus={(movieTitle) => toggleMovieWatchStatus(item?._id, movieTitle)}
                handleAddNewMovie={() => handleAddNewMovie(item?._id, '', false)}
                handleEditMovie={(movieTitle, checkmarkValue) => handleAddNewMovie(item?._id, movieTitle, checkmarkValue)}
                handleDeleteMovie={(movieTitle) => handleDeleteMovie(item?._id, movieTitle)}
              />
            )}
          </div>
        </div>

        {/* Vezes Assistido */}
        <div className='info-detail-item'>
          <span className='info-label'>Vezes Assistido:</span>
          <div className='info-value times-watched-value'>
            <div className='watch-controls'>
              <i className="fa-solid fa-angle-left" onClick={() => setTimeWatched(item._id, -1)} />
              <span className='watch-count'>{item?.timeWhatched || 0}</span>
              <i className="fa-solid fa-angle-right" onClick={() => setTimeWatched(item._id, 1)} />
            </div>
          </div>
        </div>

        {/* Coleções */}
        <div className='info-detail-item'>
          <span className='info-label'>Coleções:</span>
          <div className='info-value collection-value-wrapper'> {/* wrapper para posicionamento */}
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
                onClose={closeAllDropdowns}
                handleAddNewCollection={handleAddNewCollection}
                onRemoveCollection={(col) => onRemoveCollection(item._id, col)}
                // 2° Dropdown
                globalCollections={globalData?.globalInfo?.collections || []}
                isGlobalCollectionsDropdownOpen={isGlobalCollectionsDropdownOpen}
                handleIsGlobalCollectionsDropdownOpen={handleIsGlobalCollectionsDropdownOpen}
                onAddCollection={(col) => onAddCollection(item._id, col)}
                addNewCollection={() => addNewCollection(item._id)}
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
  const dropdownRef = useClickOutside(onClose); 
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, movieTitle: null, checkmarkValue: false });

  // Lógica do Menu de Contexto (clique direito)
  const handleContextMenu = (e, movieTitle, checkmarkValue) => {
    e.preventDefault(); // Impede o menu de contexto padrão do navegador
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      movieTitle,
      checkmarkValue,
    });
  };

  const closeContextMenu = () => {
    setContextMenu({ ...contextMenu, visible: false });
  };

  return (
    <div className="movies-dropdown-container" ref={dropdownRef}>
      <ul className="movies-list-content">
        {/* Renderiza a lista de Filmes */}
        {movies.length > 0 ? (
          movies.map((movie, index) => (
            <li 
              key={index} 
              className='movie-item-row'
              onContextMenu={(e) => handleContextMenu(e, movie.title, movie.hasWatched)} // Clique direito
            >
              <span className='movie-title'>{movie.title}</span>
              <CustomCheckbox
                checked={movie.hasWatched}
                onChange={() => toggleMovieWatchStatus(movie.title)}
                size={13}
              />
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
          <div onClick={() => { handleEditMovie(contextMenu.movieTitle, contextMenu.checkmarkValue); closeContextMenu(); }}>Editar</div>
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
  onRemoveCollection,
  // NOVOS PROPS
  globalCollections,
  isGlobalCollectionsDropdownOpen,
  handleIsGlobalCollectionsDropdownOpen,
  onAddCollection,
  addNewCollection
}) {
  const dropdownRef = useClickOutside(onClose); 

  return (
    <div className="collections-dropdown-container" ref={dropdownRef}>
      <ul className="collections-list-content">
        {/* Renderiza a lista de Coleções */}
        {collections.length > 0 ? (
          collections.map((collectionName, index) => (
            <li key={index} className='collection-item-row'>
              <span 
                className='remove-collection-action' 
                onClick={() => onRemoveCollection(collectionName)}
              >
                Remover de <div className='remove-collection-action-col'>{collectionName}</div>
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
          onSelectCollection={onAddCollection}
          onNewCollection={addNewCollection}
        />
      )}
    </div>
  );
}

function GlobalCollectionsDropdown({ 
  currentCollections = [], 
  globalCollections, 
  onClose, 
  onSelectCollection, 
  onNewCollection 
}) {
  const dropdownRef = useClickOutside(onClose); 

  // Lista as coleções que o anime NÃO tem
  const availableCollections = globalCollections.filter(
    (globalName) => !currentCollections.includes(globalName)
  );

  return (
    // Classe para posicionamento, deve ser estilizada para aparecer ao lado/acima do 'Adicionar Nova Coleção'
    <div className="global-collections-dropdown-container" ref={dropdownRef}>
      <ul className="global-collections-list-content">
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
        
        {/* Opção para Criar Nova Coleção (Abre o modal de input) */}
        <li className='create-new-collection-action' onClick={onNewCollection}>
          <i className="fa-solid fa-folder-plus"></i> Criar Nova Coleção
        </li>
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
  AddMovieModal,
  AnimeDetailsModal,
};
