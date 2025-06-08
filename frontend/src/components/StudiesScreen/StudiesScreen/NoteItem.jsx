// src/components/StudiesScreen/NoteItem.jsx
import React from 'react';
import './NoteItem.css';

function NoteItem({ title, description, icon, onClick }) {
  return (
    <div className="note-item" onClick={onClick}>
      <div className="note-item-icon-container">
        <i className={`${icon} note-item-icon`}></i>
      </div>
      <div className="note-item-content">
        <h3 className="note-item-title">{title}</h3>
        <p className="note-item-description">{description}</p>
      </div>
      <i className="fas fa-chevron-right note-item-arrow"></i>
    </div>
  );
}

export default NoteItem;
