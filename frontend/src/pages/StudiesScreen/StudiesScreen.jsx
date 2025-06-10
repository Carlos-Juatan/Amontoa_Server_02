import React, { useState } from 'react'; // Remover useCallback e useEffect, pois useDataOperations os encapsula
import { useNavigate } from 'react-router-dom';
import useDataOperations from '../../hooks/useDataOperations';
import useSearchFilter from '../../hooks/useSearchFilter';

import Button from '../../components/Common/Button/Button';
import SearchBar from '../../components/Common/SearchBar/SearchBar';
import GenericList from '../../components/Common/GenericList/GenericList';
import NoteItem from './NoteItem';

import './StudiesScreen.css';

function NoteDetailScreen() {
  const { data, loading, error, fetchData } = useDataOperations( 'studies' ); // Pega o data_path do receivedData ou usa um padrão
  const navigate = useNavigate(); // Hook para navegação

  // Use o useSearchFilter para gerenciar a busca
  // searchKeys são as chaves dos objetos 'note' que você quer pesquisar ('title', 'description')
  const { searchTerm, setSearchTerm, filteredItems: filteredNotes, handleSearchChange } = useSearchFilter(data, '', ['title', 'description']);
 
  const handleBack = () => {
    navigate('/'); // Navega de volta para a rota raiz (Dashboard)
  };
  
  // Sobrescreve handleSearchChange para resetar selectedIndex ao pesquisar
  const handleSearchTerm = (event) => {
    // Executa a lógica de pesquisa do hook
    handleSearchChange(event); // pode por diretamente sem precisar do handleSearchTerm se não tiver lógica adicional
  };

  const handleNoteClick = (note) => {
    navigate(`/studies/${note.db_collection}/${note._id}`); // Navega de volta para a rota raiz (Dashboard)
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