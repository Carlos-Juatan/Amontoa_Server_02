// src/components/StudiesScreen/NoteContentRenderer.jsx
import React, { useRef, useEffect } from 'react';
import GenericList from '../../../components/Common/GenericList/GenericList'; // Certifique-se de que o caminho está correto
import './NoteContentRenderer.css'; // Crie este CSS para estilizar o conteúdo

// ==============================================================================
// Importe e registre apenas as linguagens que você realmente usa
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import bash from 'highlight.js/lib/languages/bash';
import yaml from 'highlight.js/lib/languages/yaml';
import hljsJson from 'highlight.js/lib/languages/json'; // Renomeie para evitar conflito
import css from 'highlight.js/lib/languages/css';
import xml from 'highlight.js/lib/languages/xml'; // Para HTML

// Registra as linguagens uma única vez
// Este bloco deve ser executado apenas uma vez na aplicação,
// idealmente no seu ponto de entrada principal (ex: main.jsx ou App.jsx)
// ou em um arquivo de configuração/utilitário importado uma única vez.
let hljsInitialized = false;
if (!hljsInitialized) {
  hljs.registerLanguage('javascript', javascript);
  hljs.registerLanguage('bash', bash);
  hljs.registerLanguage('yaml', yaml);
  hljs.registerLanguage('json', hljsJson); // Use o nome renomeado aqui
  hljs.registerLanguage('css', css);
  hljs.registerLanguage('html', xml); // Usamos XML para HTML no highlight.js
  hljsInitialized = true;
  console.log("Highlight.js languages registered.");
}
// ==============================================================================

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


function NoteContentRenderer({ content, children, stylesNoteElementClassName }) {
  const codeRef = useRef(null);

  // useEffect para aplicar o destaque do Highlight.js
  useEffect(() => {
    // Só aplica se o tipo de conteúdo for 'code_snippet' e a ref estiver disponível
    if (content.type === 'code_snippet' && codeRef.current) {
      // 1. Resetar o estado do elemento para garantir uma nova aplicação do highlight
      // Isso é crucial para evitar a mensagem "Element previously highlighted"
      // e para garantir que o highlight seja re-aplicado corretamente se o código mudar.
      delete codeRef.current.dataset.highlighted; // Remove a flag que o HLJS usa
      codeRef.current.innerHTML = ''; // Limpa o conteúdo HTML gerado pelo HLJS

      // 2. Injeta o código bruto no textContent para que o Highlight.js o processe
      // Use textContent para evitar problemas de injeção de HTML e para que o HLJS
      // tenha o texto puro para trabalhar.
      codeRef.current.textContent = content.code;

      // 3. Aplica o destaque
      // Verifica se a linguagem está registrada antes de tentar destacar
      if (hljs.getLanguage(content.language)) {
        hljs.highlightElement(codeRef.current);
      } else {
        console.warn(`Highlight.js: Language "${content.language}" not registered. Attempting auto-detection or plain highlighting.`);
        hljs.highlightElement(codeRef.current); // Tenta destacar sem linguagem específica
      }
    }
  }, [content.type, content.code, content.language]); // Dependências: re-executa se o tipo, código ou linguagem mudarem

  switch (content.type) {
    case 'paragraph':
      return <div className={stylesNoteElementClassName}><p className="note-paragraph">{renderParagraphContent(content.content)}</p>{children}</div>;
    case 'image':
      return <div className={stylesNoteElementClassName}>{renderImage(content)}{children}</div>;
    case 'heading':
      const HeadingTag = `h${Math.min(Math.max(parseInt(content.level), 1), 6) || 2}`;
      return <div className={stylesNoteElementClassName}><HeadingTag className={`note-heading level-${content.level}`}>{content.content}</HeadingTag>{children}</div>;
    case 'code_snippet':
      return (
        <div className={stylesNoteElementClassName}>
          <div className="note-code-snippet">
            {content.title && <h4 className="code-snippet-title">{content.title}</h4>}
            <pre className="code-block">
              {/*
                O elemento <code> é o alvo para o Highlight.js.
                Seu conteúdo será manipulado diretamente no useEffect via innerHTML
                após a aplicação do destaque.
              */}
              <code ref={codeRef} className={`language-${content.language}`}>
                {/* O conteúdo inicial aqui pode ser vazio ou um placeholder,
                    pois o useEffect irá preenchê-lo e o Highlight.js irá transformá-lo.
                    Importante: as quebras de linha (\n) do content.code são respeitadas
                    pela tag <pre> que é a pai do <code>.
                */}
              </code>
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
          {children}
        </div>
      );
    case 'list':
      return (
        <div className={stylesNoteElementClassName}>
          <GenericList
            items={content.items}
            keyExtractor={(item, index) => item.id || item.content + index}
            renderItem={(item) => <ListItemRenderer item={item} />}
            listTitle={content.title}
            listClassName="note-list"
          />
          {children}
        </div>
      );
    case 'link':
      const linkText = content.display_text || content.content;
      const linkUrl = content.url || content.href;
      const clickableMatch = typeof linkText === 'string' ? linkText.match(/\*\*(.*?)\*\*/) : null;
      const clickablePhrase = clickableMatch ? clickableMatch[1] : linkText;
      const cleanedDisplayText = typeof linkText === 'string' ? linkText.replace(/\*\*(.*?)\*\*/g, clickablePhrase) : linkText;

      return (
        <div className={stylesNoteElementClassName}>
          <p className="note-link-container">
            {renderLinkContent(cleanedDisplayText, clickablePhrase, linkUrl)}
          </p>
          {children}
        </div>
      );
    case 'blockquote':
      return <div className={stylesNoteElementClassName}><blockquote className="note-blockquote">{content.content}</blockquote>{children}</div>;
    case 'table':
      return <div className={stylesNoteElementClassName}>{renderTable(content)}{children}</div>;
    case 'video':
      return <div className={stylesNoteElementClassName}>{renderVideo(content)}{children}</div>;
    case 'alert':
      return <div className={stylesNoteElementClassName}>{renderAlert(content)}{children}</div>;
    default:
      return <div className={stylesNoteElementClassName}><p className="note-unknown-content">Tipo de conteúdo desconhecido: {content.type}</p>{children}</div>;
  }
}

export default NoteContentRenderer;