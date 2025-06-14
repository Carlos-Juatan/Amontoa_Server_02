// src/hooks/useImageUpload.js
import { useState, useCallback, useMemo } from 'react';
import useAssetOperations from './useAssetOperations'; // Assumindo que este é o caminho correto

const useImageUpload = (moduleName, submoduleName, lessonTitle, fileIndex) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const { isUploading, uploadError, handleUpload, uploadedAssetInfo } = useAssetOperations();

  // Define o caminho da pasta e o nome do arquivo para o upload
  const folderName = useMemo(() => {
    return `images/${moduleName}/${submoduleName}`.trim().replace(/[^a-zA-Z0-9-_/]/g, '_');
  }, [moduleName, submoduleName]);

  const fileName = useMemo(() => {
    return `${lessonTitle}_${fileIndex}`.trim().replace(/[^a-zA-Z0-9-_/]/g, '_');
  }, [lessonTitle, fileIndex]);

  const imageUrl = useMemo(() => {
    // Use uploadedAssetInfo.url se disponível, caso contrário, construa a URL localmente
    if (uploadedAssetInfo?.url) {
      return uploadedAssetInfo.url;
    }
    // Fallback para URL local se ainda não foi feito upload
    return selectedFile ? `http://localhost:3000/assets/${folderName}/${fileName}.avif` : '';
  }, [selectedFile, folderName, fileName, uploadedAssetInfo]);


  const onFileChange = useCallback((event) => {
    setSelectedFile(event.target.files[0]);
  }, []);

  const uploadFile = useCallback(async () => {
    if (!selectedFile) {
      console.warn('Nenhum arquivo selecionado para upload.');
      return;
    }

    try {
      console.log(`Iniciando upload: pasta=${folderName}, arquivo=${fileName}`);
      const result = await handleUpload(selectedFile, folderName, fileName);
      console.log('Upload concluído com sucesso:', result);
      return result; // Retorna o resultado do upload
    } catch (error) {
      console.error('Falha ao enviar arquivo:', error);
      console.error('--Backend Upload Error:', uploadError);
      throw error; // Re-lança o erro para ser tratado pelo componente chamador
    }
  }, [selectedFile, folderName, fileName, handleUpload, uploadError]);

  const resetFileUpload = useCallback(() => {
    setSelectedFile(null);
    // Não resetar uploadedAssetInfo aqui, pois queremos manter a URL após o upload bem-sucedido
  }, []);

  return {
    selectedFile,
    onFileChange,
    uploadFile,
    imageUrl,
    isUploading,
    uploadError,
    resetFileUpload,
  };
};

export default useImageUpload;