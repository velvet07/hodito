import { extractNumber } from './formatters';
import { BuildingData } from '../types';

// Épületlista feldolgozása
export function parseBuildingList(text: string): Partial<BuildingData> {
  const data: Partial<BuildingData> = {};
  const lines = text.split('\n');
  
  let fullheki = 0;
  let fullbanya = 0;
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    // Pontok eltávolítása
    const cleaned = trimmed.replace(/\./g, '');
    
    // Kettőspont vagy tab alapján szétválasztás
    let parts = cleaned.split(':');
    if (parts.length < 2) {
      parts = cleaned.split('\t');
    }
    
    if (parts.length >= 2) {
      const name = parts[0].trim();
      const value = extractNumber(parts[1]);
      
      switch (name) {
        case 'Szabad terület':
        case 'Üres':
          data.szabad_terulet = value;
          fullheki += value;
          break;
        case 'Ház':
          data.haz = value;
          fullheki += value;
          break;
        case 'Barakk':
          data.barakk = value;
          fullheki += value;
          break;
        case 'Tanya':
          data.tanya = value;
          fullheki += value;
          break;
        case 'Kovácsműhely':
          data.kovacsmuhely = value;
          fullheki += value;
          break;
        case 'Könyvtár':
          data.konyvtar = value;
          fullheki += value;
          break;
        case 'Raktár':
          data.raktar = value;
          fullheki += value;
          break;
        case 'Őrtorony':
          data.ortorony = value;
          fullheki += value;
          break;
        case 'Kocsma':
          data.kocsma = value;
          fullheki += value;
          break;
        case 'Templom':
          data.templom = value;
          fullheki += value;
          break;
        case 'Kórház':
          data.korhaz = value;
          fullheki += value;
          break;
        case 'Piac':
          data.piac = value;
          fullheki += value;
          break;
        case 'Bank':
          data.bank = value;
          fullheki += value;
          break;
        case 'Fatelep':
          data.fatelep = value;
          fullheki += value;
          fullbanya += value;
          break;
        case 'Kőbánya':
          data.kobanya = value;
          fullheki += value;
          fullbanya += value;
          break;
        case 'Fémbánya':
          data.fembanya = value;
          fullheki += value;
          fullbanya += value;
          break;
        case 'Agyagbánya':
          data.agyagbanya = value;
          fullheki += value;
          fullbanya += value;
          break;
        case 'Drágakőbánya':
          data.dragakobanya = value;
          fullheki += value;
          fullbanya += value;
          break;
        case 'Bányák':
          data.banyak = fullbanya;
          break;
        case 'Erdő':
          data.erdo = value;
          fullheki += value;
          break;
        case 'Kőlelőhely':
          data.kolelohely = value;
          fullheki += value;
          break;
        case 'Fémlelőhely':
          data.femlelohely = value;
          fullheki += value;
          break;
        case 'Agyaglelőhely':
          data.agyaglelohely = value;
          fullheki += value;
          break;
        case 'Drágakőlelőhely':
          data.dragakolelohely = value;
          fullheki += value;
          break;
      }
    }
  }
  
  data.hektar = fullheki;
  data.banyak = fullbanya;
  
  return data;
}

