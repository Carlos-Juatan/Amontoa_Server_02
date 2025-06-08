para abrir digite no terminal

```Bash
npm run dev
```

# A estrutura do projeto deve ser

```
frontend/
├── src/
│   ├── assets/                 # Ícones, imagens, etc.
│   ├── components/
│   │   ├── Dashboard/          # Componentes relacionados ao Dashboard
│   │   │   ├── Dashboard.jsx
│   │   │   └── DashboardItem.jsx
│   │   ├── ScreenManager/      # Gerenciador de Telas
│   │   │   ├── ScreenManager.jsx
│   │   │   └── ScreenManagerContext.jsx  # Contexto para injetar o gerenciador
│   │   ├── ComingSoonScreen/   # Tela "Em Breve"
│   │   │   └── ComingSoonScreen.jsx
│   │   └── Common/             # Componentes reutilizáveis (botões, etc.)
│   │       └── Button.jsx
│   ├── services/
│   │   └── dataService.js      # Mock de dados e futura chamada ao backend
│   ├── utils/
│   │   └── Observable.js       # Implementação do padrão Observer
│   ├── App.jsx                 # Componente principal
│   ├── main.jsx                # Ponto de entrada da aplicação
│   └── index.css               # Estilos globais
```

# Passo 1. frontend/src/utils/Observable.js (Padrão Observer)

```JavaScript
// src/utils/Observable.js
class Observable {
  constructor() {
    this.observers = [];
  }

  // Adiciona um observador (função de callback)
  subscribe(callback) {
    this.observers.push(callback);
  }

  // Remove um observador
  unsubscribe(callback) {
    this.observers = this.observers.filter(observer => observer !== callback);
  }

  // Notifica todos os observadores com os dados fornecidos
  notify(data) {
    this.observers.forEach(observer => observer(data));
  }
}

export const screenChangeObservable = new Observable();
```
# Passo 2. frontend/src/services/dataService.js (Mock de Dados)

```JavaScript
// src/services/dataService.js

const BACKEND_DATA_URL = 'http://localhost:3000/data';

export const fetchDashboardItems = async () => {
  try {
    const response = await fetch(BACKEND_DATA_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Como o backend retorna um objeto onde cada chave (Estudos, Filmes, etc.)
    // contém um array com o objeto completo do item, precisamos extrair esses objetos.
    // Ex: {"Estudos": [{"id": "Estudos", ...}]}
    // Queremos apenas o array de objetos.
    const items = Object.values(data).flat(); // `flat()` para achatar os arrays internos

    return items;

  } catch (error) {
    console.error("Erro ao buscar dados do backend:", error);
    throw error;
  }
};

// Esta função continua como antes, para simular a inatividade
// e direcionar para a tela "Em Breve".
export const checkDataPathStatus = async (dataPath) => {
  await new Promise(resolve => setTimeout(resolve, 100)); // Simula um pequeno delay
  // Retorna true (inativo) para qualquer path que não contenha '/active'
  return !dataPath.includes('/active');
};
```

# Passo 3. frontend/src/components/Common/Button.jsx

```JavaScript
// src/components/Common/Button.jsx
import React from 'react';
import './Button.css'; // Crie este arquivo CSS depois

function Button({ children, onClick, className = '' }) {
  return (
    <button className={`common-button ${className}`} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
```

 - Crie o arquivo $frontend/src/components/Common/Button.css:

```CSS
/* src/components/Common/Button.css */
/* src/components/Common/Button.css */
.common-button {
  background-color: var(--primary-purple); /* Roxo principal */
  color: var(--text-light);
  border: 1px solid var(--primary-purple);
  padding: 12px 25px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1em;
  font-weight: bold;
  transition: background-color 0.3s ease, border-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 8px var(--shadow-color);
}

.common-button:hover {
  background-color: var(--secondary-purple); /* Roxo secundário */
  border-color: var(--secondary-purple);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px var(--shadow-color);
}

.common-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px var(--shadow-color);
}
```

# Passo 4. frontend/src/components/ComingSoonScreen/ComingSoonScreen.jsx (Tela "Em Breve")

```JavaScript
// src/components/ComingSoonScreen/ComingSoonScreen.jsx
import React from 'react';
import Button from '../Common/Button';
import './ComingSoonScreen.css'; // Crie este arquivo CSS depois

function ComingSoonScreen({ onBack }) {
  return (
    <div className="coming-soon-screen">
      <h2>Em Breve!</h2>
      <p>Esta seção está em construção. Volte em breve para novidades!</p>
      <Button onClick={onBack}>Voltar ao Dashboard</Button>
    </div>
  );
}

export default ComingSoonScreen;
```

 - Crie o arquivo $frontend/src/components/ComingSoonScreen/ComingSoonScreen.css:

```CSS
/* src/components/ComingSoonScreen/ComingSoonScreen.css */
.coming-soon-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  background-color: var(--background-dark);
  color: var(--text-light);
  padding: 20px;
}

.coming-soon-screen h2 {
  font-size: 3em;
  margin-bottom: 25px;
  color: var(--highlight-blue); /* Um toque de azul para destaque */
  text-shadow: 0 0 10px rgba(97, 218, 251, 0.4);
}

.coming-soon-screen p {
  font-size: 1.3em;
  margin-bottom: 40px;
  max-width: 600px;
  line-height: 1.6;
}
```

# Passo 5. frontend/src/components/Dashboard/DashboardItem.jsx

```JavaScript
// src/components/Dashboard/DashboardItem.jsx
import React from 'react';
import './DashboardItem.css'; // Crie este arquivo CSS depois

function DashboardItem({ title, description, icon, onClick }) {
  return (
    <div className="dashboard-item" onClick={onClick}>
      <i className={`${icon} dashboard-item-icon`}></i>
      <h3 className="dashboard-item-title">{title}</h3>
      <p className="dashboard-item-description">{description}</p>
    </div>
  );
}

export default DashboardItem;
```

 - Crie o arquivo $frontend/src/components/Dashboard/DashboardItem.css:

```CSS
/* src/components/Dashboard/DashboardItem.css */
.dashboard-item {
  background-color: var(--card-background); /* Fundo dos cards */
  border-radius: 12px;
  box-shadow: 0 6px 12px var(--shadow-color);
  padding: 25px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out, background-color 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border: 1px solid var(--border-color); /* Borda sutil */
}

.dashboard-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px var(--shadow-color);
  background-color: var(--secondary-purple); /* Um pouco de roxo no hover */
}

.dashboard-item-icon {
  font-size: 3.5em;
  margin-bottom: 20px;
  color: var(--primary-purple); /* Roxo principal para ícones */
  text-shadow: 0 0 10px rgba(140, 115, 204, 0.3);
}

.dashboard-item:hover .dashboard-item-icon {
  color: var(--highlight-blue); /* Azul no hover para ícones */
}

.dashboard-item-title {
  font-size: 1.8em;
  margin-bottom: 12px;
  color: var(--text-light);
  font-weight: 600;
}

.dashboard-item-description {
  font-size: 1em;
  color: var(--text-light);
  opacity: 0.8;
  line-height: 1.5;
}
```
# Passo 6. frontend/src/components/Dashboard/Dashboard.jsx (Tela Principal)

