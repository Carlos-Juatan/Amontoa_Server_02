// src/components/ComingSoonScreen/ComingSoonScreen.jsx
import React, { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Button from '../../components/Common/Button/Button';

import './NoteEditScreen.css';

function NoteEditScreen() {
  const { collectionName, studies_id, lesson_id } = useParams(); // Parametros passados pela url
  const navigate = useNavigate(); // Hook para navegação

  console.log(lesson_id);

  const handleBackToStudies = () => {
    navigate(`/studies/${collectionName}/${studies_id}`); // Navega de volta para tela de lista de anotações (studiesScreen)
  };

  return (
    <div className="coming-soon-screen">
      <h2>Em Breve!</h2>
      <p>Esta seção está em construção. Volte em breve para novidades!</p>
      <Button onClick={handleBackToStudies}>Voltar ao Dashboard</Button>
    </div>
  );
}

export default NoteEditScreen;