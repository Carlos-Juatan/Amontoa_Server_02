// components/forms/LinkForm.js
import React, { useState, useEffect } from 'react';

function LinkForm({ item, onChange }) {
  const [content, setContent] = useState(item?.content || '');
  const [href, setHref] = useState(item?.href || '');

  // Sincroniza estado local com a prop 'item'
  useEffect(() => {
    setContent(item?.content || '');
    setHref(item?.href || '');
  }, [item]);

  const handleContentChange = (e) => {
    const newValue = e.target.value;
    setContent(newValue);
    // Atualiza o pai imediatamente com o conteúdo atual
    onChange({ content: newValue, href });
  };

  const handleHrefChange = (e) => {
    // Apenas atualiza o estado local durante a digitação
    setHref(e.target.value);
  };

  // --- NOVA FUNÇÃO PARA MANIPULAR O FOCO (onBlur) ---
  const handleHrefBlur = () => {
    let currentValue = href; // Pega o valor atual do estado

    // Verifica se o valor não está vazio e se não começa com 'http://' ou 'https://'
    // Esta verificação acontece apenas quando o campo perde o foco
    if (currentValue && !currentValue.startsWith('http://') && !currentValue.startsWith('https://')) {
      currentValue = `https://${currentValue}`; // Adiciona o prefixo HTTPS
      setHref(currentValue); // Atualiza o estado com o valor modificado
    }
    // Sempre chama onChange para garantir que o componente pai receba o valor final
    onChange({ content, href: currentValue });
  };
  // ----------------------------------------------------

  return (
    <div>
      <label htmlFor="link-content">Texto do Link:</label>
      <input
        id="link-content"
        type="text"
        value={content}
        onChange={handleContentChange}
        placeholder="Acesse nosso site!"
        style={{ width: '100%', marginBottom: '10px' }}
      />

      <label htmlFor="link-href">URL do Link (href):</label>
      <input
        id="link-href"
        type="url"
        value={href}
        onChange={handleHrefChange} // onChange apenas atualiza o estado local
        onBlur={handleHrefBlur}     // onBlur aplica a lógica de prefixo e notifica o pai
        placeholder="https://exemplo.com.br"
        style={{ width: '100%' }}
      />
    </div>
  );
}

export default LinkForm;