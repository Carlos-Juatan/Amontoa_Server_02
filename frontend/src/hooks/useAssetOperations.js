// src/hooks/useAssetOperations.js
import { useState, useCallback } from 'react';
import { uploadFile, getPublicAssetUrl /* , deleteAsset */ } from '../services/assetService'; // Importe as funções de serviço

const useAssetOperations = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadedAssetInfo, setUploadedAssetInfo] = useState(null); // Para armazenar a URL e outros dados do asset

  /**
   * Função para lidar com o upload de um arquivo.
   * @param {File} file - O objeto File a ser enviado.
   * @param {string} folderName - Nome da pasta de destino no servidor (ex: 'images').
   * @param {string} [customFileName] - Opcional. Nome para renomear o arquivo.
   */
  const handleUpload = useCallback(async (file, folderName, customFileName = null) => {
    setIsUploading(true);
    setUploadError(null);
    setUploadedAssetInfo(null); // Limpa informações de upload anterior

    try {
      const result = await uploadFile(file, folderName, customFileName);
      setUploadedAssetInfo(result); // Guarda as informações retornadas pelo backend
      return result; // Retorna o resultado para o componente que chamou
    } catch (err) {
      setUploadError(`Falha no upload: ${err.message}`);
      console.error('Erro no hook de upload:', err);
      throw err; // Re-lança o erro para o componente lidar, se necessário
    } finally {
      setIsUploading(false);
    }
  }, []);

  /**
   * Função auxiliar para obter a URL pública de um asset.
   * Útil para exibir a imagem/vídeo após o upload ou se você já souber o nome do arquivo.
   * @param {string} folderName - Nome da pasta onde o arquivo está.
   * @param {string} fileName - Nome do arquivo.
   * @returns {string} A URL completa do asset.
   */
  const getAssetUrl = useCallback((folderName, fileName) => {
    return getPublicAssetUrl(folderName, fileName);
  }, []);

  /*
  // Exemplo de como você adicionaria a função de deletar se o backend suportar
  const handleDeleteAsset = useCallback(async (folderName, fileName) => {
    setIsUploading(true); // Reutilizando o estado de loading de upload para mutação
    setUploadError(null);
    try {
      await deleteAsset(folderName, fileName);
      setUploadedAssetInfo(null); // Limpa a info do asset deletado
      return { success: true };
    } catch (err) {
      setUploadError(`Falha ao deletar asset: ${err.message}`);
      console.error('Erro no hook ao deletar asset:', err);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, []);
  */

  return {
    isUploading,
    uploadError,
    uploadedAssetInfo,
    handleUpload,
    getAssetUrl,
    // handleDeleteAsset, // Se você implementar a função de delete
  };
};

export default useAssetOperations;