// src/hooks/useEditNoteModal.js
import { useState, useEffect, useCallback } from 'react';

const useEditNoteModal = (noteIndex, setNoteIndex, handleAddNote, handleUpdateNote) => {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalItem, setModalItem] = useState();

  const handleOpenModel = useCallback((item = null, index = null) => { // Ajustado para default null
    setIsModalOpen(true);
    setModalItem(item);
    setNoteIndex(index);
    setModalType(item?.type || ''); // Define o tipo para 'add' se não houver item
  }, []);

  const handleCloseModel = useCallback(() => {
    setIsModalOpen(false);
    setModalType('');
    setModalItem(null);
    setNoteIndex(null);
  }, []);

  const handleModalSubmit = useCallback(async (selectedTypeFromModal, formDataFromModal, uploadFileFunc) => {
    try {
      // Se o tipo for imagem e houver um arquivo selecionado, tenta fazer o upload
      if (selectedTypeFromModal === 'image' && uploadFileFunc) {
        await uploadFileFunc(); // Executa o upload através da função passada
      }

      if (noteIndex === null) {
        handleAddNote(formDataFromModal);
      } else {
        handleUpdateNote(noteIndex, formDataFromModal);
      }
      // Se estiver modificando um item fecha o modal e se estiver adicionando novos continua aberto
      if(noteIndex) handleCloseModel();
      
    } catch (error) {
      console.error("Erro ao submeter modal (incluindo upload):", error);
      // Aqui você pode adicionar lógica para mostrar uma mensagem de erro ao usuário
    }
  }, [noteIndex, handleAddNote, handleUpdateNote, handleCloseModel]);

  return { isModalOpen, modalType, modalItem, handleOpenModel, handleCloseModel, handleModalSubmit };
};

export default useEditNoteModal;