// src/pages/AnimesScreen/AnimesStructures.jsx
import React, { useState, useEffect } from 'react';

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
  AnimesItemGrid,
  AnimesItemList,
  CollapsibleMenu
};