```JavaScript
// src/components/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import DashboardItem from './DashboardItem';
import { fetchDashboardItems, checkDataPathStatus } from '../../services/dataService';
import { useScreenManager } from '../ScreenManager/ScreenManagerContext'; // Importar o hook do contexto
import './Dashboard.css'; // Crie este arquivo CSS depois

function Dashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { navigateTo } = useScreenManager(); // Usar o navigateTo do gerenciador de telas

  useEffect(() => {
    const getItems = async () => {
      try {
        const fetchedItems = await fetchDashboardItems();
        setItems(fetchedItems);
      } catch (err) {
        setError("Não foi possível carregar os itens do dashboard.");
        console.error("Erro ao carregar itens do dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    getItems();
  }, []);

  const handleItemClick = async (item) => {
    // Verifica se o data_path corresponde a um endereço "ativo" ou "inativo"
    const isInactive = await checkDataPathStatus(item.data_path);

    if (isInactive) {
      navigateTo('comingSoon'); // Navega para a tela "Em Breve"
    } else {
      // Futuramente, navegar para a tela específica do item (ex: 'EstudosScreen')
      console.log(`Navegar para a tela de ${item.title}`);
      alert(`Funcionalidade para ${item.title} em breve!`);
    }
  };

  if (loading) return <div className="dashboard-message">Carregando Dashboard...</div>;
  if (error) return <div className="dashboard-message error">{error}</div>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Meu Dashboard Central</h1>
      <div className="dashboard-grid">
        {items.map(item => (
          <DashboardItem
            key={item.id}
            title={item.title}
            description={item.description}
            icon={item.icon}
            onClick={() => handleItemClick(item)}
          />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
```

    - Crie o arquivo $frontend/src/components/Dashboard/Dashboard.css:

```CSS
/* src/components/Dashboard/Dashboard.css */
.dashboard-container {
  padding: 60px 20px;
  background-color: var(--background-dark);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; /* Alinha o conteúdo ao topo */
}

.dashboard-title {
  text-align: center;
  font-size: 3.5em;
  color: var(--highlight-blue); /* Título em azul para destaque */
  margin-bottom: 60px;
  text-shadow: 0 0 15px rgba(97, 218, 251, 0.5);
  font-weight: 700;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1400px; /* Maior largura para mais itens por linha */
  width: 100%;
  padding: 0 20px; /* Adiciona padding para telas menores */
  box-sizing: border-box; /* Inclui padding na largura total */
}

.dashboard-message {
  text-align: center;
  padding: 50px;
  font-size: 1.8em;
  color: var(--text-light);
}

.dashboard-message.error {
  color: #dc3545; /* Vermelho para erros */
}
```

# Passo 7. frontend/src/components/ScreenManager/ScreenManagerContext.jsx

```JavaScript
// src/components/ScreenManager/ScreenManagerContext.jsx
import React, { createContext, useContext } from 'react';

const ScreenManagerContext = createContext(null);

export const ScreenManagerProvider = ({ children, screenManager }) => {
  return (
    <ScreenManagerContext.Provider value={screenManager}>
      {children}
    </ScreenManagerContext.Provider>
  );
};

export const useScreenManager = () => {
  const context = useContext(ScreenManagerContext);
  if (!context) {
    throw new Error('useScreenManager must be used within a ScreenManagerProvider');
  }
  return context;
};

```

# Passo 8. frontend/src/components/ScreenManager/ScreenManager.jsx (Gerenciador de Telas)

```JavaScript
// src/components/ScreenManager/ScreenManager.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Dashboard from '../Dashboard/Dashboard';
import ComingSoonScreen from '../ComingSoonScreen/ComingSoonScreen';
import { screenChangeObservable } from '../../utils/Observable';
import { ScreenManagerProvider } from './ScreenManagerContext';

// Mapeamento das telas disponíveis
const screens = {
  dashboard: Dashboard,
  comingSoon: ComingSoonScreen,
  // Futuramente: estudosScreen, moviesScreen, etc.
};

function ScreenManager() {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [screenProps, setScreenProps] = useState({});

  // Função para navegar para uma nova tela
  // Usamos useCallback para evitar renderizações desnecessárias
  const navigateTo = useCallback((screenName, props = {}) => {
    if (screens[screenName]) {
      setCurrentScreen(screenName);
      setScreenProps(props);
      // Notifica os observadores que a tela mudou
      screenChangeObservable.notify({ screen: screenName, props: props });
    } else {
      console.warn(`Tela "${screenName}" não encontrada.`);
    }
  }, []);

  // Handler para o botão de "Voltar" na tela "Em Breve"
  const handleBackToDashboard = useCallback(() => {
    navigateTo('dashboard');
  }, [navigateTo]);

  // Renderiza a tela atual dinamicamente
  const CurrentScreenComponent = screens[currentScreen];

  // Passa as props específicas para cada tela
  const propsForCurrentScreen = { ...screenProps };
  if (currentScreen === 'comingSoon') {
    propsForCurrentScreen.onBack = handleBackToDashboard;
  }

  // O gerenciador de telas é passado via contexto
  const screenManagerApi = {
    navigateTo,
    currentScreen, // Pode ser útil para depuração ou outros hooks
  };

  return (
    <ScreenManagerProvider screenManager={screenManagerApi}>
      {CurrentScreenComponent && <CurrentScreenComponent {...propsForCurrentScreen} />}
    </ScreenManagerProvider>
  );
}

export default ScreenManager;
```

# Passo 9. frontend/src/App.jsx

```JavaScript
// src/App.jsx
import React from 'react';
import ScreenManager from './components/ScreenManager/ScreenManager';
import './App.css'; // Estilos globais
import '@fortawesome/fontawesome-free/css/all.min.css'; // Importa Font Awesome

function App() {
  return (
    <div className="app-container">
      <ScreenManager />
    </div>
  );
}

export default App;
```

# Passo 10. frontend/src/index.css (Estilos Globais)

```CSS
/* src/index.css */
/* src/index.css */
:root {
  --background-dark: #1a1a2e; /* Fundo escuro */
  --card-background: #1f2041; /* Fundo dos cards/itens */
  --text-light: #e0e0e0; /* Texto claro */
  --primary-purple: #8c73cc; /* Roxo principal */
  --secondary-purple: #5e548e; /* Roxo secundário */
  --highlight-blue: #61dafb; /* Azul claro para realces */
  --border-color: rgba(255, 255, 255, 0.1); /* Borda sutil */
  --shadow-color: rgba(0, 0, 0, 0.4);
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--background-dark); /* Aplica o fundo escuro */
  color: var(--text-light); /* Aplica a cor do texto clara */
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
```

# Passo 11. Instalar Font Awesome

```Bash
npm install @fortawesome/fontawesome-free
```

# Passo 12 Atualizar o Docker compose

    - Certifique-se de estar na pasta que contém o docker-compose.yml (a pasta raiz que contém frontend e backend).
    - Pare e remova quaisquer containers anteriores (para garantir um ambiente limpo):

```Bash
docker-compose down
```

    - Reconstrua as imagens e inicie os serviços:

```Bash
docker-compose up --build
```

# Passo 13 Fazendo a tela de estudos

nova estrutura

```
root/
├── src/
│   ├── components/
│   │   ├── StudiesScreen/        # NOVA PASTA
│   │   │   ├── StudiesScreen.jsx # NOVO COMPONENTE
│   │   │   ├── StudiesScreen.css # NOVO CSS
│   │   │   ├── NoteItem.jsx      # NOVO COMPONENTE (para cada anotação)
│   │   │   └── NoteItem.css      # NOVO CSS
│   │   └── Common/
│   │       ├── SearchBar.jsx     # NOVO COMPONENTE
│   │       └── SearchBar.css     # NOVO CSS
```

mudando o arquivo src/services/dataService.js

```JavaScript
// src/services/dataService.js

// URL para o dashboard principal
const BACKEND_DASHBOARD_URL = 'http://localhost:3000/data/dashboard';
// Prefixo para as URLs de dados específicos de cada categoria
const BACKEND_DATA_PREFIX = 'http://localhost:3000/'; // O backend já fornece 'data/studies'

export const fetchDashboardItems = async () => {
  try {
    const response = await fetch(BACKEND_DASHBOARD_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // O backend agora retorna um array de objetos, então não precisamos mais do flat()
    return data;

  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error);
    throw error;
  }
};

// Nova função para buscar dados específicos de uma categoria (ex: Estudos)
export const fetchCategoryData = async (dataPath) => {
  try {
    // Constrói a URL completa usando o prefixo e o dataPath fornecido pelo item do dashboard
    const url = `${BACKEND_DATA_PREFIX}${dataPath}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data; // Retorna os dados da categoria (ex: o objeto completo de Estudos com 'notes')

  } catch (error) {
    console.error(`Erro ao buscar dados da categoria ${dataPath}:`, error);
    throw error;
  }
};


