import { BuildingData, CalculationSettings, CalculationResults, Scrolls } from '../types';
import { RACE_BONUSES } from '../constants';

export class BuildingCalculator {
  private buildings: BuildingData;
  private settings: CalculationSettings;
  private scrolls: Scrolls;

  constructor(buildings: BuildingData, settings: CalculationSettings, scrolls: Scrolls) {
    this.buildings = buildings;
    this.settings = settings;
    this.scrolls = scrolls;
  }

  // Népesség számítás
  calculatePopulation(): number {
    const { haz, szabad_terulet, erdo, kolelohely, femlelohely, agyaglelohely, dragakolelohely } = this.buildings;
    const lakashelyzeti = this.getLakashelyzetiMultiplier();
    
    // Az eredeti kód szerint: haz * 50 * lakashelyzeti + (szabad_terulet + erdo + ...) * 8 * lakashelyzeti
    // Az élőhalott esetén is számolódik a népesség (nincs lakashelyzeti2 szorzó a népesség számításnál)
    
    const hazNepesseg = haz * 50 * lakashelyzeti;
    const teruletNepesseg = (szabad_terulet + erdo + kolelohely + femlelohely + agyaglelohely + dragakolelohely) * 8 * lakashelyzeti;
    
    return Math.round(hazNepesseg + teruletNepesseg);
  }

  // Foglalkoztatottság számítás
  calculateEmployment(): number {
    const nepesseg = this.calculatePopulation();
    if (nepesseg === 0) {
      return 0;
    }

    const skipKeys: (keyof BuildingData)[] = [
      'hektar',
      'szabad_terulet',
      'haz',
      'banyak', // gyűjtőmező, külön bányák is szerepelnek
      'erdo',
      'kolelohely',
      'femlelohely',
      'agyaglelohely',
      'dragakolelohely'
    ];

    const specialEmployment: Partial<Record<keyof BuildingData, number>> = {
      piac: 50
    };

    let szukseges_lakos = 0;

    (Object.keys(this.buildings) as (keyof BuildingData)[]).forEach((key) => {
      if (skipKeys.includes(key)) {
        return;
      }

      const buildingCount = this.buildings[key];
      const workersPerBuilding = specialEmployment[key] ?? 15;
      szukseges_lakos += buildingCount * workersPerBuilding;
    });

    return Math.round((szukseges_lakos / nepesseg) * 100);
  }

  // Érték számítás
  calculateValue(): number {
    const { hektar, szabad_terulet, haz, barakk, kovacsmuhely, tanya, konyvtar, raktar, 
            banyak, ortorony, kocsma, templom, korhaz, piac, bank } = this.buildings;
    
    const beepitett = haz + barakk + kovacsmuhely + tanya + konyvtar + raktar + 
                      banyak + ortorony + kocsma + templom + korhaz + piac + bank;
    
    const nepesseg = this.calculatePopulation();
    const nepesseg_ertek = Math.min(nepesseg, hektar * 70);
    
    return Math.round(szabad_terulet * 30 + beepitett * 45 + nepesseg_ertek / 5);
  }

  // Férőhelyek számítás
  calculateCapacity(): { barakk: number; templom: number; kocsma: number; ortorony: number } {
    const { barakk, templom, kocsma, ortorony } = this.buildings;
    const lakashelyzeti = this.getLakashelyzetiMultiplier();
    
    // Az eredeti kód szerint: barakk * 40 * lakashelyzeti
    // A törpe fajnál a lakashelyzeti már tartalmazza a 1.2-es szorzót (20% bónusz)
    // Az élőhalott esetén a lakashelyzeti már tartalmazza a szint alapú bónuszt
    
    return {
      barakk: Math.round(barakk * 40 * lakashelyzeti),
      templom: Math.round(templom * 100 * lakashelyzeti),
      kocsma: Math.round(kocsma * 40 * lakashelyzeti),
      ortorony: Math.round(ortorony * 40 * lakashelyzeti)
    };
  }

  // Raktár kapacitás számítás
  calculateStorageCapacity(): { gabona: number; agyag: number; fa: number; ko: number; fem: number; fegyver: number; dragako: number } {
    const { raktar } = this.buildings;
    const raktarmodosito = this.getRaktarModosito();
    
    return {
      gabona: Math.round(raktar * 1000 * raktarmodosito),
      agyag: Math.round(raktar * 300 * raktarmodosito),
      fa: Math.round(raktar * 300 * raktarmodosito),
      ko: Math.round(raktar * 300 * raktarmodosito),
      fem: Math.round(raktar * 300 * raktarmodosito),
      fegyver: Math.round(raktar * 100 * raktarmodosito),
      dragako: Math.round(raktar * 300 * raktarmodosito)
    };
  }

