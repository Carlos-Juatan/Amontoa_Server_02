
import Button from '../../../components/Common/Button/Button';

import NoteContentRenderer from './NoteContentRenderer';

import './MainContent.css';

// src/components/StudiesScreen/NoteDetailScreen/MainContent/MainContent.jsx
function MainContent({ currentLesson, children, buttonSection, stylesNoteElementClassName, stylesDisplayButtonsClassName }) {

  return (
    <main className='lesson-content'>
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
                    stylesNoteElementClassName={stylesNoteElementClassName}
                  >
                    <div className={stylesDisplayButtonsClassName}>
                      {buttonSection ? buttonSection(contentItem, contentIndex) : ''}
                    </div>
                  </NoteContentRenderer>
                ))
              ) : (
                <p className="no-content-message">Nenhum conteúdo para esta lição.</p>
              )}
            </div>

            <div className="lesson-nav-buttons">
              {children}
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