// src/components/ComingSoonScreen/ComingSoonScreen.jsx
import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useDataOperations from '../../hooks/useDataOperations';

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
    data: lessonData, // Renomeado 'data' para 'lessonData' para evitar conflito
    loading: lessonLoading,
    error: lessonError,
    createRecord,
    updateRecord,
    isMutating,
    mutationError,
    fetchData: refetchLessonData,
  } = useDataOperations(initialDataPath);

  // --- NOVO HOOK PARA BUSCAR TODOS OS MÓDULOS/SUBMÓDULOS EXISTENTES ---
  const {
    data: allLessonsData, // Contém todos os dados da coleção (módulos, submódulos)
    loading: allLessonsLoading,
    error: allLessonsError,
    fetchData: fetchAllLessons,
  } = useDataOperations(collectionName); // Busca a coleção inteira
  // -------------------------------------------------------------------

  // --- DADOS USADOS PARA MODIFICAR O BANCO DE DATADOS ---
  const [currentData, setCurrentData] = useState([]);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [hasEditedData, setHasEditedData] = useState(false);

  // --- DADOS USADOS NO MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalItem, setModalItem] = useState();
  const [modalIndex, setModalIndex] = useState();

  // --- ESTADOS PARA MODULE, SUBMODULE E TITLE DA AULA ---
  const [moduleName, setModuleName] = useState('');
  const [submoduleName, setSubmoduleName] = useState('');
  const [lessonTitle, setLessonTitle] = useState('');

  // --- NOVOS ESTADOS PARA CONTROLE DE INPUT/DROPDOWN ---
  const [isNewModule, setIsNewModule] = useState(false);
  const [isNewSubmodule, setIsNewSubmodule] = useState(false);
  // ---------------------------------------------------

  // --- ESTADOS PARA OS DROPDOWNS DE MÓDULOS E SUBMÓDULOS ---
  const [availableModules, setAvailableModules] = useState([]);
  const [availableSubmodules, setAvailableSubmodules] = useState([]);
  // -------------------------------------------------------

  // Efeito para buscar todos os módulos e submódulos no carregamento inicial
  useEffect(() => {
    fetchAllLessons();
  }, [fetchAllLessons]);

  // Efeito para popular os dropdowns com base nos dados carregados
  useEffect(() => {
    if (allLessonsData && Array.isArray(allLessonsData)) {
      const modules = [...new Set(allLessonsData.map(item => item.module).filter(Boolean))];
      setAvailableModules(modules.sort()); // Garante ordem alfabética

      // Se um módulo já estiver selecionado, filtra os submódulos para ele
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
        setAvailableSubmodules([]); // Limpa se nenhum módulo válido selecionado
      }
    }
  }, [allLessonsData, moduleName]); // Depende de allLessonsData e moduleName

  // Use useEffect para inicializar currentData E os novos estados (moduleName, submoduleName, lessonTitle)
  useEffect(() => {
    if (lessonData) {
      if (Array.isArray(lessonData.notes) && !initialDataLoaded) {
        setCurrentData(lessonData.notes);
        setModuleName(lessonData.module || '');
        setSubmoduleName(lessonData.submodule || '');
        setLessonTitle(lessonData.title || '');

        // Define se é um novo módulo/submódulo com base nos dados carregados
        // Se o módulo/submódulo da aula não existir nas listas de disponíveis, assume que é novo
        if (lessonData.module && !availableModules.includes(lessonData.module)) {
          setIsNewModule(true);
        }
        if (lessonData.submodule && !availableSubmodules.includes(lessonData.submodule)) {
          setIsNewSubmodule(true);
        }

        setInitialDataLoaded(true);
      }
    } else if (lesson_id === '0') {
      setCurrentData([]);
      setModuleName('');
      setSubmoduleName('');
      setLessonTitle('');
      setIsNewModule(false); // Por padrão, começa selecionando um existente
      setIsNewSubmodule(false); // Por padrão, começa selecionando um existente
      setInitialDataLoaded(true);
    }
  }, [lessonData, lesson_id, initialDataLoaded, availableModules, availableSubmodules]);

  // Função para marcar que algo foi editado, incluindo os novos campos
  const handleSetEdited = useCallback(() => {
    if (!hasEditedData) {
      setHasEditedData(true);
    }
  }, [hasEditedData]);

  const handleBackToStudies = () => {
    navigate(`/studies/${collectionName}/${studies_id}`);
  };

  const handleDelet = useCallback((item, index) => {
    console.log('Deletando item recebido :', item._id, 'index: ', index);
    const updatedNotes = currentData.filter((_, i) => i !== index);
    setCurrentData(updatedNotes);
    handleSetEdited(); // Marca como editado
  }, [currentData, handleSetEdited]);

  const handleCancel = useCallback(() => {
    console.log('Cancelar edição');
    setCurrentData([]);
    setModuleName('');
    setSubmoduleName('');
    setLessonTitle('');
    setIsNewModule(false);
    setIsNewSubmodule(false);
    setHasEditedData(false); // Reseta o estado de edição
    navigate(`/studies/${collectionName}/${studies_id}`);
  }, [navigate, collectionName, studies_id]);

  const handleSubimit = useCallback(async () => {
    const isNewRecord = lesson_id === '0';

    const newItem = {
      "module": moduleName,
      "submodule": submoduleName,
      "title": lessonTitle,
      "notes": currentData
    };

    try {
      let result;
      if (isNewRecord) {
        result = await createRecord(collectionName, newItem);
        if (result && result.id) {
          navigate(`/edit/${collectionName}/${studies_id}/${result.id}`);
        } else {
          navigate(`/studies/${collectionName}/${studies_id}`);
        }
      } else {
        result = await updateRecord(collectionName, lesson_id, newItem);
        await refetchLessonData(initialDataPath);
        navigate(`/studies/${collectionName}/${studies_id}`);
      }
      console.log("Confirmação e salvamento bem-sucedidos: ", result);
    } catch (err) {
      console.error("Erro na operação de submissão:", err);
      // Aqui você pode adicionar lógica para mostrar uma mensagem de erro ao usuário
    }
  }, [currentData, lesson_id, collectionName, createRecord, updateRecord, refetchLessonData, initialDataPath, navigate, moduleName, submoduleName, lessonTitle, studies_id]);

  const handleOpenModel = useCallback((item, index) => {
    setIsModalOpen(true);
    setModalItem(item);
    setModalIndex(index);
    setModalType(item?.type);
  }, []);

  const handleCloseModel = useCallback(() => {
    setIsModalOpen(false);
    setModalType('');
    setModalItem(null);
    setModalIndex(null);
  }, []);

  const handleModalSubimit = useCallback((selectedType, formData) => {
    handleSetEdited();
    if (modalIndex === null) {
      setCurrentData([...currentData, formData]);
    } else {
      const updatedData = [...currentData];
      updatedData[modalIndex] = formData;
      setCurrentData(updatedData);
    }
  }, [currentData, modalIndex, handleSetEdited]);

  return (
    <div className="note-edit-screen-container">
      <Header
        className="note-edit-header"
        onBackToStudies={handleBackToStudies}
        icon={studiesNoteData?.icon}
        title={studiesNoteData?.title}
      >
        <Button onClick={handleSubimit} className='note-edit-header-button-submit' disabled={!hasEditedData || isMutating}>Confirmar</Button>
        <Button onClick={() => handleOpenModel(null, null)} className='note-edit-header-button-add'>Adicionar</Button>
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
              onChange={(e) => { setModuleName(e.target.value); handleSetEdited(); }}
              placeholder="Novo Nome do Módulo"
              className={styles['form-input']}
            />
          ) : (
            <select
              id="module-name"
              value={moduleName}
              onChange={(e) => {
                setModuleName(e.target.value);
                setSubmoduleName(''); // Limpa o submódulo ao mudar o módulo
                setIsNewSubmodule(false); // Volta para o modo de seleção de submódulo existente
                handleSetEdited();
              }}
              className={styles['form-input']}
              disabled={allLessonsLoading} // Desabilita enquanto carrega os módulos
            >
              <option value="">Selecione um Módulo</option>
              {availableModules.map(mod => (
                <option key={mod} value={mod}>{mod}</option>
              ))}
            </select>
          )}
          <Button
            type="button"
            onClick={() => {
              setIsNewModule(!isNewModule);
              if (isNewModule) setModuleName(''); // Limpa o campo se voltar para dropdown
              setSubmoduleName(''); // Limpa o submódulo também
              setIsNewSubmodule(false); // Garante que o submódulo volte a selecionar existente
              handleSetEdited();
            }}
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
              onChange={(e) => { setSubmoduleName(e.target.value); handleSetEdited(); }}
              placeholder="Novo Nome do Submódulo"
              className={styles['form-input']}
            />
          ) : (
            <select
              id="submodule-name"
              value={submoduleName}
              onChange={(e) => { setSubmoduleName(e.target.value); handleSetEdited(); }}
              className={styles['form-input']}
              disabled={!moduleName || allLessonsLoading} // Desabilita se não houver módulo ou enquanto carrega
            >
              <option value="">Selecione um Submódulo</option>
              {availableSubmodules.map(submod => (
                <option key={submod} value={submod}>{submod}</option>
              ))}
            </select>
          )}
          <Button
            type="button"
            onClick={() => {
              setIsNewSubmodule(!isNewSubmodule);
              if (isNewSubmodule) setSubmoduleName(''); // Limpa o campo se voltar para dropdown
              handleSetEdited();
            }}
            className={styles['toggle-input-button']}
            disabled={!moduleName} // Só habilita se um módulo estiver selecionado
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
            onChange={(e) => { setLessonTitle(e.target.value); handleSetEdited(); }}
            placeholder="Título da Aula"
            className={styles['form-input']}
          />
        </div>
        {/* ---------------------------- */}

      </div>

      <div className="note-edit-main-content">
        {(lessonLoading && !initialDataLoaded) || allLessonsLoading ? (
          <p>Carregando dados...</p>
        ) : lessonError || allLessonsError ? (
          <p>Erro ao carregar dados: {lessonError?.message || allLessonsError?.message}</p>
        ) : (
          <MainContent
            title={lessonTitle}
            currentLesson={{ ...lessonData, notes: currentData }}
            buttonSection={(item, index) => {
              return (
                <>
                  <Button onClick={() => handleOpenModel(item, index)} className='action-icon-edit'><i className="fas fa-pencil-alt"></i></Button>
                  <Button onClick={() => handleDelet(item, index)} className='action-icon-delete'><i className="fas fa-trash-alt"></i></Button>
                </>
              );
            }}
            stylesNoteElementClassName={styles['note-element']}
            stylesDisplayButtonsClassName={`${styles['lesson-notes-display-buttons']}`}
          >
            {/* Estes botões podem ser removidos daqui, pois já estão no Header */}
            {/* <Button onClick={handleSubimit} className='note-edit-header-button-submit' disabled={!hasEditedData || isMutating}>Confirmar</Button>
            <Button onClick={() => handleOpenModel(null, null)} className='note-edit-header-button-add'>Adicionar</Button>
            <Button onClick={handleCancel} className='note-edit-header-button-cancel'>Cancelar</Button> */}
          </MainContent>
        )}
      </div>

      <EditModal
        isOpen={isModalOpen}
        onClose={handleCloseModel}
        modalType={modalType}
        handleSubimit={handleModalSubimit}
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