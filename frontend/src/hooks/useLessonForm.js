// src/hooks/useLessonForm.js
import { useState, useEffect, useCallback } from 'react';

const useLessonForm = (lessonData, lesson_id, availableModules, availableSubmodules, setHasEditedData) => {
  const [currentData, setCurrentData] = useState([]);
  const [moduleName, setModuleName] = useState('');
  const [submoduleName, setSubmoduleName] = useState('');
  const [lessonTitle, setLessonTitle] = useState('');
  const [isNewModule, setIsNewModule] = useState(false);
  const [isNewSubmodule, setIsNewSubmodule] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  
    // Use useEffect para inicializar currentData E os novos estados (moduleName, submoduleName, lessonTitle)
    useEffect(() => {
      if (lessonData) {
        if (Array.isArray(lessonData.notes) && !initialDataLoaded) {
          setCurrentData(lessonData.notes);
          setModuleName(lessonData.module || '');
          setSubmoduleName(lessonData.submodule || '');
          setLessonTitle(lessonData.title || '');
  
          // Define se é um novo módulo/submódulo com base nos dados carregados
          // Se o módulo/submódulo da aula não existir nas listas de disponíveis, assume que é novo
          if (lessonData.module && !availableModules.includes(lessonData.module)) {
            setIsNewModule(true);
          }
          if (lessonData.submodule && !availableSubmodules.includes(lessonData.submodule)) {
            setIsNewSubmodule(true);
          }
  
          setInitialDataLoaded(true);
        }
      } else if (lesson_id === '0') {
        setCurrentData([]);
        setModuleName('');
        setSubmoduleName('');
        setLessonTitle('');
        setIsNewModule(false); // Por padrão, começa selecionando um existente
        setIsNewSubmodule(false); // Por padrão, começa selecionando um existente
        setInitialDataLoaded(true);
      }
    }, [lessonData, lesson_id, initialDataLoaded, availableModules, availableSubmodules]);


  const handleSetModuleName = useCallback((value) => {
    setModuleName(value);
    setHasEditedData(true);
  }, [setHasEditedData]);

  const handleSetSubmoduleName = useCallback((value) => {
    setSubmoduleName(value);
    setHasEditedData(true);
  }, [setHasEditedData]);

  const handleSetLessonTitle = useCallback((value) => {
    setLessonTitle(value);
    setHasEditedData(true);
  }, [setHasEditedData]);

  const handleSetIsNewModule = useCallback((value) => {
    setIsNewModule(value);
    if (value) setModuleName(''); // Limpa o campo se alternar para novo módulo
    setSubmoduleName(''); // Limpa o submódulo também
    setIsNewSubmodule(false); // Garante que o submódulo volte a selecionar existente
    setHasEditedData(true);
  }, [setHasEditedData]);

  const handleSetIsNewSubmodule = useCallback((value) => {
    setIsNewSubmodule(value);
    if (value) setSubmoduleName(''); // Limpa o campo se alternar para novo submódulo
    setHasEditedData(true);
  }, [setHasEditedData]);

  const handleAddNote = useCallback((formData) => {
    setCurrentData(prevData => [...prevData, formData]);
    setHasEditedData(true);
  }, [setHasEditedData]);

  const handleUpdateNote = useCallback((index, formData) => {
    setCurrentData(prevData => {
      const updatedData = [...prevData];
      updatedData[index] = formData;
      return updatedData;
    });
    setHasEditedData(true);
  }, [setHasEditedData]);

  const handleDeleteNote = useCallback((index) => {
    setCurrentData(prevData => prevData.filter((_, i) => i !== index));
    setHasEditedData(true);
  }, [setHasEditedData]);

  const resetForm = useCallback(() => {
    setCurrentData([]);
    setModuleName('');
    setSubmoduleName('');
    setLessonTitle('');
    setIsNewModule(false);
    setIsNewSubmodule(false);
    setHasEditedData(false);
  }, [setHasEditedData]);

  return {
    currentData,
    setCurrentData, // Expor para uso direto na inicialização de notas
    moduleName,
    handleSetModuleName,
    submoduleName,
    handleSetSubmoduleName,
    lessonTitle,
    handleSetLessonTitle,
    isNewModule,
    handleSetIsNewModule,
    isNewSubmodule,
    handleSetIsNewSubmodule,
    handleAddNote,
    handleUpdateNote,
    handleDeleteNote,
    resetForm,
    lessonFormValid: moduleName && submoduleName && lessonTitle // Validação básica para o formulário
  };
};

export default useLessonForm;