  // Termelés számítás
  calculateProduction(): { gabona: number; agyag: number; fa: number; ko: number; fem: number; fegyver: number; dragako: number } {
    const { tanya, agyagbanya, fatelep, kobanya, fembanya, kovacsmuhely, dragakobanya } = this.buildings;
    
    let gabonamodosito = this.getGabonaModosito();
    const gabonamodosito2 = this.getGabonaModosito2();
    let nyersanyagmodosito = this.getNyersanyagModosito();
    const nyersanyagmodosito2 = this.getNyersanyagModosito2();
    const fegyvermodosito = this.getFegyverModosito();
    
    // Gazdálkodó személyiség hatása (az eredeti kód szerint itt alkalmazódik)
    const hasGazdalkodo = this.settings.szemelyisegek.includes('gazdalkodo');
    if (hasGazdalkodo) {
      gabonamodosito *= 1.1;
      nyersanyagmodosito *= 1.1;
    }
    
    return {
      gabona: Math.round(tanya * 50 * gabonamodosito * gabonamodosito2),
      agyag: Math.round(agyagbanya * 7 * nyersanyagmodosito * nyersanyagmodosito2),
      fa: Math.round(fatelep * 7 * nyersanyagmodosito * nyersanyagmodosito2),
      ko: Math.round(kobanya * 7 * nyersanyagmodosito * nyersanyagmodosito2),
      fem: Math.round(fembanya * 7 * nyersanyagmodosito * nyersanyagmodosito2),
      fegyver: Math.round(kovacsmuhely * 3 * fegyvermodosito),
      dragako: Math.round(dragakobanya * 7 * nyersanyagmodosito * nyersanyagmodosito2)
    };
  }

  // Gabonaszükséglet számítás (teljes)
  calculateGrainRequirement(): number {
    const { barakk, templom, kocsma } = this.buildings;
    const lakashelyzeti = this.getLakashelyzetiMultiplier();
    const lakashelyzeti2 = this.settings.faj === 'elohalott' ? 0 : 1;
    const nepesseg = this.calculatePopulation();
    
    const isOrk = this.settings.faj === 'ork';
    const multiplier = isOrk ? 0.7 : 1.0;
    
    const szukseges = Math.round(
      (barakk * 40 * lakashelyzeti * multiplier +
       templom * 100 * lakashelyzeti * multiplier +
       kocsma * 40 * lakashelyzeti * multiplier +
       nepesseg) / 5
    ) * lakashelyzeti2;
    
    return szukseges;
  }

  // Gabonaszükséglet számítás (sereg nélkül - csak templom, kocsma, népesség)
  calculateGrainRequirementNoMilitary(): number {
    const { templom, kocsma } = this.buildings;
    const lakashelyzeti = this.getLakashelyzetiMultiplier();
    const lakashelyzeti2 = this.settings.faj === 'elohalott' ? 0 : 1;
    const nepesseg = this.calculatePopulation();
    
    const szukseges = Math.round(
      (templom * 100 * lakashelyzeti +
       kocsma * 40 * lakashelyzeti +
       nepesseg) / 5
    ) * lakashelyzeti2;
    
    return szukseges;
  }

  // Bankadatok számítás
  calculateBankData(): { penz_lop: string; kamat: string } {
    const { bank } = this.buildings;
    
    if (bank === 0) {
      return { penz_lop: '100%', kamat: '0 ehhez 0 arany kell' };
    }
    
    let lop = 100;
    for (let i = 1; i <= bank; i++) {
      lop *= 0.8;
    }
    
    const min_penz = bank * 150000;
    const kamat = Math.round(min_penz * 0.05);
    
    return {
      penz_lop: (Math.round(lop * 10000) / 10000) + '%',
      kamat: `${kamat} ehhez ${min_penz} arany kell`
    };
  }

