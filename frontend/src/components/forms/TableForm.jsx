// components/forms/TableForm.js
import React, { useState, useEffect, useCallback } from 'react';

function TableForm({ item, onChange }) {
  const [title, setTitle] = useState(item?.title || '');
  const [headers, setHeaders] = useState(item?.headers ? [...item.headers] : ['']);
  const [rows, setRows] = useState(item?.rows ? item.rows.map(row => [...row]) : [['']]);

  // Sincroniza estado local com a prop 'item'
  useEffect(() => {
    setTitle(item?.title || '');
    setHeaders(item?.headers ? [...item.headers] : ['']);
    setRows(item?.rows ? item.rows.map(row => [...row]) : [['']]);
  }, [item]);

  // Função interna para notificar o pai com os dados mais recentes
  const notifyParent = useCallback((newTitle, newHeaders, newRows) => {
    // Garante que o número de células em cada linha corresponda ao número de cabeçalhos
    const normalizedRows = newRows.map(row => {
      const updatedRow = [...row];
      while (updatedRow.length < newHeaders.length) {
        updatedRow.push(''); // Adiciona célula vazia se faltar
      }
      return updatedRow.slice(0, newHeaders.length); // Remove células extras se houver
    });
    onChange({ title: newTitle, headers: newHeaders, rows: normalizedRows });
  }, [onChange]);

  // Handlers para Título
  const handleTitleChange = (e) => {
    const newValue = e.target.value;
    setTitle(newValue);
    notifyParent(newValue, headers, rows);
  };

  // Funções para gerenciar cabeçalhos (colunas)
  const handleHeaderChange = useCallback((index, value) => {
    const newHeaders = [...headers];
    newHeaders[index] = value;
    setHeaders(newHeaders);
    notifyParent(title, newHeaders, rows);
  }, [headers, title, rows, notifyParent]);

  const handleAddColumn = useCallback((afterIndex) => {
    const newHeaders = [...headers];
    newHeaders.splice(afterIndex + 1, 0, ''); // Adiciona um novo cabeçalho vazio
    setHeaders(newHeaders);

    const newRows = rows.map(row => {
      const newRow = [...row];
      newRow.splice(afterIndex + 1, 0, ''); // Adiciona uma nova célula vazia na mesma posição
      return newRow;
    });
    setRows(newRows);
    notifyParent(title, newHeaders, newRows);
  }, [headers, rows, title, notifyParent]);

  const handleRemoveColumn = useCallback((index) => {
    if (headers.length === 1) return; // Não permite remover a última coluna
    const newHeaders = headers.filter((_, i) => i !== index);
    setHeaders(newHeaders);

    const newRows = rows.map(row => row.filter((_, colIndex) => colIndex !== index));
    setRows(newRows);
    notifyParent(title, newHeaders, newRows);
  }, [headers, rows, title, notifyParent]);

  // Funções para gerenciar linhas e células
  const handleCellChange = useCallback((rowIndex, colIndex, value) => {
    const newRows = [...rows];
    newRows[rowIndex] = [...newRows[rowIndex]];
    newRows[rowIndex][colIndex] = value;
    setRows(newRows);
    notifyParent(title, headers, newRows);
  }, [rows, title, headers, notifyParent]);

  const handleAddRow = useCallback((afterIndex) => {
    // Adiciona uma nova linha com células vazias, correspondendo ao número de cabeçalhos
    const newRows = [...rows];
    newRows.splice(afterIndex + 1, 0, Array(headers.length).fill(''));
    setRows(newRows);
    notifyParent(title, headers, newRows);
  }, [rows, headers.length, title, headers, notifyParent]);

  const handleRemoveRow = useCallback((index) => {
    // Permite remover a última linha, mas a substitui por uma linha vazia se for a única
    if (rows.length === 1) {
      setRows([Array(headers.length).fill('')]);
      notifyParent(title, headers, [Array(headers.length).fill('')]);
      return;
    }
    const newRows = rows.filter((_, i) => i !== index);
    setRows(newRows);
    notifyParent(title, headers, newRows);
  }, [rows, headers.length, title, headers, notifyParent]);

  return (
    <div>
      <label htmlFor="table-title">Título da Tabela (Opcional):</label>
      <input
        id="table-title"
        type="text"
        value={title}
        onChange={handleTitleChange}
        // Usar className para estilização em CSS Modules
        className="table-title-input"
        style={{ width: '100%', marginBottom: '15px' }}
      />

      <h3>Dados da Tabela:</h3>
      <div style={{ overflowX: 'auto' }}>
        <table className="table-editor" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '15px' }}>
          <thead>
            <tr>
              {/* Célula vazia para botões de linha ou numeração */}
              <th style={{ width: '30px', border: 'none' }}></th>
              {headers.map((header, index) => (
                <th key={index} style={{ border: '1px solid var(--border-color)', padding: '8px', position: 'relative' }}>
                  <input
                    type="text"
                    value={header}
                    onChange={(e) => handleHeaderChange(index, e.target.value)}
                    placeholder={`Header ${index + 1}`}
                    // Usar className para estilização em CSS Modules
                    className="table-header-input"
                    style={{ width: '100%', border: 'none', background: 'transparent', color: 'var(--text-light)' }}
                  />
                  <div className="column-actions" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
                    <button
                      type="button"
                      onClick={() => handleAddColumn(index)}
                      title="Adicionar coluna à direita"
                      className="add-column-button"
                      style={{ background: 'var(--button-confirm)', color: 'var(--text-light)', border: 'none', padding: '2px 5px', borderRadius: '3px', cursor: 'pointer', fontSize: '0.8em' }}
                    >
                      +
                    </button>
                    {headers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveColumn(index)}
                        title="Remover esta coluna"
                        className="remove-column-button"
                        style={{ background: 'var(--button-delete)', color: 'var(--text-light)', border: 'none', padding: '2px 5px', borderRadius: '3px', cursor: 'pointer', fontSize: '0.8em', marginLeft: '2px' }}
                      >
                        -
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {/* Célula para botões de linha */}
                <td style={{ border: '1px solid var(--border-color)', padding: '4px', textAlign: 'center', backgroundColor: 'var(--card-background)', position: 'relative' }}>
                  <div className="row-actions" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <button
                      type="button"
                      onClick={() => handleAddRow(rowIndex)}
                      title="Adicionar linha abaixo"
                      className="add-row-button"
                      style={{ background: 'var(--button-confirm)', color: 'var(--text-light)', border: 'none', padding: '2px 5px', borderRadius: '3px', cursor: 'pointer', fontSize: '0.8em', marginBottom: '2px' }}
                    >
                      +
                    </button>
                    {rows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRow(rowIndex)}
                        title="Remover esta linha"
                        className="remove-row-button"
                        style={{ background: 'var(--button-delete)', color: 'var(--text-light)', border: 'none', padding: '2px 5px', borderRadius: '3px', cursor: 'pointer', fontSize: '0.8em' }}
                      >
                        -
                      </button>
                    )}
                  </div>
                </td>
                {row.map((cell, colIndex) => (
                  <td key={`${rowIndex}-${colIndex}`} style={{ border: '1px solid var(--border-color)', padding: '8px' }}>
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                      // Usar className para estilização em CSS Modules
                      className="table-cell-input"
                      style={{ width: '100%', border: 'none', background: 'transparent', color: 'var(--text-light)' }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Botão para adicionar a primeira linha, se a tabela estiver vazia */}
      {rows.length === 0 && (
        <button type="button" onClick={() => handleAddRow(-1)} className="add-row-button-initial" style={{ background: 'var(--button-confirm)', color: 'var(--text-light)', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9em' }}>
          Adicionar Primeira Linha
        </button>
      )}
    </div>
  );
}

export default TableForm;