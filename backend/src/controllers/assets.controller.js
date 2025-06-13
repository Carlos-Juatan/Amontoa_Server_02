const multer = require('multer');
const path = require('path');
const fs = require('fs').promises; // Importe o fs.promises para usar async/await

const ASSETS_BASE_DIR = process.env.ASSETS_PATH || path.join(__dirname, '..', '..', 'assets_data');

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const { folderName } = req.params;
    const targetDir = path.join(ASSETS_BASE_DIR, folderName);

    try {
      await fs.mkdir(targetDir, { recursive: true });
      cb(null, targetDir);
    } catch (error) {
      console.error(`Erro ao criar diretório ${targetDir}:`, error);
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    // --- SIMPLIFIQUE AQUI: Sempre use o nome original por enquanto ---
    // Ou gere um UUID para evitar colisões temporárias antes do renomeio
    const fileExtension = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Usar um nome temporário para garantir unicidade antes de renomear
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
    // Ou, para simplificar o teste, use o nome original.
    // cb(null, file.originalname); // Se usar isso, pode haver colisões de nomes se não renomear.
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
  uploadMiddleware(req, res, async (err) => { // Async para usar await no fs.promises.rename
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

    const { folderName } = req.params;
    const { fileName: customFileName } = req.body; // <--- AGORA req.body ESTÁ DISPONÍVEL AQUI

    let finalFileName = uploadedFile.filename; // Nome inicial dado pelo Multer

    console.log('--- Post-upload processing started ---');
    console.log('req.body (after multer processing):', req.body);
    console.log('customFileName from req.body:', customFileName);
    console.log('uploadedFile.path (original path):', uploadedFile.path);

    // Se um nome customizado foi fornecido, renomeie o arquivo
    if (customFileName) {
      const fileExtension = path.extname(uploadedFile.originalname);
      const sanitizedCustomFileName = customFileName.replace(/[^a-zA-Z0-9-_.]/g, '_'); // Sanitizar
      const newFileName = sanitizedCustomFileName + fileExtension;
      const newFilePath = path.join(uploadedFile.destination, newFileName);

      try {
        await fs.rename(uploadedFile.path, newFilePath);
        finalFileName = newFileName; // Atualiza o nome final para a resposta
        console.log(`Arquivo renomeado de ${uploadedFile.filename} para ${finalFileName}`);
      } catch (renameErr) {
        console.error(`Erro ao renomear o arquivo de ${uploadedFile.path} para ${newFilePath}:`, renameErr);
        // Pode decidir se quer falhar o upload aqui ou retornar com o nome original
        // Por simplicidade, vamos apenas logar e prosseguir com o nome original se falhar
      }
    } else {
      console.log('Nenhum nome customizado fornecido. Mantendo nome original/gerado.');
    }
    console.log('--- Post-upload processing finished ---');

    const fileUrl = `/assets/${folderName}/${finalFileName}`;

    res.status(200).json({
      message: 'Arquivo enviado e salvo com sucesso!',
      fileName: finalFileName,
      filePath: path.join(uploadedFile.destination, finalFileName), // Caminho final após renomeio
      fileUrl: fileUrl
    });
  });
};