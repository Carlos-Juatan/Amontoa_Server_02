import React, { useState, useEffect } from 'react';
import Modal from '../Modal';

import './ActionModal.css';

function ActionModal ({ isOpen, modalType, item, onClose, onEditName, onDelete, isMutating, mutationError }) {

  // Estado para o nome que será editado.
  // Inicializa com o título existente do item ou uma string vazia.
  // Usamos useEffect para atualizar o estado quando o 'item' mudar,
  // garantindo que o input mostre o nome correto ao abrir o modal para um novo item.
  const [editedName, setEditedName] = useState('');

  // Use useEffect para preencher o input quando o modal abrir ou o item mudar
  useEffect(() => {
    if (isOpen && item && item.title) {
      setEditedName(item.title);
    } else if (isOpen && !item) { // Se for um novo item, o input deve estar vazio
        setEditedName('');
    }
  }, [isOpen, item]); // Dependências: isOpen (para redefinir ao abrir/fechar) e item (se o item mudar)
  
  // Função que será chamada quando o formulário for submetido
  function handleEditSubmit() { // Renomeado de handleEdit para evitar conflito com a prop onEdit
    if (!editedName.trim()) {
      alert('O nome do item não pode ser vazio!');
      return;
    }

    // Criar um novo objeto com os dados originais do item e o nome editado
    const updatedItem = {
      ...item, // Mantém todas as outras propriedades do item original (_idList, dbCollection, lessons, etc.)
      title: editedName, // Adiciona/sobrescreve o título com o nome editado
    };

    // Chama a função onEdit (que é handleAddOrEditWrapper do StudiesNotesScreen)
    // Passando o objeto completo e atualizado
    onEditName(updatedItem);
  }

  function handleDeleteSubmit() { // Renomeado para evitar conflito com a prop onDelete
    onDelete(item);
  }

  return (
    <span className='modals'>
      {modalType === 'edit' && (
        <Modal className='modal-edit'
          isOpen={isOpen}
          onClose={onClose}
          title={`Editar: ${item?.title || 'item selecionado'}`} // Use optional chaining para evitar erro se item for undefined
          onSubmit={handleEditSubmit} // Passe a nova função de submissão
          submitButtonText={'Confirmar'}
          isMutating={isMutating} // Passe o estado de mutação para desabilitar o botão
        >
          <div className="modal-content-form"> {/* Adicione um container para o input */}
            <label htmlFor="itemName">Novo nome:</label>
            <input
              type="text"
              id="itemName"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              disabled={isMutating} // Desabilita o input durante a mutação
            />
            {mutationError && <p className="error-message">{mutationError}</p>} {/* Mostra erro */}
          </div>
        </Modal>
      )}
      
      {modalType === 'delete' && (
        <Modal className='modal-delete'
          isOpen={isOpen}
          onClose={onClose}
          title={`Confirmar exclusão: ${(item?._idList?.length > 1) ? `${item?._idList?.length} items` : '1 item'}?`}
          
          onSubmit={handleDeleteSubmit} // Use a função para deletar
          submitButtonText={'Deletar'}
          isMutating={isMutating}
        >
          <p>Você tem certeza? Irá excluir {item?.submodules? 'todos os submódulos e aulas' : 'todas as aulas'} dentro do {item?.title}</p>
          {mutationError && <p className="error-message">{mutationError}</p>}
        </Modal>
      )}
    </span>
  );
};

export default ActionModal;