// src/App.jsx (ou StudiesScreen.jsx)
// ... (imports) ...
import useDataOperations from './hooks/useDataOperations'; // Para a busca inicial dos dados
import useNoteActions from './hooks/useNoteActions'; // Seu hook de ações

function App() {
  const collectionPath = 'data/notes'; // Caminho para buscar os dados (ex: 'data/notes')
  const collectionName = 'notes'; // Nome da coleção para operações de CRUD (ex: 'notes')

  // Hook para buscar e manter o estado da lista de notas
  const {
    data: notes,
    loading: loadingNotes,
    error: notesError,
    // fetchData do useDataOperations não é diretamente exposto aqui se você usa o useNoteActions para acionar a re-sincronização
  } = useDataOperations(collectionPath); // Fornece o caminho inicial para a busca

  // Hook para as ações de adicionar, editar e deletar
  const {
    handleAddOrEdit,
    handleDelete,
    isMutating,
    mutationError,
    fetchData: refetchNotes // <--- Renomeado para evitar conflito e indicar que é para re-sincronizar notas
  } = useNoteActions(); // useNoteActions agora "passa" o fetchData do useDataOperations

  // ... (estados do modal e formulário) ...

  const handleNoteSubmit = async () => {
    // ... (validação) ...

    const noteData = {
      dbCollection: collectionName, // Usamos 'dbCollection' agora
      title: noteTitle,
      content: noteContent,
    };

    if (currentNote) {
      noteData._id = currentNote.id;
    }

    try {
      await handleAddOrEdit(noteData);
      alert(currentNote ? 'Nota atualizada com sucesso!' : 'Nota adicionada com sucesso!');
      handleCloseNoteModal();
      // Chame refetchNotes para garantir que a lista seja atualizada do backend
      await refetchNotes(collectionPath); // <--- CHAME AQUI
    } catch (err) {
      alert(mutationError || 'Erro ao salvar nota.');
      console.error(err);
    }
  };

  const handleNoteDelete = async (noteId) => {
    if (window.confirm('Tem certeza que deseja deletar esta nota?')) {
      try {
        await handleDelete({ dbCollection: collectionName, _id: noteId }); // Usamos 'dbCollection'
        alert('Nota deletada com sucesso!');
        // Chame refetchNotes para garantir que a lista seja atualizada do backend
        await refetchNotes(collectionPath); // <--- CHAME AQUI
      } catch (err) {
        alert(mutationError || 'Erro ao deletar nota.');
        console.error(err);
      }
    }
  };

  const handleBulkDelete = async (idsToDelete) => {
    // ... (validação) ...
    if (window.confirm(`Tem certeza que deseja deletar ${idsToDelete.length} notas?`)) {
      try {
        await handleDelete({ dbCollection: collectionName, _idList: idsToDelete }); // Usamos 'dbCollection'
        alert(`${idsToDelete.length} notas deletadas com sucesso!`);
        // Chame refetchNotes para garantir que a lista seja atualizada do backend
        await refetchNotes(collectionPath); // <--- CHAME AQUI
      } catch (err) {
        alert(mutationError || 'Erro ao deletar notas em massa.');
        console.error(err);
      }
    }
  };

  // ... (restante do componente) ...
}

export default App;