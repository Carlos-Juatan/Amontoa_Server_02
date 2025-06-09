// src/hooks/useDataOperations.js
import { useState, useEffect, useCallback } from 'react';
import { fetchCategoryData, postDocument, putDocument, deleteDocument } from '../services/dataService'; // Ajuste o caminho se necessário

const useDataOperations = (initialFetchPath = null) => {
  const [data, setData] = useState([]); // Começamos com null, ou um array vazio [], dependendo da sua necessidade padrão
  const [loading, setLoading] = useState(false); // Inicia como false, pois a busca inicial pode ser condicional
  const [error, setError] = useState(null);
  const [isMutating, setIsMutating] = useState(false); // Novo estado para operações de escrita (POST, PUT, DELETE)
  const [mutationError, setMutationError] = useState(null); // Erros específicos de mutação

  // --- Função para buscar dados (GET) ---
  const fetchData = useCallback(async (path = initialFetchPath) => {
    if (!path) {
      // Se não há um path para buscar, não fazemos nada.
      // Isso é útil se o hook for usado sem uma busca inicial obrigatória.
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null); // Limpa erros de busca anteriores

    try {
      const result = await fetchCategoryData(path);
      // Garantir que `data` seja sempre um array se a API retornar array ou null
      const actualData = Array.isArray(result) ? result : (result || []); // Se for objeto, trata como array de um item ou vazio
      setData(actualData);
    } catch (err) {
      setError("Não foi possível carregar os dados: " + err.message);
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  }, [initialFetchPath]); // Depende do caminho de busca inicial

  // --- Funções de Mutação (POST, PUT, DELETE) ---

  const createRecord = useCallback(async (collectionName, newData) => {
    setIsMutating(true);
    setMutationError(null); // Limpa erros de mutação anteriores
    try {
      const result = await postDocument(collectionName, newData);
      // Opcional: Atualizar o estado 'data' localmente após um POST bem-sucedido
      // Isso evita uma nova requisição GET imediatamente. Adapte conforme a necessidade da sua UI.
      if (Array.isArray(data)) {
        setData((prevData) => [...prevData, result]);
      }
      return result; // Retorna o resultado para o componente que chamou
    } catch (err) {
      setMutationError(`Erro ao criar registro: ${err.message}`);
      console.error(`Erro ao criar registro em ${collectionName}:`, err);
      throw err; // Re-lança o erro para o componente lidar
    } finally {
      setIsMutating(false);
    }
  }, [data]); // Adicionado 'data' para garantir que setData use o estado mais recente

  const updateRecord = useCallback(async (collectionName, id, updatedData) => {
    setIsMutating(true);
    setMutationError(null);
    try {
      const result = await putDocument(collectionName, id, updatedData);
      // Opcional: Atualizar o estado 'data' localmente após um PUT bem-sucedido
      if (Array.isArray(data)) {
        setData((prevData) =>
          prevData.map((item) => (item.id === id ? { ...item, ...result } : item))
        );
      }
      return result;
    } catch (err) {
      setMutationError(`Erro ao atualizar registro: ${err.message}`);
      console.error(`Erro ao atualizar registro ${id} em ${collectionName}:`, err);
      throw err;
    } finally {
      setIsMutating(false);
    }
  }, [data]);

  const deleteRecord = useCallback(async (collectionName, id) => {
    setIsMutating(true);
    setMutationError(null);
    try {
      await deleteDocument(collectionName, id);
      // Opcional: Atualizar o estado 'data' localmente após um DELETE bem-sucedido
      if (Array.isArray(data)) {
        setData((prevData) => prevData.filter((item) => item.id !== id));
      }
      return { success: true, message: `Registro ${id} deletado com sucesso.` };
    } catch (err) {
      setMutationError(`Erro ao deletar registro: ${err.message}`);
      console.error(`Erro ao deletar registro ${id} de ${collectionName}:`, err);
      throw err;
    } finally {
      setIsMutating(false);
    }
  }, [data]);

  // Efeito para executar a busca inicial se initialFetchPath for fornecido
  useEffect(() => {
    if (initialFetchPath) {
      fetchData(initialFetchPath);
    }
  }, [initialFetchPath, fetchData]); // Adicione fetchData como dependência para useCallback

  return {
    data,
    loading,
    error,
    isMutating,
    mutationError,
    fetchData, // Expõe a função de busca para ser chamada manualmente
    createRecord,
    updateRecord,
    deleteRecord,
  };
};

export default useDataOperations;