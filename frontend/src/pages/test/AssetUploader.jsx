import React, { useState } from 'react';
import useAssetOperations from './../../hooks/useAssetOperations'; // Ajuste o caminho

function AssetUploader() {
  const { isUploading, uploadError, uploadedAssetInfo, handleUpload, getAssetUrl } = useAssetOperations();
  const [selectedFile, setSelectedFile] = useState(null);
  const [folderName, setFolderName] = useState('images'); // Pasta padrão para imagens
  const [customFileName, setCustomFileName] = useState('');

  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const onFolderNameChange = (event) => {
    setFolderName(event.target.value);
  };

  const onFileNameChange = (event) => {
    setCustomFileName(event.target.value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert('Por favor, selecione um arquivo para upload.');
      return;
    }

    // --- Adicione um log aqui no frontend ANTES DE CHAMAR handleUpload ---
    console.log('Frontend - Enviando para upload:');
    console.log('  Selected File:', selectedFile);
    console.log('  Folder Name:', folderName);
    console.log('  Custom File Name:', customFileName);
    console.log('  Valor que será passado para customFileName (considerando || null):', customFileName || null);

    try {
      // Apenas envie customFileName se ele não for uma string vazia
      // Isso garante que o campo 'fileName' só será anexado ao FormData se houver um nome válido.
      const nameToSend = customFileName.trim() !== '' ? customFileName : null;

      const result = await handleUpload(selectedFile, folderName, nameToSend);
      console.log('Upload concluído com sucesso:', result);
    } catch (error) {
      console.error('Falha ao enviar arquivo:', error);
    }
  };

  return (
    <div>
      <h2>Upload de Imagens/Vídeos</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label>
            Arquivo:
            <input type="file" onChange={onFileChange} />
          </label>
        </div>
        <div>
          <label>
            Pasta Destino (ex: images, videos):
            <input type="text" value={folderName} onChange={onFolderNameChange} />
          </label>
        </div>
        <div>
          <label>
            Nome Personalizado do Arquivo (opcional):
            <input type="text" value={customFileName} onChange={onFileNameChange} placeholder="Ex: meu_avatar.png" />
          </label>
        </div>
        <button type="submit" disabled={isUploading}>
          {isUploading ? 'Enviando...' : 'Fazer Upload'}
        </button>
      </form>

      {uploadError && <p style={{ color: 'red' }}>Erro: {uploadError}</p>}

      {uploadedAssetInfo && (
        <div>
          <h3>Arquivo Enviado!</h3>
          <p>Nome: {uploadedAssetInfo.fileName}</p>
          <p>URL: <a href={getAssetUrl(folderName, uploadedAssetInfo.fileName)} target="_blank" rel="noopener noreferrer">{getAssetUrl(folderName, uploadedAssetInfo.fileName)}</a></p>
          {uploadedAssetInfo.fileUrl.match(/\.(jpeg|jpg|png|gif)$/i) && (
            <img src={getAssetUrl(folderName, uploadedAssetInfo.fileName)} alt="Uploaded Asset" style={{ maxWidth: '200px', marginTop: '10px' }} />
          )}
          {uploadedAssetInfo.fileUrl.match(/\.(mp4|mov|avi|wmv|webm)$/i) && (
            <video controls src={getAssetUrl(folderName, uploadedAssetInfo.fileName)} style={{ maxWidth: '300px', marginTop: '10px' }}>
              Seu navegador não suporta a tag de vídeo.
            </video>
          )}
        </div>
      )}
    </div>
  );
}

export default AssetUploader;