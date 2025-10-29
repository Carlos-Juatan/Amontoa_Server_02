// src/pages/AnimesScreen/AnimesModal.jsx
import React, { useState, useEffect } from 'react';

import Modal from '../../components/Common/Modal/Modal';

import Button from '../../components/Common/Button/Button';

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
        <input type="text" value={collectionName} onChange={handleChange}/>
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
      <div className='animes-modal-anime-details'>
        <div className='back-anime-button' onClick={() => chageAnime(1)}>
          <i className="fa-solid fa-angle-left"></i>
        </div>

        <div className='animes-modal-container'>
          <div className='animes-content-left'>
            <img src={item?.imageUrl} alt="" />
            
            <div className='animes-content-right-top-date'>
              <span>Data:</span>
              <div className='animes-content-right-top-date-context'>
                <span>{`${item?.date?.launched?.season} ${item?.date?.launched?.year}`}</span>
                <span>{`( ${getMonths(item?.date?.launched?.season)} )`}</span>
              </div>
            </div>
            
            <div className='animes-content-right-top-movies'>
              <span>Filmes:</span>
              <div className='movies-list' onClick={moviesDetails}>
                <span>{item?.movies?.length}</span>
                {item?.movies?.length > 0 && (
                  <div>Detalhes</div>
                )}
              </div>
            </div>
            
            <div className='animes-content-right-top-time-watch'>
              <span>Vezes Assistido:</span>
              <span>{item?.timeWhatched}</span>
              <div className='acrttw-buttons'>
                <i className="fa-solid fa-angle-up" onClick={() => setTimeWatched(1)}></i>
                <i className="fa-solid fa-angle-down" onClick={() => setTimeWatched(-1)}></i>
              </div>
            </div>
          </div>
          <div className='animes-content-right'>
            <div className='animes-content-right-top'>
              <div className='animes-content-right-top-name'>
                <span>{item?.name?.japonese}</span>
                <span>{item?.name?.english}</span>
              </div>

              <div className='animes-content-right-top-left'>
                <div className='animes-content-right-top-score'>
                  <div className='animes-content-right-top-score-personal'>
                    <div>Nota:</div>
                    <div>{item?.score}</div>
                  </div>
                </div>
              </div>

            </div>

            <div className='animes-content-description'>
              <div>Sinopse:</div>
              <p>{item?.description}</p>
            </div>

            <div className='animes-content-right-top-tags'>
              <span>tags:</span>
              <div>
                {item?.tags?.map(tag => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>

            <div className='animes-content-right-top-collections'>
              <span>coleções:</span>
              <div className='animes-content-right-top-collections-items'>
                {/* Se não tiver nenhuma coleção */}
                {!item?.collections?.length > 0 && (
                  <span>Nenhuma</span>
                )}

                {/* Lista de coleções */}
                {item?.collections?.map(col => (
                  <span>{col}</span>
                ))}
              </div>
              <div className='animes-content-right-top-collections-add-collection' onClick={openCollectionDropdown}>Adicionar</div>
            </div>

            <div className='animes-bottom'>
              <div className='animes-episodes-list'>
                <div className='animes-episodes-list-title'>
                  <span>Temporadas</span>
                  <span onClick={addNewSeason}><i className="fa-solid fa-plus"></i></span>
                </div>
                <hr />
                <ul className='lista-tempodada-anime'>
                  {item?.seasons?.map((season, index) => {
                    // 3. Variável de verificação: true se o índice atual for o índice aberto
                    const isSeasonOpen = openSeasonIndex === index;

                    return (
                      <li key={index}> {/* Use <li> para itens de <ul> */}
                        <div className='lista-season-header'>
                          <div className='season-title' onClick={() => toggleSeason(index)}>
                            <i className={`fa-solid ${isSeasonOpen ? 'fa-angle-up' : 'fa-angle-down'}`}></i>
                            <span>{season.season}</span>
                            {/* Ícone muda baseado no estado */}
                          </div>
                          <span onClick={addNewEpisode}><i className="fa-solid fa-plus"></i></span>
                        </div>
                        
                        {/* 4. Renderiza os episódios APENAS se isSeasonOpen for true */}
                        {isSeasonOpen && (
                          <div className='episodes-list'>
                            {/* Itera sobre os episódios da temporada atual */}
                            {season.episodes.map((ep, epIndex) => (
                              <div key={epIndex} className='episode-item'>
                                {/* Adição do Checkbox */}
                                <input
                                  type="checkbox"
                                  checked={ep.hasWacth} // O estado do checkbox é controlado por hasWacth
                                  onChange={() => toggleWatchStatus(index, epIndex)} // 'index' é o índice da temporada, 'epIndex' é o índice do episódio
                                />
                                <span class="checkmark"></span>

                                {/* Título do episódio */}
                                <span>{ep.title}</span>
                                <span><i className="fa-solid fa-ellipsis episode-open-menu" onClick={handleEpisodeMenuToggle} /></span>
                                
                              </div>
                            ))}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className='animes-sites-list'>
                <div className='animes-sites-list-title'>
                  <span>Links para assistir</span>
                  <span onClick={addNewLinkToWatch}><i className="fa-solid fa-plus"></i></span>
                </div>
                <hr />
                <ul>
                  {item?.links?.map((link, index) => (
                    <li key={`${link.title}-${index}`}>
                      <span>{link.title}</span>
                      <Button 
                         className='animes-site-button' 
                         onClick={() => handleOpenLink(link.url)}
                      >
                         Abrir
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className='animes-buttons'>
              <span onClick={handleOpenEditModal}>Editar</span>
              <span onClick={handleCloseModal}>Fechar</span>
            </div>
          </div>
        </div>

        <div className='next-anime-button' onClick={() => chageAnime(1)}> 
          <i className="fa-solid fa-angle-right"></i>
        </div>
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