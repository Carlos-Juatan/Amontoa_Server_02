// src/hooks/useHierarchyData.js
import { useMemo } from 'react';

// Função auxiliar para organizar os dados
// AGORA RECEBE 'dbCollection' COMO UM PARÂMETRO
const organizeHierarchyLogic = (items, dbCollection) => {
  const hierarchy = {};

  items.forEach(item => {
    const { _id, module, submodule, title } = item;

    if (!hierarchy[module]) {
      hierarchy[module] = {
        _idList: [],
        dbCollection: dbCollection, // Adiciona a coleção no nível do módulo
        submodules: {}
      };
    }
    // Adiciona o _id da aula ao array _id do módulo
    hierarchy[module]._idList.push(_id);

    if (!hierarchy[module].submodules[submodule]) {
      hierarchy[module].submodules[submodule] = {
        _idList: [],
        dbCollection: dbCollection, // Adiciona a coleção no nível do submódulo
        lessons: []
      };
    }
    // Adiciona o _id da aula ao array _id do submódulo
    hierarchy[module].submodules[submodule]._idList.push(_id);

    hierarchy[module].submodules[submodule].lessons.push({
      _id: _id,
      title: title,
      item: item, // O item completo
      dbCollection: dbCollection, // Adiciona a coleção no nível da aula
    });
  });

  // Transforma o objeto hierarchyData em um array de módulos para mapear
  const hierarchyArray = Object.entries(hierarchy).map(([moduleName, moduleContent]) => ({
    title: moduleName,
    _idList: moduleContent._idList, // O array de IDs
    dbCollection: moduleContent.dbCollection, // Garante que a coleção esteja no objeto final do módulo
    submodules: Object.entries(moduleContent.submodules).map(([submoduleName, submoduleContent]) => ({
      title: submoduleName,
      _idList: submoduleContent._idList, // O array de IDs
      dbCollection: submoduleContent.dbCollection, // Garante que a coleção esteja no objeto final do submódulo
      lessons: submoduleContent.lessons
    }))
  }));

  return hierarchyArray;
};

// Este é um Custom Hook
// AGORA RECEBE 'dbCollection' COMO UM PARÂMETRO
const useHierarchyData = (items, dbCollection) => {
  // PASSA 'dbCollection' PARA A FUNÇÃO organizeHierarchyLogic
  // Adiciona 'dbCollection' como dependência do useMemo
  const hierarchyArray = useMemo(() => organizeHierarchyLogic(items, dbCollection), [items, dbCollection]);
  return hierarchyArray;
};

export default useHierarchyData;