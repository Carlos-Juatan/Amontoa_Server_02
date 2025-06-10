import { useEffect } from 'react';
import useHierarchyData from '../../../hooks/useHierarchyData'; // Importa o hook que organiza a hierarquia
import useToggle from '../../../hooks/useToggle'; // Importa o novo hook useToggle

import './SidebarHierarchy.css';

function SidebarHierarchy({ searchTerm, filteredItems, dbCollection, onItemSelect, currentLesson, editMode, onAddOrEdit, onModelEdit, onModelDelete }) {

  const hierarchyData = useHierarchyData(filteredItems, dbCollection);

  return (
    <nav className="sidebar-nav">
      {hierarchyData.length > 0 ? (
        hierarchyData.map((module, moduleIndex) => (
          <ModuleSection
            key={`${module.title}-${moduleIndex}`}
            module={module}
            moduleIndex={moduleIndex}
            searchTerm={searchTerm}
            currentLesson={currentLesson}
            editMode={editMode}
            onAddOrEdit={onAddOrEdit}
            onModelEdit={onModelEdit}
            onModelDelete={onModelDelete}
            onItemSelect={onItemSelect}
          />
        ))
      ) : (
        <p className="no-content-message">Nenhum módulo, submódulo ou aula encontrado(a).</p>
      )}
    </nav>
  );
}

// Componente auxiliar para Módulos para melhor legibilidade
const ModuleSection = ({ module, moduleIndex, searchTerm, currentLesson, editMode, onAddOrEdit, onModelEdit, onModelDelete, onItemSelect }) => {
  const shouldModuleOpen = module.submodules.some(sm => sm.lessons.some(l => l._id === currentLesson?._id)) || searchTerm !== '';
  const [isModuleExpanded, toggleModuleExpanded, setModuleExpanded] = useToggle(shouldModuleOpen);

  // Atualiza o estado de expansão do módulo quando searchTerm ou currentLesson mudarem
  useEffect(() => {
    setModuleExpanded(shouldModuleOpen);
  }, [searchTerm, currentLesson, shouldModuleOpen, setModuleExpanded]);

  return (
    <div className="module-container">
      <div className="module-summary" onClick={toggleModuleExpanded}>
        <i className={`fas ${isModuleExpanded ? 'fa-chevron-up' : 'fa-chevron-down'} expand-icon`}></i>
        <i className="fas fa-folder module-icon"></i>
        <div className='hover-title'><span>{module.title}</span></div>
        {editMode && (
          <span className="edit-actions">
            <i className="fas fa-edit action-icon edit" onClick={(e) => { e.stopPropagation(); onModelEdit(module); }}></i>
            <i className="fas fa-trash-alt action-icon delete" onClick={(e) => { e.stopPropagation(); onModelDelete('list', module); }}></i>
          </span>
        )}
      </div>

      {isModuleExpanded && (
        <div className="module-content">
          {module.submodules && module.submodules.map((submodule, submoduleIndex) => (
            <SubmoduleSection
              key={`submodule-${submodule.title}-${submoduleIndex}`}
              submodule={submodule}
              submoduleIndex={submoduleIndex}
              searchTerm={searchTerm}
              currentLesson={currentLesson}
              editMode={editMode}
              onAddOrEdit={onAddOrEdit}
              onModelEdit={onModelEdit}
              onModelDelete={onModelDelete}
              onItemSelect={onItemSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Componente auxiliar para Submódulos para melhor legibilidade
const SubmoduleSection = ({ submodule, submoduleIndex, searchTerm, currentLesson, editMode, onAddOrEdit, onModelEdit, onModelDelete, onItemSelect }) => {
  const shouldSubmoduleOpen = submodule.lessons.some(l => l._id === currentLesson?._id) || searchTerm !== '';
  const [isSubmoduleExpanded, toggleSubmoduleExpanded, setSubmoduleExpanded] = useToggle(shouldSubmoduleOpen);

  // Atualiza o estado de expansão do submódulo quando searchTerm ou currentLesson mudarem
  useEffect(() => {
    setSubmoduleExpanded(shouldSubmoduleOpen);
  }, [searchTerm, currentLesson, shouldSubmoduleOpen, setSubmoduleExpanded]);

  return (
    <div className="submodule-container">
      <div className="submodule-summary" onClick={toggleSubmoduleExpanded}>
        <i className={`fas ${isSubmoduleExpanded ? 'fa-chevron-up' : 'fa-chevron-down'} expand-icon`}></i>
        <i className="fas fa-folder-open submodule-icon"></i>
        <div className='hover-title'><span>{submodule.title}</span></div>
        {editMode && (
          <span className="edit-actions">
            <i className="fas fa-edit action-icon edit" onClick={(e) => { e.stopPropagation(); onModelEdit(submodule); }}></i>
            <i className="fas fa-trash-alt action-icon delete" onClick={(e) => { e.stopPropagation(); onModelDelete('list', submodule); }}></i>
          </span>
        )}
      </div>

      {isSubmoduleExpanded && (
        <ul className="lessons-list">
          {submodule.lessons && submodule.lessons.map((lesson) => {
            const isActive = currentLesson && lesson._id === currentLesson._id;
            return (
              <li
                key={lesson._id}
                className={`lesson-item ${isActive ? 'active' : ''}`}
                onClick={() => onItemSelect(lesson._id)}
              >
                <i className="fas fa-file-alt lesson-icon"></i>
                {/* Wrap the title in a div or span with the hover-title class */}
                <div className="lesson-title-container hover-title"> {/* Added a new container */}
                  <span>{lesson.title}</span> {/* The title itself is in a span */}
                </div>

                {editMode && (
                  <span className="edit-actions">
                    <i className="fas fa-edit action-icon edit" onClick={(e) => { e.stopPropagation(); onAddOrEdit(lesson); }}></i>
                    <i className="fas fa-trash-alt action-icon delete" onClick={(e) => { e.stopPropagation(); onModelDelete('single', lesson); }}></i>
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SidebarHierarchy;