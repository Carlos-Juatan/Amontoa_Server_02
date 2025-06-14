// src/components/forms/ImageForm.js
import React, { useState, useEffect } from 'react';

function ImageForm({ item, onChange, moduleTile, submoduleTitle, lessonTitle, onFileChange, imageUrl, selectedFile }) {
  const [src, setSrc] = useState(item?.src || '');
  const [alt, setAlt] = useState(item?.alt || '');
  const [caption, setCaption] = useState(item?.caption || '');

  // Sincroniza estado local com a prop 'item' e 'imageUrl'
  useEffect(() => {
    setSrc(item?.src || imageUrl || ''); // Prioriza item.src, depois imageUrl, depois vazio
    setAlt(item?.alt || '');
    setCaption(item?.caption || '');
  }, [item, imageUrl]); // Adicionado imageUrl como dependência

  const handleAltChange = (e) => {
    const newValue = e.target.value;
    setAlt(newValue);
    onChange({ src: selectedFile ? imageUrl : src, alt: newValue, caption }); // Garante que src use imageUrl se houver arquivo
  };

  const handleCaptionChange = (e) => {
    const newValue = e.target.value;
    setCaption(newValue);
    onChange({ src: selectedFile ? imageUrl : src, alt, caption: newValue });
  };

  // A validação para desabilitar o botão de submit agora é feita no EditModal.
  // Este componente apenas exibe a mensagem para o usuário.
  if (!moduleTile || !submoduleTitle || !lessonTitle) {
    return (
      <p style={{ color: 'red', marginBottom: '15px' }}>
        Por favor, defina o **Módulo**, **Submódulo** e **Título da Aula** antes de adicionar uma imagem.
      </p>
    );
  }

  return (
    <div className='modal-image-src-container'>
      <div className='modal-image-src'>
        <div className='modal-image-url'>
          <label htmlFor="image-src">URL da Imagem:</label>
          {/* Exibe o URL final que será salvo */}
          <p className='image-url'>{selectedFile ? imageUrl : (src || 'N/A')}</p>
        </div>
        <div className='modal-image-upload'>
          <label>
            Arquivo:
            <input type="file" onChange={onFileChange} />
          </label>
        </div>
      </div>
      <label htmlFor="image-alt">Texto Alternativo:</label>
      <input type="text" id="image-alt" value={alt} onChange={handleAltChange} style={{ width: '100%', marginBottom: '10px' }} />
      <label htmlFor="image-caption">Legenda:</label>
      <input type="text" id="image-caption" value={caption} onChange={handleCaptionChange} style={{ width: '100%' }} />
    </div>
  );
}
export default ImageForm;