// Esta função agora verifica se o data_path NÃO contém 'inactive'
// e NÃO é 'data/studies' (o que significa que é um path ativo que ainda não tratamos)
// ou se é 'data/studies' (que vamos tratar agora)
export const checkDataPathStatus = async (dataPath) => {
  await new Promise(resolve => setTimeout(resolve, 100)); // Simula um pequeno delay

  // Se o dataPath for "data/studies", consideramos ATIVO
  if (dataPath === 'data/studies') {
    return { isActive: true, screenName: 'studiesScreen' }; // Retorna que é ativo e qual tela usar
  }

  // Se o dataPath contiver 'inactive', consideramos INATIVO
  if (dataPath.includes('inactive')) {
    return { isActive: false, screenName: 'comingSoon' }; // Retorna que é inativo
  }

  // Para qualquer outro dataPath que não seja 'inactive' e não seja 'data/studies',
  // por enquanto, também consideramos inativo (ou você pode adicionar mais lógicas aqui)
  return { isActive: false, screenName: 'comingSoon' };
};

```

```JavaScript
// src/components/Common/SearchBar.jsx
import React from 'react';
import './SearchBar.css';

function SearchBar({ searchTerm, onSearchChange, placeholder = "Pesquisar..." }) {
  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />
      <i className="fas fa-search search-icon"></i>
    </div>
  );
}

export default SearchBar;

```

```CSS
/* src/components/Common/SearchBar.css */
.search-bar-container {
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 20px auto;
}

.search-input {
  width: 100%;
  padding: 12px 15px 12px 45px; /* Mais padding à esquerda para o ícone */
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--card-background);
  color: var(--text-light);
  font-size: 1.1em;
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.search-input::placeholder {
  color: var(--text-light);
  opacity: 0.6;
}

.search-input:focus {
  border-color: var(--primary-purple);
  box-shadow: 0 0 0 3px rgba(140, 115, 204, 0.3);
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--primary-purple);
  font-size: 1.2em;
}
```

```JavaScript
// src/components/StudiesScreen/NoteItem.jsx
import React from 'react';
import './NoteItem.css';

function NoteItem({ title, description, icon, onClick }) {
  return (
    <div className="note-item" onClick={onClick}>
      <div className="note-item-icon-container">
        <i className={`${icon} note-item-icon`}></i>
      </div>
      <div className="note-item-content">
        <h3 className="note-item-title">{title}</h3>
        <p className="note-item-description">{description}</p>
      </div>
      <i className="fas fa-chevron-right note-item-arrow"></i>
    </div>
  );
}

export default NoteItem;
```

```CSS
/* src/components/StudiesScreen/NoteItem.css */
.note-item {
  background-color: var(--card-background);
  border-radius: 10px;
  box-shadow: 0 4px 8px var(--shadow-color);
  padding: 20px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
  border: 1px solid var(--border-color);
}

.note-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px var(--shadow-color);
  background-color: var(--secondary-purple);
}

.note-item-icon-container {
  flex-shrink: 0; /* Não permite que o ícone encolha */
  margin-right: 20px;
  width: 50px; /* Tamanho fixo para o container do ícone */
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--primary-purple);
  border-radius: 50%;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.note-item-icon {
  font-size: 1.8em;
  color: var(--text-light); /* Ícone claro no fundo roxo */
}

.note-item-content {
  flex-grow: 1; /* Permite que o conteúdo ocupe o espaço restante */
}

.note-item-title {
  font-size: 1.4em;
  color: var(--highlight-blue); /* Título em azul para destaque */
  margin-bottom: 5px;
}

.note-item-description {
  font-size: 0.95em;
  color: var(--text-light);
  opacity: 0.7;
}

.note-item-arrow {
  margin-left: 20px;
  color: var(--primary-purple);
  font-size: 1.2em;
}
```

```JavaScript
// src/components/StudiesScreen/StudiesScreen.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useScreenManager } from '../ScreenManager/ScreenManagerContext';
import { fetchCategoryData } from '../../services/dataService';
import Button from '../Common/Button';
import SearchBar from '../Common/SearchBar';
import NoteItem from './NoteItem';
import './StudiesScreen.css';

