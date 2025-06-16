// src/utils/imageConverter.js
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises; // Usamos fs.promises para operações assíncronas

/**
 * Converte uma imagem para o formato AVIF.
 * @param {string} inputFilePath - Caminho completo para o arquivo de imagem de entrada.
 * @param {string} outputDir - Diretório onde o arquivo AVIF será salvo.
 * @param {number} [quality=70] - Qualidade do AVIF (0-100).
 * @returns {Promise<string>} - Retorna o caminho completo do arquivo AVIF gerado.
 */
async function convertToAvif(inputFilePath, outputDir, quality = 70) {
  const fileName = path.parse(inputFilePath).name; // Nome do arquivo sem extensão
  const outputFileName = `${fileName}.avif`;
  const outputFilePath = path.join(outputDir, outputFileName);

  try {
    // Garante que o diretório de saída exista
    await fs.mkdir(outputDir, { recursive: true });

    await sharp(inputFilePath)
      .avif({ quality: quality })
      .toFile(outputFilePath);

    console.log(`Imagem convertida para AVIF: ${outputFilePath}`);
    return outputFilePath;
  } catch (error) {
    console.error(`Erro ao converter ${inputFilePath} para AVIF:`, error);
    throw new Error(`Falha na conversão para AVIF: ${error.message}`);
  }
}

/**
 * Verifica se um arquivo é uma imagem que pode ser convertida para AVIF.
 * Atualmente suporta JPEG, PNG, GIF, TIFF, WebP.
 * @param {string} mimeType - O tipo MIME do arquivo.
 * @returns {boolean}
 */
function isConvertibleImage(mimeType) {
  return ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/tiff'].includes(mimeType);
}


module.exports = {
  convertToAvif,
  isConvertibleImage
};