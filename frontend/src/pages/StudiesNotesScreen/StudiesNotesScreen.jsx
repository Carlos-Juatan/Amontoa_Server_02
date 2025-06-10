// src/components/StudiesScreen/NoteDetailScreen/StudiesNotesScreen.jsx
import React, { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useDataOperations from '../../hooks/useDataOperations'; // Sua única fonte de dados
import useSearchFilter from '../../hooks/useSearchFilter';
import useSelectionIndex from '../../hooks/useSelectionIndex';

import useNoteActions from '../../hooks/useNoteActions'; // Este hook agora RECEBE as dependências
import useModelActions from '../../hooks/useModelActions';

import Header from './Header/Header';
import Sidebar from './Sidebar/Sidebar';
import MainContent from './MainContent/MainContent';
import ActionModal from '../../components/Common/Modal/ActionModal/ActionModal';

import './StudiesNotesScreen.css';

function StudiesNotesScreen() {
  const navigate = useNavigate(); // Hook para navegação
  const { collectionName, studies_id } = useParams(); // Parametros passados pela url
  const { data: noteData } = useDataOperations('studies/' + studies_id); // Item escolhido na tela studies

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
  } = useDataOperations(collectionName); 

  const { searchTerm, setSearchTerm, filteredItems, handleSearchChange } = useSearchFilter(data, '', ['module', 'submodule', 'title']);
  const { currentIndex, setCurrentIndex, selectedObject, handleNext, handlePrev, handleItemSelect } = useSelectionIndex(filteredItems);

  const { isModalOpen, modalType, modalItem, onClose, handleModelEdit, handleModelDelete } = useModelActions();

  // useNoteActions não cria sua própria instância de useDataOperations
  const { handleEditName, handleAddOrEdit, handleDelete } = useNoteActions(
    createRecord,
    updateRecord,
    deleteRecord,
    refetchData, // Passa a função fetchData da instância principal
    isMutating,  // Passa o isMutating da instância principal
    mutationError // Passa o mutationError da instância principal
  );

  //const handleBackToStudies = useCallback(() => {
  ////  navigateTo('studiesScreen', { db_collection: 'studies' });
  //}, [navigateTo]);

  //const handleNoteEditScreen = useCallback((lessonData) => {
  //  //navigateTo('noteEditScreen', { noteData: noteData, lessonData: lessonData });
  //}, [navigateTo]);
  
  const handleBackToStudies = () => {
    navigate('/studies'); // Navega de volta para tela de lista de anotações (studiesScreen)
  };
  
  const handleNoteEditScreen = (lessonData) => {
    if (lessonData)
      navigate(`/studies/edit/${collectionName}/${studies_id}/${lessonData._id}`); // Navega para tela de edição de anotações (noteEditScreen)
    else
      navigate(`/studies/edit/${collectionName}/${studies_id}/0`);
  };

  const handleEditNameWrapper = useCallback(async (formData) => {
    try {
      // Chama a função real de deleção que veio do useNoteActions (que usa deleteRecord da instância principal)
      const result = await handleEditName(formData);
      // Após o sucesso, re-busque os dados para atualizar a tela
      await refetchData(collectionName); // CHAMA O fetchData DA INSTÂNCIA PRINCIPAL
      onClose();
      return result;
    } catch (err) {
      console.error("Erro na operação de renomerar:", err);
    }
  }, [handleEditName, refetchData, collectionName, mutationError, onClose]);

  // --- Funções Wrapper para Delete ---
  const handleDeleteWrapper = useCallback(async (formData) => {
    try {
      // Chama a função real de deleção que veio do useNoteActions (que usa deleteRecord da instância principal)
      const result = await handleDelete(formData);
      // Após o sucesso, re-busque os dados para atualizar a tela
      await refetchData(collectionName); // CHAMA O fetchData DA INSTÂNCIA PRINCIPAL
      onClose();
      return result;
    } catch (err) {
      console.error("Erro na operação de deletar:", err);
    }
  }, [handleDelete, refetchData, collectionName, mutationError, onClose]);


  if (loading) return <div className="studies-message">Carregando Anotações de Estudos...</div>;
  if (error) return <div className="studies-message error">{error}</div>;

  return (
    <div className="note-detail-screen-container">
      <Header className="note-detail-header"
        onBackToStudies={handleBackToStudies}
        icon={noteData.icon}
        title={noteData.title}
        filteredItems={filteredItems}
        currentIndex={currentIndex}
        onPrev={handlePrev}
        onNext={handleNext}
      />

      <div className="note-detail-main-content">
        <Sidebar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          filteredItems={filteredItems}
          currentLesson={selectedObject}
          dbCollection={noteData.db_collection}
          onItemSelect={handleItemSelect}

          onAddOrEdit={handleNoteEditScreen}
          onModelEdit={handleModelEdit}
          onModelDelete={handleModelDelete}
        />


        <MainContent
          currentLesson={selectedObject}
          currentIndex={currentIndex}
          filteredItems={filteredItems}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </div>

      <ActionModal
        isOpen={isModalOpen}
        modalType={modalType}
        item={modalItem}
        onClose={onClose}
        onEditName={handleEditNameWrapper}
        onDelete={handleDeleteWrapper}
        isMutating={isMutating} // Passa o estado de mutação da instância principal
        mutationError={mutationError} // Passa o erro de mutação da instância principal
      />
    </div>
  );
}

export default StudiesNotesScreen;