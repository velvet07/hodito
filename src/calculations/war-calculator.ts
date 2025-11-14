import { WarSettings, WarResults } from '../types';
import { UNIT_VALUES, RACE_BONUSES, GENERAL_BONUSES, UNDEAD_LEVEL_BONUSES, Race } from '../constants';

const UNDEAD_HOUSING_MULTIPLIERS: Record<number, number> = {
  0: 1.2,
  1: 1.6,
  2: 1.5,
  3: 1.4,
  4: 1.3,
  5: 1.2
};

function getTowerCapacityMultiplier(faj: Race, elohalott_szint = 0): number {
  if (faj === 'torpe') {
    return 1.2;
  }
  if (faj === 'elohalott') {
    return UNDEAD_HOUSING_MULTIPLIERS[elohalott_szint] ?? 1.2;
  }
  return 1;
}

export class WarCalculator {
  private static readonly MAX_UNIT_SEARCH = 10_000_000;

  // Védőerő számítás
  static calculateDefense(settings: WarSettings): number {
    const { katona, vedo = 0, tamado, ijsz, lovas, elit, faj, katonai_moral, 
            maganyos_farkas, vedelem, kitamadasi_bonusz, elohalott_szint = 0,
            szabadsagon_szovetsegesek = 0, szovetseges_ijaszok = 0,
            tudos_szazalek, lakashelyzeti_tekercs, hektar = 0, ortorony = 0 } = settings;

    // 1. LÉPÉS: Saját sereg védőértéke (őrtornyokkal együtt)
    let alapVedoero = 
      katona * UNIT_VALUES.katona.vedo +
      vedo * UNIT_VALUES.vedo.vedo +
      tamado * UNIT_VALUES.tamado.vedo +
      ijsz * UNIT_VALUES.ijsz.vedo +
      lovas * UNIT_VALUES.lovas.vedo +
      elit * UNIT_VALUES.elit.vedo;

    // Őrtorony íjászok (csak a saját sereg íjászai vonulnak toronyba)
    const ortoronyMultiplier = getTowerCapacityMultiplier(faj as Race, elohalott_szint);
    const ortoronyKapacitas = Math.round(40 * (1 + (lakashelyzeti_tekercs || 0) / 100) * ortoronyMultiplier);
    const maxOrtoronyIjsz = ortorony * ortoronyKapacitas;
    const ortoronyIjsz = Math.min(ijsz, maxOrtoronyIjsz);

    // Dokumentáció szerint: az őrtoronyban lévő íjászok védőereje megduplázódik
    const alapIjszVedo = UNIT_VALUES.ijsz.vedo; // 6
    const ortoronyIjszVedo = (faj === 'elf') ? 16 : 12; // Megduplázódik: elf 8*2=16, egyéb 6*2=12
    alapVedoero += ortoronyIjsz * (ortoronyIjszVedo - alapIjszVedo);

    // 2. LÉPÉS: Segítő seregek értékének hozzáadása
    alapVedoero += szovetseges_ijaszok * UNIT_VALUES.ijsz.vedo;

    // Minimális védőerő (hektár)
    if (alapVedoero < hektar) {
      alapVedoero = hektar;
    }

    // 3. LÉPÉS: Módosítók alkalmazása (szorzás)
    let vedoero = alapVedoero;

    // 1. Kitámadási bónusz (ork)
    if (kitamadasi_bonusz && faj === 'ork') {
      vedoero *= 1.20;
    }

    // 2. Katonai morál
    vedoero *= (katonai_moral / 100);

    // 3. Védelem varázslat
    if (vedelem) {
      vedoero *= 1.30;
    }

    // 4. Magányos farkas bónusza
    if (maganyos_farkas) {
      vedoero *= 1.40;
    }

    // 5. Őrtornyok területarányos védőértéke
    if (hektar > 0 && ortorony > 0) {
      const ortoronyArany = (ortorony / hektar) * 100;
      const multiplier = (faj === 'gnom') ? 3 : 2;
      const ortoronyVedoBonus = Math.min(ortoronyArany * multiplier, 30) / 100;
      vedoero *= (1 + ortoronyVedoBonus);
    }

    // 6. Országod hadügyi fejlettsége (hadi tekercs)
    if (tudos_szazalek > 0) {
      vedoero *= (1 + tudos_szazalek / 100);
    }

    // 7. Faji bónuszok
    const fajBonus = RACE_BONUSES[faj] || RACE_BONUSES.none;
    vedoero *= fajBonus.vedo;

    // További módosítók
    // Élőhalott szint
    if (faj === 'elohalott') {
      vedoero *= (1 + UNDEAD_LEVEL_BONUSES[elohalott_szint]);
    }

    // Szabadságon lévő szövetségesek bónusz
    if (szabadsagon_szovetsegesek > 0) {
      vedoero *= (1 + szabadsagon_szovetsegesek * 0.10);
    }

    return Math.round(vedoero);
  }

