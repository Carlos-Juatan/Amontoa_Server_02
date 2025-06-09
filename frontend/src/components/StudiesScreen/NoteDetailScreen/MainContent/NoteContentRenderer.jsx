// src/components/StudiesScreen/NoteContentRenderer.jsx
import React, { useRef, useEffect } from 'react';
import GenericList from '../../../Common/GenericList/GenericList'; // Certifique-se de que o caminho está correto
import './NoteContentRenderer.css'; // Crie este CSS para estilizar o conteúdo

// Importe e registre apenas as linguagens que você realmente usa
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import bash from 'highlight.js/lib/languages/bash';
import yaml from 'highlight.js/lib/languages/yaml';
import json from 'highlight.js/lib/languages/json';
import css from 'highlight.js/lib/languages/css';
import xml from 'highlight.js/lib/languages/xml'; // Para HTML

// Registra as linguagens uma única vez
let hljsInitialized = false;
if (!hljsInitialized) {
  hljs.registerLanguage('javascript', javascript);
  hljs.registerLanguage('bash', bash);
  hljs.registerLanguage('yaml', yaml);
  hljs.registerLanguage('json', json);
  hljs.registerLanguage('css', css);
  hljs.registerLanguage('html', xml); // Usamos XML para HTML no highlight.js
  hljsInitialized = true;
}

// Funções auxiliares para renderizar partes específicas do conteúdo
// Estas poderiam ser movidas para um arquivo utils/contentRenderHelpers.js
const renderParagraphContent = (text) => {
  if (typeof text !== 'string') {
    return text; // Retorna o que for se não for string
  }
  const parts = text.split(/(\*\*.*?\*\*)/g); // Divide por '**negrito**'
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="highlighted-text">{part.substring(2, part.length - 2)}</strong>;
    }
    return part;
  });
};

const renderLinkContent = (fullText, clickablePhrase, url) => {
  if (!fullText || !clickablePhrase || !url) {
    return <a href={url} target="_blank" rel="noopener noreferrer" className="note-link"><i className="fas fa-external-link-alt link-icon"></i> {fullText || url}</a>;
  }
  const parts = fullText.split(new RegExp(`(${clickablePhrase})`, 'gi'));
  return parts.map((part, index) => {
    if (part.toLowerCase() === clickablePhrase.toLowerCase()) {
      return (
        <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="note-link clickable-part">
          {part}
        </a>
      );
    }
    return part;
  });
};

// Componente para renderizar itens de lista, suportando aninhamento
const ListItemRenderer = ({ item }) => {
  return (
    <>
      {item.content}
      {item.sub_list && item.sub_list.length > 0 && (
        <GenericList
          items={item.sub_list}
          keyExtractor={(subItem, subIndex) => subItem.id || subItem.content + subIndex}
          renderItem={(subItem) => <ListItemRenderer item={subItem} />}
          listClassName="sub-list"
        />
      )}
    </>
  );
};

const renderImage = (content) => {
  const imageUrl = content.src && !content.src.startsWith('assets/')
    ? content.src
    : content.src
      ? `/${content.src}`
      : `https://placehold.co/600x400/8c73cc/e0e0e0?text=Imagem+N%C3%A3o+Dispon%C3%ADvel`;

  return (
    <figure className="note-image-container">
      <img src={imageUrl} alt={content.alt || 'Imagem da anotação'} className="note-image" />
      {content.caption && <figcaption className="note-image-caption">{content.caption}</figcaption>}
    </figure>
  );
};

