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

  // Determine o caminho inicial para o useDataOperations
  // Se lesson_id for '0', passamos null para evitar uma busca inicial desnecessária
  const initialDataPath = lesson_id !== '0' ? `${collectionName}/${lesson_id}` : null;

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
  } = useDataOperations(initialDataPath);

  const [currentData, setCurrentData] = useState([]); // Estado para as anotações editáveis
  const [initialDataLoaded, setInitialDataLoaded] = useState(false); // Novo estado para controlar o carregamento inicial
  const [hasEditedData, setHasEditedData] = useState(false); // Estado para as anotações iniciais

  // Use useEffect para inicializar currentData com os dados de 'notes' quando 'data' for carregado.
  useEffect(() => {
    if (data && Array.isArray(data.notes) && !initialDataLoaded) {
      setCurrentData(data.notes);
      setInitialDataLoaded(true); // Marca que os dados iniciais foram carregados
    } else if (lesson_id === '0') { // Se for um novo registro, inicia notes vazio
      setCurrentData([]);
    }
  }, [data, lesson_id, initialDataLoaded]); // Dependências: 'data' e 'initialDataLoaded'

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
    // Certifique-se de que lesson_id é uma string para a comparação '0'
    const isNewRecord = lesson_id === '0';

    const newItem = {
      "module": "MÓDULO testando xy", // Estes valores provavelmente virão de outros inputs
      "submodule": "submódulo testando xy", // Estes valores provavelmente virão de outros inputs
      "title": "Aula testando xy", // Estes valores provavelmente virão de outros inputs
      "notes": currentData // Seus dados de anotação
    };

    try {
      let result;
      if (isNewRecord) {
        // Para a criação, você só precisa do nome da coleção, não do ID
        result = await createRecord(collectionName, newItem);
      } else {
        result = await updateRecord(collectionName, lesson_id, newItem);
      }

      // Após criar ou atualizar, você pode querer re-buscar os dados para refletir as mudanças
      // ou atualizar o estado local se sua API retornar o item completo e você quiser evitar refetch
      if (isNewRecord && initialDataPath) { // Só refetch se for edição e houver um path para refetch
        await refetchData(initialDataPath);
      } else if (!isNewRecord) {
        // Se for um novo registro e você quiser redirecionar ou limpar o formulário principal
        // Isso depende da sua UX. Talvez redirecionar para a nova URL da aula criada.
        // Exemplo: Redirecionar para a URL da nova aula (se a API retornar o ID)
        navigate(`/studies/${collectionName}/${studies_id}`); // Volta para a tela de estudos
      }
      // onClose(); // Comentei, pois a questão anterior indicava manter o modal aberto.
                    // Se você quer fechar o modal principal após salvar a aula inteira, descomente.
      return result;

    } catch (err) {
      console.error("Erro na operação de submissão:", err);
      // Você pode querer exibir uma mensagem de erro na UI aqui
    }
    console.log("Confirmando e salvando: ", newItem);
  }, [currentData, lesson_id, collectionName, createRecord, updateRecord, refetchData, initialDataPath, navigate /*, onClose*/]);






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