
import Button from '../../../components/Common/Button/Button';

import NoteContentRenderer from './NoteContentRenderer';


import './MainContent.css';

// src/components/StudiesScreen/NoteDetailScreen/MainContent/MainContent.jsx
function MainContent({ currentLesson, currentIndex, filteredItems, onPrev, onNext }) {

  return (
    <main>
      <section className="lesson-content-area">
        {currentLesson ? (
          <>
            <h2 className="current-lesson-title">{currentLesson.title}</h2>
            <div className="lesson-notes-display">
              {currentLesson.notes && currentLesson.notes.length > 0 ? (
                currentLesson.notes.map((contentItem, contentIndex) => (
                  <NoteContentRenderer
                    key={`content-${currentLesson._id}-${contentIndex}`}
                    content={contentItem}
                    // As funções onEdit e onDelete para o NoteContentRenderer agora
                    // chamam handleEdit e handleDelete com o 'type' 'note' ou 'lesson'
                    onEdit={() => handleEdit('note', contentItem)} // Assume 'note' como tipo para conteúdo da aula
                    onDelete={() => handleDelete('note', contentItem)}
                  />
                ))
              ) : (
                <p className="no-content-message">Nenhum conteúdo para esta lição.</p>
              )}
            </div>

            <div className="lesson-nav-buttons">
              <Button onClick={onPrev} disabled={currentIndex === 0 || filteredItems.length === 0}>
                <i className="fas fa-chevron-left"></i> Anterior
              </Button>
              <Button onClick={onNext} disabled={currentIndex === filteredItems.length - 1 || filteredItems.length === 0}>
                Próxima <i className="fas fa-chevron-right"></i>
              </Button>
            </div>
          </>
        ) : (
          <div className="note-detail-message">Selecione uma aula no menu lateral ou use a pesquisa.</div>
        )}
      </section>
    </main>
  );
}
export default MainContent;