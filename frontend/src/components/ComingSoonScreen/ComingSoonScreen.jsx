// src/components/ComingSoonScreen/ComingSoonScreen.jsx
import React from 'react';
import Button from '../Common/Button/Button';
import './ComingSoonScreen.css'; // Crie este arquivo CSS depois

function ComingSoonScreen({ onBack }) {
  return (
    <div className="coming-soon-screen">
      <h2>Em Breve!</h2>
      <p>Esta seção está em construção. Volte em breve para novidades!</p>
      <Button onClick={onBack}>Voltar ao Dashboard</Button>
    </div>
  );
}

export default ComingSoonScreen;