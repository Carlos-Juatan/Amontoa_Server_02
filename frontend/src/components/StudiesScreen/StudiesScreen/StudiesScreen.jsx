import React, { useState } from 'react'; // Remover useCallback e useEffect, pois useDataOperations os encapsula
import { useScreenManager } from '../../ScreenManager/ScreenManagerContext';
import useDataOperations from '../../../hooks/useDataOperations';
import useSearchFilter from '../../../hooks/useSearchFilter';

import Button from '../../Common/Button/Button';
import SearchBar from '../../Common/SearchBar/SearchBar';
import GenericList from '../../Common/GenericList/GenericList';
import NoteItem from './NoteItem';

import './StudiesScreen.css';

function NoteDetailScreen({ db_collection }) {
  const { data, loading, error } = useDataOperations( db_collection ); // Pega o data_path do receivedData ou usa um padrão
  const { navigateTo } = useScreenManager();

  // Use o useSearchFilter para gerenciar a busca
  // searchKeys são as chaves dos objetos 'note' que você quer pesquisar ('title', 'description')
  const { searchTerm, setSearchTerm, filteredItems: filteredNotes, handleSearchChange } = useSearchFilter(data, '', ['title', 'description']);
 
  const handleBack = () => {
    navigateTo('dashboard');
  };

  if (data.length > 0) {
  }
  // Sobrescreve handleSearchChange para resetar selectedIndex ao pesquisar
  const handleSearchTerm = (event) => {
    // Executa a lógica de pesquisa do hook
    handleSearchChange(event); // pode por diretamente sem precisar do handleSearchTerm se não tiver lógica adicional
  };

  const handleNoteClick = (note) => {
    //const pathParts = note.data_path.split('/'); // Divide o data_path em partes
    //const nodePath = pathParts[pathParts.length - 1]; // Pega a última parte:
    //let basePath = nodePath.replace('Screen', '');
    //let finalPath = basePath + 'Screen';
    navigateTo('studiesNotesScreen', { noteData: note }); // Passa o objeto note completo e o id ou title como identificador
  };

  if (loading) return <div className="studies-message">Carregando Anotações de Estudos...</div>;
  if (error) return <div className="studies-message error">{error}</div>;

  
  return (
    <div className="studies-screen-container">
      <div className="studies-header">
        <Button onClick={handleBack} className="back-button">
          <i className="fas fa-arrow-left"></i> Voltar
        </Button>
        <h1 className="studies-title">{data ? data.title : 'Estudos'}</h1>
      </div>

      <SearchBar
        searchTerm={searchTerm} // Controlado pelo estado local
        onSearchChange={handleSearchTerm} // Usa a função que atualiza o hook de filtro
        placeholder={`Pesquisar em ${data ? data.title : 'Estudos'}...`}
      />
      <GenericList
        items={filteredNotes} // Agora GenericList recebe os itens filtrados
        //keyExtractor={(note) => note._id || note.title} // Usa o _id ou title como chave única
        renderItem={(note) => (
          <NoteItem
            title={note.title}
            description={note.description}
            icon={note.icon}
            onClick={() => handleNoteClick(note)} // Passa o objeto note completo
          />
        )}
        emptyMessage={
          // Verifica se a lista original está vazia ou se a lista filtrada está vazia devido à pesquisa
          (data && data.length === 0) 
            ? 'Nenhuma anotação disponível nesta categoria.'
            : 'Nenhuma anotação encontrada correspondente à sua pesquisa.'
        }
        listTitle="Suas Anotações"
      />
    </div>
  );
}

export default NoteDetailScreen;