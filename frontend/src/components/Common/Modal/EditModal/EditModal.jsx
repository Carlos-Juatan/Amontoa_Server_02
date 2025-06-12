import React, { useState, useCallback, useMemo, useEffect } from 'react';

import Modal from '../Modal'; // Assumindo que '../Modal' é o seu componente Modal base

// Importe todos os componentes de formulário específicos para cada tipo
import ParagraphForm from '../../../forms/ParagraphForm'; // Ajuste o caminho conforme sua estrutura
import ImageForm from '../../../forms/ImageForm';
import HeadingForm from '../../../forms/HeadingForm';
import CodeSnippetForm from '../../../forms/CodeSnippetForm';
import ListForm from '../../../forms/ListForm';
import LinkForm from '../../../forms/LinkForm';
import BlockquoteForm from '../../../forms/BlockquoteForm';
import TableForm from '../../../forms/TableForm';
import VideoForm from '../../../forms/VideoForm';
import AlertForm from '../../../forms/AlertForm';

// Opcional: Importe os tipos de nota de um arquivo de constantes
import { NOTE_TYPES } from '../../../../constants/noteTypes'; // Ajuste o caminho

import './EditModal.css';

function EditModal({ isOpen, onClose, modalType: initialModalType, handleSubimit, item, isMutating, mutationError }) {
  // Estado local para o tipo de modal selecionado quando está no modo "adicionar novo"
  const [selectedType, setSelectedType] = useState(initialModalType || '');
  // Estado local para os dados do formulário que estão sendo editados/adicionados
  const [formData, setFormData] = useState(item || {});

  // Atualiza o tipo selecionado e os dados do formulário quando as props mudam
  useEffect(() => {
    setSelectedType(initialModalType || '');
    setFormData(item || {});
  }, [initialModalType, item]);

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

  // Função para lidar com a mudança no dropdown de tipo de nota
  const handleTypeChange = useCallback((e) => {
    const newType = e.target.value;
    setSelectedType(newType);
    setFormData({ type: newType }); // Resetar formData ao mudar o tipo
  }, []);

  // Função para atualizar os dados do formulário conforme o usuário digita
  const handleFormChange = useCallback((newData) => {
    setFormData(prevData => ({ ...prevData, ...newData }));
  }, []);

  // Adapta o handleSubimit para passar os dados do formulário
  const handleSubmitWithData = useCallback(() => {
    // Aqui você pode adicionar validações extras antes de submeter
    handleSubimit(selectedType, formData);
    if(item) handleClosed();
    else setFormData({ type: selectedType });
  }, [handleSubimit, selectedType, formData]);

  const handleClosed = useCallback(() => {
    onClose();
    setSelectedType('');
    setFormData({});
  }, [onClose]);

  // Conteúdo do modal que será renderizado dentro do componente <Modal>
  const ModalContent = () => {
    // Se não há um tipo definido (modo de adição inicial)
    if (!selectedType) {
      return (
        <p>Selecione um tipo de para adicionar</p>
      );
    } else {
      // Se um tipo foi selecionado ou está no modo de edição
      const SpecificFormComponent = FormComponents[selectedType];
      if (SpecificFormComponent) {
        return (
          <SpecificFormComponent
            item={formData} // Passa os dados atuais do formulário
            onChange={handleFormChange} // Passa a função para atualizar os dados
          />
        );
      } else {
        return <p>Tipo de item desconhecido: {selectedType}</p>;
      }
    }
  };

  // Definição da função selectType
// Note que você precisará ter `NOTE_TYPES` disponível para esta função.
// Ela pode ser importada ou passada como mais um parâmetro se `selectType`
// for definida fora do componente EditModal.
function selectType(selectedType, handleTypeChange) {
  return (
    <div className='note-type-select-container'>
      <label htmlFor="note-type-select-label">Selecione o tipo de item:</label>
      <select id="note-type-select" value={selectedType} onChange={handleTypeChange}>
        <option value="">Selecione...</option>
        {/* NOTE_TYPES precisa estar acessível aqui. */}
        {/* Se NOTE_TYPES é importado no EditModal, ele não estará automaticamente disponível nesta função separada. */}
        {/* Você pode importá-lo novamente aqui ou passá-lo como um parâmetro. */}
        {NOTE_TYPES.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>
    </div>
  );
}

  return (
    <span className='modals'>
      <Modal
        isOpen={isOpen}
        onClose={handleClosed}
        // O título pode mudar com base no tipo selecionado ou se é adição/modificação
        title={item ? `Modificar ${selectedType.replace('_', ' ').toUpperCase()}` : 'Adicionar Novo Item'}
        editTypeSelection={selectType(selectedType, handleTypeChange)}
        onSubmit={handleSubmitWithData} // Usa o onSubmit com os dados do formulário
        submitButtonText={item ? 'Salvar Modificações' : 'Adicionar'}
        isMutating={isMutating}
        mutationError={mutationError}
        modalCustonStyle="EdidModal-modal-content"
      >
        {/* Renderiza o conteúdo dinâmico do modal como children */}
        {ModalContent()}
      </Modal>
    </span>
  );
}

export default EditModal;