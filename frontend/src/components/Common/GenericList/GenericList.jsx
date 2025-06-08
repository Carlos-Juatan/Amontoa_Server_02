import React from 'react';
import './GenericList.css';

function GenericList({
  items,
  renderItem,
  keyExtractor,
  emptyMessage,
  listTitle,
  listClassName // <--- NOVA PROP AQUI
}) {
  if (!items || items.length === 0) {
    return (
      <div className="generic-list-empty-message">
        {emptyMessage || 'Nenhum item encontrado.'}
      </div>
    );
  }

  return (
    <div className="generic-list-container">
      {listTitle && <h3 className="generic-list-title">{listTitle}</h3>}
      {/* Aplica a classe CSS à tag <ul> */}
      <ul className={`generic-list ${listClassName || ''}`}>
        {items.map((item, index) => (
          <li key={keyExtractor ? keyExtractor(item, index) : index} className="generic-list-item">
            {renderItem(item)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GenericList;