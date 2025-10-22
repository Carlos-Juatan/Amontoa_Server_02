// src/hooks/useDataCRUD.js

import useDataOperations from './useDataOperations';

// Este hook encapsulará a lógica de criação, leitura, atualização e deletação. CRUD (Create, Read, Update, Delete)
function useDataCRUD(collectionName) {
  const { 
    data, 
    loading, 
    error, 
    fetchData, 
    createRecord, 
    updateRecord, 
    deleteRecord, 
    isMutating, 
    mutationError 
  } = useDataOperations(collectionName);

  const handleCreateItem = async (newItem, collectionToUse = collectionName) => {
    if (!collectionToUse || !newItem) return;

    try {
      await createRecord(collectionToUse, newItem);
      await fetchData(); // Recarrega a lista
      console.log(`Novo item adicionado com sucesso na coleção ${collectionToUse}!`);
      return true; // Sucesso

    } catch (e) {
      console.error("Falha ao adicionar o novo item:", e);
      // Aqui você poderia retornar o erro ou lançá-lo novamente
      throw e; 
    }
  };

  const handleUpdateItem = async (id, updatedFields, collectionToUse = collectionName) => {
    if (!id || !updatedFields || !collectionToUse) return;

    try {
      await updateRecord(collectionToUse, id, updatedFields);
      await fetchData(); // Recarrega a lista
      console.log(`Sucesso na atualização do item ${id} na coleção ${collectionToUse}:`, updatedFields);
      return true; // Sucesso

    } catch (e) {
      console.error("Falha ao atualizar o item:", e);
      // Aqui você poderia retornar o erro ou lançá-lo novamente
      throw e; 
    }
  };

  const handleDeleteItem = async (item, collectionToUse = collectionName) => {
    if (!item || !item._id || !collectionToUse) return;

    try {
      await deleteRecord(collectionToUse, item._id);
      await fetchData(); // Recarrega a lista
      console.log(`Item com ID ${item._id} deletado com sucesso da coleção ${collectionToUse}.`);
      return true; // Sucesso

    } catch (e) {
      console.error("Erro ao deletar item:", e);
      // Aqui você poderia retornar o erro ou lançá-lo novamente
      throw e; 
    }
  };

  return {
    data,
    loading,
    error,
    fetchData,
    updateRecord,
    deleteRecord,
    isMutating,
    mutationError,
    handleCreateItem,
    handleUpdateItem,
    handleDeleteItem
  };
}

export default useDataCRUD;