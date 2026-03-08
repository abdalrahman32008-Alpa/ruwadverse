import * as Sentry from "@sentry/react";
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { inject } from '@vercel/analytics';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { LanguageProvider } from './contexts/LanguageContext';

Sentry.init({
  dsn: "https://ed4ffd71fb84b0523aec6d1fc5aa977c@o4511008585154560.ingest.us.sentry.io/4511008591708160",
  sendDefaultPii: true,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration()
  ],
  tracesSampleRate: import.meta.env.PROD ? 0.2 : 1.0,
  tracePropagationTargets: [
    "localhost",
    /^https:\/\/ruwadverse\.vercel\.app/
  ],
  replaysSessionSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
  replaysOnErrorSampleRate: 1.0,
  enableLogs: true,
  environment: import.meta.env.PROD ? "production" : "development",
  release: "ruwadverse@1.0.0",
});

inject();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
);
