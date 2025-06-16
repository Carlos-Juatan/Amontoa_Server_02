// src/pages/NoteEditScreen/NoteEditScreen.jsx
import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useDataOperations from '../../hooks/useDataOperations';
import useLessonForm from '../../hooks/useLessonForm'; // NOVO HOOK

import Button from '../../components/Common/Button/Button';
import Header from '../../components/StudiesScreen/Header/Header';
import NoteEditMain from './NoteEditMain';
import EditModal from '../../components/Common/Modal/EditModal/EditModal';

import './NoteEditScreen.css';
import styles from './NoteEditScreenElements.module.css';

function NoteEditScreen() {
  const navigate = useNavigate();
  const { collectionName, studies_id, lesson_id } = useParams();
  const { data: studiesNoteData } = useDataOperations('studies/' + studies_id);

  const initialDataPath = lesson_id !== '0' ? `${collectionName}/${lesson_id}` : null;

  const {
    data: lessonData,
    loading: lessonLoading,
    error: lessonError,
    createRecord,
    updateRecord,
    isMutating,
    fetchData: refetchLessonData,
  } = useDataOperations(initialDataPath);

  const [hasEditedData, setHasEditedData] = useState(false);
  // ----------------------------------------

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalItem, setModalItem] = useState();
  const [modalIndex, setModalIndex] = useState();

  const [availableModules, setAvailableModules] = useState([]);
  const [availableSubmodules, setAvailableSubmodules] = useState([]);

  // --- Usando o novo hook useLessonForm ---
  const {
    currentData,
    setCurrentData, // Apenas se precisar manipular currentData diretamente
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



  const handleBackToStudies = useCallback(() => {
    navigate(`/studies/${collectionName}/${studies_id}`);
  }, [navigate, collectionName, studies_id]);

  const handleCancel = useCallback(() => {
    resetForm(); // Usa a função de reset do hook
    navigate(`/studies/${collectionName}/${studies_id}`);
  }, [navigate, collectionName, studies_id, resetForm]);

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

  const handleOpenModel = useCallback((item = null, index = null) => { // Ajustado para default null
    setIsModalOpen(true);
    setModalItem(item);
    setModalIndex(index);
    setModalType(item?.type || ''); // Define o tipo para 'add' se não houver item
  }, []);

  const handleCloseModel = useCallback(() => {
    setIsModalOpen(false);
    setModalType('');
    setModalItem(null);
    setModalIndex(null);
  }, []);

  const handleModalSubmit = useCallback(async (selectedTypeFromModal, formDataFromModal, uploadFileFunc) => {
    try {
      const lastModalFormType = selectedTypeFromModal;

      // Se o tipo for imagem e houver um arquivo selecionado, tenta fazer o upload
      if (selectedTypeFromModal === 'image' && uploadFileFunc) {
        await uploadFileFunc(); // Executa o upload através da função passada
      }

      if (modalIndex === null) {
        handleAddNote(formDataFromModal);
      } else {
        handleUpdateNote(modalIndex, formDataFromModal);
      }
      // Se estiver modificando um item fecha o modal e se estiver adicionando novos continua aberto
      if(modalIndex) handleCloseModel();
      
    } catch (error) {
      console.error("Erro ao submeter modal (incluindo upload):", error);
      // Aqui você pode adicionar lógica para mostrar uma mensagem de erro ao usuário
    }
  }, [modalIndex, handleAddNote, handleUpdateNote, handleCloseModel]);

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

        lessonData={lessonData}
        lessonLoading={lessonLoading}
        lessonError={lessonError}

        availableSubmodules={availableSubmodules}
        setAvailableSubmodules={setAvailableSubmodules}
        availableModules={availableModules}
        setAvailableModules={setAvailableModules}

        lessonTitle={lessonTitle}
        handleSetLessonTitle={handleSetLessonTitle}
        submoduleName={submoduleName}
        handleSetSubmoduleName={handleSetSubmoduleName}
        moduleName={moduleName}
        handleSetModuleName={handleSetModuleName}

        isNewModule={isNewModule}
        handleSetIsNewModule={handleSetIsNewModule}
        isNewSubmodule={isNewSubmodule}
        handleSetIsNewSubmodule={handleSetIsNewSubmodule}

        isMutating={isMutating}

        handleSubimit={handleSubimit}
        handleCancel={handleCancel}

        hasEditedData={hasEditedData}

        handleDeleteNote={handleDeleteNote}
      />
    </div>
  );
}

export default NoteEditScreen;