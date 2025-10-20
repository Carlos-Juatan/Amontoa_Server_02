// src/pages/AnimesScreen/AnimesComponents.jsx
import React, { useState } from 'react';

import { sortOptions } from '../../utils/sortFilterUtils';

import CustomDropdown from '../../components/Common/CustomDropdown/CustomDropdown';
import SearchBar from '../../components/Common/SearchBar/SearchBar';

function AnimeCollectionsFilter({ globalCollections, selectedCollection, onCollectionFilter, addNewCollection }) {
  return (
    <div className='anime-collections'> 
      <span onClick={() => onCollectionFilter('Tudo')} className={selectedCollection === 'Tudo' ? 'selected-collection' : ''}>
        Tudo
      </span>
      <span onClick={() => onCollectionFilter('Temporada Atual')} className={selectedCollection === 'Temporada Atual' ? 'selected-collection' : ''}>
        Temporada Atual
      </span>
      <span onClick={() => onCollectionFilter('Favoritos')} className={selectedCollection === 'Favoritos' ? 'selected-collection' : ''}>
        Favoritos
      </span>
      {globalCollections?.map(item => (
        <span key={item} onClick={() => onCollectionFilter(item)} className={selectedCollection === item ? 'selected-collection' : ''}>
          {item}
        </span>
      ))}
      <span className='new-collection' onClick={addNewCollection}>
        <i className="fa-solid fa-plus"></i>
      </span>
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

function AnimesItemGrid({ id, imageUrl, japoneseTitle, englishTitle}) {
  return(
    <>
      <img src={imageUrl} alt="" />
      <h3 className="truncar-texto">{japoneseTitle}</h3>
      <span className="truncar-texto">{englishTitle}</span>
    </>
  );
}

function AnimesItemList({ id, imageUrl, japoneseTitle, englishTitle, seasons, timeWhatched, score, launcheData }) {
  return(
    <>
      <div className='animes-item-list-title'>
        <img src={imageUrl} alt="" />
        <div className='animes-item-list-title-text'>
          <h3 className="truncar-texto">{japoneseTitle}</h3>
          <span className="truncar-texto">{englishTitle}</span>
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
        <i className="fa-solid fa-ellipsis"></i>
      </div>
    </>
  );
}

function AnimeDisplayList({ displayStyle, finalSortedItems, loading, seasonInfo }) {

  // Mensagem de Feedback
  if (finalSortedItems.length === 0 && !loading) return <p>Nenhum item corresponde à sua busca.</p>;
  /*<div className='animes-list'><ul className='animes-list-grid'><p>Nenhum item corresponde à sua busca.</p></ul></div>*/

  // Renderização em GRID
  if (displayStyle === 'grid') {
    return (
      <ul className='animes-list-grid'>
        {finalSortedItems.map(item => (
          <li className='animes-item-grid' key={item._id}>
            <AnimesItemGrid
              id={item._id}
              imageUrl={item.imageUrl || "N/A"}
              japoneseTitle={item.name?.japonese || "N/A"}
              englishTitle={item.name?.english || "N/A"}
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
        {finalSortedItems.map(item => (
          <li className='animes-item-list' key={item._id}>
            <AnimesItemList
              id={item._id}
              imageUrl={item.imageUrl || "N/A"}
              japoneseTitle={item.name?.japonese || "N/A"}
              englishTitle={item.name?.english || "N/A"}
              seasons={item.seasons?.length || "-"}
              timeWhatched={item.timeWhatched?.length || "-"}
              score={item.score?.personal || "-"}
              launcheData={seasonInfo(item.date?.launched)}
            />
          </li>
        ))}
      </ul>
    </>
  );
}

function AnimeSidebar({ searchTerm, handleSearchChange, globalData, selectedTags, toggleTags, launchOptions, selectedLaunches, toggleLaunches, addNewAnime }) {
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

        <hr/>

        <div className='animes-sidebar-content'>
          <div className='animes-sidebar-option animes-sidebar-newAnime'>
            <div onClick={ addNewAnime }>
              <span>Adicionar Anime</span>
            </div>
          </div>

          <hr/>

          <CollapsibleMenu
            title={"Gênero"}
            options={globalData?.tags}
            selectedList={selectedTags} // O estado que armazena as chaves
            onToggle={toggleTags}
          />

          <hr/>

          <CollapsibleMenu
            title={"Lançamento"}
            options={launchOptions.map(o => o.displayLabel)} // Passamos o array de filterKey's para o CollapsibleMenu
            selectedList={selectedLaunches} // O estado que armazena as chaves
            onToggle={toggleLaunches}
          />

          <hr/>
          
      </div>
    </div>
  );
}

function CollapsibleMenu({ title, options, selectedList, onToggle }){
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
  AnimeSidebar,
  AnimesItemGrid,
  AnimesItemList
};