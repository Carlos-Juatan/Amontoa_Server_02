// src/pages/NoteEditScreen/NoteEditScreen.jsx
import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useDataOperations from '../../hooks/useDataOperations';
import useLessonForm from '../../hooks/useLessonForm'; // NOVO HOOK

import Button from '../../components/Common/Button/Button';
import Header from '../../components/StudiesScreen/Header/Header';
import MainContent from '../../components/StudiesScreen/MainContent/MainContent';
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
    mutationError,
    fetchData: refetchLessonData,
  } = useDataOperations(initialDataPath);

  const {
    data: allLessonsData,
    loading: allLessonsLoading,
    error: allLessonsError,
    fetchData: fetchAllLessons,
  } = useDataOperations(collectionName);

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

  // Efeito para buscar todos os módulos e submódulos no carregamento inicial
  useEffect(() => {
    fetchAllLessons();
  }, [fetchAllLessons]);

  // Efeito para popular os dropdowns com base nos dados carregados
  useEffect(() => {
    if (allLessonsData && Array.isArray(allLessonsData)) {
      const modules = [...new Set(allLessonsData.map(item => item.module).filter(Boolean))];
      setAvailableModules(modules.sort());

      if (moduleName && modules.includes(moduleName)) {
        const submodules = [
          ...new Set(
            allLessonsData
              .filter(item => item.module === moduleName)
              .map(item => item.submodule)
              .filter(Boolean)
          )
        ];
        setAvailableSubmodules(submodules.sort());
      } else {
        setAvailableSubmodules([]);
      }
    }
  }, [allLessonsData, moduleName]);

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
      // Se o tipo for imagem e houver um arquivo selecionado, tenta fazer o upload
      if (selectedTypeFromModal === 'image' && uploadFileFunc) {
        await uploadFileFunc(); // Executa o upload através da função passada
      }

      if (modalIndex === null) {
        handleAddNote(formDataFromModal);
      } else {
        handleUpdateNote(modalIndex, formDataFromModal);
      }
      handleCloseModel();
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

      <div className={styles['lesson-details-form-container']}>
        <h2>Detalhes da Aula</h2>

        {/* --- CAMPO MÓDULO --- */}
        <div className={styles['form-group']}>
          <label htmlFor="module-name">Módulo:</label>
          {isNewModule ? (
            <input
              id="module-name"
              type="text"
              value={moduleName}
              onChange={(e) => handleSetModuleName(e.target.value)}
              placeholder="Novo Nome do Módulo"
              className={styles['form-input']}
            />
          ) : (
            <select
              id="module-name"
              value={moduleName}
              onChange={(e) => {
                handleSetModuleName(e.target.value);
                handleSetIsNewSubmodule(false); // Garante que o submódulo volte a selecionar existente
              }}
              className={styles['form-input']}
              disabled={allLessonsLoading}
            >
              <option value="">Selecione um Módulo</option>
              {availableModules.map(mod => (
                <option key={mod} value={mod}>{mod}</option>
              ))}
            </select>
          )}
          <Button
            type="button"
            onClick={() => handleSetIsNewModule(!isNewModule)}
            className={styles['toggle-input-button']}
          >
            {isNewModule ? 'Selecionar Módulo Existente' : 'Adicionar Novo Módulo'}
          </Button>
        </div>
        {/* ------------------- */}

        {/* --- CAMPO SUBMÓDULO --- */}
        <div className={styles['form-group']}>
          <label htmlFor="submodule-name">Submódulo:</label>
          {isNewSubmodule ? (
            <input
              id="submodule-name"
              type="text"
              value={submoduleName}
              onChange={(e) => handleSetSubmoduleName(e.target.value)}
              placeholder="Novo Nome do Submódulo"
              className={styles['form-input']}
            />
          ) : (
            <select
              id="submodule-name"
              value={submoduleName}
              onChange={(e) => handleSetSubmoduleName(e.target.value)}
              className={styles['form-input']}
              disabled={!moduleName || allLessonsLoading}
            >
              <option value="">Selecione um Submódulo</option>
              {availableSubmodules.map(submod => (
                <option key={submod} value={submod}>{submod}</option>
              ))}
            </select>
          )}
          <Button
            type="button"
            onClick={() => handleSetIsNewSubmodule(!isNewSubmodule)}
            className={styles['toggle-input-button']}
            disabled={!moduleName}
          >
            {isNewSubmodule ? 'Selecionar Submódulo Existente' : 'Adicionar Novo Submódulo'}
          </Button>
        </div>
        {/* ---------------------- */}

        {/* --- CAMPO TÍTULO DA AULA --- */}
        <div className={styles['form-group']}>
          <label htmlFor="lesson-title">Título da Aula:</label>
          <input
            id="lesson-title"
            type="text"
            value={lessonTitle}
            onChange={(e) => handleSetLessonTitle(e.target.value)}
            placeholder="Título da Aula"
            className={styles['form-input']}
          />
        </div>
        {/* ---------------------------- */}
      </div>

      <div className="note-edit-main-content">
        {(lessonLoading) || allLessonsLoading ? (
          <p>Carregando dados...</p>
        ) : lessonError || allLessonsError ? (
          <p>Erro ao carregar dados: {lessonError?.message || allLessonsError?.message}</p>
        ) : (
          <MainContent
            title={lessonTitle}
            currentLesson={{ ...lessonData, notes: currentData }}
            buttonSection={(item, index) => (
              <>
                <Button onClick={() => handleOpenModel(item, index)} className='action-icon-edit'><i className="fas fa-pencil-alt"></i></Button>
                <Button onClick={() => handleDeleteNote(index)} className='action-icon-delete'><i className="fas fa-trash-alt"></i></Button>
              </>
            )}
            stylesNoteElementClassName={styles['note-element']}
            stylesDisplayButtonsClassName={`${styles['lesson-notes-display-buttons']}`}
          >
            <Button onClick={handleSubimit} className='note-edit-header-button-submit' disabled={!hasEditedData || isMutating}>Confirmar</Button>
            <Button onClick={() => handleOpenModel(null, null)} className='note-edit-header-button-add'>Adicionar</Button>
            <Button onClick={handleCancel} className='note-edit-header-button-cancel'>Cancelar</Button>
          </MainContent>
        )}
      </div>

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
        modalIndex={modalIndex}
      />
    </div>
  );
}

export default NoteEditScreen;