const renderTable = (content) => {
  return (
    <div className="note-table-container">
      {content.title && <h4 className="table-title">{content.title}</h4>}
      <table className="note-table">
        <thead>
          <tr>
            {content.headers && content.headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {content.rows && content.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const renderVideo = (content) => {
  const videoSrc = content.src;
  const isYouTube = content.source_type === 'youtube';

  if (!videoSrc) {
    return (
      <div className="video-placeholder">
        <i className="fas fa-video-slash"></i>
        <span>Vídeo não disponível ou URL inválida.</span>
      </div>
    );
  }

  if (isYouTube) {
    const parsedUrl = new URL(videoSrc);
    // Adiciona parâmetros para melhor controle e branding modesto
    parsedUrl.searchParams.set('autoplay', '0');
    parsedUrl.searchParams.set('controls', '1');
    parsedUrl.searchParams.set('modestbranding', '1');
    parsedUrl.searchParams.set('rel', '0'); // Não mostrar vídeos relacionados ao final
    const youTubeEmbedUrl = parsedUrl.toString();

    return (
      <figure className="note-video-container youtube-video">
        <iframe
          src={youTubeEmbedUrl}
          frameBorder="0"
          allowFullScreen
          title={content.caption || "YouTube video player"}
          className="note-youtube-iframe"
        ></iframe>
        {content.caption && <figcaption className="note-video-caption">{content.caption}</figcaption>}
      </figure>
    );
  } else {
    // Para vídeos locais ou de outras fontes
    const finalVideoSrc = videoSrc.startsWith('assets/')
      ? `/${videoSrc}`
      : videoSrc;

    return (
      <figure className="note-video-container local-video">
        <video controls className="note-video">
          <source src={finalVideoSrc} type={content.mimeType || 'video/mp4'} />
          Seu navegador não suporta a tag de vídeo.
        </video>
        {content.caption && <figcaption className="note-video-caption">{content.caption}</figcaption>}
      </figure>
    );
  }
};

const renderAlert = (content) => {
  return (
    <div className={`note-alert alert-${content.level.toLowerCase()}`}>
      <i className={`alert-icon fas ${
        content.level.toLowerCase() === 'info' ? 'fa-info-circle' :
        content.level.toLowerCase() === 'note' ? 'fa-sticky-note' :
        content.level.toLowerCase() === 'tip' ? 'fa-lightbulb' :
        content.level.toLowerCase() === 'important' ? 'fa-exclamation-circle' :
        content.level.toLowerCase() === 'warning' ? 'fa-exclamation-triangle' :
        content.level.toLowerCase() === 'caution' ? 'fa-hand-paper' : 'fa-bell'
      }`}></i>
      <span className="alert-content">{content.content}</span>
    </div>
  );
};


function NoteContentRenderer({ content }) {
  const codeRef = useRef(null);

  useEffect(() => {
    // Aplica highlight.js ao bloco de código
    if (content.type === 'code_snippet' && codeRef.current) {
      if (hljs.getLanguage(content.language)) {
        hljs.highlightElement(codeRef.current);
      } else {
        console.warn(`Highlight.js: Language "${content.language}" not registered. Highlighting without specific language.`);
        hljs.highlightElement(codeRef.current);
      }
    }
  }, [content]); // Dependência em content para re-renderizar se o conteúdo mudar

  switch (content.type) {
    case 'paragraph':
      return <p className="note-paragraph">{renderParagraphContent(content.content)}</p>;
    case 'image':
      return renderImage(content);
    case 'heading':
      const HeadingTag = `h${Math.min(Math.max(parseInt(content.level), 1), 6) || 2}`;
      return <HeadingTag className={`note-heading level-${content.level}`}>{content.content}</HeadingTag>;
    case 'code_snippet':
      return (
        <div className="note-code-snippet">
          {content.title && <h4 className="code-snippet-title">{content.title}</h4>}
          <pre className="code-block">
            <code ref={codeRef} className={`language-${content.language}`}>{content.code}</code>
          </pre>
          <button
            className="copy-code-button"
            onClick={() => {
              navigator.clipboard.writeText(content.code)
                .then(() => {
                  const feedbackDiv = document.createElement('div');
                  feedbackDiv.textContent = 'Copiado!';
                  feedbackDiv.className = 'copy-feedback';
                  document.body.appendChild(feedbackDiv);
                  setTimeout(() => {
                    feedbackDiv.remove();
                  }, 1500);
                })
                .catch(err => console.error('Erro ao copiar: ', err));
            }}
          >
            Copiar
          </button>
        </div>
      );
    case 'list':
      return (
        <GenericList
          items={content.items}
          keyExtractor={(item, index) => item.id || item.content + index}
          renderItem={(item) => <ListItemRenderer item={item} />}
          listTitle={content.title}
          listClassName="note-list"
        />
      );
    case 'link':
      const linkText = content.display_text || content.content;
      const linkUrl = content.url || content.href;
      const clickableMatch = typeof linkText === 'string' ? linkText.match(/\*\*(.*?)\*\*/) : null;
      const clickablePhrase = clickableMatch ? clickableMatch[1] : linkText;
      const cleanedDisplayText = typeof linkText === 'string' ? linkText.replace(/\*\*(.*?)\*\*/g, clickablePhrase) : linkText;

      return (
        <p className="note-link-container">
          {renderLinkContent(cleanedDisplayText, clickablePhrase, linkUrl)}
        </p>
      );
    case 'blockquote':
      return <blockquote className="note-blockquote">{content.content}</blockquote>;
    case 'table':
      return renderTable(content);
    case 'video':
      return renderVideo(content);
    case 'alert':
      return renderAlert(content);
    default:
      return <p className="note-unknown-content">Tipo de conteúdo desconhecido: {content.type}</p>;
  }
}

export default NoteContentRenderer;