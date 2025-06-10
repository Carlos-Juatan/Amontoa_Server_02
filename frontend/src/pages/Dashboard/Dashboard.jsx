// src/components/Dashboard/Dashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importe useNavigate
import DashboardItem from './../../components/Dashboard/DashboardItem';
import useDataOperations from '../../hooks/useDataOperations';
import './Dashboard.css';

function Dashboard() {
  const { data, loading, error } = useDataOperations('dashboard');
  const navigate = useNavigate(); // Use o hook useNavigate

  const handleItemClick = async (item) => {
    const pathParts = item.db_collection.split('/');
    const status = pathParts[pathParts.length - 1];
    const isActive = status !== 'inactive';

    const screenBaseName = isActive ? status : pathParts[pathParts.length - 2];

    let targetPath = '';

    // Mapeamento de nomes de coleção para caminhos de URL
    // Mantenha os caminhos consistentes com as rotas definidas em App.jsx
    if (isActive) {
      if (screenBaseName === 'studies') {
        targetPath = '/studies';
      }
      // Adicione outros mapeamentos para telas ativas
      // else if (screenBaseName === 'movies') {
      //   targetPath = '/movies';
      // }
      // ...
    } else {
      targetPath = '/comingSoon'; // Se inativo, sempre vai para ComingSoon
    }

    if (targetPath) {
      // Navegue para a rota correspondente.
      // Você pode passar state para a rota se precisar de dados complexos que não vão na URL.
      // Ex: navigate(targetPath, { state: { dbCollection: item.db_collection } });
      navigate(targetPath);
    } else {
      console.warn(`Caminho para a tela "${screenBaseName}" não definido.`);
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