// assets.controller.js
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

const ASSETS_BASE_DIR = process.env.ASSETS_PATH || path.join(__dirname, '..', '..', 'assets_data');

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    let category = '';
    if (req.originalUrl.includes('/upload/images')) {
        category = 'images';
    } else if (req.originalUrl.includes('/upload/videos')) {
        category = 'videos';
    } else {
        // Fallback ou erro se a categoria não for clara.
        // Para as rotas propostas, isso não deve acontecer.
        category = 'misc'; 
    }

    // Constrói o caminho da pasta dinamicamente
    let folderPathParts = [category]; // Começa com a categoria (images/videos)

    if (req.params.folderName) {
      folderPathParts.push(req.params.folderName);
    }
    if (req.params.subfolder) {
      folderPathParts.push(req.params.subfolder);
    }

    // Se nenhuma subpasta for fornecida (apenas /upload/images), use um padrão
    if (folderPathParts.length === 1 && category !== 'misc') {
        folderPathParts.push('default'); // Ex: /assets_data/images/default
    } else if (folderPathParts.length === 1 && category === 'misc') {
        folderPathParts.push('uploads'); // Fallback para outras categorias não explicitas
    }

    const targetSubDir = path.join(...folderPathParts);

    // É crucial que `targetSubDir` seja tratado como um caminho seguro.
    // path.normalize() já ajuda, mas a substituição regex previne '..'
    const sanitizedTargetSubDir = path.normalize(targetSubDir).replace(/^(\.\.[/\\])+/, '');

    const targetDir = path.join(ASSETS_BASE_DIR, sanitizedTargetSubDir);

    try {
      // O { recursive: true } é a chave! Ele cria todas as subpastas necessárias.
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
  const allowedMimeTypes = /jpeg|jpg|png|gif|mp4|mov|avi|wmv|webm/;
  const isMimeTypeAllowed = allowedMimeTypes.test(file.mimetype);
  const isExtensionAllowed = allowedMimeTypes.test(path.extname(file.originalname).toLowerCase());

  if (isMimeTypeAllowed && isExtensionAllowed) {
    return cb(null, true);
  }
  cb(new Error("Tipo de arquivo não suportado. Apenas imagens (jpeg, jpg, png, gif) e vídeos (mp4, mov, avi, wmv, webm) são permitidos."));
};

const uploadMiddleware = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 25 * 1024 * 1024 }
}).fields([
  { name: 'file', maxCount: 1 },
  { name: 'fileName', maxCount: 1 }
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

    // Reconstroi o caminho da URL para a resposta
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

    // Se nenhuma subpasta for fornecida na URL, use o nome da pasta padrão que foi usada
    if (urlPathParts.length === 1 && category !== 'misc') {
        urlPathParts.push('default'); 
    } else if (urlPathParts.length === 1 && category === 'misc') {
        urlPathParts.push('uploads'); 
    }

    const fullUrlPath = urlPathParts.join('/'); // Monta o caminho para a URL

    const { fileName: customFileName } = req.body;
    let finalFileName = uploadedFile.filename;

    console.log('--- Post-upload processing started ---');
    console.log('req.body (after multer processing):', req.body);
    console.log('customFileName from req.body:', customFileName);
    console.log('uploadedFile.path (original path):', uploadedFile.path);

    // Se um nome customizado foi fornecido, renomeie o arquivo
    if (customFileName) {
      const fileExtension = path.extname(uploadedFile.originalname);
      const sanitizedCustomFileName = customFileName.replace(/[^a-zA-Z0-9-_.]/g, '_');
      const newFileName = sanitizedCustomFileName + fileExtension;
      const newFilePath = path.join(uploadedFile.destination, newFileName);

      try {
        await fs.rename(uploadedFile.path, newFilePath);
        finalFileName = newFileName;
        console.log(`Arquivo renomeado de ${uploadedFile.filename} para ${finalFileName}`);
      } catch (renameErr) {
        console.error(`Erro ao renomear o arquivo de ${uploadedFile.path} para ${newFilePath}:`, renameErr);
      }
    } else {
      console.log('Nenhum nome customizado fornecido. Mantendo nome original/gerado.');
    }
    console.log('--- Post-upload processing finished ---');

    const fileUrl = `/assets/${fullUrlPath}/${finalFileName}`; // A URL final

    res.status(200).json({
      message: 'Arquivo enviado e salvo com sucesso!',
      fileName: finalFileName,
      filePath: path.join(uploadedFile.destination, finalFileName),
      fileUrl: fileUrl
    });
  });
};