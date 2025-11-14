// Adatok localStorage-ba mentése és betöltése

const STORAGE_KEY_BUILDINGS = 'hodito-buildings';
const STORAGE_KEY_SETTINGS = 'hodito-settings';
const STORAGE_KEY_SCROLLS = 'hodito-scrolls';

import { BuildingData, CalculationSettings, Scrolls } from '../types';

export function saveBuildings(buildings: BuildingData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_BUILDINGS, JSON.stringify(buildings));
  } catch (e) {
    console.error('Failed to save buildings to localStorage', e);
  }
}

export function loadBuildings(): BuildingData | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY_BUILDINGS);
    if (stored) {
      return JSON.parse(stored) as BuildingData;
    }
  } catch (e) {
    console.error('Failed to load buildings from localStorage', e);
  }
  return null;
}

export function saveSettings(settings: CalculationSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings to localStorage', e);
  }
}

export function loadSettings(): CalculationSettings | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (stored) {
      return JSON.parse(stored) as CalculationSettings;
    }
  } catch (e) {
    console.error('Failed to load settings from localStorage', e);
  }
  return null;
}

export function saveScrolls(scrolls: Scrolls): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_SCROLLS, JSON.stringify(scrolls));
  } catch (e) {
    console.error('Failed to save scrolls to localStorage', e);
  }
}

export function loadScrolls(): Scrolls | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY_SCROLLS);
    if (stored) {
      return JSON.parse(stored) as Scrolls;
    }
  } catch (e) {
    console.error('Failed to load scrolls from localStorage', e);
  }
  return null;
}

export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY_BUILDINGS);
    localStorage.removeItem(STORAGE_KEY_SETTINGS);
    localStorage.removeItem(STORAGE_KEY_SCROLLS);
  } catch (e) {
    console.error('Failed to clear data from localStorage', e);
  }
}

