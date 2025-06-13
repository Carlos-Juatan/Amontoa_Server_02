// src/services/assetService.js
const BASE_URL = 'http://localhost:3000'; // Certifique-se de que esta é a URL correta do seu backend
const ASSETS_UPLOAD_ENDPOINT = `${BASE_URL}/assets/upload`; // Endpoint para upload

/**
 * Envia um arquivo (imagem/vídeo) para o servidor.
 * @param {File} file - O objeto File do input de arquivo.
 * @param {string} folderName - O nome da pasta no servidor onde o arquivo será salvo (ex: 'images', 'videos').
 * @param {string} [customFileName] - Opcional. O nome personalizado para o arquivo. Se não for fornecido, o nome original será usado.
 * @returns {Promise<Object>} Um objeto com os detalhes do arquivo salvo (fileName, fileUrl, etc.).
 */
export const uploadFile = async (file, folderName, customFileName = null) => {
  if (!file) {
    throw new Error('Nenhum arquivo fornecido para upload.');
  }
  if (!folderName) {
    throw new Error('Nome da pasta (folderName) é obrigatório para o upload.');
  }

  const url = `${ASSETS_UPLOAD_ENDPOINT}/${folderName}`;
  const formData = new FormData();

  formData.append('file', file); // 'file' é o nome do campo que o Multer espera no backend

  if (customFileName) {
    formData.append('fileName', customFileName); // 'fileName' é o campo para o nome personalizado
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData, // FormData define automaticamente o Content-Type como 'multipart/form-data'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Erro HTTP! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Erro ao fazer upload para ${url}:`, error);
    throw error;
  }
};

/**
 * Constrói a URL pública para acessar um arquivo estático.
 * Esta função não faz uma requisição, apenas monta a URL.
 * @param {string} folderName - O nome da pasta onde o arquivo está.
 * @param {string} fileName - O nome do arquivo.
 * @returns {string} A URL completa para o arquivo.
 */
export const getPublicAssetUrl = (folderName, fileName) => {
  if (!folderName || !fileName) {
    console.warn('Nome da pasta ou do arquivo ausente para construir a URL do asset.');
    return ''; // Ou lance um erro, dependendo da sua necessidade
  }
  return `${BASE_URL}/assets/${folderName}/${fileName}`;
};

// Se você precisar de funções para deletar/atualizar assets via API,
// adicione-as aqui, seguindo o padrão de getDocumentUrl e deleteDocument.
// Por exemplo:
/*
export const deleteAsset = async (folderName, fileName) => {
  const url = `${BASE_URL}/assets/${folderName}/${fileName}`; // Se o backend tiver uma rota DELETE específica para assets
  try {
    const response = await fetch(url, { method: 'DELETE' });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return { success: true, message: 'Asset deletado com sucesso.' };
  } catch (error) {
    console.error(`Erro ao deletar asset ${fileName} de ${folderName}:`, error);
    throw error;
  }
};
*/