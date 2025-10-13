// src/pages/linksScreen/linksScreen.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useDataOperations from '../../hooks/useDataOperations';
import useSearchFilter from '../../hooks/useSearchFilter';

import Button from '../../components/Common/Button/Button';
import SearchBar from '../../components/Common/SearchBar/SearchBar';
import LinksItem from './linksItem';
import ActionModal from '../../components/Common/Modal/ActionModal/ActionModal';

import './linksScreen.css';

function LinksScreen() {
  //#region ... Variables ...
  const collectionName = 'links-work';
  const navigate = useNavigate(); // to navegate between pages
  const { data, loading, error, fetchData, updateRecord, deleteRecord, isMutating, mutationError } = useDataOperations(collectionName); // to get data from mongoDB
  const { searchTerm, setSearchTerm, filteredItems, handleSearchChange } = useSearchFilter(data, '', ['title', 'description', 'group']); // to filter the 'data'
  //#endregion

  //#region ... Hooks ...
  const handleBackToDashboard = () => { navigate('/'); }; // Navegate back to root (Dashboard)
  const handleSearchTerm = (event) => { handleSearchChange(event); }; // change the research term on the search hook
  const [isEditing, setIsEditing] = useState(false); // used to change the edition mode
  const [selectedGroup, setSelectedGroup] = useState('Todos'); // Used to check how group is selected and select the default group
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  //#endregion

  //#region ... Functions ...
  const toggleEditing = (event) => { setIsEditing(prev => !prev); }; // Change between True and False
  const handleOpenLink = (url) => { window.open(url, '_blank'); }; // Open a link on another window on the browser
  const addGroup = (event) => { console.log("adicionando novo grupo"); }; // Add a new group on the list

  //#region ---> Data Functions <---
  const updateItem = async (id, updatedFields) => {
    try {
      await updateRecord(collectionName, id, updatedFields);
      await fetchData();
      console.log(`Sucesso na atualização do item ${id}:`, updatedFields);

    } catch (e) {
      console.error("Falha ao atualizar o item:", e);
    }
  };
  //#endregion

  //#region ---> Groups Functions <---
  const getGroupsList = () => { // Creating groups
    let groups = ['Todos', 'Acesso Rápido'];

    if (data && data.length > 0) {
      const dynamicGroups = [...new Set(data.map(item => item.group))];
      groups = [...groups, ...dynamicGroups];
    }

    return [...new Set(groups)];
  };

  const groupsList = getGroupsList(); // The list of all groups
  const handleGroupSelection = (groupName) => { setSelectedGroup(groupName); }; // Select the group

  const getFinalFilteredLinks = () => {
    if (!filteredItems || filteredItems.length === 0) { return []; } // If have no itens return empty

    let linksToRender = filteredItems;
    if (selectedGroup !== 'Todos') { linksToRender = filteredItems.filter(link => link.group === selectedGroup); } // Filters items by groups if different from 'Todos'

    // Sorting groups
    linksToRender.sort((a, b) => {
      if (selectedGroup === 'Todos') {
        // If 'Todos': Sort by group first
        if (a.group < b.group) return -1;
        if (a.group > b.group) return 1;

        return a.order - b.order; // In case of the same group: order by 'order'
      } else {
        return a.order - b.order; // If Specific Group: Order only by 'order'
      }
    });

    return linksToRender;
  };

  const finalFilteredLinks = getFinalFilteredLinks();
  //#endregion

  //#region ---> Ordening Functions <---
  const handleOrdening = async (id, value) => {
    // 1. USE THE FINAL SORTED AND FILTERED LIST THAT IS DISPLAYED ON THE SCREEN
    const listToSearch = finalFilteredLinks;

    // Find the current item and its index in the VISIBLE list
    const currentIndex = listToSearch.findIndex(item => item._id === id);
    const currentItem = listToSearch[currentIndex];

    if (!currentItem) return;

    // 2. Determine the index of the neighboring item
    const swapIndex = currentIndex + value;
    const neighborItem = listToSearch[swapIndex];

    // 3. Check if the neighbor is valid (if it exists and if it is in the same group)
    // NOTE: If the specific group is selected, all items are already in the same group.
    // If "All" is selected, checking the group is crucial.
    if (!neighborItem || neighborItem.group !== currentItem.group) {
      console.log(`Movimentação não possível para ID: ${id}. Fora dos limites do grupo ou do array.`);
      return;
    }

    // 4. CHANGING 'order' VALUES (Pure Logic)
    // These are the new values ​​that will be saved in the DB
    const newCurrentOrder = neighborItem.order;
    const newNeighborOrder = currentItem.order;

    // 5. BACK-END PERSISTENCE (PUT for both items)
    try {
      await updateRecord(collectionName, currentItem._id, { order: newCurrentOrder });
      await updateRecord(collectionName, neighborItem._id, { order: newNeighborOrder });
      await fetchData();
      console.log(`Reordenação concluída: ${currentItem.title} e ${neighborItem.title} trocaram a ordem.`);

    } catch (e) {
      console.error("Falha ao reordenar e persistir no DB:", e);
    }
  };
  //#endregion

  //#region ---> Modals <---
  const openDeleteModal = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  // FUNÇÃO QUE É PASSADA PARA LinksItem, que abre o modal
  const deleteItem = (id) => {
    // Encontra o item completo para passar ao modal
    const item = data.find(i => i._id === id);
    if (item) {
      openDeleteModal(item);
    }
  };

  // FUNÇÃO QUE EXECUTA A AÇÃO APÓS A CONFIRMAÇÃO DO MODAL
  const handleDeleteConfirmation = async (item) => {
    if (!item || !item._id) return;

    try {
      await deleteRecord(collectionName, item._id);
      // Re-sincroniza a lista após a exclusão bem-sucedida
      await fetchData();
      closeDeleteModal(); // Fecha o modal após o sucesso
      console.log(`Item ${item.title} (ID: ${item._id}) deletado com sucesso.`);
    } catch (e) {
      console.error("Erro ao deletar item:", e);
      // O erro de mutação será tratado no ActionModal
    }
  };
  //#endregion

  //#endregion

  //#region ... Dom - Display ...
  return (
    <div className="links-screen-container">

      {/* Header */}
      <div className="links-header">
        <Button onClick={handleBackToDashboard} className="back-button">
          <i className="fas fa-arrow-left"></i> Voltar
        </Button>
        <h1 className="links-title">{'Links'}</h1>
      </div>

      {/* Body */}

      {/* SearchBar */}
      <div className='links-research'>
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchTerm}
          placeholder={`Pesquisar em ${'Links'}...`}
        />
      </div>

      {/* Links Container */}
      <div className='links-container'>
        {/* Header */}
        <div className='links-container-header'>
          <div className='links-container-header-tabs'>
            {groupsList.map((groupName) => (
              <span
                key={groupName}
                className={groupName === selectedGroup ? 'selected' : 'unselected'}
                onClick={() => handleGroupSelection(groupName)}
              >
                {groupName /*groupName.replace(/_/g, ' ').toUpperCase() --> Can modify the group name if you want*/}
              </span>
            ))}
          </div>

          <div className='links-container-header-buttons'>
            {!isEditing && (
              <Button onClick={toggleEditing} className='edit-button'>
                <i className="fas fa-pencil"></i>
              </Button>
            )}
            {isEditing && (
              <>
                <Button onClick={addGroup} className='add-button'>
                  <i className="fas fa-plus"></i>
                </Button>
                <Button onClick={toggleEditing} className='cancel-edit-button'>
                  Cancelar
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Links */}
        <ul className='links-list'>
          {finalFilteredLinks.map((item) => (
            <li key={item._id} className='links-list-item'>
              <LinksItem
                isEditing={isEditing}
                handleOpenLink={handleOpenLink}
                handleOrdening={handleOrdening}
                deleteItem={deleteItem}
                updateItem={updateItem}
                // cancelUpdate não é mais necessário no pai
                id={item._id}
                icon={item.icon || "fas fa-link"} // Use um fallback para o ícone
                title={item.title}
                url={item.url} // Usando 'url' do seu objeto de dados
                description={item.description}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* ActionModal para a confirmação de exclusão */}
      <ActionModal
        isOpen={isDeleteModalOpen}
        modalType={'delete'} // Força o tipo de modal para delete
        item={itemToDelete} // O item que será excluído
        onClose={closeDeleteModal} // Função para fechar o modal
        onDelete={handleDeleteConfirmation} // Função que será chamada ao confirmar
        isMutating={isMutating} 
        mutationError={mutationError}
        deleteMessage={`Você tem certeza que deseja excluir o link: ${itemToDelete?.title}?`}
      />
    </div>
  );
  //#endregion
}

export default LinksScreen;