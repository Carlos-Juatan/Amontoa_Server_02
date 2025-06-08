// src/components/Common/SearchBar.jsx
import React from 'react';
import './SearchBar.css';

function SearchBar({ searchTerm, onSearchChange, placeholder, className = '' }) {
  return (
    <div className={`search-bar-container ${className}`}>
      <i className="fas fa-search search-icon"></i>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={onSearchChange}
        className="search-input"
      />
      {searchTerm && (
        <button className="clear-search-button" onClick={() => onSearchChange('')}>
          <i className="fas fa-times-circle"></i>
        </button>
      )}
    </div>
  );
}

export default SearchBar;