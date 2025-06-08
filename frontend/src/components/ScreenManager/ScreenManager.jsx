// src/components/ScreenManager/ScreenManager.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Dashboard from '../Dashboard/Dashboard';
import ComingSoonScreen from '../ComingSoonScreen/ComingSoonScreen';
import StudiesScreen from '../StudiesScreen/StudiesScreen/StudiesScreen';
import StudiesNotesScreen from '../StudiesScreen/NoteDetailScreen/StudiesNotesScreen'; // Importar a tela de detalhes
import NoteEditScreen from '../StudiesScreen/NoteEditScreen/NoteEditScreen';
import { screenChangeObservable } from '../../utils/Observable';
import { ScreenManagerProvider } from './ScreenManagerContext';

// Mapeamento das telas disponíveis
const screens = {
  dashboard: Dashboard,
  comingSoon: ComingSoonScreen,
  studiesScreen: StudiesScreen,
  studiesNotesScreen: StudiesNotesScreen,
  noteEditScreen: NoteEditScreen,
};

function ScreenManager() {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [screenProps, setScreenProps] = useState({});

  // Função para navegar para uma nova tela
  const navigateTo = useCallback((screenName, props = {}) => {
    if (screens[screenName]) {
      setCurrentScreen(screenName);
      setScreenProps(props);
      screenChangeObservable.notify({ screen: screenName, props: props });
    } else {
      console.warn(`Tela "${screenName}" não encontrada.`);
    }
  }, []);

  // Handler para o botão de "Voltar" na tela "Em Breve"
  const handleBackToDashboard = useCallback(() => {
    navigateTo('dashboard');
  }, [navigateTo]);

  // Renderiza a tela atual dinamicamente
  const CurrentScreenComponent = screens[currentScreen];

  // Passa as props específicas para cada tela
  const propsForCurrentScreen = { ...screenProps };
  if (currentScreen === 'comingSoon') {
    propsForCurrentScreen.onBack = handleBackToDashboard;
  }
  // Para NoteDetailScreen, as props já vêm via navigateTo({ noteData: ... })

  const screenManagerApi = {
    navigateTo,
    currentScreen,
  };

  return (
    <ScreenManagerProvider screenManager={screenManagerApi}>
      {CurrentScreenComponent && <CurrentScreenComponent {...propsForCurrentScreen} />}
    </ScreenManagerProvider>
  );
}

export default ScreenManager;
