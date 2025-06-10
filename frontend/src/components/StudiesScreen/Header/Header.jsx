// src/components/StudiesScreen/NoteDetailScreen/Header/Header.jsx
import Button from "../../Common/Button/Button";

import './Header.css';

function Header({ onBackToStudies, icon, title, children }) {

  return (
    <header className="note-detail-header">

      <Button onClick={onBackToStudies} className="back-button">
        <i className="fas fa-arrow-left"></i> Voltar
      </Button>

      <div className="header-center">
        <h1 className="note-detail-title">
          <i className={`${icon} note-detail-icon`}></i>
          {title}
        </h1>
      </div>

      {/* Renderiza os children passados pelo componente pai aqui */}
      <div className="header-nav-buttons">
        {children}
      </div>
      
    </header>
  );
}
export default Header;