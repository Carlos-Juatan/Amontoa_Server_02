// src/controllers/assets.controller.js
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { convertToAvif, isConvertibleImage } = require('../utils/imageConverter'); // Importa as funções de conversão

const ASSETS_BASE_DIR = process.env.ASSETS_PATH || path.join(__dirname, '..', '..', 'assets_data');

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    let category = '';
    if (req.originalUrl.includes('/upload/images')) {
      category = 'images';
    } else if (req.originalUrl.includes('/upload/videos')) {
      category = 'videos';
    } else {
      category = 'misc';
    }

    let folderPathParts = [category];

    if (req.params.folderName) {
      folderPathParts.push(req.params.folderName);
    }
    if (req.params.subfolder) {
      folderPathParts.push(req.params.subfolder);
    }

    if (folderPathParts.length === 1 && category !== 'misc') {
      folderPathParts.push('default');
    } else if (folderPathParts.length === 1 && category === 'misc') {
      folderPathParts.push('uploads');
    }

    const targetSubDir = path.join(...folderPathParts);
    const sanitizedTargetSubDir = path.normalize(targetSubDir).replace(/^(\.\.[/\\])+/, '');
    const targetDir = path.join(ASSETS_BASE_DIR, sanitizedTargetSubDir);

    try {
      await fs.mkdir(targetDir, { recursive: true });
      cb(null, targetDir);
    } catch (error) {
      console.error(`Erro ao criar diretório ${targetDir}:`, error);
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = /jpeg|jpg|png|gif|mp4|mov|avi|wmv|webm|webp|tiff/;
  const isMimeTypeAllowed = allowedMimeTypes.test(file.mimetype);
  const isExtensionAllowed = allowedMimeTypes.test(path.extname(file.originalname).toLowerCase());

  if (isMimeTypeAllowed && isExtensionAllowed) {
    return cb(null, true);
  }
  cb(new Error("Tipo de arquivo não suportado. Apenas imagens (jpeg, jpg, png, gif, webp, tiff) e vídeos (mp4, mov, avi, wmv, webm) são permitidos."));
};

const uploadMiddleware = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 25 * 1024 * 1024 }
}).fields([
  { name: 'file', maxCount: 1 },
  { name: 'fileName', maxCount: 1 } // Removido o campo 'convertToAvif' daqui
]);


exports.uploadFile = (req, res, next) => {
  uploadMiddleware(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.error("MulterError:", err.message);
      return res.status(400).json({ message: 'Erro no upload do arquivo', error: err.message });
    } else if (err) {
      console.error("Erro desconhecido no upload:", err.message);
      return res.status(500).json({ message: 'Erro interno do servidor', error: err.message });
    }

    const uploadedFile = req.files && req.files['file'] ? req.files['file'][0] : null;

    if (!uploadedFile) {
      return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
    }

    // Determina a categoria com base na URL para a URL de resposta
    let category = '';
    if (req.originalUrl.includes('/upload/images')) {
      category = 'images';
    } else if (req.originalUrl.includes('/upload/videos')) {
      category = 'videos';
    } else {
      category = 'misc';
    }

    let urlPathParts = [category];
    if (req.params.folderName) {
      urlPathParts.push(req.params.folderName);
    }
    if (req.params.subfolder) {
      urlPathParts.push(req.params.subfolder);
    }

    if (urlPathParts.length === 1 && category !== 'misc') {
      urlPathParts.push('default');
    } else if (urlPathParts.length === 1 && category === 'misc') {
      urlPathParts.push('uploads');
    }

    const { fileName: customFileName } = req.body; // Não pegamos mais o convertToAvifFlag
    let finalFileName = uploadedFile.filename;
    let avifUrl = null;
    let avifFilePath = null;

    console.log('--- Post-upload processing started ---');
    console.log('req.body (after multer processing):', req.body);
    console.log('customFileName from req.body:', customFileName);
    console.log('uploadedFile.path (original path):', uploadedFile.path);

    // Se um nome customizado foi fornecido, renomeie o arquivo original primeiro
    if (customFileName) {
      const fileExtension = path.extname(uploadedFile.originalname);
      const sanitizedCustomFileName = customFileName.replace(/[^a-zA-Z0-9-_.]/g, '_');
      const newFileName = sanitizedCustomFileName + fileExtension;
      const newFilePath = path.join(uploadedFile.destination, newFileName);

      try {
        await fs.rename(uploadedFile.path, newFilePath);
        uploadedFile.path = newFilePath; // Atualiza o caminho do arquivo para o novo nome
        uploadedFile.filename = newFileName; // Atualiza o nome do arquivo
        finalFileName = newFileName;
        console.log(`Arquivo original renomeado para: ${finalFileName}`);
      } catch (renameErr) {
        console.error(`Erro ao renomear o arquivo de ${uploadedFile.path} para ${newFilePath}:`, renameErr);
      }
    } else {
      console.log('Nenhum nome customizado fornecido. Mantendo nome original/gerado.');
    }

    // --- Lógica de Conversão para AVIF (AGORA AUTOMÁTICA PARA IMAGENS) ---
    // Só tenta converter se a categoria for 'images' E o arquivo for uma imagem conversível
    if (category === 'images' && isConvertibleImage(uploadedFile.mimetype)) {
      try {
        const originalBaseName = path.parse(finalFileName).name; // Usa o nome FINAL para o AVIF
        const avifFileName = `${originalBaseName}.avif`;
        const avifDestinationPath = path.join(uploadedFile.destination, avifFileName);

        await convertToAvif(uploadedFile.path, uploadedFile.destination, 70); // Qualidade padrão 70

        avifFilePath = avifDestinationPath;
        avifUrl = `/assets/${urlPathParts.join('/')}/${avifFileName}`;
        console.log(`Arquivo AVIF gerado: ${avifFilePath}`);

      } catch (convertError) {
        console.error("Erro ao converter para AVIF:", convertError.message);
        // Não impede o upload do arquivo original, apenas informa sobre a falha na conversão
      }
    } else {
      console.log('Conversão para AVIF não aplicável (não é uma imagem ou rota de vídeo).');
    }

    console.log('--- Post-upload processing finished ---');

    const fileUrl = `/assets/${urlPathParts.join('/')}/${finalFileName}`; // URL do arquivo original (ou renomeado)

    res.status(200).json({
      message: 'Arquivo enviado e salvo com sucesso!',
      fileName: finalFileName,
      filePath: path.join(uploadedFile.destination, finalFileName),
      fileUrl: fileUrl,
      avif: avifUrl ? { // Inclui informações do AVIF apenas se a conversão ocorreu
        fileName: path.basename(avifFilePath),
        filePath: avifFilePath,
        fileUrl: avifUrl
      } : undefined
    });

    // Opcional: Remover o arquivo original após a conversão, se desejar manter apenas o AVIF
    // Esta parte só será executada se avifFilePath foi definido (ou seja, se a conversão AVIF aconteceu)
    if (avifFilePath) { // Simplificado: só verifica se avifFilePath foi criado
      try {
        await fs.unlink(uploadedFile.path); // Remove o arquivo original (ou renomeado)
        console.log(`Arquivo original ${uploadedFile.path} removido após conversão para AVIF.`);
      } catch (unlinkErr) {
        console.error(`Erro ao remover arquivo original ${uploadedFile.path}:`, unlinkErr);
      }
    }
  });
};