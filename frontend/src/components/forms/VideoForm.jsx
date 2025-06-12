// components/forms/VideoForm.js
import React, { useState, useEffect } from 'react';

function VideoForm({ item, onChange }) {
  const [src, setSrc] = useState(item?.src || '');
  const [mimeType, setMimeType] = useState(item?.mimeType || '');
  const [caption, setCaption] = useState(item?.caption || '');

  // Sincroniza estado local com a prop 'item'
  useEffect(() => {
    setSrc(item?.src || '');
    setMimeType(item?.mimeType || '');
    setCaption(item?.caption || '');
  }, [item]);

  const handleSrcChange = (e) => {
    const newValue = e.target.value;
    setSrc(newValue);
    onChange({ src: newValue, mimeType, caption });
  };

  const handleMimeTypeChange = (e) => {
    const newValue = e.target.value;
    setMimeType(newValue);
    onChange({ src, mimeType: newValue, caption });
  };

  const handleCaptionChange = (e) => {
    const newValue = e.target.value;
    setCaption(newValue);
    onChange({ src, mimeType, caption: newValue });
  };

  return (
    <div>
      <label htmlFor="video-src">URL do Vídeo:</label>
      <input
        id="video-src"
        type="url"
        value={src}
        onChange={handleSrcChange}
        placeholder="Ex: /assets/videos/meu-video.mp4"
        style={{ width: '100%', marginBottom: '10px' }}
      />

      <label htmlFor="video-mimeType">Tipo MIME (Ex: video/mp4):</label>
      <input
        id="video-mimeType"
        type="text"
        value={mimeType}
        onChange={handleMimeTypeChange}
        placeholder="video/mp4"
        style={{ width: '100%', marginBottom: '10px' }}
      />

      <label htmlFor="video-caption">Legenda (Opcional):</label>
      <input
        id="video-caption"
        type="text"
        value={caption}
        onChange={handleCaptionChange}
        style={{ width: '100%' }}
      />
    </div>
  );
}

export default VideoForm;