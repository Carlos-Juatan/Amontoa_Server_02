import { useCallback, useState } from 'react';

const useModelActions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalItem, setModalItem] = useState();

    const onClose = useCallback(() => {
      setIsModalOpen(false);
      setModalType('')
      setModalItem(null);
    }, []);

    const handleModelEdit = useCallback((item) => {
      setModalType('edit')
      setIsModalOpen(true);
      setModalItem(item);
      //console.log(`Ação: Abrir modal para editar os _ids ${item._idList}`);
      // Aqui você pode integrar com a lógica de edição
    }, []);

    const handleModelDelete = useCallback((type, item) => {
      setModalType('delete')
      setIsModalOpen(true);
      setModalItem(item);
      //if(type === 'list'){
      //  console.log(`Ação: Deletar lista de items dos _ids ${item._idList}}`);
      //} else {
      //  console.log(`Ação: Deletar item do _id ${item._id}`);
      //}
    }, []);

    return { isModalOpen, modalType, modalItem, onClose, handleModelEdit, handleModelDelete };
};

export default useModelActions;