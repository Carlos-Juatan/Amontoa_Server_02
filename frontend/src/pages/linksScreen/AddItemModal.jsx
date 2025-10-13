// src/pages/linksScreen/AddItemModal.jsx

import React, { useState, useEffect } from 'react';
import Modal from '../../components/Common/Modal/Modal';

const NEW_GROUP_VALUE = '--- NOVO GRUPO ---'; // Valor especial para indicar a criação
const defaultLinkData = { title: '', url: '', description: '', group: 'Acesso Rápido', icon: 'fa-solid fa-globe', };

import './AddItemModal.css';

function AddItemModal({ isOpen, onClose, onSubmit, groupsList, isMutating, mutationError }) {

  //#region ... Hooks ...
  const [formData, setFormData] = useState(defaultLinkData);
  // NOVO: Estado para gerenciar o nome de um grupo recém-criado
  const [newGroupName, setNewGroupName] = useState('');
  //#endregion

  //#region ... Functions ...
  // Reseta o formulário e o estado do novo grupo ao abrir
  useEffect(() => {
    if (isOpen) {
      setFormData(defaultLinkData);
      setNewGroupName(''); // Limpa o nome do novo grupo
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'group' && value === NEW_GROUP_VALUE) {
      // Se o usuário selecionou 'Novo Grupo', apenas limpamos o estado do grupo no form.
      setFormData(prev => ({ ...prev, group: '' }));
      setNewGroupName('');
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNewGroupNameChange = (e) => {
    // Atualiza o estado do novo nome, que será usado no submit
    setNewGroupName(e.target.value);
  }

  const handleSubmit = () => {
    let finalFormData = { ...formData };

    // 1. Validação básica (Título e URL)
    if (!finalFormData.title.trim() || !finalFormData.url.trim()) {
      alert('Título e URL são obrigatórios.');
      return;
    }

    // 2. Lógica de Novo Grupo
    if (!finalFormData.group || finalFormData.group === '') {
      if (!newGroupName.trim()) {
        alert('O nome do novo grupo não pode ser vazio.');
        return;
      }
      // Usa o novo nome digitado
      finalFormData.group = newGroupName.trim();
    }

    onSubmit(finalFormData);
  };
  //#endregion

  // Lista de grupos a exibir no select, incluindo a opção de criar
  const availableGroups = [...groupsList.filter(g => g !== 'Todos'), NEW_GROUP_VALUE];


  //#region ... Dom Display ...
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={"Adicionar Novo Link"}
      onSubmit={handleSubmit}
      submitButtonText={"Criar"}
      isMutating={isMutating}
      modalCustonStyle="item-add-modal-content"
    >
      <form className="item-add-form">

        {/* Ícone */}
        <div className='item-add-form-icon'>
          <label>Ícone:</label>
          <input
            type="text"
            name="icon"
            value={formData.icon}
            onChange={handleChange}
            disabled={isMutating}
          />
          <i className={`${formData.icon}`}></i>
        </div>

        <div className='item-add-form-info'>
          <div className='item-add-form-info-header'>
            {/* Título */}
            <div className='item-add-form-title'>
              <label>Título:</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                disabled={isMutating}
              />
            </div>

            {/* URL */}
            <div className='item-add-form-url'>
              <label>URL:</label>
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                disabled={isMutating}
              />
            </div>

            {/* Grupo e Novo Grupo Input */}
            <div className='item-add-form-group'>
              <label>Grupo:</label>
              <select
                name="group"
                // O valor será vazio se a opção 'Novo Grupo' for selecionada
                value={formData.group || NEW_GROUP_VALUE}
                onChange={handleChange}
                disabled={isMutating}
              >
                {availableGroups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>

              {/* INPUT CONDICIONAL PARA NOVO GRUPO */}
              {(!formData.group || formData.group === '') && (
                <div className='new-group-input'>
                  <input
                    id="newGroupNameInput"
                    type="text"
                    value={newGroupName}
                    onChange={handleNewGroupNameChange}
                    placeholder="Nome do grupo"
                    disabled={isMutating}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Descrição */}
          <div className='item-add-form-description'>
            <label>Descrição:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={isMutating}
            />
          </div>
        </div>
      </form>

      {mutationError && <p className="error-message">{mutationError}</p>}
    </Modal>
  );
  //#endregion
}

export default AddItemModal;