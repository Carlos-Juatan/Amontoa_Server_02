// src/pages/linksScreen/linksScreen.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useDataOperations from '../../hooks/useDataOperations';
import useSearchFilter from '../../hooks/useSearchFilter';

import Button from '../../components/Common/Button/Button';
import SearchBar from '../../components/Common/SearchBar/SearchBar';
import LinksItem from './linksItem';

import './linksScreen.css';

function LinksScreen() {
  // ... Variables ...
  const navigate = useNavigate(); // to navegate between pages
  const { data, loading, error, fetchData } = useDataOperations( 'links-work' ); // to get data from mongoDB
  const { searchTerm, setSearchTerm, filteredItems, handleSearchChange } = useSearchFilter(data, '', ['title', 'tags']); // to filter the 'data'

  // ... Hooks ...
  const handleBackToDashboard = () => { navigate('/'); }; // Navegate back to root (Dashboard)
  const handleSearchTerm = (event) => { handleSearchChange(event); }; // change the research term on the search hook
  const [isEditing, setIsEditing] = useState(false); // used to change the edition mode

  // ... Functions ...
  const toggleEditing = (event) => { setIsEditing(prev => !prev); console.log(`edit mode: ${!isEditing}`);}; // Change between True and False
  const addGroup = (event) => { console.log("adicionando novo grupo"); }; // Add a new group on the list
  const handleOpenLink = (url) => { window.open(url, '_blank'); }; // Open a link on another window on the browser
  const handleOdening = (id, value) => { console.log(`Mudando a posição do item de ID:${id} com o valor: ${value}`); };
  const deleteItem = (id) => { console.log(`Deletando o item de id: ${id}`); };
  const cancelUpdate = (id) => { console.log(`Cancelando atualizando do item de id: ${id}`); };
  const updateItem = (id, data) => { console.log(`Atualizando o item de id: ${id} data: ${data}`); };

  // ... Debug ...
  console.log(`testando a data recebida: tamanho - ${data.length} : conteúdo - ${data}`)

  // ... Display ...
  return (
    <div className="links-screen-container">

      {/* Header */}
      <div className="links-header">
        <Button onClick={handleBackToDashboard} className="back-button">
          <i className="fas fa-arrow-left"></i> Voltar
        </Button>
        <h1 className="links-title">{'Links'}</h1>
      </div>

      {/* Body */}

      {/* SearchBar */}
      <div className='links-research'>
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchTerm}
          placeholder={`Pesquisar em ${'Links'}...`}
        />
      </div>

      {/* Links Container */}
      <div className='links-container'>
        {/* Header */}
        <div className='links-container-header'>
          <div className='links-container-header-tabs'>
            <span className='unselected'>Todos</span>
            <span className='selected'>Acesso Rápido</span>
            <span className='unselected'>Vídeos</span>
          </div>

          <div className='links-container-header-buttons'>
            {!isEditing && (
              <Button onClick={toggleEditing} className='edit-button'>
                <i className="fas fa-pencil"></i>
              </Button>
            )}
            {isEditing && (
              <>
                <Button onClick={addGroup} className='add-button'>
                  <i className="fas fa-plus"></i>
                </Button>
                <Button onClick={toggleEditing} className='cancel-edit-button'>
                  Cancelar
                </Button>
              </>
            )}
          </div>
        </div>
        
        {/* Links */}
        <ul className='links-list'>
          <li className='links-list-item'>
            <LinksItem
              isEditing={isEditing}
              handleOpenLink={handleOpenLink}
              handleOdening={handleOdening}
              deleteItem={deleteItem}
              updateItem={updateItem}
              cancelUpdate={cancelUpdate}
              id={0}
              icon={"fa-solid fa-wrench"}
              title={"Esse título é um título"}
              link={"https://www.google.com"}
              description={"Essa descrição serve para mostrar a descrição"}
            />
          </li>
        </ul>
      </div>
    </div>
  );
}

export default LinksScreen;