
import React, { useCallback, useState, useEffect } from 'react';

import useDataOperations from '../../hooks/useDataOperations';

import MainContent from '../../components/StudiesScreen/MainContent/MainContent'
import Button from '../../components/Common/Button/Button';

import styles from './NoteEditScreenElements.module.css';

function NoteEditMain({
  collectionName,

  currentData,

  // Todos os dados das anotações do curso selecionado ( Anotações da PromovaWeb - DevOps )
  lessonData,
  lessonLoading,
  lessonError,

  // Dados disponiveis de todos os módulos e submodulos que existem no curso selecionado
  availableSubmodules,
  setAvailableSubmodules,
  availableModules,
  setAvailableModules,

  lessonTitle,
  handleSetLessonTitle,
  submoduleName,
  handleSetSubmoduleName,
  moduleName,
  handleSetModuleName,

  isNewModule,
  handleSetIsNewModule,
  isNewSubmodule,
  handleSetIsNewSubmodule,

  isMutating,

  handleSubimit,
  handleCancel,

  hasEditedData,

  handleDeleteNote,
}) {

  const {
    data: allLessonsData,
    loading: allLessonsLoading,
    fetchData: fetchAllLessons,
    error: allLessonsError,
  } = useDataOperations(collectionName);

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

  return (
    <>
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
    </>
  );
}

export default NoteEditMain;