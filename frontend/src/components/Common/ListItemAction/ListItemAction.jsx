// src/components/Common/ListItemAction/ListItemAction.jsx
import React from 'react';

function ListItemAction({ iconClass, text, onClick }) {
  return (
    <li className='add-new-item-action' onClick={onClick}>
      <i className={`fa-solid ${iconClass}`}></i> {text}
    </li>
  );
}

export default ListItemAction;