import Modal from '../Modal';

import './ActionModal.css';

function ActionModal ({ isOpen, modalType, item, onClose, onEdit, onDelete }) {

  function handleEdit() {
    onEdit(item);
  }

  function handleDelete() {
    onDelete(item);
  }

  return (
    <span className='modals'>
      {modalType === 'edit' && (
        <Modal className='modal-edit'
        isOpen={isOpen}
        onClose={onClose}
        title={`Editar os nomes de ${item._idList.length} item(s)`}

        onSubmit={handleEdit}
        submitButtonText={'confirmar'}
        >
          
        </Modal>
      )}
      
      {modalType === 'delete' && (
        <Modal className='modal-delete'
        isOpen={isOpen}
        onClose={onClose}
        title={`Deletar ${item._idList?.length || 1} item(s):`}
        
        onSubmit={handleDelete}
        submitButtonText={'apagar'}
        >
          
        </Modal>
      )}
    </span>
  );
};

export default ActionModal;