// src/utils/modalUtils.js

// Função utilitária para converter para Title Case
const toTitleCase = (str) => {
  // 1. Remove espaços em branco do início/fim (como o .trim() faria)
  // 2. Converte para minúsculas para garantir consistência
  // 3. Usa uma expressão regular para encontrar o início da string (\b) ou o espaço (\s) 
  //    seguido por uma letra, e transforma essa letra em maiúscula.
  return str.trim().toLowerCase().split(/\s+/).map(word => {
    // Evita erro se a palavra for vazia
    if (word.length === 0) return ''; 
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
};

export { toTitleCase };