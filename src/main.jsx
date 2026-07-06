import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './api/AuthContext';
import { SiteConfigProvider } from './api/SiteConfigContext';
import './style.css';

const splashStartedAt = performance.now();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <SiteConfigProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </SiteConfigProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

// Keep the splash screen up for a small minimum duration so it reads as an
// intentional loading animation rather than a flash, then fade it out.
const splash = document.getElementById('splash-screen');
if (splash) {
  requestAnimationFrame(() => {
    const elapsed = performance.now() - splashStartedAt;
    const remaining = Math.max(0, 500 - elapsed);
    setTimeout(() => {
      splash.classList.add('splash-hide');
      setTimeout(() => splash.remove(), 400);
    }, remaining);
  });
}
