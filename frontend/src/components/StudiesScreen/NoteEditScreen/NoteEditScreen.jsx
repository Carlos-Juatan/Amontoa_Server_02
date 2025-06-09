// src/components/ComingSoonScreen/ComingSoonScreen.jsx
import React, { useCallback } from 'react';
import { useScreenManager } from '../../ScreenManager/ScreenManagerContext';

import Button from '../../Common/Button/Button';

import './NoteEditScreen.css';

function NoteEditScreen({ noteData, lessonData }) {
  const { navigateTo } = useScreenManager();

  console.log(lessonData);

  const handleBackToStudies = useCallback(() => {
    navigateTo('studiesNotesScreen', { noteData: noteData });
  }, [navigateTo]);

  return (
    <div className="coming-soon-screen">
      <h2>Em Breve!</h2>
      <p>Esta seção está em construção. Volte em breve para novidades!</p>
      <Button onClick={handleBackToStudies}>Voltar ao Dashboard</Button>
    </div>
  );
}

export default NoteEditScreen;