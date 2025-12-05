// src/pages/AnimesScreen/hooks/useAnimeModalManager.js

import { useState, useMemo, useEffect } from 'react';

import useSelectionIndex from '../../../hooks/useSelectionIndex'

export default function useAnimeModalManager(items, globalData, handleCreateItem, handleUpdateItem, handleDeleteItem, handleCreateTag) {
  //#region Variables
  // Tipo de Modal de Animes Oberto ou null para fechado
  const [hasAnimeModal, setHasAnimeModal] = useState(null);

  // Controlar a abertura dos dropdowns (Filme e Coleção)
  const [isMoviesDropdownOpen, setIsMoviesDropdownOpen] = useState(false); // 1° Dropdown dos filmes
  const [isCollectionsDropdownOpen, setIsCollectionsDropdownOpen] = useState(false); // 1° Dropdown das coleções
  const [isGlobalCollectionsDropdownOpen, setIsGlobalCollectionsDropdownOpen] = useState(false); // 2° Dropdown das coleções

  // Controla os Modais de adicionar e editar
  const [updatedItemId, setUpdatedItemId] = useState(null);
  // para o modal de filmes
  const [hasAddEditMovie, setHasAddEditMovie] = useState(false);
  const [hasMovieNamed, setHasMovieNamed] = useState(null);
  const [hasMovieWatched, setHasMovieWatched] = useState(false);
  // para o modal de temporadas
  const [hasAddEditSeason, setHasAddEditSeason] = useState(false);
  const [hasSeasonInfo, setHasSeasonInfo] = useState(null);
  // para o modal de episodios
  const [hasAddEditEpisode, setHasAddEditEpisode] = useState(false);
  const [hasEpisodeInfo, setHasEpisodeInfo] = useState(null);
  // para o modal de links
  const [hasAddEditLink, setHasAddEditLink] = useState(false);
  const [hasLinkInfo, setHasLinkInfo] = useState(null);
  // para o modal de tags
  const [tagSubmitCallback, setTagSubmitCallback] = useState(null);
  const [hasAddEditTag, setHasAddEditTag] = useState(false);

  // Estado para controlar qual temporada está aberta.
  // Usamos null para nenhuma aberta, ou o índice da temporada.
  const [openSeasonIndex, setOpenSeasonIndex] = useState(null);
  //#endregion

  //#region Functions

  //#region Manipulação do anime selecionado
  // Funcção para abrir o modal ao clicar no item
  const { currentIndex, setCurrentIndex, selectedObject, handleNext, handlePrev } = useSelectionIndex(items);

  const openAnimeModal = (index, modalType = 'details') => {
    setCurrentIndex(index);
    setHasAnimeModal(modalType);
  }

  const closeAnimeModal = () => setHasAnimeModal(null);

  //#endregion

  //#region Lado esqeurdo do modal
  const getMonths = (season) => {
    return season === 'Inverno' ? 'Jan - Mar' : season === 'Primavera' ? 'Abr - Jun' : season === 'Verão' ? 'Jul - Set' : season === 'Outono' ? 'Out - Dez' : '-';
  }

  const toggleMovieWatchStatus = async (itemId, movieTitle) => {
    const currentItem = items.find(item => item._id === itemId);

    if (!currentItem || !Array.isArray(currentItem.movies)) return;

    // Usa o método MAP para criar um NOVO ARRAY de filmes
    const updatedMovies = currentItem.movies.map(movie => {
      // Ao achar o item a ser modificado ele modifica e retorna um novo array
      if (movie.title === movieTitle) {
        return {
          ...movie,
          hasWatched: !movie.hasWatched
        };
      }

      // Caso o item não seja encontrado ele retorna o array original sem modificações
      return movie;
    });

    // Chama a função de atualização com o novo array completo
    await handleUpdateItem(itemId, { movies: updatedMovies });
  }

  const openAddEditMovie = async (itemId = '', movieTitle = '', checkmarckValue = false) => {
    setHasAddEditMovie(true);
    setUpdatedItemId(itemId);
    setHasMovieNamed(movieTitle);
    setHasMovieWatched(checkmarckValue);

  }

  const closeAddEditMovie = () => {
    setHasAddEditMovie(false);
    setUpdatedItemId(null);
    setHasMovieNamed(null);
    setHasMovieWatched(false);
  };

  const createEditMovie = async (newMovieTile, newCheckmarkValue) => {
    const currentItem = items.find(item => item._id === updatedItemId);
    const oldMovieTitle = hasMovieNamed;

    if (!currentItem || !Array.isArray(currentItem.movies)) return;

    // 1. Tenta EDITAR (usa MAP):
    //    Se oldMovieTitle existe, mapeamos e procuramos por ele.
    let isEditing = false;
    const updatedMovies = currentItem.movies.map(movie => {
      if (oldMovieTitle && movie.title === oldMovieTitle) {
        isEditing = true;
        return { // Retorna o objeto EDITADO
          title: newMovieTile,
          hasWatched: newCheckmarkValue
        };
      }
      return movie; // Retorna os filmes inalterados
    });

    let finalMovies = updatedMovies;

    // 2. Se NÃO ESTAVA EDITANDO (ADIÇÃO):
    //    Significa que oldMovieTitle não foi encontrado ou era nulo/vazio (nova adição).
    if (!isEditing) {
      const newMovie = { title: newMovieTile, hasWatched: newCheckmarkValue };

      // Verifica se já existe um filme com o novo título antes de adicionar (opcional, mas recomendado)
      const alreadyExists = updatedMovies.some(movie => movie.title === newMovieTile);

      if (!alreadyExists) {
        finalMovies = [...updatedMovies, newMovie];
      } else {
        // Tratar erro ou apenas retornar se já existir
        console.warn(`Filme "${newMovieTile}" já existe na lista.`);
        return; // Evita a atualização
      }
    }

    // 3. Ordena e Atualiza:
    finalMovies.sort((a, b) => a.title.localeCompare(b.title));

    await handleUpdateItem(updatedItemId, { movies: finalMovies });
    closeAddEditMovie(); // Fecha o modal após a atualização bem-sucedida
  };

  const handleDeleteMovie = async (itemId, movieTitle) => {
    const currentItem = items.find(item => item._id === itemId);

    if (!currentItem || !Array.isArray(currentItem.movies)) return;

    // 1. Usa o FILTER para criar um NOVO ARRAY que inclui APENAS os filmes cujo título NÃO É o filme a ser removido.
    const updatedMovies = currentItem.movies.filter(movie => {
      return movie.title !== movieTitle;
    });

    // 2. Chama a função de atualização com o novo array, se o filme foi removido
    if (updatedMovies.length < currentItem.movies.length) {
      await handleUpdateItem(itemId, { movies: updatedMovies });
    }
  }

  const setTimeWatched = async (itemId, value) => {
    const itemToUpdate = items.find(item => item._id === itemId);

    if (itemToUpdate) {
      // Garante o valor atual e copia
      const currentCount = itemToUpdate.timeWhatched || 0;
      const calcValue = currentCount + value;
      const updatedCount = calcValue >= 0 ? calcValue : 0;
      // Chama a função de atualização
      if (updatedCount != currentCount)
        await handleUpdateItem(itemId, { timeWhatched: updatedCount });
    }
  }

  //#region Manipuladores de Dropdown
  // Função auxiliar para fechar todos os dropdowns relacionados
  const closeAllDropdowns = () => {
    setIsMoviesDropdownOpen(false);
    setIsCollectionsDropdownOpen(false);
    setIsGlobalCollectionsDropdownOpen(false);
  };
  //#region  Filmes
  // Funções de manipulação do clique
  const openMoviesDropdown = (e) => {
    e.stopPropagation();
    closeAllDropdowns(); // Fecha todos os dropdowns primeiro
    setIsMoviesDropdownOpen(prev => !prev); // abre o dropdown do filme
  };
  //#endregion

  //#region Coleções
  const openCollectionDropdown = (e) => {
    e.stopPropagation();
    closeAllDropdowns(); // Fecha todos os dropdowns primeiro
    setIsCollectionsDropdownOpen(prev => !prev); // abre o dropdown de coleções
  };

  // Manipula o 2° dropdown de coleções globais
  const handleIsGlobalCollectionsDropdownOpen = (value) => {
    setIsGlobalCollectionsDropdownOpen(value);
    // Se for para abrir, garante que o principal está aberto
    if (value) setIsCollectionsDropdownOpen(true);
  };
  //#endregion
  //#endregion

  //#endregion

  //#region Lado Direito do modal
  // Função para alternar o estado de abertura da 'gaveta' de epsódios da temperada
  const toggleSeason = (index) => { setOpenSeasonIndex(openSeasonIndex === index ? null : index); };

  const handleOpenLink = (url) => { window.open(url, '_blank'); };

  // --- FUNÇÕES DE MANIPULAÇÃO DE TEMPORADAS ---

  const openAddEditSeason = (itemId = '', seasonIndex = null, title = '', episodes = []) => {
    setHasAddEditSeason(true);
    setUpdatedItemId(itemId);
    setHasSeasonInfo({
      index: seasonIndex,
      title: title,
      episodes: episodes
    });
  }

  const closeAddEditSeason = () => {
    setHasAddEditSeason(false);
    setUpdatedItemId(null);
    setHasSeasonInfo(null);
  }

  const onAddEditSeason = async (newTitle, newEpisodes) => {
    const currentItem = items.find(item => item._id === updatedItemId);

    if (!currentItem || !Array.isArray(currentItem.seasons)) return;

    const isEditing = hasSeasonInfo.index !== null;
    let updatedSeasons = [...currentItem.seasons];

    const newSeasonData = {
      title: newTitle,
      episodes: newEpisodes
    };

    if (isEditing) {
      // Edição
      updatedSeasons[hasSeasonInfo.index] = newSeasonData;
    } else {
      // Adição
      updatedSeasons.push(newSeasonData);
    }

    // Atualiza o item no banco de dados
    await handleUpdateItem(updatedItemId, { seasons: updatedSeasons });
  }

  const onDeleteSeason = async (itemId = '', seasonIndex = null) => {
    // 1. Encontra o item (Anime) principal pelo ID.
    const currentItem = items.find(item => item._id === itemId);

    // 2. Verifica se o item existe e se 'seasons' é um array.
    if (!currentItem || !Array.isArray(currentItem.seasons)) return;

    // 3. CRIA um NOVO ARRAY de temporadas, excluindo a temporada no índice especificado.
    const updatedSeasons = currentItem.seasons.filter((_, index) => {
      return index !== seasonIndex; // Retorna TRUE para manter a temporada, FALSE para deletar.
    });

    // Forma alternativa reduzida para o filtro de cima
    //const updatedSeasons = currentItem.seasons.filter((_, index) => index !== seasonIndex);

    // 4. Confirma se a remoção realmente ocorreu (se o novo array é menor).
    if (updatedSeasons.length < currentItem.seasons.length) {
      // 5. Atualiza o item no banco de dados com a nova lista de temporadas.
      await handleUpdateItem(itemId, { seasons: updatedSeasons });
    }
  }

  // --- FUNÇÕES DE MANIPULAÇÃO DE EPISÓDIOS ---

  const openAddEditEpisode = (itemId = '', seasonIndex = null, episodeTitle = '', hasWatched = false,) => {
    setHasAddEditEpisode(true);
    setUpdatedItemId(itemId);
    setHasEpisodeInfo({
      sIndex: seasonIndex,
      title: episodeTitle,
      hasWatched: hasWatched
    });
  }

  const closeAddEditEpisode = () => {
    setHasAddEditEpisode(false);
    setUpdatedItemId(null);
    setHasEpisodeInfo(null);
  }

  const onAddEditEpisode = async (newEpisodeTitle, newEpisodeHasWacthed) => {
    const currentItem = items.find(item => item._id === updatedItemId);
    const oldEpisodeTitle = hasEpisodeInfo?.title;

    if (!currentItem || !Array.isArray(currentItem.seasons)) return;

    let isEditing = false;
    const updatedSeasons = currentItem.seasons.map((season, sIndex) => {

      // Retorna a temporada original se não for a que estamos editando
      if (sIndex !== hasEpisodeInfo.sIndex) return season;

      // --- Lógica de Edição/Adição dentro da temporada correta ---

      let updatedEpisodes = season.episodes;

      // Tenta EDITAR um episódio existente
      if (oldEpisodeTitle) {

        updatedEpisodes = season.episodes.map(episode => {
          if (episode.title === oldEpisodeTitle) {
            isEditing = true;
            return {
              title: newEpisodeTitle || episode.title,
              hasWacth: newEpisodeHasWacthed !== undefined ? newEpisodeHasWacthed : episode.hasWacth
            };
          }
          return episode;
        });
      }

      // Tenta ADICIONAR um novo episódio (se não for edição e newEpisodeTitle for válido)
      if (!isEditing && newEpisodeTitle) {
        const newEpisode = {
          title: newEpisodeTitle,
          hasWacth: newEpisodeHasWacthed !== undefined ? newEpisodeHasWacthed : false
        };

        const alreadyExists = season.episodes.some(ep => ep.title === newEpisodeTitle);

        if (!alreadyExists) {
          updatedEpisodes = [...season.episodes, newEpisode];
        } else {
          console.warn(`Episódio "${newEpisodeTitle}" já existe na Temporada ${sIndex + 1}.`);
          // Se já existir, a edição/adição para
          return season;
        }
      }

      // Retorna o NOVO objeto de temporada com a lista de episódios atualizada
      return {
        ...season,
        episodes: updatedEpisodes
      };
    });

    // 2. Atualiza o item principal com o NOVO array de temporadas.
    await handleUpdateItem(updatedItemId, { seasons: updatedSeasons });
  };

  const onDeleteEpisode = async (itemId = '', seasonIndex = null, episodeIndex = null) => {
    const currentItem = items.find(item => item._id === itemId);
    let hasEdited = false;

    if (!currentItem || !Array.isArray(currentItem.seasons)) return;

    // 1. Mapeia o array de temporadas (Nível 1 de Imutabilidade).
    const updatedSeasons = currentItem.seasons.map((season, sIndex) => {

      if (sIndex !== seasonIndex) return season; // Retorna a temporada original.

      // 2. Filtra os episódios (Nível 2 de Imutabilidade) para deletar o item.
      const updatedEpisodes = season.episodes.filter((_, eIndex) => eIndex !== episodeIndex);

      if (updatedEpisodes.length < season.episodes.length) hasEdited = true;

      // 3. Retorna a NOVA temporada com a lista de episódios filtrada.
      // Usa `season.title` para garantir que o título da temporada seja preservado.
      return {
        ...season,
        episodes: updatedEpisodes
      };
    });

    // 4. Atualiza o item principal.
    if (hasEdited) await handleUpdateItem(itemId, { seasons: updatedSeasons });
  }

  const toggleEpisodeWatchStatus = async (itemId, seasonIndex, episodeIndex) => {
    // 1. Encontra o item (Anime) principal e faz a checagem inicial.
    const currentItem = items.find(item => item._id === itemId);

    if (!currentItem || !Array.isArray(currentItem.seasons)) return;

    // 2. Mapeia o array de temporadas (Primeiro Nível de Imutabilidade)
    const updatedSeasons = currentItem.seasons.map((season, sIndex) => {

      // A. Se não for a temporada que queremos modificar, retorna a temporada original.
      if (sIndex !== seasonIndex) return season;

      // B. Se for a temporada correta, Mapeia o array de episódios dentro dela.
      const updatedEpisodes = season.episodes.map((episode, eIndex) => {

        // C. Se for o episódio que queremos modificar...
        if (eIndex === episodeIndex) {
          // ... retorna um NOVO objeto de episódio com 'hasWacth' invertido.
          return {
            ...episode,
            hasWacth: !episode.hasWacth // <--- A inversão ocorre aqui
          };
        }

        // D. Se não for o episódio, retorna o objeto de episódio original.
        return episode;
      });

      // E. Retorna um NOVO objeto de temporada com a lista de episódios atualizada.
      return {
        ...season,
        episodes: updatedEpisodes
      };
    });

    // 3. Chama a função de atualização com o novo array completo de temporadas.
    await handleUpdateItem(itemId, { seasons: updatedSeasons });
  }

  // --- FUNÇÕES DE MANIPULAÇÃO DE LINKS ---

  const openAddEditLink = (itemId = '', linkTitle = '', url = '') => {
    setHasAddEditLink(true);
    setUpdatedItemId(itemId);
    setHasLinkInfo({
      title: linkTitle,
      url: url
    });

  }

  const closeAddEditLink = () => {
    setHasAddEditLink(false);
    setUpdatedItemId(null);
    setHasLinkInfo(null);
  }

  const onEditLink = async (newLinkTitle, newLinkUrl) => {
    const currentItem = items.find(item => item._id === updatedItemId);
    const oldLinkTitle = hasLinkInfo.title;

    if (!currentItem || !Array.isArray(currentItem.movies)) return;

    let isEditing = false;
    const updatedLinks = currentItem.links.map(link => {
      if (oldLinkTitle && link.title === oldLinkTitle) {
        isEditing = true;
        return {
          title: newLinkTitle || link.title, // Usa o novo título, se fornecido
          url: newLinkUrl || link.url   // Usa a nova URL, se fornecida
        };
      }
      return link;
    });

    let finalLinks = updatedLinks;

    // Se for uma nova adição
    if (!isEditing) {
      const newLink = { title: newLinkTitle, url: newLinkUrl };

      const alreadyExists = updatedLinks.some(link => link.title === newLinkTitle);

      if (!alreadyExists) {
        finalLinks = [...updatedLinks, newLink];
      } else {
        // Tratar erro ou apenas retornar se já existir
        console.warn(`Links "${newLinkTitle}" já existe na lista.`);
        return; // Evita a atualização
      }
    }

    finalLinks.sort((a, b) => a.title.localeCompare(b.title));

    await handleUpdateItem(updatedItemId, { links: finalLinks });
  };

  const onDeleteLink = async (itemId, linkToDelete) => {
    const currentItem = items.find(item => item._id === itemId);

    if (!currentItem || !Array.isArray(currentItem.links)) return;

    const updatedLinks = currentItem.links.filter(link => {
      return link.title !== linkToDelete;
    });

    if (updatedLinks.length < currentItem.links.length) {
      await handleUpdateItem(itemId, { links: updatedLinks });
    }
  };
  //#endregion

  //#endregion

  //#region Animes Modal Edit
  //#region Manter Dados do modo edição
  
  // Adicione esta referência no início do seu hook:
  const [initialLoadRef, setInitialLoadRef] = useState(false);
  // Opcionalmente, você pode usar um useRef: const initialLoadRef = useRef(false);
  // Usaremos useState para forçar o useEffect a rodar na primeira vez.

  const createInitialState = (item, type) => {
    // Sua lógica de initialState (edit) e newState (new) aqui
    if (type === 'edit') {
      // Retorna o objeto de edição
      return {
        _id: item?._id || null,
        imageUrl: item?.imageUrl || 'http://localhost:3000/assets/images/placeholder.avif', // Padrão
        title_en: item?.name?.english || '',
        title_jp: item?.name?.japonese || '',
        score: item?.score ?? null,
        sinopse: item?.description || '',
        tags: item?.tags || [],
        date: {
          launched: {
            season: item?.date?.launched?.season || 'Inverno', // Padrão
            year: item?.date?.launched?.year || new Date().getFullYear(), // Padrão
          }
        }
      };
    }
    // Retorna o objeto novo
    return {
      _id: null,
      imageUrl: 'http://localhost:3000/assets/images/placeholder.avif',
      title_en: '',
      title_jp: '',
      score: '',
      sinopse: '',
      tags: [],
      date: {
        launched: {
          season: 'Inverno',
          year: new Date().getFullYear()
        }
      }
    };
  }
  
  // 1. Crie o estado inicial memorizado
  const newInitialState = useMemo(() => {
      return createInitialState(selectedObject, hasAnimeModal);
  }, [selectedObject, hasAnimeModal]);

  // 2. O estado inicial usa a função, mas a recriação é controlada pelo useMemo acima
  const [formData, setFormData] = useState(() => createInitialState(selectedObject, hasAnimeModal));
  const [previewImageUrl, setPreviewImageUrl] = useState(() => formData.imageUrl); // Usa o resultado inicial do formData

  
  // 3. Atualize o useEffect com a lógica de prevenção de reset:
 
// src/hooks/useAnimeModalManager.js

  useEffect(() => {
    // Objeto sendo editado atualmente (do seu estado)
    const currentFormDataId = formData._id;
    // Novo objeto passado pelo pai
    const newSelectedId = selectedObject?._id;

    // ----------------------------------------------------
    // Condições para RESETAR o formulário:
    // ----------------------------------------------------
      
    // ----------------------------------------------------
    // LÓGICA DE RESET/CANCELAMENTO
    // ----------------------------------------------------

    // Condição de Reset/Cancelamento:
    // ✅ Prevenção de Perda de Dados em Edição: A lógica if (hasAnimeModal === 'edit' && currentFormDataId !== newSelectedId) e o return no final garantem que o estado 
    // seja mantido se o ID for o mesmo.
    // Se o modal estiver aberto, mas não estiver em modo 'edit' ou 'new' 
    // (ou seja, está em 'details' ou 'null', dependendo da sua implementação de fechamento)
    if (hasAnimeModal !== 'edit' && hasAnimeModal !== 'new') {
      // Reseta o formData para o estado inicial baseado no item que está sendo visualizado
      const itemToView = selectedObject; // O item original antes das edições

      if (itemToView) {
        const originalState = createInitialState(itemToView, 'edit');
        setFormData(originalState);
        setPreviewImageUrl(originalState.imageUrl);
      }

      setInitialLoadRef(false); // Reseta a flag para a próxima vez que abrir 'new'
      return; // Sai do useEffect
    }
    
    // ----------------------------------------------------
    // LÓGICA DE ABERTURA (New/Edit)
    // ----------------------------------------------------

    // MODO NEW:
    // ✅ Prevenção de Perda de Dados em Novo: A lógica if (hasAnimeModal === 'new') usando o !initialLoadRef garante que o formulário só resete na abertura inicial, 
    // mantendo o estado durante as re-renderizações (como após adicionar uma tag).
    if (hasAnimeModal === 'new') {
      // O formulário só deve ser resetado se for a primeira vez que abriu, 
      // ou se o modo de edição for explicitamente fechado e reaberto

      // Se a referência de carga inicial for falsa, inicialize o formulário
      if (!initialLoadRef) {
        const newState = createInitialState(null, 'new');
        setFormData(newState);
        setPreviewImageUrl(newState.imageUrl);
        setInitialLoadRef(true); // Indica que o estado NEW foi carregado
      }

      // Se for TRUE, o formulário já está em uso, e a atualização global (fetchData)
      // não causará o reset, pois o useEffect não executa mais esta parte.
      return;
    }

    //✅ Reset ao Cancelar Edição: A primeira cláusula if (hasAnimeModal !== 'edit' && hasAnimeModal !== 'new') reseta explicitamente o formData para os valores 
    // originais (selectedObject) sempre que o modal sai dos modos de edição/criação, resolvendo o problema de persistência.
    // 2. MODO 'EDIT' e MUDANÇA DE ITEM: O ID do formulário atual (currentFormDataId) é diferente do novo item (newSelectedId).
    // Ou seja, o usuário clicou em outro anime.
    if (hasAnimeModal === 'edit' && currentFormDataId !== newSelectedId) {
      // Se o novo ID for null ou se for um ID diferente, recalcule e resete o estado.
      const newState = createInitialState(selectedObject, 'edit');
      setFormData(newState);
      setPreviewImageUrl(newState.imageUrl);
      return;
    }

    // ----------------------------------------------------
    // PREVENÇÃO DE PERDA DE DADOS:
    // ----------------------------------------------------

    // Se hasAnimeModal === 'edit' E currentFormDataId === newSelectedId,
    // (O fetchData rodou e recriou o selectedObject, mas é o mesmo item)
    // NADA ACONTECE. O estado (formData) com as edições não salvas é mantido.
    setInitialLoadRef(false);

  }, [selectedObject, hasAnimeModal]); // Dependências
  // Você pode precisar adicionar formData._id (se existir) na lista de dependências
  // Mas não o formData inteiro, senão ele vai rodar a cada digitação!
  //#endregion

  //#region change inputs
  // Função auxiliar para verificar a URL
  const checkImageExists = (url) => {
    return new Promise((resolve) => {
      // Se a URL estiver vazia, retornamos o placeholder
      if (!url.trim()) {
        return resolve('http://localhost:3000/assets/images/placeholder.avif');
      }

      const img = new Image();
      img.onload = () => resolve(url); // Se carregar com sucesso, resolve com a URL válida
      img.onerror = () => resolve('http://localhost:3000/assets/images/placeholder.avif'); // Se falhar, resolve com o placeholder
      img.src = url;
    });
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    if (name === 'score' && value !== '' && isNaN(Number(value)) || Number(value) > 10) return;

    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'imageUrl') {
      // 2. Se for o campo de URL, verificar a URL e atualizar o preview
      const validUrl = await checkImageExists(value);
      setPreviewImageUrl(validUrl);
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      date: {
        ...prev.date,
        launched: {
          ...prev.date.launched,
          [name]: value
        }
      }
    }));
  };

  const handleAddTag = (newTag) => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag].sort((a, b) => a.localeCompare(b))
      }));
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };
  //#endregion 

  //#region Modal de tags
  const openAddEditTag = (callback) => {
    if (callback) {
      // Guardamos a função que o filho enviou (ex: adicionar ao formData)
      setTagSubmitCallback(() => callback);
    }
    setHasAddEditTag(true);
  }

  const closeAddEditTag = () => {
    setHasAddEditTag(false);
    setTagSubmitCallback(null); // Limpa o callback ao fechar
  }

  // Esta função será chamada pelo AddEditTagModal no Pai
  const handleAddNewTag = (newTag) => {
    // 1. Aqui você pode adicionar lógica para salvar a tag no GlobalData (Backend/Contexto) se necessário
    // ... lógica global ...
    handleCreateTag(newTag);

    // 2. Executa o callback do filho (para atualizar o visual do formulário imediatamente)
    if (tagSubmitCallback) {
      tagSubmitCallback(newTag);
    }

    // 3. Fecha o modal
    closeAddEditTag();
  };
  //#endregion
  //#endregion

  return {
    // Abrir ou fechar o modal de animeModal de anime
    openAnimeModal,
    closeAnimeModal,
    hasAnimeModal,

    // Anime selecionado e funções de seleção
    currentIndex,
    selectedObject,
    handlePrev,
    handleNext,

    // Lado esquerdo do modal
    getMonths,
    closeAllDropdowns,
    isMoviesDropdownOpen, // Primeiro Dropdown dos filmes
    openMoviesDropdown, // 1°
    toggleMovieWatchStatus, // 1°
    handleDeleteMovie, // Segundo Dropdown dos filmes

    hasAddEditMovie, // Modal de edição dos filmes
    openAddEditMovie, // Modal de edição dos filmes
    closeAddEditMovie, // Modal de edição dos filmes
    hasMovieNamed, // Modal de edição dos filmes
    hasMovieWatched, // Modal de edição dos filmes
    createEditMovie, // Modal de edição dos filmes

    // Lado Direito do modal
    hasAddEditSeason,
    openAddEditSeason,
    closeAddEditSeason,
    hasSeasonInfo,
    onAddEditSeason,
    onDeleteSeason,
    hasAddEditEpisode,
    openAddEditEpisode,
    closeAddEditEpisode,
    hasEpisodeInfo,
    onAddEditEpisode,
    onDeleteEpisode,
    toggleEpisodeWatchStatus,
    hasAddEditLink, // Modal de edição de links
    openAddEditLink, // Modal de edição de links
    closeAddEditLink, // Modal de edição de links
    hasLinkInfo, // Modal de edição de links

    setTimeWatched,

    isCollectionsDropdownOpen, // Primeiro Dropdown das coleções
    openCollectionDropdown, // 1°
    isGlobalCollectionsDropdownOpen, // Segundo Dropdown das coleções
    handleIsGlobalCollectionsDropdownOpen, // 2°

    // Lado Direito do modal
    openSeasonIndex,
    toggleSeason,
    handleOpenLink,
    onEditLink,
    onDeleteLink,

    // modal de dição
    hasAddEditTag, // Modal de edição de tags
    openAddEditTag,
    closeAddEditTag,
    handleAddNewTag,

    // ... estados e funções existentes ...
    formData,
    previewImageUrl,
    handleChange,
    handleDateChange,
    handleAddTag,
    handleRemoveTag,
  };
}