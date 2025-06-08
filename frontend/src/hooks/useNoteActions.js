// src/hooks/useNoteActions.js
import { useCallback } from 'react';

// Este hook agora RECEBE as funções e estados de useDataOperations como argumentos
const useNoteActions = (createRecord, updateRecord, deleteRecord, fetchData, isMutating, mutationError) => {
    // As funções createRecord, updateRecord, deleteRecord, fetchData, isMutating, mutationError
    // SÃO AGORA RECEBIDAS COMO ARGUMENTOS, NÃO CRIADAS AQUI.
    // Isso garante que você está usando as funções da ÚNICA instância de useDataOperations do seu componente.

    const handleAddOrEdit = useCallback(async (data) => {
        const { dbCollection, _id, ...itemData } = data;

        if (!dbCollection) {
            console.error('Erro: dbCollection é obrigatório para adicionar/editar.');
            throw new Error('Nome da coleção não fornecido.');
        }

        try {
            if (!_id) {
                console.log(`Ação: Adicionando novo item à coleção "${dbCollection}"`);
                const newItem = await createRecord(dbCollection, itemData);
                console.log('Novo item adicionado:', newItem);
                return newItem;
            } else {
                console.log(`Ação: Editando item "<span class="math-inline">\{\_id\}" na coleção "</span>{dbCollection}"`);
                const updatedItem = await updateRecord(dbCollection, _id, itemData);
                console.log('Item atualizado:', updatedItem);
                return updatedItem;
            }
        } catch (error) {
            console.error('Erro na ação de adicionar/editar:', error);
            throw error;
        }
    }, [createRecord, updateRecord]); // As dependências são as funções que ESTÃO SENDO RECEBIDAS

    const handleDelete = useCallback(async (data) => {
        const { dbCollection, _id, _idList } = data;

        if (!dbCollection) {
            console.error('Erro: dbCollection é obrigatório para deletar.');
            throw new Error('Nome da coleção não fornecido.');
        }

        try {
            if (_idList && _idList.length > 0) {
                console.log(`Ação: Deletando <span class="math-inline">\{\_idList\.length\} item\(s\) da coleção "</span>{dbCollection}"`);
                const results = [];
                for (const id of _idList) {
                    await deleteRecord(dbCollection, id);
                    results.push(`Deletado: ${id}`);
                }
                console.log('Itens deletados:', results);
                return { success: true, message: `Deletados ${_idList.length} itens.` };
            } else if (_id) {
                console.log(`Ação: Deletando 1 item "<span class="math-inline">\{\_id\}" da coleção "</span>{dbCollection}"`);
                await deleteRecord(dbCollection, _id);
                console.log('Item deletado:', _id);
                return { success: true, message: `Deletado item ${_id}.` };
            } else {
                console.warn('Nenhum _id ou _idList fornecido para exclusão.');
                throw new Error('Nenhum ID para exclusão.');
            }
        } catch (error) {
            console.error('Erro na ação de deletar:', error);
            throw error;
        }
    }, [deleteRecord]); // A dependência é a função que ESTÁ SENDO RECEBIDA

    // Retorna as funções e os estados que foram PASSADOS como argumentos.
    return { handleAddOrEdit, handleDelete, isMutating, mutationError, fetchData };
};

export default useNoteActions;