const multer = require('multer');
const path = require('path');
const fs = require('fs').promises; // Usar promises para operações de sistema de arquivos

// Define o diretório base para salvar os assets.
// Ele pega o valor da variável de ambiente ASSETS_PATH definida no docker-compose.yml.
// Se não estiver definida (ex: em ambiente de desenvolvimento local sem Docker),
// ele usa uma pasta 'assets_data' relativa ao diretório do projeto.
const ASSETS_BASE_DIR = process.env.ASSETS_PATH || path.join(__dirname, '..', '..', 'assets_data');

// Configuração do Multer para armazenamento em disco
const storage = multer.diskStorage({
  // Define o destino do arquivo
  destination: async (req, file, cb) => {
    const { folderName } = req.params; // Pega o nome da pasta da URL (ex: 'images', 'videos')
    const targetDir = path.join(ASSETS_BASE_DIR, folderName); // Caminho completo da pasta de destino

    try {
      // Cria o diretório recursivamente se ele não existir
      await fs.mkdir(targetDir, { recursive: true });
      cb(null, targetDir); // Chama a callback com o diretório de destino
    } catch (error) {
      console.error(`Erro ao criar diretório ${targetDir}:`, error);
      cb(error); // Retorna um erro se a criação da pasta falhar
    }
  },
  // Define o nome do arquivo no disco
  filename: (req, file, cb) => {
    // O nome do arquivo pode vir no corpo da requisição via campo 'fileName'
    const { fileName } = req.body;
    const fileExtension = path.extname(file.originalname); // Obtém a extensão original do arquivo

    if (fileName) {
      // Se um fileName foi fornecido no corpo, usa-o com a extensão original
      cb(null, fileName + fileExtension);
    } else {
      // Caso contrário, usa o nome original do arquivo
      cb(null, file.originalname);
    }
  }
});

// Filtro de arquivos: aceita apenas tipos MIME de imagem e vídeo
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = /jpeg|jpg|png|gif|mp4|mov|avi|wmv|webm/;
  const isMimeTypeAllowed = allowedMimeTypes.test(file.mimetype);
  const isExtensionAllowed = allowedMimeTypes.test(path.extname(file.originalname).toLowerCase());

  if (isMimeTypeAllowed && isExtensionAllowed) {
    return cb(null, true); // Aceita o arquivo
  }
  // Rejeita o arquivo com uma mensagem de erro
  cb(new Error("Tipo de arquivo não suportado. Apenas imagens (jpeg, jpg, png, gif) e vídeos (mp4, mov, avi, wmv, webm) são permitidos."));
};

// Configuração principal do Multer
const upload = multer({
  storage: storage,         // Usa a configuração de armazenamento definida acima
  fileFilter: fileFilter,   // Aplica o filtro de tipos de arquivo
  limits: { fileSize: 25 * 1024 * 1024 } // Limite de tamanho do arquivo: 25MB (ajuste conforme necessário)
});

// Função controladora para lidar com o upload de um único arquivo
exports.uploadFile = (req, res, next) => {
  // `upload.single('file')` espera um campo de formulário chamado 'file'
  upload.single('file')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      // Erro específico do Multer (ex: tamanho excedido, tipo de arquivo inválido)
      console.error("MulterError:", err.message);
      return res.status(400).json({ message: 'Erro no upload do arquivo', error: err.message });
    } else if (err) {
      // Outros erros (ex: erro ao criar pasta)
      console.error("Erro desconhecido no upload:", err.message);
      return res.status(500).json({ message: 'Erro interno do servidor', error: err.message });
    }

    // Se nenhum arquivo foi enviado (apesar de tudo)
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
    }

    const { folderName } = req.params;
    const uploadedFileName = req.file.filename; // Nome final do arquivo salvo

    // Constrói a URL pública para acessar o arquivo
    // '/assets' é o prefixo que o Express usa para servir arquivos estáticos
    const fileUrl = `/assets/${folderName}/${uploadedFileName}`;

    res.status(200).json({
      message: 'Arquivo enviado e salvo com sucesso!',
      fileName: uploadedFileName,
      filePath: req.file.path, // Caminho completo do arquivo no servidor (dentro do contêiner)
      fileUrl: fileUrl         // URL acessível publicamente via navegador
    });
  });
};