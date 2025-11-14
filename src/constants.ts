// Katonai egységek alapértékei
export const UNIT_VALUES = {
  katona: { vedo: 1, tamado: 1 },
  vedo: { vedo: 4, tamado: 0 },
  tamado: { vedo: 0, tamado: 4 },
  ijsz: { vedo: 6, tamado: 2 },
  lovas: { vedo: 2, tamado: 6 },
  elit: { vedo: 5, tamado: 5 }
} as const;

// Faji bónuszok
export const RACE_BONUSES = {
  elf: { vedo: 1.30, tamado: 1.0, gabona: 1.3, nyersanyag: 0.7 },
  ork: { vedo: 1.0, tamado: 1.30, gabona: 1.4, nyersanyag: 1.0 },
  felelf: { vedo: 1.10, tamado: 0.90, gabona: 0.9, nyersanyag: 1.0 },
  torpe: { vedo: 1.0, tamado: 1.0, gabona: 1.0, nyersanyag: 3.0 },
  gnom: { vedo: 1.0, tamado: 1.0, gabona: 1.0, nyersanyag: 1.0 },
  orias: { vedo: 1.0, tamado: 1.0, gabona: 1.2, nyersanyag: 1.0 },
  elohalott: { vedo: 1.0, tamado: 1.0, gabona: 1.0, nyersanyag: 1.0 },
  ember: { vedo: 1.0, tamado: 1.0, gabona: 1.0, nyersanyag: 1.0 },
  none: { vedo: 1.0, tamado: 1.0, gabona: 1.0, nyersanyag: 1.0 }
} as const;

// Tábornok bónuszok
export const GENERAL_BONUSES: Record<number, number> = {
  0: 0,
  1: 0,
  2: 0.03,
  3: 0.05,
  4: 0.06,
  5: 0.07,
  6: 0.08,
  7: 0.10,
  8: 0.20
};

// Élőhalott szint bónuszok
export const UNDEAD_LEVEL_BONUSES: Record<number, number> = {
  0: 0,
  1: 0.40,
  2: 0.30,
  3: 0.20,
  4: 0.10,
  5: 0
};

// Épületek listája
export const BUILDINGS = [
  'hektar',
  'szabad_terulet',
  'haz',
  'barakk',
  'kovacsmuhely',
  'tanya',
  'konyvtar',
  'raktar',
  'banyak',
  'ortorony',
  'kocsma',
  'templom',
  'korhaz',
  'piac',
  'bank',
  'fatelep',
  'kobanya',
  'fembanya',
  'agyagbanya',
  'dragakobanya',
  'erdo',
  'kolelohely',
  'femlelohely',
  'agyaglelohely',
  'dragakolelohely'
] as const;

// Faj típusok
export type Race = keyof typeof RACE_BONUSES;

// Személyiségek
export const PERSONALITIES = {
  kereskedo: 'kereskedo',
  tolvaj: 'tolvaj',
  varazslo: 'varazslo',
  harcos: 'harcos',
  tabornok: 'tabornok',
  vandor: 'vandor',
  tudos: 'tudos',
  gazdalkodo: 'gazdalkodo',
  tulelo: 'tulelo'
} as const;

// Időszakok
export const PERIODS = {
  bo_termes: 'bo_termes',
  ragcsalok: 'ragcsalok',
  nyersanyag_plus: 'nyersanyag_plus',
  nyersanyag_minus: 'nyersanyag_minus',
  tudomany_honapja: 'tudomany_honapja',
  zsugoraru: 'zsugoraru'
} as const;

// Hadi tekercs maximum értékek
export function getHadiTekercsMax(faj: Race, hasTudomanyHonapja: boolean = false, hasTudos: boolean = false): number {
  // Alapértelmezett: 30%
  // Gnóm: 50% (minden tudományág)
  // Elf: 40% (hadügy és mágia területén)
  // Ork: 40% (hadügy és mezőgazdaság területén)
  // Törpe: 40% (ipar és hadügy területén)
  // Egyéb fajok: 30%
  
  let baseMax = 30;
  if (faj === 'gnom') {
    baseMax = 50;
  } else if (faj === 'elf' || faj === 'ork' || faj === 'torpe') {
    baseMax = 40;
  }
  
  if (hasTudos) {
    baseMax += 5;
  }
  
  if (hasTudomanyHonapja) {
    baseMax += 5;
  }
  
  return baseMax;
}

// Lakáshelyzeti tekercs maximum értékek
export function getLakashelyzetiTekercsMax(faj: Race, hasTudomanyHonapja: boolean = false): number {
  // Alapértelmezett: 30%
  // Gnóm: 50% (minden tudományág)
  // Óriás: 40% (mágia és lakáshelyzet területén)
  // Félelf: 40% (tolvajlás és lakáshelyzet területén)
  // Törpe: 30% (csak ipar és hadügy 40%)
  // Elf: 30% (csak hadügy és mágia 40%)
  // Ork: 30% (csak hadügy és mezőgazdaság 40%)
  // Élőhalott: 30%
  // Ember: 30%
  // Tudomány hónapja: +5%, de maximum 55% (minden fajra vonatkozik)
  
  let baseMax = 30;
  if (faj === 'gnom') {
    baseMax = 50;
  } else if (faj === 'orias' || faj === 'felelf') {
    baseMax = 40;
  }
  
  // Tudomány hónapja: +5%, de maximum 55% (dokumentáció szerint)
  if (hasTudomanyHonapja) {
    baseMax = Math.min(55, baseMax + 5);
  }
  
  return baseMax;
}

// Mezőgazdaság tekercs maximum értékek
export function getMezogazdasagTekercsMax(faj: Race, hasTudos: boolean = false, hasTudomanyHonapja: boolean = false): number {
  // Alapértelmezett: 30%
  // Gnóm: 50% (minden tudományág)
  // Ork: 40% (hadügy és mezőgazdaság területén)
  // Tudós személyiség: +5% (kivéve lakáshelyzet)
  // Tudomány hónapja: +5%, de maximum 55% (minden fajra vonatkozik)
  
  let baseMax = 30;
  if (faj === 'gnom') {
    baseMax = 50;
  } else if (faj === 'ork') {
    baseMax = 40;
  }
  
  if (hasTudos) {
    baseMax += 5;
  }
  
  // Tudomány hónapja: +5%, de maximum 55% (dokumentáció szerint)
  if (hasTudomanyHonapja) {
    baseMax = Math.min(55, baseMax + 5);
  }
  
  return baseMax;
}

// Bányászat tekercs maximum értékek
export function getBanyaszatTekercsMax(faj: Race, hasTudos: boolean = false, hasTudomanyHonapja: boolean = false): number {
  // Alapértelmezett: 30%
  // Gnóm: 50% (minden tudományág)
  // Tudós személyiség: +5%
  // Tudomány hónapja: +5%, de maximum 55% (minden fajra vonatkozik)
  
  let baseMax = 30;
  if (faj === 'gnom') {
    baseMax = 50;
  }
  
  if (hasTudos) {
    baseMax += 5;
  }
  
  // Tudomány hónapja: +5%, de maximum 55% (dokumentáció szerint)
  if (hasTudomanyHonapja) {
    baseMax = Math.min(55, baseMax + 5);
  }
  
  return baseMax;
}

