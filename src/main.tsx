import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Initialize theme from localStorage before rendering
const SETTINGS_KEY = 'proxima-appearance-settings';
const initializeTheme = () => {
  const saved = localStorage.getItem(SETTINGS_KEY);
  if (saved) {
    try {
      const settings = JSON.parse(saved);
      const root = document.documentElement;
      
      if (settings.theme === 'light') {
        root.classList.add('light-mode');
        root.style.colorScheme = 'light';
      } else if (settings.theme === 'dark') {
        root.classList.remove('light-mode');
        root.style.colorScheme = 'dark';
      } else {
        root.style.colorScheme = 'light dark';
        if (window.matchMedia('(prefers-color-scheme: light)').matches) {
          root.classList.add('light-mode');
        }
      }
      
      const sizeMap: Record<string, string> = {
        small: '14px',
        medium: '16px',
        large: '18px',
      };
      root.style.fontSize = sizeMap[settings.fontSize] || '16px';
    } catch (error) {
      console.error('Failed to initialize theme:', error);
    }
  }
};

// Initialize theme immediately
initializeTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
