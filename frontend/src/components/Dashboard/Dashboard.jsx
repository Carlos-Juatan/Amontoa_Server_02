// src/components/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import DashboardItem from './DashboardItem';
// IMPORTANTE: Mude 'fetchDashboardItems' para 'fetchCategoryData'
// Remova 'checkDataPathStatus' se não for mais usada diretamente aqui ou se será refatorada.
// Por enquanto, vamos manter fetchCategoryData e adicionar uma forma de verificar o status.
import { fetchCategoryData } from '../../services/dataService'; // <--- CORREÇÃO AQUI
import useDataOperations from '../../hooks/useDataOperations';
import { useScreenManager } from '../ScreenManager/ScreenManagerContext';
import './Dashboard.css';

function Dashboard() {
  const { data, loading, error } = useDataOperations('dashboard');
  const { navigateTo } = useScreenManager();

  const handleItemClick = async (item) => {
    // A lógica de checkDataPathStatus precisa ser refeita.
    // Atualmente, sua prop `dataPath` no JSON do dashboard já tem 'data/movies/inactive' ou 'data/studies'.
    // O que determina se está 'ativo' é a presença de 'inactive' no path.
    // Vamos adaptar isso aqui.

    const pathParts = item.db_collection.split('/'); // Ex: ['data', 'movies', 'inactive'] ou ['data', 'studies']
    const status = pathParts[pathParts.length - 1]; // Pega a última parte: 'inactive' ou o nome da coleção

    // Uma tela é considerada "ativa" se a última parte do db_collection NÃO for 'inactive'.
    const isActive = status !== 'inactive';

    // O screenName é derivado do nome da coleção (parte do db_collection)
    // Ex: 'data/studies' -> 'studiesScreen'
    // Ex: 'data/movies/inactive' -> 'moviesScreen'
    // Vamos pegar o penúltimo item se o último for 'inactive', ou o último se não for.
    const screenBaseName = isActive ? status : pathParts[pathParts.length - 2];
    
    // Mapeamento de nomes de coleção para nomes de telas (camelCase + "Screen")
    // Isso é um ponto que você pode querer externalizar ou criar uma convenção mais robusta.
    // Para simplificar, vamos usar uma convenção simples: 'studies' -> 'studiesScreen'
    let screenName = screenBaseName + 'Screen';

    // Caso especial para 'dashboard' ou outros que não seguem a mesma regra
    if (screenBaseName === 'dashboard') {
        screenName = 'dashboard'; // Ou o nome exato da sua tela de dashboard
    } else if (screenBaseName === 'studies') {
        screenName = 'studiesScreen'; // Nome real da tela de estudos
    } else if (screenBaseName === 'movies') {
        screenName = 'moviesScreen'; // Exemplo para filmes
    }
    // ... adicione mais mapeamentos conforme necessário para suas futuras telas

    if (isActive) {
      // Para as telas ativas, precisamos passar o dataPath original (ex: 'data/studies')
      navigateTo(screenName, { db_collection: item.db_collection });
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
        {data.map(item => (
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

export default Dashboard;