  // Lakáshelyzeti szorzó
  private getLakashelyzetiMultiplier(): number {
    // Élőhalott speciális kezelés
    if (this.settings.faj === 'elohalott') {
      const szint = this.settings.szint || 5;
      const elohalottMultipliers: Record<number, number> = {
        5: 1.2,
        4: 1.3,
        3: 1.4,
        2: 1.5,
        1: 1.6
      };
      return elohalottMultipliers[szint] || 1.2;
    }
    
    if (this.settings.skip_tekercs) {
      const max = this.getMaxLakashelyzeti();
      let multiplier = max / 100 + 1;
      if (this.settings.faj === 'torpe') {
        multiplier *= 1.2;
      }
      return multiplier;
    }
    
    const max = this.getMaxLakashelyzeti();
    const value = Math.min(this.scrolls.lakashelyzeti, max);
    
    if (this.settings.faj === 'torpe') {
      return (value / 100 + 1) * 1.2;
    }
    
    return value / 100 + 1;
  }

  // Gabona módosító (csak tekercs érték, NEM tartalmazza a faji bónuszt!)
  // FONTOS: Az eredeti kódban a gabonamodosito CSAK a tekercs értéket tartalmazza!
  // A faji bónusz külön van (gabonamodosito2-ben vagy nincs)
  // A gazdálkodó személyiség itt NEM számolódik, hanem később alkalmazódik!
  private getGabonaModosito(): number {
    // Élőhalott esetén mindig 1.0
    if (this.settings.faj === 'elohalott') {
      return 1.0;
    }
    
    let modosito = 1.0;
    
    if (this.settings.skip_tekercs) {
      modosito = this.getMaxMezogazdasag() / 100 + 1;
    } else {
      const max = this.getMaxMezogazdasag();
      const value = Math.min(this.scrolls.mezogazdasag, max);
      modosito = value / 100 + 1;
    }
    
    // FONTOS: A faji bónusz NEM itt számolódik! Az eredeti kódban a gabonamodosito CSAK a tekercs értéket tartalmazza.
    // A faji bónusz külön van (gabonamodosito2-ben vagy nincs)
    // A gazdálkodó személyiség NEM itt számolódik, hanem a calculateProduction-ban!
    
    return modosito;
  }

  // Gabona módosító 2 (faji alapérték + időszaki módosítók)
  private getGabonaModosito2(): number {
    const raceBonus = RACE_BONUSES[this.settings.faj]?.gabona ?? 1.0;
    let modosito2 = raceBonus;
    
    // Időszaki módosítók
    const hasBoTermes = this.settings.idoszakok.includes('bo_termes');
    const hasRagcsalok = this.settings.idoszakok.includes('ragcsalok');
    
    if (hasBoTermes) modosito2 *= 1.2; // +20%
    if (hasRagcsalok) modosito2 *= 0.9; // -10%
    
    return modosito2;
  }

  // Nyersanyag módosító 2 (faji alapérték + időszaki módosítók)
  private getNyersanyagModosito2(): number {
    const raceBonus = RACE_BONUSES[this.settings.faj]?.nyersanyag ?? 1.0;
    let modosito2 = raceBonus;
    
    const hasNyersanyagPlus = this.settings.idoszakok.includes('nyersanyag_plus');
    const hasNyersanyagMinus = this.settings.idoszakok.includes('nyersanyag_minus');
    
    if (hasNyersanyagPlus) modosito2 *= 1.2;
    if (hasNyersanyagMinus) modosito2 *= 0.9;
    
    return modosito2;
  }

  // Nyersanyag módosító (csak tekercs érték)
  private getNyersanyagModosito(): number {
    // Élőhalott esetén mindig 1.0
    if (this.settings.faj === 'elohalott') {
      return 1.0;
    }
    
    let modosito = 1.0;
    
    if (this.settings.skip_tekercs) {
      modosito = this.getMaxBanyaszat() / 100 + 1;
    } else {
      const max = this.getMaxBanyaszat();
      const value = Math.min(this.scrolls.banyaszat, max);
      modosito = value / 100 + 1;
    }
    
    return modosito;
  }

  // Fegyver módosító
  private getFegyverModosito(): number {
    return this.settings.faj === 'torpe' ? 3 : 1;
  }

  // Raktár módosító
  private getRaktarModosito(): number {
    const hasZsugoraru = this.settings.idoszakok.includes('zsugoraru');
    
    let modosito = 1.0;
    
    if (this.settings.faj === 'torpe') {
      modosito = 1.5;
    } else if (this.settings.faj === 'gnom') {
      modosito = 0.9;
    }
    
    if (hasZsugoraru) {
      modosito *= 3;
    }
    
    return modosito;
  }