function StudiesScreen({ dataPath }) {
  const { navigateTo } = useScreenManager();
  const [studiesData, setStudiesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const getStudiesData = async () => {
      try {
        setLoading(true);
        const data = await fetchCategoryData(dataPath);
        // O backend está retornando um array com um único objeto para /data/studies.
        // Precisamos extrair esse objeto para 'studiesData'.
        const actualStudiesObject = Array.isArray(data) && data.length > 0 ? data[0] : null;
        setStudiesData(actualStudiesObject);
        console.log("Dados de Estudos carregados (objeto principal):", actualStudiesObject); // DEBUG
      } catch (err) {
        setError("Não foi possível carregar os dados de Estudos.");
        console.error("Erro ao carregar dados de Estudos:", err);
      } finally {
        setLoading(false);
      }
    };
    getStudiesData();
  }, [dataPath]);

  // Filtra as anotações de nível superior com base no termo de pesquisa
  const filteredNotes = useMemo(() => {
    // Agora, studiesData já deve ser o objeto, e queremos 'notes-list'
    if (!studiesData || !studiesData['notes-list']) {
      console.log("studiesData ou studiesData['notes-list'] estão vazios/nulos."); // DEBUG
      return [];
    }

    const topLevelNotes = studiesData['notes-list'];
    console.log("Itens de nível superior de 'notes-list':", topLevelNotes); // DEBUG

    if (!searchTerm) {
      return topLevelNotes; // Retorna todos os itens de nível superior se não houver termo de pesquisa
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return topLevelNotes.filter(note => {
      // 1. Pesquisa no título e descrição do item de nível superior
      const matchesTopLevel =
        note.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        note.description.toLowerCase().includes(lowerCaseSearchTerm);

      if (matchesTopLevel) return true; // Se já encontrou no nível superior, inclui

      // 2. Opcionalmente: Pesquisa dentro dos módulos, submódulos e lições aninhadas
      // Esta parte é mais complexa e pode ser otimizada para performance em grandes datasets.
      // Por enquanto, faz uma busca profunda.
      if (note.modules) {
        for (const module of note.modules) {
          if (module.submodules) {
            for (const submodule of module.submodules) {
              if (submodule.lessons) {
                for (const lesson of submodule.lessons) {
                  if (lesson.title.toLowerCase().includes(lowerCaseSearchTerm)) {
                    return true; // Encontrou no título da lição
                  }
                  if (lesson.notes) {
                    for (const content of lesson.notes) {
                      if (content.type === 'paragraph' && content.content.toLowerCase().includes(lowerCaseSearchTerm)) {
                        return true; // Encontrou no conteúdo do parágrafo da lição
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      return false; // Não encontrou em nenhum lugar
    });
  }, [studiesData, searchTerm]);


  const handleBack = () => {
    navigateTo('dashboard');
  };

  const handleNoteClick = (note) => {
    // 'note' aqui é um item completo do 'notes-list' (ex: "Anotações da PromovaWeb - DevOps")
    alert(`Clicou na anotação principal: ${note.title}`);
    console.log("Dados completos da anotação principal:", note);
    // Futuramente: navegar para uma nova tela de detalhes que exiba os módulos/submódulos/lessons deste item
    // navigateTo('noteDetailScreen', { noteData: note });
  };

  if (loading) return <div className="studies-message">Carregando Anotações de Estudos...</div>;
  if (error) return <div className="studies-message error">{error}</div>;
  // Verifica se studiesData existe, se 'notes-list' existe e se filteredNotes tem itens
  if (!studiesData || !studiesData['notes-list'] || filteredNotes.length === 0) {
    return <div className="studies-message">Nenhuma anotação encontrada ou correspondente à pesquisa.</div>;
  }

  return (
    <div className="studies-screen-container">
      <div className="studies-header">
        <Button onClick={handleBack} className="back-button">
          <i className="fas fa-arrow-left"></i> Voltar
        </Button>
        <h1 className="studies-title">{studiesData.title}</h1>
      </div>

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder={`Pesquisar em ${studiesData.title}...`}
      />

      <div className="notes-list">
        {filteredNotes.map((note) => ( // 'note' é agora um item do 'notes-list'
          <NoteItem
            key={note._id || note.title} // Usar _id se disponível, senão title
            title={note.title}
            description={note.description}
            icon={note.icon}
            onClick={() => handleNoteClick(note)}
          />
        ))}
      </div>
    </div>
  );
}

export default StudiesScreen;
```

```CSS
/* src/components/StudiesScreen/StudiesScreen.css */
.studies-screen-container {
  padding: 40px 20px;
  background-color: var(--background-dark);
  min-height: 100vh;
  color: var(--text-light);
}

.studies-header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  position: relative; /* Para posicionar o botão de voltar */
}

.studies-header .back-button {
  background: none;
  border: none;
  color: var(--highlight-blue);
  font-size: 1.1em;
  padding: 8px 15px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: color 0.2s ease;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}

.studies-header .back-button:hover {
  color: var(--primary-purple);
}

.studies-header .back-button i {
  font-size: 1.2em;
}

.studies-title {
  flex-grow: 1; /* Permite que o título ocupe o espaço central */
  text-align: center;
  font-size: 3em;
  color: var(--primary-purple);
  text-shadow: 0 0 10px rgba(140, 115, 204, 0.4);
  margin: 0 auto; /* Centraliza o título */
  padding-left: 100px; /* Espaço para o botão de voltar */
  padding-right: 100px; /* Espaço simétrico */
}

.notes-list {
  max-width: 900px;
  margin: 30px auto;
  padding: 0 10px;
}

.studies-message {
  text-align: center;
  padding: 50px;
  font-size: 1.5em;
  color: var(--text-light);
}

.studies-message.error {
  color: #dc3545;
}
```

```JavaScript
// src/components/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import DashboardItem from './DashboardItem';
import { fetchDashboardItems, checkDataPathStatus } from '../../services/dataService';
import { useScreenManager } from '../ScreenManager/ScreenManagerContext';
import './Dashboard.css';

function Dashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { navigateTo } = useScreenManager();

  useEffect(() => {
    const getItems = async () => {
      try {
        const fetchedItems = await fetchDashboardItems();
        setItems(fetchedItems);
      } catch (err) {
        setError("Não foi possível carregar os itens do dashboard.");
        console.error("Erro ao carregar itens do dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    getItems();
  }, []);

  const handleItemClick = async (item) => {
    const { isActive, screenName } = await checkDataPathStatus(item.data_path);

    if (isActive) {
      navigateTo(screenName, { dataPath: item.data_path });
    } else {
      navigateTo('comingSoon');
    }
  };

  if (loading) return <div className="dashboard-message">Carregando Dashboard...</div>;
  if (error) return <div className="dashboard-message error">{error}</div>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Meu Dashboard Central</h1>
      <div className="dashboard-grid">
        {items.map(item => (
          <DashboardItem
            key={item._id || item.title}
            title={item.title}
            description={item.description}
            icon={item.icon}
            onClick={() => handleItemClick(item)}
          />
        ))}
      </div>
    </div>
  );
}

// **ISSO É CRUCIAL: DEVE SER 'export default'**
export default Dashboard;
```

```JavaScript
// src/components/ScreenManager/ScreenManager.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Dashboard from '../Dashboard/Dashboard'; // **AQUI DEVE SER 'import Dashboard from'**
import ComingSoonScreen from '../ComingSoonScreen/ComingSoonScreen';
import StudiesScreen from '../StudiesScreen/StudiesScreen';
import { screenChangeObservable } from '../../utils/Observable';
import { ScreenManagerProvider } from './ScreenManagerContext';

// Mapeamento das telas disponíveis
const screens = {
  dashboard: Dashboard,
  comingSoon: ComingSoonScreen,
  studiesScreen: StudiesScreen,
};

function ScreenManager() {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [screenProps, setScreenProps] = useState({});

  // Função para navegar para uma nova tela
  const navigateTo = useCallback((screenName, props = {}) => {
    if (screens[screenName]) {
      setCurrentScreen(screenName);
      setScreenProps(props);
      screenChangeObservable.notify({ screen: screenName, props: props });
    } else {
      console.warn(`Tela "${screenName}" não encontrada.`);
    }
  }, []);

  // Handler para o botão de "Voltar" na tela "Em Breve"
  const handleBackToDashboard = useCallback(() => {
    navigateTo('dashboard');
  }, [navigateTo]);

  // Renderiza a tela atual dinamicamente
  const CurrentScreenComponent = screens[currentScreen];

  // Passa as props específicas para cada tela
  const propsForCurrentScreen = { ...screenProps };
  if (currentScreen === 'comingSoon') {
    propsForCurrentScreen.onBack = handleBackToDashboard;
  }

  const screenManagerApi = {
    navigateTo,
    currentScreen,
  };

  return (
    <ScreenManagerProvider screenManager={screenManagerApi}>
      {CurrentScreenComponent && <CurrentScreenComponent {...propsForCurrentScreen} />}
    </ScreenManagerProvider>
  );
}

export default ScreenManager;
```

# Passo 14 Nosso próximo objetivo é criar a tela de detalhes

```
root/
├── src/
│   ├── assets/
│   │   ├── images/             # Para imagens locais (.avif)
│   │   └── videos/             # Para vídeos locais
│   ├── components/
│   │   ├── Dashboard/
│   │   ├── ScreenManager/
│   │   ├── ComingSoonScreen/
│   │   ├── StudiesScreen/
│   │   │   ├── StudiesScreen.jsx
│   │   │   ├── StudiesScreen.css
│   │   │   ├── NoteItem.jsx
│   │   │   ├── NoteItem.css
│   │   │   ├── NoteDetailScreen.jsx
│   │   │   ├── NoteDetailScreen.css
│   │   │   ├── NoteContentRenderer.jsx
│   │   │   └── NoteContentRenderer.css
│   │   └── Common/
│   │       ├── Button.jsx
│   │       ├── Button.css
│   │       ├── SearchBar.jsx
│   │       └── SearchBar.css
│   ├── services/
│   │   └── dataService.js
│   ├── utils/
│   │   └── Observable.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
```

# Passo 15. $frontend/src/components/StudiesScreen/NoteContentRenderer.jsx (Atualização Completa)

```JavaScript
// src/components/StudiesScreen/NoteContentRenderer.jsx
import React from 'react';
import './NoteContentRenderer.css';

// Componente recursivo para renderizar listas aninhadas
const ListItemRenderer = ({ item }) => {
  return (
    <li className="list-item">
      {item.content}
      {item.sub_list && item.sub_list.length > 0 && (
        <ul className="sub-list">
          {item.sub_list.map((subItem, subIndex) => (
            <ListItemRenderer key={subIndex} item={subItem} />
          ))}
        </ul>
      )}
    </li>
  );
};

function NoteContentRenderer({ content }) {
  // Função para destacar palavras em negrito (assumindo **palavra**)
  const renderParagraphContent = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g); // Divide pelo padrão **...**
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="highlighted-text">{part.substring(2, part.length - 2)}</strong>;
      }
      return part;
    });
  };

  switch (content.type) {
    case 'paragraph':
      return <p className="note-paragraph">{renderParagraphContent(content.content)}</p>;
    case 'image':
      // Usando placeholder.co como fallback e para demonstração
      const imageUrl = content.src && !content.src.startsWith('assets/')
        ? content.src // É uma URL externa
        : content.src // É um caminho local (ex: assets/images/placeholder.avif)
          ? `/${content.src}` // Adiciona '/' para ser um caminho absoluto a partir da raiz pública
          : `https://placehold.co/600x400/8c73cc/e0e0e0?text=Imagem+N%C3%A3o+Dispon%C3%ADvel`;

      return (
        <figure className="note-image-container">
          <img src={imageUrl} alt={content.alt || 'Imagem da anotação'} className="note-image" />
          {content.caption && <figcaption className="note-image-caption">{content.caption}</figcaption>}
        </figure>
      );
    case 'heading':
      const HeadingTag = `h${content.level}`;
      return <HeadingTag className={`note-heading level-${content.level}`}>{content.content}</HeadingTag>;
    case 'code_snippet':
      return (
        <div className="note-code-snippet">
          {content.title && <h4 className="code-snippet-title">{content.title}</h4>}
          <pre className="code-block">
            <code className={`language-${content.language}`}>{content.code}</code>
          </pre>
          <button
            className="copy-code-button"
            onClick={() => {
              const el = document.createElement('textarea');
              el.value = content.code;
              document.body.appendChild(el);
              el.select();
              document.execCommand('copy');
              document.body.removeChild(el);
              // Substituindo alert por um feedback visual mais suave
              const feedbackDiv = document.createElement('div');
              feedbackDiv.textContent = 'Copiado!';
              feedbackDiv.className = 'copy-feedback';
              document.body.appendChild(feedbackDiv);
              setTimeout(() => {
                feedbackDiv.remove();
              }, 1500);
            }}
          >
            Copiar
          </button>
        </div>
      );
    case 'list':
      return (
        <ul className="note-list">
          {content.items && content.items.map((item, index) => (
            <ListItemRenderer key={index} item={item} />
          ))}
        </ul>
      );
    case 'link':
      return (
        <a href={content.url} target="_blank" rel="noopener noreferrer" className="note-link">
          <i className="fas fa-external-link-alt link-icon"></i> {content.text}
        </a>
      );
    case 'blockquote':
      return <blockquote className="note-blockquote">{content.content}</blockquote>;
    case 'table':
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
    case 'video':
      const videoUrl = content.src && !content.src.startsWith('assets/')
        ? content.src // É uma URL externa
        : content.src // É um caminho local (ex: assets/videos/sample.mp4)
          ? `/${content.src}` // Adiciona '/' para ser um caminho absoluto
          : `https://placehold.co/600x400/000000/FFFFFF?text=V%C3%ADdeo+N%C3%A3o+Dispon%C3%ADvel`; // Fallback

      return (
        <figure className="note-video-container">
          <video controls src={videoUrl} className="note-video">
            Seu navegador não suporta a tag de vídeo.
          </video>
          {content.caption && <figcaption className="note-video-caption">{content.caption}</figcaption>}
        </figure>
      );
    case 'alert':
      return (
        <div className={`note-alert alert-${content.level}`}>
          <i className={`alert-icon fas ${
            content.level === 'info' ? 'fa-info-circle' :
            content.level === 'note' ? 'fa-sticky-note' :
            content.level === 'tip' ? 'fa-lightbulb' :
            content.level === 'important' ? 'fa-exclamation-circle' :
            content.level === 'warning' ? 'fa-exclamation-triangle' :
            content.level === 'caution' ? 'fa-hand-paper' : 'fa-bell'
          }`}></i>
          <span className="alert-content">{content.content}</span>
        </div>
      );
    default:
      return <p className="note-unknown-content">Tipo de conteúdo desconhecido: {content.type}</p>;
  }
}

export default NoteContentRenderer;

```

  - Crie o arquivo $frontend/src/components/StudiesScreen/NoteContentRenderer.css:

```css
/* src/components/StudiesScreen/NoteContentRenderer.css */

/* Geral */
.note-paragraph {
  font-size: 1em;
  line-height: 1.6;
  margin-bottom: 15px;
  color: var(--text-light);
  opacity: 0.9;
}

.highlighted-text {
  color: var(--primary-purple); /* Cor para texto destacado */
  font-weight: bold;
}

/* Imagens */
.note-image-container {
  margin: 20px 0;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 8px var(--shadow-color);
}

.note-image {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
  display: block;
  margin: 0 auto;
}

.note-image-caption {
  font-size: 0.85em;
  color: var(--text-light);
  opacity: 0.7;
  margin-top: 10px;
}

/* Títulos */
.note-heading {
  margin-top: 30px;
  margin-bottom: 15px;
  color: var(--highlight-blue);
  font-weight: 600;
}

.note-heading.level-1 { font-size: 2.5em; }
.note-heading.level-2 { font-size: 2em; }
.note-heading.level-3 { font-size: 1.7em; }
.note-heading.level-4 { font-size: 1.4em; }
.note-heading.level-5 { font-size: 1.2em; }
.note-heading.level-6 { font-size: 1em; }

/* Blocos de Código */
.note-code-snippet {
  background-color: #282a36; /* Cor de fundo de código (Dracula) */
  border-radius: 8px;
  padding: 15px;
  margin: 20px 0;
  position: relative;
  overflow-x: auto;
  box-shadow: 0 2px 8px var(--shadow-color);
}

.code-snippet-title {
  font-size: 0.9em;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 5px;
}

.code-block {
  margin: 0;
  padding: 0;
}

.code-block code {
  display: block;
  font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
  font-size: 0.9em;
  color: #f8f8f2;
  white-space: pre-wrap;
  word-break: break-all;
}

/* Estilos básicos para linguagens de código */
.language-bash { color: #50fa7b; }
.language-javascript { color: #bd93f9; }
.language-html { color: #ff79c6; }
.language-css { color: #8be9fd; }
.language-yaml { color: #ffb86c; } /* Laranja claro */
.language-json { color: #ffb86c; }

.copy-code-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: var(--primary-purple);
  color: var(--text-light);
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.8em;
  transition: background-color 0.2s ease;
}

.copy-code-button:hover {
  background-color: var(--secondary-purple);
}

/* Feedback de cópia */
.copy-feedback {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #28a745; /* Verde para sucesso */
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  z-index: 1000;
  opacity: 0;
  animation: fadeInOut 1.5s forwards;
}

@keyframes fadeInOut {
  0% { opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { opacity: 0; }
}

/* Listas */
.note-list {
  list-style-type: disc;
  margin-left: 25px;
  margin-bottom: 15px;
  color: var(--text-light);
}

.note-list .list-item {
  margin-bottom: 8px;
  line-height: 1.5;
}

.note-list .sub-list {
  list-style-type: circle;
  margin-left: 20px;
  margin-top: 5px;
}

/* Links */
.note-link {
  color: var(--highlight-blue);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.note-link:hover {
  color: var(--primary-purple);
  text-decoration: underline;
}

.link-icon {
  font-size: 0.9em;
}

/* Blockquotes */
.note-blockquote {
  background-color: rgba(140, 115, 204, 0.1); /* Roxo sutil */
  border-left: 5px solid var(--primary-purple);
  padding: 15px 20px;
  margin: 20px 0;
  font-style: italic;
  color: var(--text-light);
  opacity: 0.9;
  border-radius: 0 8px 8px 0;
}

/* Tabelas */
.note-table-container {
  margin: 20px 0;
  overflow-x: auto; /* Para tabelas largas */
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: 0 2px 8px var(--shadow-color);
  padding: 15px;
}

.table-title {
  font-size: 1.1em;
  color: var(--highlight-blue);
  margin-bottom: 10px;
  text-align: center;
}

.note-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px; /* Garante que a tabela não fique muito estreita */
}

.note-table th,
.note-table td {
  border: 1px solid var(--border-color);
  padding: 12px;
  text-align: left;
  color: var(--text-light);
}

.note-table th {
  background-color: var(--secondary-purple);
  font-weight: bold;
  color: white;
}

.note-table tr:nth-child(even) {
  background-color: rgba(255, 255, 255, 0.02);
}

/* Vídeos */
.note-video-container {
  margin: 20px 0;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 8px var(--shadow-color);
}

.note-video {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
  display: block;
  margin: 0 auto;
  background-color: black; /* Fundo preto para vídeos */
}

.note-video-caption {
  font-size: 0.85em;
  color: var(--text-light);
  opacity: 0.7;
  margin-top: 10px;
}

/* Alertas */
.note-alert {
  padding: 15px 20px;
  margin: 20px 0;
  border-radius: 8px;
  display: flex;
  align-items: flex-start;
  gap: 15px;
  font-size: 1em;
  line-height: 1.5;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.alert-icon {
  font-size: 1.5em;
  flex-shrink: 0; /* Não permite que o ícone encolha */
  margin-top: 2px;
}

.alert-content {
  flex-grow: 1;
}

.alert-info {
  background-color: rgba(97, 218, 251, 0.1); /* Azul claro */
  border-left: 5px solid var(--highlight-blue);
  color: var(--text-light);
}
.alert-info .alert-icon { color: var(--highlight-blue); }

.alert-note {
  background-color: rgba(140, 115, 204, 0.1); /* Roxo */
  border-left: 5px solid var(--primary-purple);
  color: var(--text-light);
}
.alert-note .alert-icon { color: var(--primary-purple); }

.alert-tip {
  background-color: rgba(255, 193, 7, 0.1); /* Amarelo */
  border-left: 5px solid #ffc107;
  color: var(--text-light);
}
.alert-tip .alert-icon { color: #ffc107; }

.alert-important {
  background-color: rgba(220, 53, 69, 0.1); /* Vermelho */
  border-left: 5px solid #dc3545;
  color: var(--text-light);
}
.alert-important .alert-icon { color: #dc3545; }

.alert-warning {
  background-color: rgba(253, 126, 20, 0.1); /* Laranja */
  border-left: 5px solid #fd7e14;
  color: var(--text-light);
}
.alert-warning .alert-icon { color: #fd7e14; }

.alert-caution {
  background-color: rgba(108, 117, 125, 0.1); /* Cinza */
  border-left: 5px solid #6c757d;
  color: var(--text-light);
}
.alert-caution .alert-icon { color: #6c757d; }

/* Fallback */
.note-unknown-content {
  color: #dc3545;
  font-style: italic;
  padding: 10px;
  border: 1px dashed #dc3545;
  border-radius: 5px;
  text-align: center;
}

```

# Passo 16. $frontend/src/components/StudiesScreen/NoteDetailScreen.jsx (Atualização Completa)

```JavaScript
// src/components/StudiesScreen/NoteDetailScreen.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useScreenManager } from '../ScreenManager/ScreenManagerContext';
import Button from '../Common/Button';
import NoteContentRenderer from './NoteContentRenderer';
import './NoteDetailScreen.css';

function NoteDetailScreen({ noteData }) {
  const { navigateTo } = useScreenManager();

  // Flatten all lessons from the noteData for easy navigation
  const allLessons = useMemo(() => {
    const lessons = [];
    if (noteData && noteData.modules) {
      noteData.modules.forEach(module => {
        if (module.submodules) {
          module.submodules.forEach(submodule => {
            if (submodule.lessons) {
              submodule.lessons.forEach(lesson => {
                lessons.push({
                  ...lesson,
                  moduleId: module.title, // Add module context
                  submoduleId: submodule.title, // Add submodule context
                  parentNoteTitle: noteData.title, // Add parent note title
                });
              });
            }
          });
        }
      });
    }
    return lessons;
  }, [noteData]);

  // State to manage the currently displayed lesson
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  // Set initial lesson when component mounts or noteData changes
  useEffect(() => {
    if (allLessons.length > 0) {
      setCurrentLessonIndex(0); // Start with the first lesson
    }
  }, [allLessons]);

  const currentLesson = allLessons[currentLessonIndex];

  const handleBackToStudies = useCallback(() => {
    navigateTo('studiesScreen', { dataPath: 'data/studies' });
  }, [navigateTo]);

  const goToPrevLesson = useCallback(() => {
    setCurrentLessonIndex(prevIndex => Math.max(0, prevIndex - 1));
  }, []);

  const goToNextLesson = useCallback(() => {
    setCurrentLessonIndex(prevIndex => Math.min(allLessons.length - 1, prevIndex + 1));
  }, [allLessons.length]);

  const handleLessonSelect = useCallback((index) => {
    setCurrentLessonIndex(index);
  }, []);

  if (!noteData) {
    return <div className="note-detail-message error">Dados da anotação não encontrados.</div>;
  }

  return (
    <div className="note-detail-screen-container">
      {/* Header */}
      <header className="note-detail-header">
        <Button onClick={handleBackToStudies} className="back-button">
          <i className="fas fa-arrow-left"></i> Voltar
        </Button>
        <div className="header-center">
          <h1 className="note-detail-title">
            <i className={`${noteData.icon} note-detail-icon`}></i>
            {noteData.title}
          </h1>
          <p className="note-detail-description">{noteData.description}</p>
        </div>
        <div className="header-nav-buttons">
          <Button onClick={goToPrevLesson} disabled={currentLessonIndex === 0}>
            <i className="fas fa-chevron-left"></i> Anterior
          </Button>
          <Button onClick={goToNextLesson} disabled={currentLessonIndex === allLessons.length - 1}>
            Próxima <i className="fas fa-chevron-right"></i>
          </Button>
        </div>
      </header>

      <div className="note-detail-main-content">
        {/* Sidebar Menu */}
        <aside className="note-detail-sidebar">
          <h2 className="sidebar-title">Aulas</h2>
          <nav className="sidebar-nav">
            {noteData.modules && noteData.modules.map((module, moduleIndex) => (
              <details key={`module-${moduleIndex}`} className="module-details" open={module.title === currentLesson?.moduleId}>
                <summary className="module-summary">
                  <i className="fas fa-folder module-icon"></i> {module.title}
                </summary>
                <div className="module-content">
                  {module.submodules && module.submodules.map((submodule, submoduleIndex) => (
                    <details key={`submodule-${submoduleIndex}`} className="submodule-details" open={submodule.title === currentLesson?.submoduleId}>
                      <summary className="submodule-summary">
                        <i className="fas fa-folder-open submodule-icon"></i> {submodule.title}
                      </summary>
                      <ul className="lessons-list">
                        {submodule.lessons && submodule.lessons.map((lesson, lessonIndexInSubmodule) => {
                          const lessonGlobalIndex = allLessons.findIndex(
                            l => l.moduleId === module.title && l.submoduleId === submodule.title && l.title === lesson.title
                          );
                          const isActive = lessonGlobalIndex === currentLessonIndex;
                          return (
                            <li
                              key={`lesson-${lessonGlobalIndex}`}
                              className={`lesson-item ${isActive ? 'active' : ''}`}
                              onClick={() => handleLessonSelect(lessonGlobalIndex)}
                            >
                              <i className="fas fa-file-alt lesson-icon"></i> {lesson.title}
                            </li>
                          );
                        })}
                      </ul>
                    </details>
                  ))}
                </div>
              </details>
            ))}
          </nav>
        </aside>

        {/* Main Lesson Content */}
        <section className="lesson-content-area">
          {currentLesson ? (
            <>
              <h2 className="current-lesson-title">{currentLesson.title}</h2>
              <div className="lesson-notes-display">
                {currentLesson.notes && currentLesson.notes.length > 0 ? (
                  currentLesson.notes.map((contentItem, contentIndex) => (
                    <NoteContentRenderer key={`content-${contentIndex}`} content={contentItem} />
                  ))
                ) : (
                  <p className="no-content-message">Nenhum conteúdo para esta lição.</p>
                )}
              </div>
            </>
          ) : (
            <div className="note-detail-message">Selecione uma aula no menu lateral.</div>
          )}
        </section>
      </div>

      {/* Bottom Navigation */}
      <footer className="note-detail-footer-nav">
        <Button onClick={goToPrevLesson} disabled={currentLessonIndex === 0}>
          <i className="fas fa-chevron-left"></i> Anterior
        </Button>
        <Button onClick={goToNextLesson} disabled={currentLessonIndex === allLessons.length - 1}>
          Próxima <i className="fas fa-chevron-right"></i>
        </Button>
      </footer>
    </div>
  );
}

export default NoteDetailScreen;

```

  - Crie o arquivo $frontend/src/components/StudiesScreen/NoteDetailScreen.css:

```css
/* src/components/StudiesScreen/NoteDetailScreen.css */

.note-detail-screen-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--background-dark);
  color: var(--text-light);
  padding: 20px;
}

/* Header */
.note-detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  background-color: var(--card-background);
  border-radius: 12px;
  margin-bottom: 25px;
  box-shadow: 0 4px 15px var(--shadow-color);
  border: 1px solid var(--border-color);
  flex-wrap: wrap; /* Permite que os itens quebrem a linha em telas pequenas */
  gap: 15px; /* Espaçamento entre os itens do header */
}

.note-detail-header .back-button {
  background: none;
  border: none;
  color: var(--highlight-blue);
  font-size: 1.1em;
  padding: 8px 15px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: color 0.2s ease, transform 0.2s ease;
  flex-shrink: 0; /* Não permite encolher */
}

.note-detail-header .back-button:hover {
  color: var(--primary-purple);
  transform: translateX(-5px);
}

.note-detail-header .back-button i {
  font-size: 1.2em;
}

.header-center {
  flex-grow: 1; /* Permite que o centro ocupe o espaço disponível */
  text-align: center;
  padding: 0 20px; /* Espaçamento para não colar nos botões */
}

.note-detail-title {
  font-size: 2.2em;
  color: var(--primary-purple);
  text-shadow: 0 0 8px rgba(140, 115, 204, 0.3);
  margin: 0 0 5px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.note-detail-icon {
  font-size: 1.1em;
  color: var(--highlight-blue);
}

.note-detail-description {
  font-size: 0.95em;
  color: var(--text-light);
  opacity: 0.7;
  margin: 0;
}

.header-nav-buttons {
  display: flex;
  gap: 10px;
  flex-shrink: 0; /* Não permite encolher */
}

.header-nav-buttons .common-button {
  padding: 8px 15px;
  font-size: 0.9em;
  display: flex;
  align-items: center;
  gap: 5px;
}

.header-nav-buttons .common-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: var(--secondary-purple);
  border-color: var(--secondary-purple);
}

/* Main Content Area (Sidebar + Lesson Content) */
.note-detail-main-content {
  display: flex;
  flex-grow: 1; /* Permite que o conteúdo principal ocupe o espaço restante */
  gap: 25px;
  max-width: 1400px; /* Limita a largura máxima */
  margin: 0 auto; /* Centraliza */
  width: 100%;
}

/* Sidebar */
.note-detail-sidebar {
  flex-shrink: 0; /* Não permite que a sidebar encolha */
  width: 280px; /* Largura fixa para a sidebar */
  background-color: var(--card-background);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 15px var(--shadow-color);
  border: 1px solid var(--border-color);
  overflow-y: auto; /* Adiciona scroll se o conteúdo for muito longo */
  max-height: calc(100vh - 200px); /* Ajusta a altura máxima */
}

.sidebar-title {
  font-size: 1.8em;
  color: var(--highlight-blue);
  margin-bottom: 20px;
  border-bottom: 2px solid var(--primary-purple);
  padding-bottom: 10px;
  text-align: center;
}

.sidebar-nav {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* Details/Summary for Modules and Submodules */
.module-details, .submodule-details {
  margin-bottom: 10px;
  background-color: rgba(140, 115, 204, 0.08); /* Fundo sutil para módulos */
  border-radius: 8px;
  overflow: hidden;
}

.module-summary, .submodule-summary {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  cursor: pointer;
  font-weight: bold;
  color: var(--text-light);
  transition: background-color 0.2s ease;
}

.module-summary {
  font-size: 1.2em;
  color: var(--primary-purple);
}
.module-summary:hover {
  background-color: rgba(140, 115, 204, 0.15);
}

.submodule-summary {
  font-size: 1.1em;
  color: var(--highlight-blue);
  padding-left: 30px; /* Indentação para submódulos */
}
.submodule-summary:hover {
  background-color: rgba(97, 218, 251, 0.1);
}

.module-icon, .submodule-icon {
  margin-right: 10px;
  font-size: 1.1em;
}

.lessons-list {
  list-style: none;
  padding: 0;
  margin: 0;
  background-color: rgba(255, 255, 255, 0.02); /* Fundo para a lista de lições */
  border-top: 1px solid var(--border-color);
}

.lesson-item {
  padding: 10px 15px 10px 50px; /* Indentação para lições */
  cursor: pointer;
  color: var(--text-light);
  transition: background-color 0.2s ease, color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 10px;
}

.lesson-item:hover {
  background-color: rgba(97, 218, 251, 0.08); /* Azul claro no hover */
  color: var(--highlight-blue);
}

.lesson-item.active {
  background-color: var(--primary-purple);
  color: white;
  font-weight: bold;
  border-left: 5px solid var(--highlight-blue);
  padding-left: 45px; /* Ajusta padding devido à borda */
}

.lesson-item.active .lesson-icon {
  color: white; /* Ícone branco na lição ativa */
}

.lesson-icon {
  font-size: 0.9em;
  color: var(--primary-purple);
}


/* Main Lesson Content Area */
.lesson-content-area {
  flex-grow: 1; /* Ocupa o espaço restante */
  background-color: var(--card-background);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 15px var(--shadow-color);
  border: 1px solid var(--border-color);
  overflow-y: auto; /* Scroll para o conteúdo da aula */
  max-height: calc(100vh - 200px); /* Ajusta a altura máxima */
}

.current-lesson-title {
  font-size: 2.5em;
  color: var(--primary-purple);
  margin-bottom: 25px;
  border-bottom: 2px solid var(--highlight-blue);
  padding-bottom: 15px;
  text-align: center;
  text-shadow: 0 0 5px rgba(140, 115, 204, 0.2);
}

.lesson-notes-display {
  /* Estilos para o container dos conteúdos da aula */
}

.no-content-message {
  font-style: italic;
  color: var(--text-light);
  opacity: 0.6;
  text-align: center;
  padding: 30px;
  font-size: 1.1em;
}

/* Bottom Navigation */
.note-detail-footer-nav {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 20px;
  margin-top: 25px;
  background-color: var(--card-background);
  border-radius: 12px;
  box-shadow: 0 -2px 10px var(--shadow-color);
  border: 1px solid var(--border-color);
  flex-shrink: 0; /* Não permite encolher */
}

.note-detail-footer-nav .common-button {
  padding: 10px 20px;
  font-size: 1em;
  display: flex;
  align-items: center;
  gap: 8px;
}

.note-detail-footer-nav .common-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: var(--secondary-purple);
  border-color: var(--secondary-purple);
}

/* Responsividade básica */
@media (max-width: 1024px) {
  .note-detail-main-content {
    flex-direction: column;
  }

  .note-detail-sidebar {
    width: 100%;
    max-height: 300px; /* Limita a altura da sidebar em telas menores */
    margin-bottom: 20px;
  }

  .lesson-content-area {
    width: 100%;
    max-height: none; /* Remove limite de altura para o conteúdo principal */
  }

  .note-detail-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .note-detail-header .back-button {
    position: static; /* Remove posicionamento absoluto */
    margin-bottom: 10px;
    transform: none;
  }

  .header-nav-buttons {
    margin-top: 15px;
  }
}

@media (max-width: 768px) {
  .note-detail-title {
    font-size: 1.8em;
  }
  .note-detail-description {
    font-size: 0.9em;
  }
  .note-detail-header .back-button,
  .header-nav-buttons .common-button,
  .note-detail-footer-nav .common-button {
    font-size: 0.85em;
    padding: 6px 12px;
  }
  .sidebar-title {
    font-size: 1.5em;
  }
  .module-summary, .submodule-summary {
    font-size: 1em;
  }
  .lesson-item {
    font-size: 0.9em;
  }
  .current-lesson-title {
    font-size: 2em;
  }
}

```

# Passo 17. $frontend/src/components/StudiesScreen/StudiesScreen.jsx (Atualização do handleNoteClick)

```JavaScript
// src/components/StudiesScreen/StudiesScreen.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useScreenManager } from '../ScreenManager/ScreenManagerContext';
import { fetchCategoryData } from '../../services/dataService';
import Button from '../Common/Button';
import SearchBar from '../Common/SearchBar';
import NoteItem from './NoteItem';
import './StudiesScreen.css';

function StudiesScreen({ dataPath }) {
  const { navigateTo } = useScreenManager();
  const [studiesData, setStudiesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const getStudiesData = async () => {
      try {
        setLoading(true);
        const data = await fetchCategoryData(dataPath);
        const actualStudiesObject = Array.isArray(data) && data.length > 0 ? data[0] : null;
        setStudiesData(actualStudiesObject);
        console.log("Dados de Estudos carregados (objeto principal):", actualStudiesObject);
      } catch (err) {
        setError("Não foi possível carregar os dados de Estudos.");
        console.error("Erro ao carregar dados de Estudos:", err);
      } finally {
        setLoading(false);
      }
    };
    getStudiesData();
  }, [dataPath]);

  const filteredNotes = useMemo(() => {
    if (!studiesData || !studiesData['notes-list']) {
      console.log("studiesData ou studiesData['notes-list'] estão vazios/nulos.");
      return [];
    }

    const topLevelNotes = studiesData['notes-list'];
    console.log("Itens de nível superior de 'notes-list':", topLevelNotes);

    if (!searchTerm) {
      return topLevelNotes;
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return topLevelNotes.filter(note => {
      const matchesTopLevel =
        note.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        note.description.toLowerCase().includes(lowerCaseSearchTerm);

      if (matchesTopLevel) return true;

      if (note.modules) {
        for (const module of note.modules) {
          if (module.submodules) {
            for (const submodule of module.submodules) {
              if (submodule.lessons) {
                for (const lesson of submodule.lessons) {
                  if (lesson.title.toLowerCase().includes(lowerCaseSearchTerm)) {
                    return true;
                  }
                  if (lesson.notes) {
                    for (const content of lesson.notes) {
                      if (content.type === 'paragraph' && content.content.toLowerCase().includes(lowerCaseSearchTerm)) {
                        return true;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      return false;
    });
  }, [studiesData, searchTerm]);


  const handleBack = () => {
    navigateTo('dashboard');
  };

  const handleNoteClick = (note) => {
    // Passa o objeto 'note' completo para a NoteDetailScreen
    navigateTo('noteDetailScreen', { noteData: note });
  };

  if (loading) return <div className="studies-message">Carregando Anotações de Estudos...</div>;
  if (error) return <div className="studies-message error">{error}</div>;
  if (!studiesData || !studiesData['notes-list'] || filteredNotes.length === 0) {
    return <div className="studies-message">Nenhuma anotação encontrada ou correspondente à pesquisa.</div>;
  }

  return (
    <div className="studies-screen-container">
      <div className="studies-header">
        <Button onClick={handleBack} className="back-button">
          <i className="fas fa-arrow-left"></i> Voltar
        </Button>
        <h1 className="studies-title">{studiesData.title}</h1>
      </div>

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder={`Pesquisar em ${studiesData.title}...`}
      />

      <div className="notes-list">
        {filteredNotes.map((note) => (
          <NoteItem
            key={note._id || note.title}
            title={note.title}
            description={note.description}
            icon={note.icon}
            onClick={() => handleNoteClick(note)}
          />
        ))}
      </div>
    </div>
  );
}

export default StudiesScreen;

```

# Passo 18. $frontend/src/components/ScreenManager/ScreenManager.jsx (Atualização)

```JavaScript
// src/components/ScreenManager/ScreenManager.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Dashboard from '../Dashboard/Dashboard';
import ComingSoonScreen from '../ComingSoonScreen/ComingSoonScreen';
import StudiesScreen from '../StudiesScreen/StudiesScreen';
import NoteDetailScreen from '../StudiesScreen/NoteDetailScreen'; // Importar a tela de detalhes
import { screenChangeObservable } from '../../utils/Observable';
import { ScreenManagerProvider } from './ScreenManagerContext';

// Mapeamento das telas disponíveis
const screens = {
  dashboard: Dashboard,
  comingSoon: ComingSoonScreen,
  studiesScreen: StudiesScreen,
  noteDetailScreen: NoteDetailScreen, // Adicionar a tela de detalhes da anotação
};

function ScreenManager() {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [screenProps, setScreenProps] = useState({});

  // Função para navegar para uma nova tela
  const navigateTo = useCallback((screenName, props = {}) => {
    if (screens[screenName]) {
      setCurrentScreen(screenName);
      setScreenProps(props);
      screenChangeObservable.notify({ screen: screenName, props: props });
    } else {
      console.warn(`Tela "${screenName}" não encontrada.`);
    }
  }, []);

  // Handler para o botão de "Voltar" na tela "Em Breve"
  const handleBackToDashboard = useCallback(() => {
    navigateTo('dashboard');
  }, [navigateTo]);

  // Renderiza a tela atual dinamicamente
  const CurrentScreenComponent = screens[currentScreen];

  // Passa as props específicas para cada tela
  const propsForCurrentScreen = { ...screenProps };
  if (currentScreen === 'comingSoon') {
    propsForCurrentScreen.onBack = handleBackToDashboard;
  }
  // Para NoteDetailScreen, as props já vêm via navigateTo({ noteData: ... })

  const screenManagerApi = {
    navigateTo,
    currentScreen,
  };

  return (
    <ScreenManagerProvider screenManager={screenManagerApi}>
      {CurrentScreenComponent && <CurrentScreenComponent {...propsForCurrentScreen} />}
    </ScreenManagerProvider>
  );
}

export default ScreenManager;

```

## 3. `$frontend/src/components/StudiesScreen/NoteContentRenderer.jsx` (Atualização com Highlight.js, Link e Video)

Vamos integrar o `highlight.js`, ajustar o renderizador de links e verificar o suporte a vídeo.

**Primeiro, instale `highlight.js`:**
```bash
npm install highlight.js
```

**Então, atualize o arquivo:**

# como o projeto está no momento

```
root
├── frontend/
│   ├── public/
│   │   ├── assets/        
│   │   ├── images/
│   │   │   └── placeholder.avif 
│   │   └── videos/         
│   │   │   └── local-video.mp4  
│   ├── src/
│   │   ├── components/
│   │   │   ├── ComingSoonScreen/  
│   │   │   │   ├── ComingSoonScreen.css       
│   │   │   │   └── ComingSoonScreen.jsx       
│   │   │   ├── Common/      
│   │   │   │   ├── SearchBar.css   
│   │   │   │   ├── SearchBar.jsx   
│   │   │   │   ├── Button.css   
│   │   │   │   └── Button.jsx   
│   │   │   ├── Dashboard/    
│   │   │   │   ├── Dashboard.css
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── DashboardItem.css
│   │   │   │   └── DashboardItem.jsx  
│   │   │   ├── ScreenManager/  
│   │   │   │   ├── ScreenManager.jsx
│   │   │   │   └── ScreenManagerContext.jsx   
│   │   │   └── StudiesScreen/    
│   │   │   │   ├── NoteContentRenderer.css
│   │   │   │   ├── NoteContentRenderer.jsx
│   │   │   │   ├── NoteDetailScreen.css
│   │   │   │   ├── NoteDetailScreen.jsx
│   │   │   │   ├── NoteItem.css
│   │   │   │   ├── NoteItem.jsx
│   │   │   │   ├── StudiesScreen.css
│   │   │   │   └── StudiesScreen.jsx         
│   │   ├── services/
│   │   │   └── dataService.js      
│   │   ├──  utils/
│   │   │   └── Observable.js     
│   │   ├── App.css  
│   │   ├── App.jsx 
│   │   ├── index.css  
│   │   └── main.jsx               
│   ├── Dockerfile   
│   └── index.html               
└── frontend.yml
```



npm run dev

```JavaScript
```
