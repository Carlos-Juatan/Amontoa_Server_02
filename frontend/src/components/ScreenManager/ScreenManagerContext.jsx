// src/components/ScreenManager/ScreenManagerContext.jsx
import React, { createContext, useContext } from 'react';

const ScreenManagerContext = createContext(null);

export const ScreenManagerProvider = ({ children, screenManager }) => {
  return (
    <ScreenManagerContext.Provider value={screenManager}>
      {children}
    </ScreenManagerContext.Provider>
  );
};

export const useScreenManager = () => {
  const context = useContext(ScreenManagerContext);
  if (!context) {
    throw new Error('useScreenManager must be used within a ScreenManagerProvider');
  }
  return context;
};