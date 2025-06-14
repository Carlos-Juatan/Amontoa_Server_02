// src/components/Common/Modal/EditModal/EditModal.jsx
import React, { useState, useCallback, useMemo, useEffect } from 'react';

import Modal from '../../Modal/Modal';
import useImageUpload from '../../../../hooks/useImageUpload'; // NOVO HOOK
import NoteTypeSelector from '../../../NoteTypeSelector/NoteTypeSelector'; // NOVO COMPONENTE

// Importe todos os componentes de formulário específicos para cada tipo
import ParagraphForm from '../../../forms/ParagraphForm';
import ImageForm from '../../../forms/ImageForm';
import HeadingForm from '../../../forms/HeadingForm';
import CodeSnippetForm from '../../../forms/CodeSnippetForm';
import ListForm from '../../../forms/ListForm';
import LinkForm from '../../../forms/LinkForm';
import BlockquoteForm from '../../../forms/BlockquoteForm';
import TableForm from '../../../forms/TableForm';
import VideoForm from '../../../forms/VideoForm';
import AlertForm from '../../../forms/AlertForm';

// Importe os tipos de nota de um arquivo de constantes
import { NOTE_TYPES } from '../../../../constants/noteTypes';

import './EditModal.css';

function EditModal({ isOpen, onClose, modalType: initialModalType, handleSubimit, item, isMutating, mutationError, moduleTile, submoduleTitle, lessonTitle, listLenth, modalIndex }) {
  const [selectedType, setSelectedType] = useState(initialModalType || '');
  const [formData, setFormData] = useState(item || {});

  // Usa o novo hook de upload de imagem
  const fileIndex = modalIndex != null ? modalIndex : listLenth;
  const {
    selectedFile,
    onFileChange,
    uploadFile,
    imageUrl,
    isUploading,
    uploadError,
    resetFileUpload,
  } = useImageUpload(moduleTile, submoduleTitle, lessonTitle, fileIndex);

  // Atualiza o tipo selecionado e os dados do formulário quando as props mudam
  useEffect(() => {
    setSelectedType(initialModalType || '');
    setFormData(item || {});
    // Reseta o estado do file upload quando o modal é aberto ou um novo item é selecionado
    resetFileUpload();
  }, [initialModalType, item, resetFileUpload]);

  // Mapeia os tipos de notas para seus respectivos componentes de formulário
  const FormComponents = useMemo(() => ({
    paragraph: ParagraphForm,
    image: ImageForm,
    heading: HeadingForm,
    code_snippet: CodeSnippetForm,
    list: ListForm,
    link: LinkForm,
    blockquote: BlockquoteForm,
    table: TableForm,
    video: VideoForm,
    alert: AlertForm,
  }), []);

  const handleTypeChange = useCallback((e) => {
    const newType = e.target.value;
    setSelectedType(newType);
    setFormData({ type: newType }); // Resetar formData ao mudar o tipo
    resetFileUpload(); // Reseta upload quando muda o tipo
  }, [resetFileUpload]);

  const handleFormChange = useCallback((newData) => {
    setFormData(prevData => ({ ...prevData, ...newData }));
  }, []);

  const handleSubmitWithData = useCallback(async (event) => {
    event.preventDefault(); // Impede o comportamento padrão do formulário

    // Passa a função de upload de arquivo para o handler pai
    await handleSubimit(selectedType, formData, uploadFile);

    // Limpa estados específicos após a submissão
    if (!item) { // Se for um novo item, resetar o formulário
      setSelectedType('');
      setFormData({});
    }
    resetFileUpload();
  }, [handleSubimit, selectedType, formData, uploadFile, item, resetFileUpload]);

  const handleClosed = useCallback(() => {
    onClose();
    setSelectedType('');
    setFormData({});
    resetFileUpload(); // Reseta upload ao fechar o modal
  }, [onClose, resetFileUpload]);

  // Lógica de validação para desabilitar o botão de submit do modal
  const isSubmitDisabled = useMemo(() => {
    // Validação básica: verifica se o módulo, submódulo e título estão preenchidos para ImageForm
    const isImageFormInvalid = selectedType === 'image' && (!moduleTile || !submoduleTitle || !lessonTitle);

    // Adicione outras validações específicas para cada tipo de formulário aqui, se necessário.
    // Por exemplo, verificar se `formData` tem campos obrigatórios preenchidos para o `selectedType`.
    // Exemplo: const isParagraphInvalid = selectedType === 'paragraph' && !formData.content;

    return isMutating || isUploading || isImageFormInvalid;
  }, [isMutating, isUploading, selectedType, moduleTile, submoduleTitle, lessonTitle]);


  const ModalContent = () => {
    if (!selectedType) {
      return <p>Selecione um tipo de nota para adicionar.</p>;
    } else {
      const SpecificFormComponent = FormComponents[selectedType];
      if (SpecificFormComponent) {
        return (
          <SpecificFormComponent
            item={formData}
            onChange={handleFormChange}
            moduleTile={moduleTile}
            submoduleTitle={submoduleTitle}
            lessonTitle={lessonTitle}
            listLenth={listLenth}
            onFileChange={selectedType === 'image' ? onFileChange : undefined} // Só passa para ImageForm
            imageUrl={selectedType === 'image' ? imageUrl : undefined} // Só passa para ImageForm
            selectedFile={selectedType === 'image' ? selectedFile : undefined} // Só passa para ImageForm
          />
        );
      } else {
        return <p>Tipo de item desconhecido: {selectedType}</p>;
      }
    }
  };

  return (
    <span className='modals'>
      <Modal
        isOpen={isOpen}
        onClose={handleClosed}
        title={item ? `Modificar ${selectedType.replace('_', ' ').toUpperCase()}` : 'Adicionar Novo Item'}
        editTypeSelection={<NoteTypeSelector selectedType={selectedType} onChange={handleTypeChange} />}
        onSubmit={handleSubmitWithData}
        submitButtonText={item ? 'Salvar Modificações' : 'Adicionar'}
        isMutating={isMutating}
        mutationError={mutationError || uploadError} // Inclui erro de upload
        modalCustonStyle="EdidModal-modal-content"
        isSubmitDisabled={isSubmitDisabled} // Passa o estado de desabilitação
      >
        {ModalContent()}
      </Modal>
    </span>
  );
}

export default EditModal;