  // Támadóerő számítás
  static calculateAttack(settings: WarSettings): number {
    const { katona, tamado, ijsz, lovas, elit, faj, katonai_moral,
            maganyos_farkas, verszomj, tabornok = 0, tabornok_szemelyiseg = false,
            elohalott_szint = 0, tudos_szazalek, irany } = settings;

    let alapTamadoero = 
      katona * UNIT_VALUES.katona.tamado +
      tamado * UNIT_VALUES.tamado.tamado +
      ijsz * UNIT_VALUES.ijsz.tamado +
      lovas * UNIT_VALUES.lovas.tamado +
      elit * UNIT_VALUES.elit.tamado;

    let tamadoero = alapTamadoero;

    // Faji bónusz
    const fajBonus = RACE_BONUSES[faj] || RACE_BONUSES.none;
    tamadoero *= fajBonus.tamado;

    // Katonai morál
    tamadoero *= (katonai_moral / 100);

    // Magányos farkas
    if (maganyos_farkas) {
      tamadoero *= 1.40;
    }

    // Vérszomj varázslat
    if (verszomj) {
      tamadoero *= 1.30;
    }

    // Tábornok bónusz (személyiség +1 tábornok)
    const effectiveTabornok = Math.min(8, tabornok + (tabornok_szemelyiseg ? 1 : 0));
    tamadoero *= (1 + (GENERAL_BONUSES[effectiveTabornok] || 0));

    // Élőhalott szint
    if (faj === 'elohalott') {
      tamadoero *= (1 + UNDEAD_LEVEL_BONUSES[elohalott_szint]);
    }

    // Hadi tekercs
    if (tudos_szazalek > 0) {
      tamadoero *= (1 + tudos_szazalek / 100);
    }

    // Felfele támadás bónusz
    if (irany === 'felfele') {
      tamadoero *= 1.10;
    }

    return Math.round(tamadoero);
  }

  // Gabonaszükséglet számítás
  static calculateGrainRequirement(settings: WarSettings): number {
    const { katona, tamado, ijsz, lovas, elit, kor = 2 } = settings;
    const osszesKatona = katona + tamado + ijsz + lovas + elit;
    return osszesKatona * kor;
  }

  // Teljes háború számítás
  static calculate(settings: WarSettings): WarResults {
    const vedoero = this.calculateDefense(settings);
    const tamadoero = this.calculateAttack(settings);
    const gabonaszukseglet = this.calculateGrainRequirement(settings);
    
    const eredmeny = vedoero >= tamadoero ? 'A támadás sikertelen' : 'A támadás sikeres';
    
    return {
      vedoero,
      tamadoero,
      eredmeny,
      gabonaszukseglet
    };
  }

  static calculateRequiredArchersForDefense(settings: WarSettings, targetAttack: number): number | null {
    const requiredDefense = targetAttack + 1;
    const baseDefense = this.calculateDefense(settings);
    if (requiredDefense <= baseDefense) {
      return 0;
    }

    const baseArchers = settings.ijsz || 0;
    let high = 1;

    const defenseWith = (additional: number) =>
      this.calculateDefense({
        ...settings,
        ijsz: baseArchers + additional
      });

    let testDefense = defenseWith(high);
    while (high <= this.MAX_UNIT_SEARCH && testDefense < requiredDefense) {
      high *= 2;
      testDefense = defenseWith(high);
    }

    if (high > this.MAX_UNIT_SEARCH) {
      return null;
    }

    let low = Math.floor(high / 2);

    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      const defense = defenseWith(mid);
      if (defense >= requiredDefense) {
        high = mid;
      } else {
        low = mid + 1;
      }
    }

    return low;
  }

  static calculateRequiredCavalryForAttack(settings: WarSettings, targetDefense: number): number | null {
    const requiredAttack = targetDefense + 1; // szükséges a védelem áttöréséhez
    const baseAttack = this.calculateAttack(settings);

    if (baseAttack >= requiredAttack) {
      return 0;
    }

    const baseCavalry = settings.lovas || 0;
    let high = 1;

    const attackWith = (additional: number) =>
      this.calculateAttack({
        ...settings,
        lovas: baseCavalry + additional
      });

    let testAttack = attackWith(high);
    while (high <= this.MAX_UNIT_SEARCH && testAttack < requiredAttack) {
      high *= 2;
      testAttack = attackWith(high);
    }

    if (high > this.MAX_UNIT_SEARCH) {
      return null;
    }

    let low = Math.floor(high / 2);

    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      const attack = attackWith(mid);
      if (attack >= requiredAttack) {
        high = mid;
      } else {
        low = mid + 1;
      }
    }

    return low;
  }
}

