import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './context/LanguageContext';
import { brandConfig } from './config/brandConfig';
import './index.css';

// Ensure browser document title matches dynamic brandConfig appName
if (typeof document !== 'undefined') {
  document.title = `${brandConfig.appName} — ${brandConfig.tagline}`;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
);
