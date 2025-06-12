// src/components/ComingSoonScreen/ComingSoonScreen.jsx
import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useDataOperations from '../../hooks/useDataOperations';

import useNoteActions from '../../hooks/useNoteActions';
import useModelActions from '../../hooks/useModelActions';

import Button from '../../components/Common/Button/Button';
import Header from '../../components/StudiesScreen/Header/Header';
import MainContent from '../../components/StudiesScreen/MainContent/MainContent';
import EditModal from '../../components/Common/Modal/EditModal/EditModal';

import './NoteEditScreen.css';
import styles from './NoteEditScreenElements.module.css';

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
  } = lesson_id != 0 ? useDataOperations(`${collectionName}/${lesson_id}`) : {};

  const [currentData, setCurrentData] = useState([]); // Estado para as anotações editáveis
  const [initialDataLoaded, setInitialDataLoaded] = useState(false); // Novo estado para controlar o carregamento inicial
  const [hasEditedData, setHasEditedData] = useState(false); // Estado para as anotações iniciais

  // Use useEffect para inicializar currentData com os dados de 'notes' quando 'data' for carregado.
  useEffect(() => {
    if (data && data.notes && !initialDataLoaded) {
      setCurrentData(data.notes);
      setInitialDataLoaded(true); // Marca que os dados iniciais foram carregados
    }
  }, [data, initialDataLoaded]); // Dependências: 'data' e 'initialDataLoaded'

  const handleBackToStudies = () => {
    navigate(`/studies/${collectionName}/${studies_id}`); // Navega de volta para tela de lista de anotações (studiesScreen)
  };




  const handleAdd = useCallback(() => {
    console.log('Adicionar Novo');
    // Adiciona um novo item ao array currentData (você pode querer um modal para isso)
    const newItem = {
      _id: `new-item-${Date.now()}`, // ID temporário
      type: 'paragraph',
      content: 'Novo parágrafo...',
    };
    setCurrentData([...currentData, newItem]);
  }, [currentData]); // Dependência: currentData
  
  const handleDelet = useCallback((item, index) => {
    console.log('Deletando item recebido :', item._id, 'index: ', index);
    // Remove o item do array currentData
    const updatedNotes = currentData.filter((_, i) => i !== index);
    setCurrentData(updatedNotes);
    setHasEditedData(true);
  }, [currentData]); // Dependência: currentData

  const handleCancel = useCallback(() => {
    console.log('Cancelar edição');
    setCurrentData([]); // Limpa osj dados originais
    navigate(`/studies/${collectionName}/${studies_id}`); // Volta para a tela de estudos
  }, [navigate, collectionName, studies_id]); // Dependências










  const handleEdit = useCallback((item, index) => {
    console.log('Editando item recebido :', item._id, 'index: ', index);
    handleModelAddOrEdit(item, index);
  }, []); // Dependência: currentData

  const handleSubimit = useCallback(async () => {
    console.log("Confirmando e salvando: ", currentData);
  }, [currentData]); // Adicione as dependências






  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalItem, setModalItem] = useState();
  const [modalIndex, setModalIndex] = useState();

    const handleOpenModel = useCallback((item, index) => {
      setIsModalOpen(true);
      setModalItem(item);
      setModalIndex(index)
      setModalType(item?.type);
    }, []);

    const handleCloseModel = useCallback(() => {
      setIsModalOpen(false);
      setModalType('')
      setModalItem(null);
      setModalIndex(null)
    }, []);

    const handleModalSubimit = useCallback((selectedType, formData) => {
      if (modalIndex === null){
        setCurrentData([...currentData, formData]);
        setHasEditedData(true);
      } else {
        // Modo de edição: substitui o item existente no modalIndex
        // 1. Cria uma nova cópia do array currentData
        const updatedData = [...currentData];
        // 2. Substitui o item na posição `modalIndex`
        updatedData[modalIndex] = formData;
        // 3. Atualiza o estado com o novo array
        setCurrentData(updatedData);
        setHasEditedData(true); // Indica que os dados foram modificados
        console.log('Item atualizado no índice:', modalIndex, formData);
      }
    }, [currentData, modalIndex]);

    /*
    const handleAdd = useCallback(() => {
      console.log('Adicionar Novo');
      // Adiciona um novo item ao array currentData (você pode querer um modal para isso)
      const newItem = {
        _id: `new-item-${Date.now()}`, // ID temporário
        type: 'paragraph',
        content: 'Novo parágrafo...',
      };
      setCurrentData([...currentData, newItem]);
    }, [currentData]); // Dependência: currentData
    */




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

      <div className="note-edit-main-content">
        {loading ? (
          <p>Carregando dados...</p>
        ) : error ? (
          <p>Erro ao carregar dados: {error.message}</p>
        ) : (
          <MainContent
            currentLesson={{ ...data, notes: currentData }} // Passe a estrutura completa com notes de currentData
            buttonSection={(item, index) => { //'item' é o dado que MainContent nos passou para CADA item da lista
              return (
                <>
                  <Button onClick={() => handleOpenModel(item, index)} className='action-icon-edit'><i className="fas fa-pencil-alt"></i></Button>
                  <Button onClick={() => handleDelet(item, index)} className='action-icon-delete'><i className="fas fa-trash-alt"></i></Button>
                </>
              )
            }}
            stylesNoteElementClassName={styles['note-element']} // Passa o NOME da classe gerada para o .note-element ( pode ser passado direto )
            stylesDisplayButtonsClassName={`${styles['lesson-notes-display-buttons']}`} // Passa a classe dos botões ( pode ser passada 'concaternada' com várias classes)
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
        handleSubimit={handleModalSubimit}
        item={modalItem}
        index={modalIndex}
        isMutating={isMutating} // Passa o estado de mutação da instância principal
        mutationError={mutationError} // Passa o erro de mutação da instância principal
      >
        
      </EditModal>

    </div>
  );
}

export default NoteEditScreen;