  // Max lakáshelyzeti tekercs
  private getMaxLakashelyzeti(): number {
    const hasTudomanyHonapja = this.settings.idoszakok.includes('tudomany_honapja');
    let max = 30;
    
    if (this.settings.faj === 'gnom') max = 50;
    else if (this.settings.faj === 'orias' || this.settings.faj === 'felelf') max = 40;
    
    // Tudomány hónapja: +5%, de maximum 55% (dokumentáció szerint minden fajra)
    if (hasTudomanyHonapja) {
      max = Math.min(55, max + 5);
    }
    
    return max;
  }

  // Max mezőgazdaság tekercs
  private getMaxMezogazdasag(): number {
    const hasTudos = this.settings.szemelyisegek.includes('tudos');
    const hasTudomanyHonapja = this.settings.idoszakok.includes('tudomany_honapja');
    let max = 30;
    
    if (this.settings.faj === 'gnom') {
      max = 50;
    } else if (this.settings.faj === 'ork') {
      max = 40;
    }
    
    if (hasTudos) max += 5;
    // Tudomány hónapja: +5%, de maximum 55% (dokumentáció szerint minden fajra)
    if (hasTudomanyHonapja) {
      max = Math.min(55, max + 5);
    }
    
    return max;
  }

  // Max bányászat tekercs
  private getMaxBanyaszat(): number {
    const hasTudos = this.settings.szemelyisegek.includes('tudos');
    const hasTudomanyHonapja = this.settings.idoszakok.includes('tudomany_honapja');
    let max = 30;
    
    if (this.settings.faj === 'gnom') {
      max = 50;
    }
    
    if (hasTudos) max += 5;
    // Tudomány hónapja: +5%, de maximum 55% (dokumentáció szerint minden fajra)
    if (hasTudomanyHonapja) {
      max = Math.min(55, max + 5);
    }
    
    return max;
  }

  // Teljes számítás
  calculate(): CalculationResults {
    const capacity = this.calculateCapacity();
    const storage = this.calculateStorageCapacity();
    const production = this.calculateProduction();
    const bankData = this.calculateBankData();
    
    const gabonaszukseglet = this.calculateGrainRequirement();
    const gabonaszukseglet_n = this.calculateGrainRequirementNoMilitary();
    const gabonatermeles = production.gabona;
    const gabonaRaktarKapacitas = storage.gabona;
    
    // Körre elég számítás (ha negatív a különbség)
    let gabona_kor_re_elég: number | null = null;
    if (gabonatermeles - gabonaszukseglet < 0) {
      const fogyasztas = gabonaszukseglet - gabonatermeles;
      if (fogyasztas > 0) {
        gabona_kor_re_elég = Math.floor(gabonaRaktarKapacitas / fogyasztas);
      }
    }
    
    let gabona_kor_re_elég_n: number | null = null;
    if (gabonatermeles - gabonaszukseglet_n < 0) {
      const fogyasztas_n = gabonaszukseglet_n - gabonatermeles;
      if (fogyasztas_n > 0) {
        gabona_kor_re_elég_n = Math.floor(gabonaRaktarKapacitas / fogyasztas_n);
      }
    }
    
    return {
      nepesseg: this.calculatePopulation(),
      foglalkoztatottsag: this.calculateEmployment(),
      ertek: this.calculateValue(),
      barakkhely: capacity.barakk,
      templomhely: capacity.templom,
      kocsmahely: capacity.kocsma,
      ortoronyhely: capacity.ortorony,
      gabona: storage.gabona,
      agyag: storage.agyag,
      fa: storage.fa,
      ko: storage.ko,
      fem: storage.fem,
      fegyver: storage.fegyver,
      dragako: storage.dragako,
      gabona_t: production.gabona,
      agyag_t: production.agyag,
      fa_t: production.fa,
      ko_t: production.ko,
      fem_t: production.fem,
      fegyver_t: production.fegyver,
      dragako_t: production.dragako,
      gabonaszukseglet,
      gabonaszukseglet_n,
      gabona_kor_re_elég,
      gabona_kor_re_elég_n,
      penz_lop: bankData.penz_lop,
      kamat: bankData.kamat
    };
  }
}

