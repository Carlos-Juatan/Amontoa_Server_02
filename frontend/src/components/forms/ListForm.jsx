// components/forms/ListForm.js
import React, { useState, useEffect, useCallback } from 'react';

function ListForm({ item, onChange }) {
  const [title, setTitle] = useState(item?.title || '');
  const [items, setItems] = useState(item?.items || [{ type: 'list_item', content: '' }]);

  // Sincroniza estado local com a prop 'item'
  useEffect(() => {
    setTitle(item?.title || '');
    // Crie uma nova cópia do array e de seus objetos internos para garantir que React detecte a mudança
    setItems(item?.items ? item.items.map(i => ({ ...i })) : [{ type: 'list_item', content: '' }]);
  }, [item]);

  // Função interna para notificar o pai com os dados mais recentes
  const notifyParent = useCallback((newTitle, newItems) => {
    onChange({ title: newTitle, items: newItems });
  }, [onChange]);

  const handleTitleChange = (e) => {
    const newValue = e.target.value;
    setTitle(newValue);
    notifyParent(newValue, items);
  };

  const handleItemContentChange = useCallback((index, newContent) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], content: newContent };
    setItems(newItems);
    notifyParent(title, newItems);
  }, [items, title, notifyParent]);

  const handleAddItem = useCallback(() => {
    const newItems = [...items, { type: 'list_item', content: '' }];
    setItems(newItems);
    notifyParent(title, newItems);
  }, [items, title, notifyParent]);

  const handleRemoveItem = useCallback((index) => {
    const newItems = items.filter((_, i) => i !== index);
    // Garante que haja pelo menos um item, mesmo que vazio, para não sumir o input
    const finalItems = newItems.length > 0 ? newItems : [{ type: 'list_item', content: '' }];
    setItems(finalItems);
    notifyParent(title, finalItems);
  }, [items, title, notifyParent]);

  return (
    <div>
      <label htmlFor="list-title">Título da Lista (Opcional):</label>
      <input
        id="list-title"
        type="text"
        value={title}
        onChange={handleTitleChange}
        style={{ width: '100%', marginBottom: '15px' }}
      />

      <h3>Itens da Lista:</h3>
      {items.map((listItem, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <input
            type="text"
            value={listItem.content}
            onChange={(e) => handleItemContentChange(index, e.target.value)}
            placeholder={`Item ${index + 1}`}
            style={{ flexGrow: 1, marginRight: '10px' }}
          />
          <button type="button" onClick={() => handleRemoveItem(index)} className="remove-button" style={{ padding: '5px 10px' }}>
            Remover
          </button>
        </div>
      ))}
      <button type="button" onClick={handleAddItem} style={{ padding: '8px 15px', marginTop: '10px' }}>
        Adicionar Item
      </button>
    </div>
  );
}

export default ListForm;