// components/forms/TableForm.js
import React, { useState, useEffect, useCallback } from 'react';

function TableForm({ item, onChange }) {
  const [title, setTitle] = useState(item?.title || '');
  const [headers, setHeaders] = useState(item?.headers || ['']);
  const [rows, setRows] = useState(item?.rows || [['']]);

  // Sincroniza estado local com a prop 'item'
  useEffect(() => {
    setTitle(item?.title || '');
    // Crie novas cópias profundas dos arrays para o reset
    setHeaders(item?.headers ? [...item.headers] : ['']);
    setRows(item?.rows ? item.rows.map(row => [...row]) : [['']]);
  }, [item]);

  // Função interna para notificar o pai com os dados mais recentes
  const notifyParent = useCallback((newTitle, newHeaders, newRows) => {
    // Garante que o número de células em cada linha corresponda ao número de cabeçalhos
    const normalizedRows = newRows.map(row => {
      const updatedRow = [...row];
      while (updatedRow.length < newHeaders.length) {
        updatedRow.push('');
      }
      return updatedRow.slice(0, newHeaders.length);
    });
    onChange({ title: newTitle, headers: newHeaders, rows: normalizedRows });
  }, [onChange]);

  // Handlers para Título
  const handleTitleChange = (e) => {
    const newValue = e.target.value;
    setTitle(newValue);
    notifyParent(newValue, headers, rows);
  };

  // Funções para gerenciar cabeçalhos
  const handleHeaderChange = useCallback((index, value) => {
    const newHeaders = [...headers];
    newHeaders[index] = value;
    setHeaders(newHeaders);
    notifyParent(title, newHeaders, rows);
  }, [headers, title, rows, notifyParent]);

  const handleAddHeader = useCallback(() => {
    const newHeaders = [...headers, ''];
    setHeaders(newHeaders);
    // Adiciona uma nova célula vazia a cada linha existente
    const newRows = rows.map(row => [...row, '']);
    setRows(newRows);
    notifyParent(title, newHeaders, newRows);
  }, [headers, rows, title, notifyParent]);

  const handleRemoveHeader = useCallback((index) => {
    if (headers.length === 1) return; // Não remove se for o último
    const newHeaders = headers.filter((_, i) => i !== index);
    setHeaders(newHeaders);
    // Remove a célula correspondente de cada linha
    const newRows = rows.map(row => row.filter((_, colIndex) => colIndex !== index));
    setRows(newRows);
    notifyParent(title, newHeaders, newRows);
  }, [headers, rows, title, notifyParent]);

  // Funções para gerenciar linhas e células
  const handleCellChange = useCallback((rowIndex, colIndex, value) => {
    const newRows = [...rows]; // Copia o array de linhas
    newRows[rowIndex] = [...newRows[rowIndex]]; // Copia a linha específica
    newRows[rowIndex][colIndex] = value;
    setRows(newRows);
    notifyParent(title, headers, newRows);
  }, [rows, title, headers, notifyParent]);

  const handleAddRow = useCallback(() => {
    // Adiciona uma nova linha com células vazias, correspondendo ao número de cabeçalhos
    const newRows = [...rows, Array(headers.length).fill('')];
    setRows(newRows);
    notifyParent(title, headers, newRows);
  }, [rows, headers.length, title, headers, notifyParent]);

  const handleRemoveRow = useCallback((index) => {
    if (rows.length === 1 && headers.length === 1) return; // Não remove se for a última linha e a última coluna
    if (rows.length === 1) { // Se for a última linha, mas pode ter mais de uma coluna
        setRows([Array(headers.length).fill('')]); // Apenas limpa a última linha
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
        style={{ width: '100%', marginBottom: '15px' }}
      />

      <h3>Cabeçalhos:</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
        {headers.map((header, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              value={header}
              onChange={(e) => handleHeaderChange(index, e.target.value)}
              placeholder={`Header ${index + 1}`}
              style={{ marginRight: '5px' }}
            />
            {headers.length > 1 && (
              <button type="button" onClick={() => handleRemoveHeader(index)} className="remove-button">x</button>
            )}
          </div>
        ))}
        <button type="button" onClick={handleAddHeader}>Adicionar Cabeçalho</button>
      </div>

      <h3>Dados da Tabela:</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index} style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {header || `Coluna ${index + 1}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td key={`${rowIndex}-${colIndex}`} style={{ border: '1px solid #ccc', padding: '8px' }}>
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                      style={{ width: '100%', border: 'none', background: 'transparent' }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: '10px' }}>
        <button type="button" onClick={handleAddRow} style={{ marginRight: '10px' }}>Adicionar Linha</button>
        {rows.length > 1 && (
          <button type="button" onClick={() => handleRemoveRow(rows.length - 1)} className="remove-button">Remover Última Linha</button>
        )}
      </div>
    </div>
  );
}

export default TableForm;