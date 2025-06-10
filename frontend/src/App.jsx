// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Importe Routes e Route
import Dashboard from './pages/Dashboard/Dashboard';
import ComingSoonScreen from './pages/ComingSoonScreen/ComingSoonScreen';
import StudiesScreen from './pages/StudiesScreen/StudiesScreen';
import StudiesNotesScreen from './pages/StudiesNotesScreen/StudiesNotesScreen';
import NoteEditScreen from './pages/NoteEditScreen/NoteEditScreen';

import './App.css'; // Estilos globais
import '@fortawesome/fontawesome-free/css/all.min.css'; // Importa Font Awesome
import 'highlight.js/styles/atom-one-dark.css';

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/comingSoon" element={<ComingSoonScreen />} />
        <Route path="/studies" element={<StudiesScreen />} />
        {/*
          Para NoteEditScreen e StudiesNotesScreen, você pode precisar de parâmetros na URL.
          Por exemplo, para editar uma nota específica, você passaria o ID da nota.
          Aqui vou usar um exemplo simples com 'noteId' para a tela de edição.
          Para StudiesNotesScreen, que parece ser uma tela de detalhes,
          você também pode querer passar um ID de nota/estudo.
        */}
        <Route path="/studies/:collectionName/:studies_id" element={<StudiesNotesScreen />} />
        <Route path="/studies/edit/:collectionName/:studies_id/:lesson_id" element={<NoteEditScreen />} />
        {/* Você pode adicionar mais rotas conforme necessário, por exemplo: */}
        {/* <Route path="/movies" element={<MoviesScreen />} /> */}
      </Routes>
    </div>
  );
}

export default App;