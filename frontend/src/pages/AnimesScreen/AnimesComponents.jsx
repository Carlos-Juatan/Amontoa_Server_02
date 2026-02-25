// src/pages/AnimesScreen/AnimesComponents.jsx
import React, { useState, useRef } from 'react';

import { sortOptions } from './utils/sortFilterUtils';

import AnimeActionsMenu from './AnimeActionsMenu';
import CustomDropdown from '../../components/Common/CustomDropdown/CustomDropdown';
import SearchBar from '../../components/Common/SearchBar/SearchBar';

function AnimeCollectionsFilter({ globalCollections, selectedCollection, onCollectionFilter, addNewCollection, onRenameCollection, onDeleteCollection, ContextMenuComponent }) {
  // Estado para controlar o menu de contexto
  const [contextMenu, setContextMenu] = useState(null); // { name: string, x: number, y: number }

  const handleContextMenu = (e, collectionName) => {
    e.preventDefault(); // Impede que o menu de contexto padrão do navegador apareça
    setContextMenu({
      name: collectionName,
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  return (
    <div className='anime-collections'>
      {/* Os itens fixos (Tudo, Temporada Atual, Favoritos) não podem ser renomeados/apagados */}
      <span onClick={() => onCollectionFilter('Tudo')} className={selectedCollection === 'Tudo' ? 'selected-collection' : ''}>
        Tudo
      </span>
      <span onClick={() => onCollectionFilter('Temporada Atual')} className={selectedCollection === 'Temporada Atual' ? 'selected-collection' : ''}>
        Temporada Atual
      </span>
      <span onClick={() => onCollectionFilter('Favoritos')} className={selectedCollection === 'Favoritos' ? 'selected-collection' : ''}>
        Favoritos
      </span>

      {/* COLEÇÕES CRIADAS PELO USUÁRIO */}
      {globalCollections?.map(item => (
        <span
          key={item}
          onClick={() => onCollectionFilter(item)}
          onContextMenu={(e) => handleContextMenu(e, item)} // CHAVE: Botão direito
          className={selectedCollection === item ? 'selected-collection' : ''}
        >
          {item}
        </span>
      ))}

      {/* Botão Adicionar */}
      <span className='new-collection' onClick={addNewCollection}>
        <i className="fa-solid fa-plus"></i>
      </span>

      {/* EXIBE O MENU DE CONTEXTO SE O ESTADO ESTIVER PREENCHIDO */}
      {contextMenu && (
        <ContextMenuComponent
          x={contextMenu.x}
          y={contextMenu.y}
          collectionName={contextMenu.name}
          onRename={onRenameCollection}
          onDelete={onDeleteCollection}
          onClose={handleCloseContextMenu}
        />
      )}
    </div>
  );
}

function AnimeOrganizationControls({ displaySort, handleSortSelect, displayStyle, handleDisplayStyle }) {
  return (
    <div className='animes-organization'>
      <div className='animes-organization-left'>
        <span className='animes-organization-left-label'>Classificar por:</span>
        <CustomDropdown
          options={sortOptions}        // A lista de opções
          value={displaySort}          // O valor atual (estado)
          onChange={handleSortSelect}  // A função para atualizar o estado
        />
      </div>
      <div className='animes-organization-right'>
        <span
          className={`${displayStyle === 'grid' ? 'animes-organization-right-selected' : ''}`}
          onClick={() => handleDisplayStyle('grid')}
        >
          <i className="fa-solid fa-table-cells-large"></i>
        </span>
        <span
          className={`${displayStyle === 'list' ? 'animes-organization-right-selected' : ''}`}
          onClick={() => handleDisplayStyle('list')}
        >
          <i className="fa-solid fa-list-ul"></i>
        </span >
      </div>
    </div>
  );
}

function AnimeDisplayList({ displayStyle, finalSortedItems, loading, seasonInfo, globalCollections, openActionMenu, setOpenActionMenu, onEditAnime, onDeleteAnime, onAddToExistingCollection, onRemoveCollection, onAddNewCollection, handleItemClick }) {

  // Mensagem de Feedback
  if (finalSortedItems.length === 0 && !loading) return <p>Nenhum item corresponde à sua busca.</p>;
  /*<div className='animes-list'><ul className='animes-list-grid'><p>Nenhum item corresponde à sua busca.</p></ul></div>*/

  // Renderização em GRID
  if (displayStyle === 'grid') {
    return (
      <ul className='animes-list-grid'>
        {finalSortedItems.map((item, index) => (
          <li className='animes-item-grid' key={item._id}>
            <AnimesItemGrid
              id={item._id}
              itemColections={item.collections}
              onItemClick={() => handleItemClick(index)}
              imageUrl={item.imageUrl || "N/A"}
              japoneseTitle={item.name?.japonese || "N/A"}
              englishTitle={item.name?.english || "N/A"}
              collections={globalCollections}
              isMenuOpen={openActionMenu && openActionMenu.id === item._id ? openActionMenu : null}
              setOpenActionMenu={setOpenActionMenu}
              onEditAnime={() => onEditAnime(index)}
              onDeleteAnime={onDeleteAnime}
              onAddToExistingCollection={onAddToExistingCollection}
              onRemoveCollection={onRemoveCollection}
              onAddNewCollection={onAddNewCollection}
            />
          </li>
        ))}
      </ul>
    );
  }

  // Renderização em LISTA (displayStyle === 'list')
  return (
    <>
      <div className='animes-list-header'>
        <span className='animes-list-header-option animes-list-header-title'>Título</span>
        <span className='animes-list-header-option'>Temporadas</span>
        <span className='animes-list-header-option'>Vezes Assistidas</span>
        <span className='animes-list-header-option'>Nota</span>
        <span className='animes-list-header-option'>Lançamento</span>
      </div>

      <ul className='animes-list-list'>
        {finalSortedItems.map((item, index) => (
          <li className='animes-item-list' key={item._id}>
            <AnimesItemList
              id={item._id}
              itemColections={item.collections}
              onItemClick={() => handleItemClick(index)}
              imageUrl={item.imageUrl || "N/A"}
              japoneseTitle={item.name?.japonese || "N/A"}
              englishTitle={item.name?.english || "N/A"}
              seasons={item.seasons?.length || "-"}
              timeWhatched={item.timeWhatched?.length || "-"}
              score={item.score || "-"}
              launcheData={seasonInfo(item.date?.launched)}
              collections={globalCollections}
              isMenuOpen={openActionMenu && openActionMenu.id === item._id ? openActionMenu : null} 
              setOpenActionMenu={setOpenActionMenu}
              onEditAnime={() => onEditAnime(index)}
              onDeleteAnime={onDeleteAnime}
              onAddToExistingCollection={onAddToExistingCollection}
              onRemoveCollection={onRemoveCollection}
              onAddNewCollection={onAddNewCollection}
            />
          </li>
        ))}
      </ul>
    </>
  );
}

function AnimesItemGrid({ id, itemColections, onItemClick, imageUrl, japoneseTitle, englishTitle, collections, isMenuOpen, setOpenActionMenu, onEditAnime, onDeleteAnime, onAddToExistingCollection, onRemoveCollection, onAddNewCollection }) {

  const menuRef = useRef(null); // Ref para o ícone de reticências

  // Função para abrir/fechar o menu e calcular a direção
  const handleMenuToggle = (e) => {
    e.stopPropagation(); 
    
    if (isMenuOpen) {
      setOpenActionMenu(null); // Fechar
      return;
    }

    // --- LÓGICA DE CÁLCULO DE POSIÇÃO ---
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const estimatedMenuHeight = 350; // Estimar a altura máxima do menu (4-5 itens * 40px)
      
      let direction = 'down';

      // Se a parte inferior do botão + a altura estimada do menu > a altura da janela
      if (rect.bottom + estimatedMenuHeight > viewportHeight) {
        direction = 'up';
      }
      
      // Abre o menu, passando a direção
      setOpenActionMenu({ id: id, direction: direction }); 
    }
  };

  return (
    // Adicionar onClick para abrir o MediaSourceHandle
    <div className='animes-item-grid-content' onClick={onItemClick}>
      <div className='up'>
        <img src={imageUrl} alt="" />
        <div className='img-filter' />
      </div>
      <div className='bottom'>
        <div className='left'>
          <h3 className="truncar-texto">{japoneseTitle}</h3>
          <div className="truncar-texto truncar-sub-texto">{englishTitle}</div>
        </div>
        <div className='right'>
          <i
            className="fa-solid fa-ellipsis"
            ref={menuRef}
            onClick={handleMenuToggle}
          />
        
          {isMenuOpen && (
            <AnimeActionsMenu
              itemId={id}
              itemColections={itemColections}
              collections={collections}
              onEdit={onEditAnime}
              onDelete={onDeleteAnime}
              onRemoveCollection={onRemoveCollection}
              onAddToCollection={onAddToExistingCollection}
              onAddNewCollection={onAddNewCollection}
              direction={isMenuOpen.direction}
              onClose={() => setOpenActionMenu(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function AnimesItemList({ id, itemColections, onItemClick, imageUrl, japoneseTitle, englishTitle, seasons, timeWhatched, score, launcheData, collections, isMenuOpen, setOpenActionMenu, onEditAnime, onDeleteAnime, onAddToExistingCollection, onRemoveCollection, onAddNewCollection }) {

  const menuRef = useRef(null); // Ref para o ícone de reticências

  // Função para abrir/fechar o menu e calcular a direção
  const handleMenuToggle = (e) => {
    e.stopPropagation(); 
    
    if (isMenuOpen) {
      setOpenActionMenu(null); // Fechar
      return;
    }
    
    // --- LÓGICA DE CÁLCULO DE POSIÇÃO ---
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const estimatedMenuHeight = 350; // Estimar a altura máxima do menu (4-5 itens * 40px)
      
      let direction = 'down';

      // Se a parte inferior do botão + a altura estimada do menu > a altura da janela
      if (rect.bottom + estimatedMenuHeight > viewportHeight) {
        direction = 'up';
      }
      
      // Abre o menu, passando a direção
      setOpenActionMenu({ id: id, direction: direction }); 
    }
  };
  return (
    <div className='animes-item-list-content' onClick={onItemClick}>
      <div className='animes-item-list-title'>
        <img src={imageUrl} alt="" />
        <div className='animes-item-list-title-text'>
          <h3 className="truncar-texto">{japoneseTitle}</h3>
          <div className="truncar-texto truncar-sub-texto">{englishTitle}</div>
        </div>
      </div>
      <span className='animes-item-list-item'>{seasons}</span>
      <span className='animes-item-list-item'>{timeWhatched}</span>
      <span className='animes-item-list-item'>{score}</span>
      <div className='animes-item-list-item animes-item-list-launchedData'>
        <span className='animes-item-list-launchedData-title'>{`${launcheData.season} ${launcheData.year}`}</span>
        <span className='animes-item-list-launchedData-subtitle'>{`${launcheData.months}`}</span>
      </div>
      <div className="animes-item-list-item animes-item-list-options">
        <i
          className="fa-solid fa-ellipsis"
          ref={menuRef}
          onClick={handleMenuToggle} // NOVO: Clique para abrir/fechar o menu
        />
      
        {isMenuOpen && (
          <AnimeActionsMenu
            itemId={id}
            itemColections={itemColections}
            collections={collections}
            onEdit={onEditAnime}
            onDelete={onDeleteAnime}
            onRemoveCollection={onRemoveCollection}
            onAddToCollection={onAddToExistingCollection}
            onAddNewCollection={onAddNewCollection}
            direction={isMenuOpen.direction}
            onClose={() => setOpenActionMenu(null)}
          />
        )}
      </div>
    </div>
  );
}

function AnimeSidebar({ searchTerm, handleSearchChange, globalData, selectedTags, toggleTags, launchOptions, selectedLaunches, toggleLaunches, onAddNewAnime }) {
  return (
    <div className='animes-sidebar'>
      <div className='animes-sidebar-title'>
        <h3>Filtros</h3>
      </div>

      <div className='animes-sidebar-research'>
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          placeholder={`Pesquisar em ${'Animes'}...`}
        />
      </div>

      <hr />

      <div className='animes-sidebar-content'>
        <div className='animes-sidebar-option animes-sidebar-newAnime'>
          <div onClick={onAddNewAnime}>
            <span>Adicionar Anime</span>
          </div>
        </div>

        <hr />

        <CollapsibleMenu
          title={"Gênero"}
          options={globalData?.tags}
          selectedList={selectedTags} // O estado que armazena as chaves
          onToggle={toggleTags}
        />

        <hr />

        <CollapsibleMenu
          title={"Lançamento"}
          options={launchOptions.map(o => o.displayLabel)} // Passamos o array de filterKey's para o CollapsibleMenu
          selectedList={selectedLaunches} // O estado que armazena as chaves
          onToggle={toggleLaunches}
        />

        <hr />

      </div>
    </div>
  );
}

function CollapsibleMenu({ title, options, selectedList, onToggle }) {
  const [hasOpen, setHasOpen] = useState(false);
  const toggleHasOpen = () => setHasOpen(!hasOpen);

  return (
    <div className='animes-sidebar-option'>
      <div className={`animes-sidebar-option-title ${hasOpen ? 'animes-sidebar-option-open' : ''}`} onClick={toggleHasOpen}>
        <span>{title}</span>
        <div>{hasOpen ? <i className="fa-solid fa-angle-up"></i> : <i className="fa-solid fa-angle-down"></i>}</div>
      </div>

      {hasOpen && (
        <div className="animes-sidebar-options">
          {options.map(option => {
            const isSelected = selectedList.includes(option);
            return (
              <div className={`animes-sidebar-options-item ${isSelected ? 'animes-sidebar-options-item-selected' : ''}`} key={option} onClick={() => onToggle(option)}>
                <span>{option}</span>
                <span>{isSelected ? '✔ ' : ''}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export {
  CollapsibleMenu,
  AnimeCollectionsFilter,
  AnimeOrganizationControls,
  AnimeDisplayList,
  AnimeSidebar
};