// components/forms/ParagraphForm.js (Exemplo de um componente de formulário)
// Você precisará criar um para cada tipo de nota
import React, { useState, useEffect } from 'react';

function ParagraphForm({ item, onChange }) {
  const [content, setContent] = useState(item?.content || '');

  // *** Adicione este useEffect ***
  useEffect(() => {
    // Quando a prop 'item' muda (incluindo quando ela se torna um objeto vazio),
    // atualize o estado interno para refletir o novo valor (ou vazio)
    setContent(item?.content || '');
  }, [item]); // Monitore a prop 'item'
 
  // Handler para o evento onChange do textarea
  const handleContentChange = (e) => {
    const newValue = e.target.value;
    setContent(newValue); // Atualiza o estado local
    onChange({ content: newValue }); // Notifica o componente pai imediatamente
  };

  return (
    <div>
      <label htmlFor="paragraph-content">Conteúdo do Parágrafo:</label>
      <textarea
        id="paragraph-content"
        value={content}
        onChange={handleContentChange} // Usa o novo handler
        rows="5"
        style={{ width: '100%' }}
      />
    </div>
  );
}
export default ParagraphForm;