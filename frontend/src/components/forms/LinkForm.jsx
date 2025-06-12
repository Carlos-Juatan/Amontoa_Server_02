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
    onChange({ content: newValue, href });
  };

  const handleHrefChange = (e) => {
    const newValue = e.target.value;
    setHref(newValue);
    onChange({ content, href: newValue });
  };

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
        onChange={handleHrefChange}
        placeholder="https://exemplo.com.br"
        style={{ width: '100%' }}
      />
    </div>
  );
}

export default LinkForm;