// src/pages/AnimesScreen/AnimesModal.jsx
import React, { useState, useEffect } from 'react';

import Modal from '../../components/Common/Modal/Modal';

import Button from '../../components/Common/Button/Button';
import CustomCheckbox from '../../components/Common/CustomCheckbox/CustomCheckbox';

import './AnimesModal.css';

function AddCollectionModal({ isOpen, onClose, title, onSubmit, initialValue }) {
  const [collectionName, setCollectionName] = useState(initialValue || '');

  const handleChange = (e) => setCollectionName(e.target.value);

  const handleSubmit = () => {
    if (collectionName.trim()) {
      const formattedName = toTitleCase(collectionName); 
      onSubmit(formattedName);
      setCollectionName('');
      onClose();
    }
  };


  return (
    <div className='animes-modal-add-collection'>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        onSubmit={handleSubmit}
        submitButtonText={"Criar"}
        modalCustonStyle="item-add-collection-content"
      >
        <input type="text" value={collectionName} onChange={handleChange} />
      </Modal>
    </div>
  );
}

function AnimeDetailsModal({  }) {
  // 1. Estado para controlar qual temporada está aberta.
  // Usamos null para nenhuma aberta, ou o índice da temporada.
  const [openSeasonIndex, setOpenSeasonIndex] = useState(null);

  // 2. Função para alternar o estado de abertura da gaveta
  const toggleSeason = (index) => {
    // Se o índice clicado for o mesmo que já está aberto, feche (set null).
    // Caso contrário, abra a nova temporada (set index).
    setOpenSeasonIndex(openSeasonIndex === index ? null : index);
  };

  const getMonths = (season) => {
    return season === 'Inverno' ? 'Jan - Mar' : season === 'Primavera' ? 'Abr - Jun' : season === 'Verão' ? 'Jul - Set' : season === 'Primavera' ? 'Out - Dez' : '-';
  }
  const handleOpenLink = (url) => { window.open(url, '_blank'); };

  const handleCloseModal = () => { console.log('Fechando Modal de anime'); }
  const handleOpenEditModal = () => { console.log('Abrindo Modal de editar anime'); }
  const chageAnime = (value) => { console.log(`Mudando o anime na lista em: ${value}`); }
  const moviesDetails = () => { console.log('Abrir Detalhes dos filmes.'); }
  const setTimeWatched = (value) => { console.log(`Mudando vezes assistidas em: ${value}`); }
  const openCollectionDropdown = () => { console.log('Abrir dropdown das colleções.'); }
  const addNewSeason = () => { console.log('Adicionando nova temporada na lista'); }
  const addNewEpisode = () => { console.log('Adicionando novo epsódio na lista'); }
  const toggleWatchStatus = (seasonIndex, episodeIndex) => { console.log(`Temporada ${seasonIndex + 1}, Episódio ${episodeIndex + 1}: Status alterado!`);};
  const handleEpisodeMenuToggle = (e) => { console.log('Abrindo menu de episódio'); }
  const addNewLinkToWatch = () => { console.log('Adicionando novo link para assitir'); }

  return (
    <div className='animes-modal-overlay'>
      <div className='animes-modal-anime-container'>
        {/* Botão de navegação esquerda */}
        <div className='change-anime-button' onClick={() => chageAnime(1)}><i className="fa-solid fa-angle-left" /></div>

        {/* Conteúdo principal do modal */}
        <div className='animes-modal-content'>

          {/* Painel Esquerdo: Imagem e Informações Auxiliares */}
          <div className='modal-left-panel'>
            <div className='modal-image-wrapper'>
              <img src={item?.imageUrl} alt='Anime cover' className='anime-cover-image' />
            </div>
            
            <div className='modal-info-details'>
              {/* Data de Lançamento */}
              <div className='info-detail-item'>
                <span className='info-label'>Data:</span>
                <div className='info-value date-value'>
                  <span>{`${item?.date?.launched?.season} ${item?.date?.launched?.year}`}</span>
                  <span className='date-months'>{`( ${getMonths(item?.date?.launched?.season)} )`}</span>
                </div>
              </div>

              {/* Filmes */}
              <div className='info-detail-item'>
                <span className='info-label'>Filmes:</span>
                <div className='info-value movies-value' onClick={moviesDetails}>
                  <span>{item?.movies?.length || 0}</span>
                  {item?.movies?.length > 0 && (
                    <div className='info-details'>Detalhes</div>
                  )}
                </div>
              </div>

              {/* Vezes Assistido */}
              <div className='info-detail-item'>
                <span className='info-label'>Vezes Assistido:</span>
                <div className='info-value times-watched-value'>
                  <div className='watch-controls'>
                    <i className="fa-solid fa-angle-left" onClick={() => setTimeWatched(1)} />
                    <span className='watch-count'>{item?.timeWhatched || 0}</span>
                    <i className="fa-solid fa-angle-right" onClick={() => setTimeWatched(-1)} />
                  </div>
                </div>
              </div>

              {/* Coleções */}
              <div className='info-detail-item'>
                <span className='info-label'>Coleções:</span>
                <div className='info-value collection-value' onClick={openCollectionDropdown}>
                    <div className='info-details'>Detalhes</div>
                </div>
              </div>
            </div>
          </div>

          {/* Conteúdo Direito: Títulos, Sinopse, Temporadas, Links */}
          <div className='modal-right-content'>
            
            {/* Bloco de Título e Nota */}
            <div className='anime-header-block'>
              <div className='anime-titles'>
                <span className='title-japanese'>{item?.name?.japonese}</span>
                <span className='title-english'>{item?.name?.english}</span>
              </div>

              <div className='anime-score-wrapper'>
                <div className='anime-score'>
                  <div className='score-label'>Nota:</div>
                  <div className='score-value'>{item?.score || '-'}</div>
                </div>
              </div>
            </div>

            {/* Bloco de Informações: Sinopse, Tags, Coleções */}
            <div className='anime-info-block'>

              {/* Sinopse */}
              <div className='info-section synopsis-section'>
                <div className='section-label'>Sinopse:</div>
                <p className='synopsis-text'>{item?.description || 'Undefined'}</p>
              </div>

              {/* Tags */}
              <div className='info-section tags-section'>
                <span className='section-label'>tags:</span>
                <div className='tags-list'>
                  {(item?.tags || 'Undefined').map(tag => (
                    <span key={tag} className='tag-item'>{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bloco de Temporadas e Links */}
            <div className='seasons-and-links-block'>

              {/* Seção de Temporadas */}
              <div className='seasons-section'>
                <div className='section-title-wrapper'>
                  <span className='section-title'>Temporadas</span>
                  <span className='add-new-button' onClick={addNewSeason}><i className="fa-solid fa-plus"></i></span>
                </div>
                <hr className='section-divider' />


                <ul className='season-list'>
                  {(item?.seasons || []).map((season, index) => {
                    const isSeasonOpen = openSeasonIndex === index; // Varifica se o índice atual for o índice aberto

                    return (
                      <li key={index} className='season-list-item'>
                        <div className='season-header'>
                          <div className='season-title-wrapper' onClick={() => toggleSeason(index)}>
                            <i className={`fa-solid season-toggle-icon ${isSeasonOpen ? 'fa-angle-up' : 'fa-angle-down'}`}></i>
                            <span className='season-title'>{season.season}</span>
                          </div>
                          <span className='add-episode-button' onClick={addNewEpisode}><i className="fa-solid fa-plus"></i></span>
                        </div>

                        {/* Lista de Episódios (condicional) */}
                        {isSeasonOpen && (
                          <div className='episodes-list-wrapper'>
                            {(season.episodes || []).map((ep, epIndex) => (
                              <div key={epIndex} className='episode-item'>
                                <CustomCheckbox
                                  checked={ep.hasWacth}
                                  onChange={() => toggleWatchStatus(index, epIndex)}
                                  size={13}
                                />
                                <span className='episode-title'>{ep.title}</span>
                                <span className='episode-menu-button'><i className="fa-solid fa-ellipsis" onClick={handleEpisodeMenuToggle} /></span>
                              </div>
                            ))}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Seção de Links para Assistir */}
              <div className='watch-links-section'>
                <div className='section-title-wrapper'>
                  <span className='section-title'>Links para assistir</span>
                  <span className='add-new-button' onClick={addNewLinkToWatch}><i className="fa-solid fa-plus" /></span>
                </div>
                <hr className='section-divider' />
                <ul className='links-list'>
                  {(item?.links || []).map((link, index) => (
                    <li key={`${link.title}-${index}`} className='link-list-item'>
                      <span className='link-title'>{link.title}</span>
                      <Button className='link-open-button' onClick={() => handleOpenLink(link.url)}>Abrir</Button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Botões de Ação do Modal */}
            <div className='modal-action-buttons'>
              <Button className='action-button button-edit' onClick={handleOpenEditModal}>Editar</Button>
              <Button className='action-button button-close' onClick={handleCloseModal}>Fechar</Button>
              {/*
              <span className='action-button button-edit' onClick={handleOpenEditModal}>Editar</span>
              <span className='action-button button-close' onClick={handleCloseModal}>Fechar</span>
              */}
            </div>
          </div>
        </div>

        {/* Botão de navegação direita */}
        <div className='change-anime-button' onClick={() => chageAnime(1)}><i className="fa-solid fa-angle-right" /></div>
      </div>
    </div>
  );
}

function AnimeEditModal({  }) {
  return (
    <div className='animes-modal-overlay'>
      <div className='animes-modal-container'>

      </div>
    </div>
  );
}

export {
  AddCollectionModal,
  AnimeDetailsModal,
  AnimeEditModal,
};


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


const item = {
  "_id": "68ee5cdeed0a2910f69f36a1",
  "imageUrl": "https://cdn.myanimelist.net/images/anime/1286/99889l.jpg",
  "date": {
    "launched": {
      "season": "Inverno",
      "year": 2025
    },
    "lastEdit": "2025-10-16T18:38:12.456Z"
  },
  "movies": [
    {
      "title": "",
      "hasWatched": false,
      "louchedData": ""
    }
  ],
  "timeWhatched": 0,
  "name": {
    "japonese": "Kimetsu no Yaiba",
    "english": "Demon Slayer"
  },
  "score": 8,
  "description": "Este anime trata de um personagem que perdeu toda a sua família em um ataque noturno, a única sobrevivente é sua irma, que ficou infectada, e para salvar sua irmã, o protagonista segue em uma jornada desafiadora e perigosa caçando onis para tentar achar a cura de sua irmã.",
  "tags": [
    "Ação",
    "Aventura",
    "Fantasia"
  ],
  "collections": [],
  "seasons": [
    {
      "season": "1° Temporada",
      "episodes": [
        { "title": "Episódio 1", "hasWacth": true },
        { "title": "Episódio 2", "hasWacth": false }
      ]
    },
    {
      "season": "2° Temporada",
      "episodes": [
        { "title": "Episódio 1", "hasWacth": false }
      ]
    }
  ],
  "links": [
    {
      "title": "Crunchyroll",
      "url": "https://www.crunchyroll.com/"
    }
  ]
}