// src/components/StudiesScreen/NoteDetailScreen/Header/Header.jsx
import Button from "../../../Common/Button/Button";

import './Header.css';

function Header({ onBackToStudies, icon, title, filteredItems, currentIndex, onPrev, onNext, onAdd }) {

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

      <div className="header-nav-buttons">
        <Button onClick={onPrev} disabled={currentIndex === 0 || filteredItems.length === 0}>
          <i className="fas fa-chevron-left"></i> Anterior
        </Button>
        <Button onClick={onNext} disabled={currentIndex === filteredItems.length - 1 || filteredItems.length === 0}>
          Próxima <i className="fas fa-chevron-right"></i>
        </Button>
      </div>
    </header>
  );
}
export default Header;