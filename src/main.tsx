import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { inject } from '@vercel/analytics';
import App from './App.tsx';
import './index.css';
import { LanguageProvider } from './contexts/LanguageContext';

inject();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
);
