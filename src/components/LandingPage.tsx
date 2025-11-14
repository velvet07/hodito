import React, { useEffect, useState } from 'react';
import { initTheme, setStoredTheme, Theme } from '../utils/theme';

export default function LandingPage() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const current = initTheme();
    setTheme(current);

    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'hodito-theme' && (event.newValue === 'light' || event.newValue === 'dark')) {
        setTheme(event.newValue);
      }
    };

    const handleThemeChange = (event: Event) => {
      if ('detail' in event && (event as CustomEvent<Theme>).detail) {
        setTheme((event as CustomEvent<Theme>).detail);
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('themechange', handleThemeChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('themechange', handleThemeChange as EventListener);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setStoredTheme(newTheme);
    setTheme(newTheme);
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-10">
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className="btn btn-ghost btn-sm gap-2"
          title="Sötét/Világos mód váltása"
          aria-label="Téma váltása"
        >
          {theme === 'light' ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364 6.364l-1.577 1.577M21 12h-2.25m-4.773 4.773l-1.577-1.577M12 18.75V21m-4.773-4.773l-1.577 1.577M3 12h2.25m4.773-4.773L9.18 8.18M12 5.25V3" />
            </svg>
          )}
        </button>
      </div>

      <div className="max-w-3xl w-full text-center space-y-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-base-content tracking-wide">HÓDÍTÓ KALKULÁTOR</h1>
          <p className="text-base-content/70 mt-3 text-sm md:text-base">Válaszd ki, melyik kalkulátort szeretnéd használni.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <a href="buildings.html" className="card bg-base-100 shadow-xl hover:shadow-2xl transition focus:outline-none focus:ring-2 focus:ring-primary">
            <div className="card-body items-center text-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-primary text-primary-content flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l9.75-9 9.75 9M4.5 10.5v9A1.5 1.5 0 006 21h3.75v-4.5h4.5V21H18a1.5 1.5 0 001.5-1.5v-9" />
                </svg>
              </div>
              <h2 className="card-title text-xl">Épületlista kalkulátor</h2>
              <p className="text-base-content/70 text-sm">
                Férőhely, termelés és tekercsek automatikus kiszámítása.
              </p>
            </div>
          </a>
          <a href="war.html" className="card bg-base-100 shadow-xl hover:shadow-2xl transition focus:outline-none focus:ring-2 focus:ring-secondary">
            <div className="card-body items-center text-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-secondary text-secondary-content flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2.25 2.25L15 10.5m4.5-4.875v6.375c0 4.875-3.125 9-7.5 10.875-4.375-1.875-7.5-6-7.5-10.875V5.625L12 2.625l7.5 3z" />
                </svg>
              </div>
              <h2 className="card-title text-xl">Háború kalkulátor</h2>
              <p className="text-base-content/70 text-sm">
                Védő- és támadóerő kalkuláció kristálygömb és épületlista alapján.
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

