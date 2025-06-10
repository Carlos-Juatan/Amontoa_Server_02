// src/components/ComingSoonScreen/ComingSoonScreen.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../components/Common/Button/Button';

import './ComingSoonScreen.css';

function ComingSoonScreen() {
  const navigate = useNavigate(); // Hook para navegação

  const handleBackToDashboard = () => {
    navigate('/'); // Navega de volta para a rota raiz (Dashboard)
  };

  return (
    <div className="coming-soon-screen">
      <h2>Em Breve!</h2>
      <p>Esta seção está em construção. Volte em breve para novidades!</p>
      <Button onClick={handleBackToDashboard}>Voltar ao Dashboard</Button>
    </div>
  );
}

export default ComingSoonScreen;