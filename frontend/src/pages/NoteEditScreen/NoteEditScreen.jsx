// src/pages/NoteEditScreen/NoteEditScreen.jsx
import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useDataOperations from '../../hooks/useDataOperations';
import useLessonForm from '../../hooks/useLessonForm'; // NOVO HOOK
import useEditNoteModal from '../../hooks/useEditNoteModal';

import Button from '../../components/Common/Button/Button';
import Header from '../../components/StudiesScreen/Header/Header';
import NoteEditMain from './NoteEditMain';
import EditModal from '../../components/Common/Modal/EditModal/EditModal';

import './NoteEditScreen.css';
import styles from './NoteEditScreenElements.module.css';

function NoteEditScreen() {
  const navigate = useNavigate(); // Sistema de navegação de telas
  const { collectionName, studies_id, lesson_id } = useParams(); // Informações pegas na url da página


  // ------------------- COLETANDO DADOS DO BANCO DE DADOS -------------------------------------

  const initialDataPath = lesson_id !== '0' ? `${collectionName}/${lesson_id}` : null; // Caminho para pegar as anotações da aula selecionada
  const { data: lessonData, loading: lessonLoading, error: lessonError, createRecord, updateRecord,  isMutating, mutationError, fetchData: refetchLessonData, } = useDataOperations(initialDataPath);
  
  const { data: studiesNoteData } = useDataOperations('studies/' + studies_id); // Dados do curso selecionado ( Anotações da PromovaWeb - DevOps )


  // ------------------- DADOS USADOS PARA VALIDAÇÕES E VERIFICAÇÕES -------------------------------------

  const [hasEditedData, setHasEditedData] = useState(false); // Verifica se os dados do foram modificados para habilitar o botão de 'submit'

  const [availableModules, setAvailableModules] = useState([]);
  const [availableSubmodules, setAvailableSubmodules] = useState([]);

  const [noteIndex, setNoteIndex] = useState(); // id para a anotação sendo modificada atualmente.


  // -------------------  usando o novo hook uselessonform -------------------------------------
  const {
    currentData,
    moduleName,
    handleSetModuleName,
    submoduleName,
    handleSetSubmoduleName,
    lessonTitle,
    handleSetLessonTitle,
    isNewModule,
    handleSetIsNewModule,
    isNewSubmodule,
    handleSetIsNewSubmodule,
    handleAddNote,
    handleUpdateNote,
    handleDeleteNote,
    resetForm,
    lessonFormValid // Estado de validação do formulário principal
  } = useLessonForm(lessonData, lesson_id, availableModules, availableSubmodules, setHasEditedData);


  // -------------------  FUNÇÕES DE NAVEGAÇÃO DE TELA -------------------------------------

  const handleBackToStudies = useCallback(() => {
    navigate(`/studies/${collectionName}/${studies_id}`);
  }, [navigate, collectionName, studies_id]);

  const handleCancel = useCallback(() => {
    resetForm(); // Usa a função de reset do hook
    navigate(`/studies/${collectionName}/${studies_id}`);
  }, [navigate, collectionName, studies_id, resetForm]);


  // -------------------  FUNÇÃO DE CONFIRMAR E SALVAR DADOS NO BANCO DE DADOS  -------------------------------------

  const handleSubimit = useCallback(async () => {
    const isNewRecord = lesson_id === '0';

    const itemToSave = {
      "module": moduleName,
      "submodule": submoduleName,
      "title": lessonTitle,
      "notes": currentData
    };

    try {
      let result;
      if (isNewRecord) {
        result = await createRecord(collectionName, itemToSave);
        if (result && result.id) {
          navigate(`/edit/${collectionName}/${studies_id}/${result.id}`);
        } else {
          navigate(`/studies/${collectionName}/${studies_id}`);
        }
      } else {
        result = await updateRecord(collectionName, lesson_id, itemToSave);
        await refetchLessonData(initialDataPath);
        navigate(`/studies/${collectionName}/${studies_id}`);
      }
      console.log("Confirmação e salvamento bem-sucedidos: ", result);
      setHasEditedData(false); // Reseta o estado de edição após salvar
    } catch (err) {
      console.error("Erro na operação de submissão:", err);
    }
  }, [currentData, lesson_id, collectionName, createRecord, updateRecord, refetchLessonData, initialDataPath, navigate, moduleName, submoduleName, lessonTitle, studies_id]);


  // -------------------  FUNÇÕES DE MANIPULAÇÃO DOS MODAIS  -------------------------------------
  const { isModalOpen, modalType, modalItem, handleOpenModel, handleCloseModel, handleModalSubmit } = useEditNoteModal( noteIndex, setNoteIndex, handleAddNote, handleUpdateNote );

  return (
    <div className="note-edit-screen-container">
      <Header
        className="note-edit-header"
        onBackToStudies={handleBackToStudies}
        icon={studiesNoteData?.icon}
        title={studiesNoteData?.title}
      >
        <Button onClick={handleSubimit} className='note-edit-header-button-submit' disabled={!hasEditedData || isMutating}>Confirmar</Button>
        <Button onClick={() => handleOpenModel()} className='note-edit-header-button-add'>Adicionar</Button>
        <Button onClick={handleCancel} className='note-edit-header-button-cancel'>Cancelar</Button>
      </Header>

      <NoteEditMain
        collectionName={collectionName}

        currentData={currentData}

        // Todos os dados das anotações do curso selecionado ( Anotações da PromovaWeb - DevOps )
        lessonData={lessonData}
        lessonLoading={lessonLoading}
        lessonError={lessonError}

        // Dados disponiveis de todos os módulos e submodulos que existem no curso selecionado
        availableSubmodules={availableSubmodules}
        setAvailableSubmodules={setAvailableSubmodules}
        availableModules={availableModules}
        setAvailableModules={setAvailableModules}

        // Dados do topo - Configuração de nomes Módulo, Submódulo e aula
        lessonTitle={lessonTitle}
        handleSetLessonTitle={handleSetLessonTitle}
        submoduleName={submoduleName}
        handleSetSubmoduleName={handleSetSubmoduleName}
        moduleName={moduleName}
        handleSetModuleName={handleSetModuleName}

        // Verificação se são módulos e submódulos novos ou não
        isNewModule={isNewModule}
        handleSetIsNewModule={handleSetIsNewModule}
        isNewSubmodule={isNewSubmodule}
        handleSetIsNewSubmodule={handleSetIsNewSubmodule}

        // Verificação de slavamento de dados no banco de dados
        isMutating={isMutating}

        // ------------------- PROPS PARA MODAIS ------------------------------------------------
        handleOpenModel={handleOpenModel}
        // --------------------------------------------------------------------------------------

        // Verificação se os dados das anotações foram mudados
        hasEditedData={hasEditedData}

        // Métodos para cancelar e salvar os dados no banco de dados
        handleSubimit={handleSubimit}
        handleCancel={handleCancel}

        // Método para remover os dados das anotações
        handleDeleteNote={handleDeleteNote}
      >
      </NoteEditMain>

      <EditModal
        isOpen={isModalOpen}
        onClose={handleCloseModel}
        modalType={modalType}
        handleSubimit={handleModalSubmit}
        item={modalItem}
        isMutating={isMutating}
        mutationError={mutationError}
        moduleTile={moduleName}
        submoduleTitle={submoduleName}
        lessonTitle={lessonTitle}
        listLenth={currentData?.length || 0}
        noteIndex={noteIndex}
      >
      </EditModal>

    </div>
  );
}

export default NoteEditScreen;