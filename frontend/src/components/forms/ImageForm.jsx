// components/forms/ImageForm.js
import React, { useState, useEffect } from 'react';

function ImageForm({ item, onChange }) {
  const [src, setSrc] = useState(item?.src || '');
  const [alt, setAlt] = useState(item?.alt || '');
  const [caption, setCaption] = useState(item?.caption || '');

  // Sincroniza estado local com a prop 'item'
  useEffect(() => {
    setSrc(item?.src || '');
    setAlt(item?.alt || '');
    setCaption(item?.caption || '');
  }, [item]);

  // Handlers individuais para cada input
  const handleSrcChange = (e) => {
    const newValue = e.target.value;
    setSrc(newValue);
    onChange({ src: newValue, alt, caption }); // Passa todos os valores atuais
  };

  const handleAltChange = (e) => {
    const newValue = e.target.value;
    setAlt(newValue);
    onChange({ src, alt: newValue, caption });
  };

  const handleCaptionChange = (e) => {
    const newValue = e.target.value;
    setCaption(newValue);
    onChange({ src, alt, caption: newValue });
  };

  return (
    <div>
      <label htmlFor="image-src">URL da Imagem:</label>
      <input type="text" id="image-src" value={src} onChange={handleSrcChange} style={{ width: '100%', marginBottom: '10px' }} />
      <label htmlFor="image-alt">Texto Alternativo:</label>
      <input type="text" id="image-alt" value={alt} onChange={handleAltChange} style={{ width: '100%', marginBottom: '10px' }} />
      <label htmlFor="image-caption">Legenda:</label>
      <input type="text" id="image-caption" value={caption} onChange={handleCaptionChange} style={{ width: '100%' }} />
    </div>
  );
}
export default ImageForm;