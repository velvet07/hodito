import { extractNumber } from './formatters';
import { WarSettings, Race } from '../types';

// Kristálygömb importálása
export function parseKristalygomb(text: string, tipus: 'vedo' | 'tamado'): Partial<WarSettings> {
  const data: Partial<WarSettings> = {};
  
  // Normalizáljuk a szöveget
  let normalizedText = text.replace(/\t/g, ' ');
  normalizedText = normalizedText.replace(/[ \t]+/g, ' ');
  
  // Segédfüggvény: érték kinyerése kulcsszó után
  function extractValue(keyword: string): string | null {
    const regex = new RegExp(keyword + ':\\s*([^\\n]+)', 'i');
    const match = normalizedText.match(regex);
    if (match) {
      let value = match[1].trim();
      if (/^[0-9.,\s]+/.test(value)) {
        const numMatch = value.match(/^([0-9.,\s]+)/);
        if (numMatch) {
          return numMatch[1].trim();
        }
      }
      return value;
    }
    return null;
  }
  
  // Föld (Hektár)
  const foldValue = extractValue('Föld');
  if (foldValue) {
    const hektarNum = foldValue.replace(/hektár/gi, '').trim();
    if (hektarNum) {
      data.hektar = extractNumber(hektarNum);
    }
  }
  
  // Katonai egységek
  const katonaValue = extractValue('Katona');
  if (katonaValue) data.katona = extractNumber(katonaValue);
  
  const vedoValue = extractValue('Védő');
  if (vedoValue && tipus === 'vedo') data.vedo = extractNumber(vedoValue);
  
  const tamadoValue = extractValue('Támadó');
  if (tamadoValue) data.tamado = extractNumber(tamadoValue);
  
  const ijszValue = extractValue('Íjász');
  if (ijszValue) data.ijsz = extractNumber(ijszValue);
  
  const lovasValue = extractValue('Lovas');
  if (lovasValue) data.lovas = extractNumber(lovasValue);
  
  const elitValue = extractValue('Elit');
  if (elitValue) data.elit = extractNumber(elitValue);
  
  // Katonai morál
  const moralValue = extractValue('Katonai morál');
  if (moralValue) {
    const moralNum = moralValue.replace(/%/g, '').trim();
    if (moralNum) {
      data.katonai_moral = parseInt(moralNum) || 75;
    }
  }
  
  // Szövetség
  const szovetsegValue = extractValue('Szövetség');
  if (szovetsegValue) {
    const szovetsegLower = szovetsegValue.trim().toLowerCase();
    if (szovetsegLower.startsWith('magányos')) {
      data.maganyos_farkas = true;
    }
  }
  
  // Faj
  const fajValue = extractValue('Faj');
  if (fajValue) {
    const fajText = fajValue.trim();
    const fajMap: Record<string, Race> = {
      'Elf': 'elf',
      'Ork': 'ork',
      'Félelf': 'felelf',
      'Törpe': 'torpe',
      'Gnóm': 'gnom',
      'Óriás': 'orias',
      'Élőhalott': 'elohalott',
      'Ember': 'ember'
    };
    if (fajMap[fajText]) {
      data.faj = fajMap[fajText];
    }
  }
  
  // Személyiség
  const szemelyisegValue = extractValue('Személyiség');
  if (szemelyisegValue) {
    const szemelyisegek = szemelyisegValue.split(',').map(s => s.trim()).filter(s => s.length > 0);
    const hasTudos = szemelyisegek.some(s => s.includes('Tudós'));
    if (hasTudos) {
      data.tudos = true;
    }
    
    // Tábornok személyiség (támadóknál)
    if (tipus === 'tamado') {
      const hasTabornok = szemelyisegek.some(s => s.includes('Tábornok'));
      if (hasTabornok) {
        data.tabornok_szemelyiseg = true;
      }
    }
  }
  
  return data;
}

// Épületlista importálása (háború számítóhoz)
export function parseEpuletlistaForWar(text: string): { hektar?: number; ortorony?: number; barakk?: number } {
  const data: { hektar?: number; ortorony?: number; barakk?: number } = {};
  
  const lines = text.split('\n');
  let totalHektar = 0;
  
  const epuletek = [
    'Szabad terület', 'Üres', 'Ház', 'Barakk', 'Kovácsműhely', 'Tanya',
    'Könyvtár', 'Raktár', 'Őrtorony', 'Kocsma', 'Templom', 'Kórház',
    'Piac', 'Bank', 'Fatelep', 'Kőbánya', 'Fémbánya', 'Agyagbánya',
    'Drágakőbánya', 'Erdő', 'Kőlelőhely', 'Fémlelőhely', 'Agyaglelőhely',
    'Drágakőlelőhely'
  ];
  
  for (const line of lines) {
    if (!line || !line.trim()) continue;
    
    let parts = line.split(':');
    if (parts.length < 2) {
      parts = line.split('\t');
    }
    
    if (parts.length >= 2) {
      const epuletNev = parts[0].trim();
      const epuletSzam = extractNumber(parts[1].trim());
      
      if (epuletek.some(e => epuletNev.includes(e))) {
        totalHektar += epuletSzam;
        
        if (epuletNev.includes('Őrtorony')) {
          data.ortorony = epuletSzam;
        }

        if (epuletNev.includes('Barakk')) {
          data.barakk = epuletSzam;
        }
      }
    }
  }
  
  if (totalHektar > 0) {
    data.hektar = totalHektar;
  }
  
  return data;
}

