// src/pages/AnimesScreen/AnimesComponents.jsx
import React, { useState } from 'react';

import Button from '../../components/Common/Button/Button';
import SearchBar from '../../components/Common/SearchBar/SearchBar';

function AnimesHeader({ onBackClick, title }) {
  return (
    <div className="animes-header">
      <Button onClick={onBackClick} className="back-button">
        <i className="fas fa-arrow-left"></i> Voltar
      </Button>
      <h1 className="animes-title">{title}</h1>
    </div>
  );
}

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
      <i className="fa-solid fa-plus" onClick={addNewCollection}></i>
    </div>
  );
}

function AnimeOrganizationControls({ displaySort, handleSortSelect, handleDisplayStyle }) {
  return (
    <div className='animes-organization'>
      <div className='animes-organization-left'>
        <span>Classificar por:</span>
          <select name="sort" value={displaySort} onChange={handleSortSelect}
          >
            <option value="AZ">Alfabético A-Z</option>
            <option value="ZA">Alfabético Z-A</option>
            <option value="MN">Maior Nota</option>
            <option value="MM">Menor Nota</option>
            <option value="LMR">Lançamento Mais Recente</option>
            <option value="LMA">Lançamento Mais Antigo</option>
            <option value="MMR">Modificação Mais Recente</option>
            <option value="MMA">Modificação Mais Antiga</option>
            <option value="MQE">Maior Quantidades de Episódios</option>
            <option value="MQM">Menor Quantidades de Episódios</option>
          </select>
      </div>
      <div className='animes-organization-right'>
        <i className="fa-solid fa-table-cells-large" onClick={() => handleDisplayStyle('grid')}></i>
        <i className="fa-solid fa-list-ul" onClick={() => handleDisplayStyle('list')}></i>
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

function AnimeSidebar({ searchTerm, handleSearchChange, globalData, selectedTags, toggleTags, launchOptions, selectedLaunches, toggleLaunches }) {
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

      <div className='animes-sidebar-content'>
        <div className='animes-sidebar-option'>
          <div onClick={ () => undefined }>
            <span>Adicionar Anime</span>
          </div>
        </div>

        <CollapsibleMenu
          title={"Gênero"}
          options={globalData?.tags}
          selectedList={selectedTags} // O estado que armazena as chaves
          onToggle={toggleTags}
        />

        <CollapsibleMenu
          title={"Lançamento"}
          options={launchOptions.map(o => o.displayLabel)} // Passamos o array de filterKey's para o CollapsibleMenu
          selectedList={selectedLaunches} // O estado que armazena as chaves
          onToggle={toggleLaunches}
        />
          
      </div>
    </div>
  );
}

function CollapsibleMenu({ title, options, selectedList, onToggle }){
  const [hasOpen, setHasOpen] = useState(false);
  const toggleHasOpen = () => setHasOpen(!hasOpen);

  return (
    <div className='animes-sidebar-option'>
      <div onClick={toggleHasOpen}>
        <span>{title}</span>
        <span>{hasOpen ? '▲' : '▼'}</span>
      </div>

      {hasOpen && (
        <div className="opcoes">
          {options.map(option => {
            const isSelected = selectedList.includes(option);
            return (
              <div key={option} onClick={() => onToggle(option)}>
                {option}
                {isSelected ? '✔ ' : ''}
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
  AnimesHeader,
  AnimeCollectionsFilter,
  AnimeOrganizationControls,
  AnimeDisplayList,
  AnimeSidebar,
  AnimesItemGrid,
  AnimesItemList
};