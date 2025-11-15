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
  // Védőerő számítás
  static calculateDefense(settings: WarSettings): number {
    const { katona, vedo = 0, tamado, ijsz, lovas, elit, faj, katonai_moral, 
            maganyos_farkas, vedelem, kitamadasi_bonusz, elohalott_szint = 0,
            szabadsagon_szovetsegesek = 0, szovetseges_ijaszok = 0,
            tudos_szazalek, lakashelyzeti_tekercs, hektar = 0, ortorony = 0,
            ijasz_plus } = settings;

    // 1. LÉPÉS: Saját sereg védőértéke (őrtornyokkal együtt)
    const baseIjszDefense = UNIT_VALUES.ijsz.vedo + (ijasz_plus ? 1 : 0);

    let alapVedoero = 
      katona * UNIT_VALUES.katona.vedo +
      vedo * UNIT_VALUES.vedo.vedo +
      tamado * UNIT_VALUES.tamado.vedo +
      ijsz * baseIjszDefense +
      lovas * UNIT_VALUES.lovas.vedo +
      elit * UNIT_VALUES.elit.vedo;

    // Őrtorony íjászok (csak a saját sereg íjászai vonulnak toronyba)
    const ortoronyMultiplier = getTowerCapacityMultiplier(faj as Race, elohalott_szint);
    const ortoronyKapacitas = Math.round(40 * (1 + (lakashelyzeti_tekercs || 0) / 100) * ortoronyMultiplier);
    const maxOrtoronyIjsz = ortorony * ortoronyKapacitas;
    const ortoronyIjsz = Math.min(ijsz, maxOrtoronyIjsz);

    // Dokumentáció szerint: az őrtoronyban lévő íjászok védőereje megduplázódik
    const elfTowerBonus = 10; // 6 -> 16 különbség
    const baseTowerBonus = 6; // 6 -> 12 különbség
    const ortoronyIjszVedo = baseIjszDefense + (faj === 'elf' ? elfTowerBonus : baseTowerBonus);
    alapVedoero += ortoronyIjsz * (ortoronyIjszVedo - baseIjszDefense);

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
            elohalott_szint = 0, tudos_szazalek, irany, lovas_plus, elit_plus } = settings;

    const baseLovasAttack = UNIT_VALUES.lovas.tamado + (lovas_plus ? 1 : 0);
    const baseElitAttack = UNIT_VALUES.elit.tamado + (elit_plus ? 1 : 0);

    let alapTamadoero = 
      katona * UNIT_VALUES.katona.tamado +
      tamado * UNIT_VALUES.tamado.tamado +
      ijsz * UNIT_VALUES.ijsz.tamado +
      lovas * baseLovasAttack +
      elit * baseElitAttack;

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
    const { katona = 0, vedo = 0, tamado = 0, ijsz = 0, lovas = 0, elit = 0, kor = 2, tanya = 0 } = settings;
    const osszesEgyseg = katona + vedo + tamado + ijsz + lovas + elit;
    if (osszesEgyseg <= 0) {
      return 0;
    }
    const fogyasztasPerKor = Math.ceil(osszesEgyseg / 5); // 1 bála -> 5 egység
    const totalConsumption = fogyasztasPerKor * kor;
    const termelesPerKor = tanya * 50;
    const totalProduction = termelesPerKor * kor;
    const deficit = totalConsumption - totalProduction;
    return deficit > 0 ? deficit : 0;
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
}

