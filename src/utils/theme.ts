// Közös téma kezelés localStorage-ral

const THEME_STORAGE_KEY = 'hodito-theme';

export type Theme = 'light' | 'dark';

export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'dark' || stored === 'light') {
    return stored;
  }
  
  // Alapértelmezett: light
  return 'light';
}

export function setStoredTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  applyTheme(theme);
  
  // Custom event küldése ugyanabban az ablakban (React komponenseknek)
  window.dispatchEvent(new CustomEvent('themechange', { detail: theme }));
}

export function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return;
  
  const html = document.documentElement;
  html.setAttribute('data-theme', theme);
}

// Oldal betöltésekor alkalmazza a tárolt témát
export function initTheme(): Theme {
  const theme = getStoredTheme();
  applyTheme(theme);
  return theme;
}

