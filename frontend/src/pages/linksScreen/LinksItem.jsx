// src/pages/linksScreen/linksItem.jsx
import React, { useState, useEffect } from 'react';

import Button from '../../components/Common/Button/Button';

function LinksItem({ isEditing, handleOpenLink, handleOdening, deleteItem, updateItem, id, icon, title, link, description }) {
  // ... Hooks ...
  const [canEdit, setCanEdit] = useState(false); // ---------------------- Novo para o modo de edição 
  const [editTitle, setEditTitle] = useState(title);
  const [editLink, setEditLink] = useState(link);
  const [editDescription, setEditDescription] = useState(description);
  useEffect(() => { if(!isEditing && canEdit) { setCanEdit(false); } }, [isEditing, canEdit]); // Reseta o modo de edição caso o modo global de edição esteja desativado

  // ... Functions ...
  const resetLocalState = () => { setEditTitle(title); setEditLink(link); setEditDescription(description); }; // Função para resetar os valores do item
  const changeEditMode = (value) => { setCanEdit(value); }; // Função para mudar o item de modo de edição

  return (
    <div 
      className={`links-list-item-card ${!canEdit ? 'isntEditMode' : ''}`}
      onClick={!isEditing ? () => handleOpenLink(link) : () => {if(!canEdit) {changeEditMode(true)}; }}
    >
      <div className='links-card-icon-container'>
        <i className={`${icon} links-card-icon`}></i>
      </div>
      <div className='links-card-info'>
        {!canEdit ? <>
          <h3 className='links-card-info-title'>{title}</h3>
          <p className='links-card-info-link'>{link}</p>
          <p className='links-card-info-description'>{description}</p>
        </> : <>
          <input className='links-card-info-title-input' type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)}/>
          <input className='links-card-info-link-input' type="text" value={editLink} onChange={(e) => setEditLink(e.target.value)}/>
          <input className='links-card-info-description-input' type="text" value={editDescription} onChange={(e) => setEditDescription(e.target.value)}/>
        </>}
      </div>
      <div className='links-card-buttons'>
        {!canEdit ? <>
          <i className="fas fa-chevron-right links-card-arrow"></i>
        </> : <>
          <div className='links-card-buttons-ordening'>
            <Button onClick={() => handleOdening(id, -1)} className="up-button">
              <i className="fa-solid fa-caret-up"></i>
            </Button>
            <Button onClick={() => handleOdening(id, 1)} className="down-button">
              <i className="fa-solid fa-caret-down"></i>
            </Button>
          </div>
          <div className='links-card-buttons-managers'>
            <Button onClick={() => deleteItem(id)} className="delete-button">
              <i className="fa-solid fa-trash"></i>
            </Button>
            <div className='links-card-buttons-managers-data'>
              <Button onClick={() => { updateItem(id, { title: editTitle, link: editLink, description: editDescription }); changeEditMode(false); }} className="update-button">Atualizar</Button>
              <Button onClick={() => { resetLocalState(); changeEditMode(false); }} className="cancel-button">Cancelar</Button>
            </div>
          </div>
        </>}
      </div>
    </div>
  );
}

export default LinksItem;