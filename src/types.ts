import { Race } from './constants';

// Exportáljuk a Race típust is
export type { Race };

// Épület adatok típusa
export interface BuildingData {
  hektar: number;
  szabad_terulet: number;
  haz: number;
  barakk: number;
  kovacsmuhely: number;
  tanya: number;
  konyvtar: number;
  raktar: number;
  banyak: number;
  ortorony: number;
  kocsma: number;
  templom: number;
  korhaz: number;
  piac: number;
  bank: number;
  fatelep: number;
  kobanya: number;
  fembanya: number;
  agyagbanya: number;
  dragakobanya: number;
  erdo: number;
  kolelohely: number;
  femlelohely: number;
  agyaglelohely: number;
  dragakolelohely: number;
}

// Számítási beállítások
export interface CalculationSettings {
  faj: Race;
  szemelyisegek: string[];
  idoszakok: string[];
  skip_tekercs: boolean;
  szint?: number; // Élőhalott szint
}

// Tekercsek
export interface Scrolls {
  lakashelyzeti: number;
  mezogazdasag: number;
  banyaszat: number;
}

// Számítási eredmények
export interface CalculationResults {
  nepesseg: number;
  foglalkoztatottsag: number;
  ertek: number;
  barakkhely: number;
  templomhely: number;
  kocsmahely: number;
  ortoronyhely: number;
  gabona: number;
  agyag: number;
  fa: number;
  ko: number;
  fem: number;
  fegyver: number;
  dragako: number;
  gabona_t: number;
  agyag_t: number;
  fa_t: number;
  ko_t: number;
  fem_t: number;
  fegyver_t: number;
  dragako_t: number;
  gabonaszukseglet: number;
  gabonaszukseglet_n: number; // Sereg nélkül
  gabona_kor_re_elég: number | null; // Körre elég (teljes), ha negatív a különbség
  gabona_kor_re_elég_n: number | null; // Körre elég (sereg nélkül), ha negatív a különbség
  penz_lop: string;
  kamat: string;
}

// Háború számítási beállítások
export interface WarSettings {
  katona: number;
  vedo?: number;
  tamado: number;
  ijsz: number;
  lovas: number;
  elit: number;
  faj: Race;
  katonai_moral: number;
  maganyos_farkas: boolean;
  vedelem?: boolean;
  verszomj?: boolean;
  tabornok?: number;
  kitamadasi_bonusz?: boolean;
  elohalott_szint?: number;
  szabadsagon_szovetsegesek?: number;
  szovetseges_ijaszok?: number;
  tudos_szazalek: number;
  lakashelyzeti_tekercs: number;
  tudomany_honapja?: boolean;
  tudos?: boolean;
  hektar?: number;
  ortorony?: number;
  kor?: number;
  irany?: 'felfele' | 'lefele';
  tabornok_szemelyiseg?: boolean;
}

// Háború számítási eredmények
export interface WarResults {
  vedoero: number;
  tamadoero: number;
  eredmeny: string;
  gabonaszukseglet: number;
}

