// src/components/ComingSoonScreen/ComingSoonScreen.jsx
import React, { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useDataOperations from '../../hooks/useDataOperations';

import useNoteActions from '../../hooks/useNoteActions';

import Button from '../../components/Common/Button/Button';
import Header from '../../components/StudiesScreen/Header/Header';
import MainContent from '../../components/StudiesScreen/MainContent/MainContent';

import './NoteEditScreen.css';

function NoteEditScreen() {
  const navigate = useNavigate(); // Hook para navegação

  const { collectionName, studies_id, lesson_id } = useParams(); // Parametros passados pela url
  const { data: studiesNoteData } = useDataOperations('studies/' + studies_id); // Item escolhido na tela studies
  
  const {
    data,
    loading,
    error,
    createRecord,      // <--- Funções de CRUD expostas
    updateRecord,
    deleteRecord,
    isMutating,        // <--- Estados de mutação expostos
    mutationError,
    fetchData: refetchData, // <--- Função de re-sincronização exposta
  } = useDataOperations(`${collectionName}/${lesson_id}`); 

  const [currentData, setCurrentData] = useState([]);

  const handleBackToStudies = () => {
    navigate(`/studies/${collectionName}/${studies_id}`); // Navega de volta para tela de lista de anotações (studiesScreen)
  };
  
  const handleEdit = () => {
    
  };
  
  const handleDelet = () => {
    
  };

  const handleSubimit = () => {
    
  };
  
  const handleCancel = () => {
    
  };

  return (
    <div className="note-edit-screen-container">
      <Header className="note-edit-header"
        onBackToStudies={handleBackToStudies}
        icon={studiesNoteData.icon}
        title={studiesNoteData.title}
      >
        <Button onClick={handleSubimit} className='note-edit-header-button-submit' disabled={currentData.length === 0 }>Confirmar</Button>
        <Button onClick={handleCancel} className='note-edit-header-button-cancel'>Cancelar</Button>
      </Header>
      
      <div className="note-edit-main-content">
        <MainContent 
        currentLesson={data} 
        buttonSection={
          <>
          <Button onClick={handleEdit} className='action-icon-edit'><i className="fas fa-pencil-alt"></i></Button>
          <Button onClick={handleDelet} className='action-icon-delete'><i className="fas fa-trash-alt"></i></Button>
          </>
        }
        >
          <Button onClick={handleSubimit} className='note-edit-header-button-submit' disabled={currentData.length === 0}>Confirmar</Button>
          <Button onClick={handleCancel} className='note-edit-header-button-cancel'>Cancelar</Button>
        </MainContent>
      </div>
      
    </div>

  );
}

export default NoteEditScreen;