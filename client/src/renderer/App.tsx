import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import FirstRunSetup from './components/FirstRunSetup';
import Dashboard from './components/Dashboard';
import Terminal from './components/Terminal';
import Settings from './components/Settings';
import { AppSettings } from '../types';

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: #1a1b26;
  color: #c0caf5;
  overflow: hidden;
`;

const App: React.FC = () => {
  const [isFirstRun, setIsFirstRun] = useState<boolean | null>(null);
  const [settings, setSettings] = useState<AppSettings | null>(null);

  useEffect(() => {
    checkFirstRun();
    loadSettings();
  }, []);

  const checkFirstRun = async () => {
    const firstRun = await window.terminium.app.isFirstRun();
    setIsFirstRun(firstRun);
  };

  const loadSettings = async () => {
    const loadedSettings = await window.terminium.settings.get();
    setSettings(loadedSettings);
  };

  const handleSetupComplete = () => {
    setIsFirstRun(false);
  };

  if (isFirstRun === null || settings === null) {
    return (
      <AppContainer>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          Loading...
        </div>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <BrowserRouter>
        {isFirstRun ? (
          <FirstRunSetup onComplete={handleSetupComplete} />
        ) : (
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/terminal/:sessionId" element={<Terminal />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </BrowserRouter>
    </AppContainer>
  );
};

export default App;
