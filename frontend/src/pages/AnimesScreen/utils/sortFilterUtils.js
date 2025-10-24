// src/utils/sortFilterUtils.js

// Função auxiliar para determinar a temporada atual do ano.
const getCurrentAnimeSeason = () => {
  // 1. Obtém a data atual do sistema
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // getMonth() retorna 0-11
  const currentYear = now.getFullYear();

  let season = '';
  // Mapeamento:
  // 1 (Jan) - 3 (Mar) = Inverno
  // 4 (Abr) - 6 (Jun) = Primavera
  // 7 (Jul) - 9 (Set) = Verão
  // 10 (Out) - 12 (Dez) = Outono

  if (currentMonth >= 10 && currentMonth <= 12) {
    season = 'Outono';
  } else if (currentMonth >= 7 && currentMonth <= 9) {
    season = 'Verão';
  } else if (currentMonth >= 4 && currentMonth <= 6) {
    season = 'Primavera';
  } else {
    season = 'Inverno';
  }

  return {
    season: season,
    year: currentYear
  };
};

// Função auxiliar para mapear estações para um número
const mapSeasonToOrder = (season) => {
  switch (season) {
    case 'Inverno':
      return 1; // Jan-Mar
    case 'Primavera':
      return 2; // Abr-Jun
    case 'Verão':
      return 3; // Jul-Set
    case 'Outono':
      return 4; // Out-Dez
    default:
      return 0;
  }
}

// Função para calcular a quantidade total de episódios de um item
const countTotalEpisodes = (item) => {
  return item.seasons?.reduce((total, season) => {
    // Adiciona o número de episódios de cada temporada
    return total + (season.episodes?.length || 0);
  }, 0) || 0; // Retorna 0 se não houver temporadas
};

const sortOptions = [
    { value: 'AZ', label: 'Alfabético A-Z' },
    { value: 'ZA', label: 'Alfabético Z-A' },
    { value: 'MN', label: 'Maior Nota' },
    { value: 'MM', label: 'Menor Nota' },
    { value: 'LR', label: 'Lançamento Recente' },
    { value: 'LA', label: 'Lançamento Antigo' },
    { value: 'MR', label: 'Modificação Recente' },
    { value: 'MA', label: 'Modificação Antiga' },
    { value: 'MaE', label: 'Mais Episódios' },
    { value: 'MeE', label: 'Menos Episódios' },
];

// Função principal de ordenação
const sortItems = (items, sortKey) => {
  // 1. Cria uma cópia do array para não modificar o estado original
  const sorted = [...items];

  sorted.sort((a, b) => {
    switch (sortKey) {
      // ORDENAÇÃO ALFABÉTICA
      case 'AZ': // Alfabético A-Z
        return (a.name?.japonese || '').localeCompare(b.name?.japonese || '');

      case 'ZA': // Alfabético Z-A
        return (b.name?.japonese || '').localeCompare(a.name?.japonese || '');

      // ORDENAÇÃO POR NOTA PESSOAL
      case 'MN': // Maior Nota (10 -> 0)
        return (b.score?.personal || 0) - (a.score?.personal || 0);

      case 'MM': // Menor Nota (0 -> 10)
        return (a.score?.personal || 0) - (b.score?.personal || 0);

      case 'LR': { // Lançamento mais recente (novos) -> ORDEM DECRESCENTE
        const yearA = a.date?.launched?.year || 0;
        const yearB = b.date?.launched?.year || 0;
        const monthA = mapSeasonToOrder(a.date?.launched?.season);
        const monthB = mapSeasonToOrder(b.date?.launched?.season);

        // 1. Compara o ano: B - A (para ter o mais recente primeiro)
        if (yearA !== yearB) {
          return yearB - yearA;
        }

        // 2. Se o ano for igual, compara a estação: A - B
        return monthB - monthA;
      }

      case 'LA': { // Lançamento mais antigos (velhos) -> ORDEM CRESCENTE
        const yearA = a.date?.launched?.year || 0;
        const yearB = b.date?.launched?.year || 0;
        const monthA = mapSeasonToOrder(a.date?.launched?.season);
        const monthB = mapSeasonToOrder(b.date?.launched?.season);

        // 1. Compara o ano: A - B (para ter o mais antigo primeiro)
        if (yearA !== yearB) {
          return yearA - yearB;
        }

        // 2. Se o ano for igual, compara a estação: B - A
        return monthA - monthB;
      }

      // ORDENAÇÃO POR DATA DE EDIÇÃO
      case 'MR': { // Últimas Modificadas (Mais Recentes)
        const dateA = new Date(a.date?.lastEdit || 0);
        const dateB = new Date(b.date?.lastEdit || 0);
        return dateB.getTime() - dateA.getTime();
      }

      case 'MA': { // Primeiras Modificadas (Mais Antigas)
        // OBS: Se a data não for formato ISO (e.g., '14/10/2025'), 
        // a conversão pode falhar.
        const dateA = new Date(a.date?.lastEdit || 0);
        const dateB = new Date(b.date?.lastEdit || 0);
        return dateA.getTime() - dateB.getTime();
      }

      // ORDENAÇÃO POR EPISÓDIOS
      case 'MaE': // Maior Quantidade de Episódios
        return countTotalEpisodes(b) - countTotalEpisodes(a);

      case 'MeE': // Menor Quantidade de Episódios
        return countTotalEpisodes(a) - countTotalEpisodes(b);

      default:
        return 0; // Ordem padrão ou nenhuma alteração
    }
  });

  return sorted;
};

export { getCurrentAnimeSeason, mapSeasonToOrder, countTotalEpisodes, sortOptions, sortItems };
