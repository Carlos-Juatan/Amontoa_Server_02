const BASE_URL = 'http://localhost:3000'; // URL base do seu servidor
const DATA_ENDPOINT = `${BASE_URL}/data`; // Endpoint para acesso às coleções

// Função auxiliar para construir URLs de coleções
const getCollectionUrl = (collectionName) => {
  if (!collectionName) {
    throw new Error('Nome da coleção é obrigatório.');
  }
  return `${DATA_ENDPOINT}/${collectionName}`;
};

// Função auxiliar para construir URLs de documentos específicos
const getDocumentUrl = (collectionName, id) => {
  if (!collectionName || !id) {
    throw new Error('Nome da coleção e ID do documento são obrigatórios.');
  }
  return `${DATA_ENDPOINT}/${collectionName}/${id}`;
};

// =========================================================
// Funções de Operações CRUD
// =========================================================

/**
 * Busca dados de uma categoria/coleção específica.
 * @param {string} dataPath - O caminho dos dados, como 'data/dashboard' ou 'data/studies'.
 * @returns {Promise<Array | Object>} Os dados da coleção.
 */
export const fetchCategoryData = async (dataPath) => {
  // dataPath já vem no formato 'data/studies', então apenas precisamos concatenar com BASE_URL
  const url = `${DATA_ENDPOINT}/${dataPath}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Erro ao buscar dados de ${url}:`, error);
    throw error;
  }
};

/**
 * Adiciona um novo documento a uma coleção.
 * @param {string} collectionName - O nome da coleção (ex: 'dashboard', 'studies').
 * @param {Object} newData - O objeto de dados a ser adicionado.
 * @returns {Promise<Object>} O documento criado.
 */
export const postDocument = async (collectionName, newData) => {
  const url = getCollectionUrl(collectionName);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Erro ao criar documento em ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Atualiza um documento existente em uma coleção.
 * @param {string} collectionName - O nome da coleção.
 * @param {string} id - O ID do documento a ser atualizado.
 * @param {Object} updatedData - O objeto de dados com as atualizações.
 * @returns {Promise<Object>} O documento atualizado.
 */
export const putDocument = async (collectionName, id, updatedData) => {
  const url = getDocumentUrl(collectionName, id);
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Erro ao atualizar documento ${id} em ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Deleta um documento de uma coleção.
 * @param {string} collectionName - O nome da coleção.
 * @param {string} id - O ID do documento a ser deletado.
 * @returns {Promise<Object>} Uma confirmação de sucesso ou erro.
 */
export const deleteDocument = async (collectionName, id) => {
  const url = getDocumentUrl(collectionName, id);
  try {
    const response = await fetch(url, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // Para operações DELETE, a resposta pode não ter JSON, ou pode ser um objeto vazio.
    // Verifique o status para determinar o sucesso.
    // Pode retornar response.statusText ou um objeto de sucesso personalizado.
    return { success: true, message: `Documento ${id} deletado com sucesso.` };
  } catch (error) {
    console.error(`Erro ao deletar documento ${id} de ${collectionName}:`, error);
    throw error;
  }
};