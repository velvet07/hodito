import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { WarSettings, WarResults } from '../types';
import { WarCalculator } from '../calculations/war-calculator';
import { formatNumber } from '../utils/formatters';
import { parseKristalygomb, parseEpuletlistaForWar } from '../utils/war-parsers';
import { Race, GENERAL_BONUSES, getHadiTekercsMax, getLakashelyzetiTekercsMax, getEffectiveGeneralMax } from '../constants';
import { initTheme, setStoredTheme, Theme } from '../utils/theme';

// Segéd komponensek
interface UnitInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  id: string;
}

const FIELD_WIDTH = '72px';

const UnitInput: React.FC<UnitInputProps> = ({ label, value, onChange, id }) => {
  return (
    <div className="flex items-center justify-between gap-1.5">
      <label className="text-xs font-medium label-text whitespace-nowrap">
        {label}:
      </label>
      <input
        type="text"
        id={id}
        value={value || ''}
        onChange={(e) => {
          const num = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
          onChange(num);
        }}
        className="input input-bordered input-sm text-xs"
        style={{ width: FIELD_WIDTH }}
      />
    </div>
  );
};

interface CheckboxInputProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const CheckboxInput: React.FC<CheckboxInputProps> = ({ label, checked, onChange, disabled = false }) => {
  return (
    <label
      className={`flex items-center gap-2 text-xs cursor-pointer ${
        disabled ? 'text-base-content/40 cursor-not-allowed' : 'text-base-content'
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="checkbox checkbox-primary"
        style={{ height: '14px', width: '14px' }}
      />
      <span>{label}</span>
    </label>
  );
};

const WarCalculatorComponent: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => initTheme());

  useEffect(() => {
    setStoredTheme(theme);
  }, [theme]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent | CustomEvent) => {
      if (e instanceof StorageEvent) {
        if (e.key === 'hodito-theme' && e.newValue) {
          setTheme(e.newValue as Theme);
        }
      } else if (e instanceof CustomEvent) {
        if (e.detail && (e.detail === 'light' || e.detail === 'dark')) {
          setTheme(e.detail as Theme);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange as EventListener);
    window.addEventListener('themechange', handleStorageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange as EventListener);
      window.removeEventListener('themechange', handleStorageChange as EventListener);
    };
  }, []);

  const [vedoSettings, setVedoSettings] = useState<WarSettings>({
    katona: 0,
    vedo: 0,
    tamado: 0,
    ijsz: 0,
    lovas: 0,
    elit: 0,
    faj: 'none',
    katonai_moral: 75,
    maganyos_farkas: false,
    vedelem: true,
    kitamadasi_bonusz: false,
    elohalott_szint: 5,
    szabadsagon_szovetsegesek: 0,
    szovetseges_ijaszok: 0,
    tudos_szazalek: 0,
    lakashelyzeti_tekercs: 0,
    hektar: 0,
    ortorony: 0,
    tudos: false,
    tudomany_honapja: false
  });

  const [tamadoSettings, setTamadoSettings] = useState<WarSettings>({
    katona: 0,
    tamado: 0,
    ijsz: 0,
    lovas: 0,
    elit: 0,
    faj: 'none',
    katonai_moral: 75,
    maganyos_farkas: false,
    verszomj: true,
    tabornok: 0,
    elohalott_szint: 0,
    tudos_szazalek: 0,
    lakashelyzeti_tekercs: 0,
    kor: 2,
    irany: 'felfele',
    tudos: false,
    tudomany_honapja: false,
    tabornok_szemelyiseg: false
  });

  const [vedoKristalygomb, setVedoKristalygomb] = useState('');
  const [vedoEpuletlista, setVedoEpuletlista] = useState('');
  const [tamadoKristalygomb, setTamadoKristalygomb] = useState('');
  const [tamadoEpuletlista, setTamadoEpuletlista] = useState('');
  const [vedoBarakkCount, setVedoBarakkCount] = useState<number | null>(null);
  const [tamadoBarakkCount, setTamadoBarakkCount] = useState<number | null>(null);
  const [archerSuggestion, setArcherSuggestion] = useState<{ total: number; added: number } | null>(null);
  const [cavalrySuggestion, setCavalrySuggestion] = useState<{ total: number; added: number } | null>(null);
  const [archerCalcError, setArcherCalcError] = useState<string | null>(null);
  const [cavalryCalcError, setCavalryCalcError] = useState<string | null>(null);

  const handleTudomanyHonapjaToggle = useCallback((value: boolean) => {
    setVedoSettings(prev => (prev.tudomany_honapja === value ? prev : { ...prev, tudomany_honapja: value }));
    setTamadoSettings(prev => (prev.tudomany_honapja === value ? prev : { ...prev, tudomany_honapja: value }));
  }, []);

  const handleVedoImport = useCallback(() => {
    const kristalygombData = parseKristalygomb(vedoKristalygomb, 'vedo');
    const hasKristaly = vedoKristalygomb.trim().length > 0;
    const hasEpuletlista = vedoEpuletlista.trim().length > 0;
    const epuletlistaData = hasEpuletlista ? parseEpuletlistaForWar(vedoEpuletlista) : {};
    const { barakk, ...rest } = epuletlistaData;
    setVedoBarakkCount(barakk ?? null);

    setVedoSettings(prev => {
      const next: WarSettings = { ...prev, ...kristalygombData };

      if (hasEpuletlista) {
        if (!hasKristaly) {
          Object.assign(next, rest);
        } else if (typeof rest.ortorony === 'number') {
          next.ortorony = rest.ortorony;
        }
      } else {
        const baseHektar = next.hektar ?? 0;
        if (baseHektar > 0) {
          next.ortorony = Math.floor(baseHektar * 0.1);
        }
      }

      if (!hasKristaly) {
        const effectiveBarakk = barakk ?? 0;
        if (effectiveBarakk > 0) {
          const housing = next.lakashelyzeti_tekercs ?? 0;
          next.ijsz = Math.floor(effectiveBarakk * 40 * (1 + housing / 100));
        }
      }

      return next;
    });
  }, [vedoKristalygomb, vedoEpuletlista]);

  const handleTamadoImport = useCallback(() => {
    const kristalygombData = parseKristalygomb(tamadoKristalygomb, 'tamado');
    const hasKristaly = tamadoKristalygomb.trim().length > 0;
    const hasEpuletlista = tamadoEpuletlista.trim().length > 0;
    const epuletlistaData = hasEpuletlista ? parseEpuletlistaForWar(tamadoEpuletlista) : {};
    const { barakk, ...rest } = epuletlistaData;
    setTamadoBarakkCount(barakk ?? null);

    setTamadoSettings(prev => {
      const next: WarSettings = { ...prev, ...kristalygombData };

      if (hasEpuletlista) {
        if (!hasKristaly) {
          Object.assign(next, rest);
        } else if (typeof rest.ortorony === 'number') {
          next.ortorony = rest.ortorony;
        }
      }

      if (!hasKristaly) {
        const effectiveBarakk = barakk ?? 0;
        if (effectiveBarakk > 0) {
          const housing = next.lakashelyzeti_tekercs ?? 0;
          next.lovas = Math.floor(effectiveBarakk * 40 * (1 + housing / 100));
        }
      }

      return next;
    });
  }, [tamadoKristalygomb, tamadoEpuletlista]);

  const handleVedoClear = useCallback(() => {
    setVedoKristalygomb('');
    setVedoEpuletlista('');
    setVedoSettings({
      katona: 0,
      vedo: 0,
      tamado: 0,
      ijsz: 0,
      lovas: 0,
      elit: 0,
      faj: 'none',
      katonai_moral: 75,
      maganyos_farkas: false,
      vedelem: true,
      kitamadasi_bonusz: false,
      elohalott_szint: 5,
      szabadsagon_szovetsegesek: 0,
      szovetseges_ijaszok: 0,
      tudos_szazalek: 0,
      lakashelyzeti_tekercs: 0,
      hektar: 0,
      ortorony: 0,
      tudos: false,
      tudomany_honapja: false
    });
    setVedoBarakkCount(null);
  }, []);

  const handleTamadoClear = useCallback(() => {
    setTamadoKristalygomb('');
    setTamadoEpuletlista('');
    setTamadoSettings({
      katona: 0,
      tamado: 0,
      ijsz: 0,
      lovas: 0,
      elit: 0,
      faj: 'none',
      katonai_moral: 75,
      maganyos_farkas: false,
      verszomj: true,
      tabornok: 0,
      elohalott_szint: 0,
      tudos_szazalek: 0,
      kor: 2,
      irany: 'felfele',
      tudos: false,
      tudomany_honapja: false,
      tabornok_szemelyiseg: false,
      lakashelyzeti_tekercs: 0
    });
    setTamadoBarakkCount(null);
  }, []);

  useEffect(() => {
    setVedoSettings(prev => {
      if (prev.faj === 'none') return prev;
      const max = getHadiTekercsMax(prev.faj, prev.tudomany_honapja ?? false, prev.tudos ?? false);
      return prev.tudos_szazalek === max ? prev : { ...prev, tudos_szazalek: max };
    });
  }, [vedoSettings.faj, vedoSettings.tudos, vedoSettings.tudomany_honapja]);

  useEffect(() => {
    setTamadoSettings(prev => {
      if (prev.faj === 'none') return prev;
      const max = getHadiTekercsMax(prev.faj, prev.tudomany_honapja ?? false, prev.tudos ?? false);
      return prev.tudos_szazalek === max ? prev : { ...prev, tudos_szazalek: max };
    });
  }, [tamadoSettings.faj, tamadoSettings.tudos, tamadoSettings.tudomany_honapja]);

  useEffect(() => {
    setVedoSettings(prev => {
      if (prev.faj === 'none') return prev;
      const max = getLakashelyzetiTekercsMax(prev.faj, prev.tudomany_honapja ?? false);
      return prev.lakashelyzeti_tekercs === max ? prev : { ...prev, lakashelyzeti_tekercs: max };
    });
  }, [vedoSettings.faj, vedoSettings.tudomany_honapja]);

  useEffect(() => {
    setTamadoSettings(prev => {
      if (prev.faj === 'none') return prev;
      const max = getLakashelyzetiTekercsMax(prev.faj, prev.tudomany_honapja ?? false);
      return prev.lakashelyzeti_tekercs === max ? prev : { ...prev, lakashelyzeti_tekercs: max };
    });
  }, [tamadoSettings.faj, tamadoSettings.tudomany_honapja]);

  useEffect(() => {
    if (vedoBarakkCount === null) return;
    if (vedoKristalygomb.trim().length > 0) return;
    setVedoSettings(prev => {
      const lakas = prev.lakashelyzeti_tekercs || 0;
      const maxCapacity = Math.floor(vedoBarakkCount * 40 * (1 + lakas / 100));
      if (maxCapacity <= 0) return prev;
      const current = prev.ijsz || 0;
      if (current !== 0 && current <= maxCapacity) {
        return prev;
      }
      return { ...prev, ijsz: maxCapacity };
    });
  }, [vedoBarakkCount, vedoSettings.lakashelyzeti_tekercs, vedoKristalygomb]);

  useEffect(() => {
    if (tamadoBarakkCount === null) return;
    if (tamadoKristalygomb.trim().length > 0) return;
    setTamadoSettings(prev => {
      const lakas = prev.lakashelyzeti_tekercs || 0;
      const maxCapacity = Math.floor(tamadoBarakkCount * 40 * (1 + lakas / 100));
      if (maxCapacity <= 0) return prev;
      const current = prev.lovas || 0;
      if (current !== 0 && current <= maxCapacity) {
        return prev;
      }
      return { ...prev, lovas: maxCapacity };
    });
  }, [tamadoBarakkCount, tamadoSettings.lakashelyzeti_tekercs, tamadoKristalygomb]);

  useEffect(() => {
    setTamadoSettings(prev => {
      const max = getEffectiveGeneralMax(prev.faj, prev.tabornok_szemelyiseg ?? false);
      if ((prev.tabornok ?? 0) === max) {
        return prev;
      }
      return { ...prev, tabornok: max };
    });
  }, [tamadoSettings.faj, tamadoSettings.tabornok_szemelyiseg]);

  const updateVedoSettings = useCallback((updates: Partial<WarSettings>) => {
    setVedoSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const updateTamadoSettings = useCallback((updates: Partial<WarSettings>) => {
    setTamadoSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const vedoResults = useMemo(() => WarCalculator.calculate(vedoSettings), [vedoSettings]);
  const tamadoResults = useMemo(() => WarCalculator.calculate(tamadoSettings), [tamadoSettings]);

  const vedoWins = vedoResults.vedoero >= tamadoResults.tamadoero;
  const hasVedoData =
    Boolean(
      vedoSettings.katona ||
        vedoSettings.vedo ||
        vedoSettings.tamado ||
        vedoSettings.ijsz ||
        vedoSettings.lovas ||
        vedoSettings.elit ||
        vedoSettings.hektar ||
        vedoSettings.ortorony ||
        vedoKristalygomb.trim().length ||
        vedoEpuletlista.trim().length
    );
  const hasTamadoData =
    Boolean(
      tamadoSettings.katona ||
        tamadoSettings.tamado ||
        tamadoSettings.ijsz ||
        tamadoSettings.lovas ||
        tamadoSettings.elit ||
        tamadoKristalygomb.trim().length ||
        tamadoEpuletlista.trim().length
    );
  const vedoBorderClass = hasVedoData ? (vedoWins ? 'border-success' : 'border-error') : 'border-base-300';
  const tamadoBorderClass = hasTamadoData ? (!vedoWins ? 'border-success' : 'border-error') : 'border-base-300';
  const tamadoTabornokMax = useMemo(
    () => getEffectiveGeneralMax(tamadoSettings.faj, tamadoSettings.tabornok_szemelyiseg ?? false),
    [tamadoSettings.faj, tamadoSettings.tabornok_szemelyiseg]
  );
  const tabornokOptions = useMemo(
    () => Array.from({ length: tamadoTabornokMax + 1 }, (_, index) => index),
    [tamadoTabornokMax]
  );

  const handleArcherRequirement = useCallback(() => {
    setArcherCalcError(null);
    if (!hasVedoData) {
      setArcherSuggestion(null);
      setArcherCalcError('Add meg a védő adatait a számításhoz.');
      return;
    }
    if (!hasTamadoData) {
      setArcherSuggestion(null);
      setArcherCalcError('Add meg a támadó adatait a számításhoz.');
      return;
    }
    const result = WarCalculator.calculateRequiredArchersForDefense(vedoSettings, tamadoResults.tamadoero);
    if (result === null) {
      setArcherSuggestion(null);
      setArcherCalcError('A számítás nem sikerült. Próbáld meg pontosítani az adatokat.');
      return;
    }
    const newTotal = (vedoSettings.ijsz || 0) + result;
    setArcherSuggestion({ total: newTotal, added: result });
    setVedoSettings(prev => ({ ...prev, ijsz: newTotal }));
  }, [hasVedoData, hasTamadoData, vedoSettings, tamadoResults.tamadoero]);

  const handleCavalryRequirement = useCallback(() => {
    setCavalryCalcError(null);
    if (!hasVedoData) {
      setCavalrySuggestion(null);
      setCavalryCalcError('Add meg a védő adatait a számításhoz.');
      return;
    }
    if (!hasTamadoData) {
      setCavalrySuggestion(null);
      setCavalryCalcError('Add meg a támadó adatait a számításhoz.');
      return;
    }
    const result = WarCalculator.calculateRequiredCavalryForAttack(tamadoSettings, vedoResults.vedoero);
    if (result === null) {
      setCavalrySuggestion(null);
      setCavalryCalcError('A számítás nem sikerült. Próbáld meg pontosítani az adatokat.');
      return;
    }
    const newTotal = (tamadoSettings.lovas || 0) + result;
    setCavalrySuggestion({ total: newTotal, added: result });
    setTamadoSettings(prev => ({ ...prev, lovas: newTotal }));
  }, [hasVedoData, hasTamadoData, tamadoSettings, vedoResults.vedoero]);

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <header className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-base-content mb-2">Háború</h1>
            <p className="text-base-content/70">Hódító.hu online stratégia játék csata kalkulátor</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="btn btn-ghost btn-sm gap-2"
              title={theme === 'light' ? 'Sötét mód' : 'Világos mód'}
              type="button"
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
            <a href="docs/war-guide.html" className="btn btn-outline btn-sm gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              Leírás
            </a>
            <a href="buildings.html" className="btn btn-primary btn-sm gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              Épületek
            </a>
          </div>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {/* Védő oszlop */}
          <div className={`card bg-base-100 shadow-xl border-2 ${vedoBorderClass}`}>
            <div className="card-body">
              <h2 className="card-title text-xl">
                Védők
              </h2>
              <div className="divider"></div>
            
            <div className="space-y-3">
              {/* Védőerő */}
              <div className="pb-2">
                <div className="divider"></div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium label-text">Védőerő:</span>
                  <span className={`text-lg font-bold ${vedoWins ? 'text-success' : 'text-error'}`}>
                    {formatNumber(vedoResults.vedoero)}
                  </span>
                </div>
              </div>

              {/* Katonai egységek */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-base-content mb-2">Katonai egységek</h3>
                <div className="space-y-1.5">
                  <UnitInput label="Katona" value={vedoSettings.katona} onChange={(v) => updateVedoSettings({ katona: v })} id="vedo_katona" />
                  <UnitInput label="Védő" value={vedoSettings.vedo || 0} onChange={(v) => updateVedoSettings({ vedo: v })} id="vedo_vedo" />
                  <UnitInput label="Íjász" value={vedoSettings.ijsz} onChange={(v) => updateVedoSettings({ ijsz: v })} id="vedo_ijsz" />
                  <UnitInput label="Lovas" value={vedoSettings.lovas} onChange={(v) => updateVedoSettings({ lovas: v })} id="vedo_lovas" />
                  <UnitInput label="Elit" value={vedoSettings.elit} onChange={(v) => updateVedoSettings({ elit: v })} id="vedo_elit" />
                </div>
              </div>

              {/* Katonai morál */}
              <div className="pt-2">
                <div className="divider"></div>
                <div className="flex items-center justify-between gap-1.5">
                  <label className="text-xs font-medium label-text whitespace-nowrap">Katonai morál:</label>
                  <div className="flex items-center gap-1.5" style={{ width: FIELD_WIDTH }}>
                    <input
                      type="text"
                      value={vedoSettings.katonai_moral}
                      onChange={(e) => updateVedoSettings({ katonai_moral: parseInt(e.target.value) || 75 })}
                      className="input input-bordered input-sm w-full text-xs"
                      style={{ width: '100%' }}
                    />
                    <span className="text-xs text-base-content/50">%</span>
                  </div>
                </div>
              </div>

              {/* Faj */}
              <div className="pt-2">
                <div className="divider"></div>
                <label className="label">
                  <span className="label-text text-xs">Faj:</span>
                </label>
                <select
                  value={vedoSettings.faj}
                  onChange={(e) => updateVedoSettings({ faj: e.target.value as Race })}
                  className="select select-bordered select-sm w-full text-xs"
                >
                  <option value="none">válassz</option>
                  <option value="elf">Elf</option>
                  <option value="ork">Ork</option>
                  <option value="felelf">Félelf</option>
                  <option value="torpe">Törpe</option>
                  <option value="gnom">Gnóm</option>
                  <option value="orias">Óriás</option>
                  <option value="elohalott">Élőhalott</option>
                  <option value="ember">Ember</option>
                </select>
              </div>

              {/* Speciális képességek */}
              <div className="pt-2">
                <div className="divider"></div>
                <h3 className="text-sm font-semibold text-base-content mb-2">Speciális képességek</h3>
                <div className="space-y-1.5">
                  <CheckboxInput
                    label="Tudós (Hadi tekercs)"
                    checked={vedoSettings.tudos || false}
                    onChange={(checked) => updateVedoSettings({ tudos: checked })}
                  />
                  <CheckboxInput
                    label="Tudomány hónapja"
                    checked={vedoSettings.tudomany_honapja || false}
                    onChange={handleTudomanyHonapjaToggle}
                  />
                  <div className="flex items-center justify-between gap-1.5">
                    <label className="text-xs font-medium label-text whitespace-nowrap">Hadi tekercs:</label>
                  <div className="flex items-center gap-1.5" style={{ width: FIELD_WIDTH }}>
                      <input
                        type="text"
                        value={vedoSettings.tudos_szazalek}
                        onChange={(e) => updateVedoSettings({ tudos_szazalek: parseInt(e.target.value) || 0 })}
                      className="input input-bordered input-sm w-full text-xs"
                      />
                      <span className="text-xs text-base-content/50">%</span>
                    </div>
                  </div>
                  <CheckboxInput
                    label="Magányos farkas"
                    checked={vedoSettings.maganyos_farkas}
                    onChange={(checked) => updateVedoSettings({ maganyos_farkas: checked })}
                  />
                  <CheckboxInput
                    label="Védelem varázslat"
                    checked={vedoSettings.vedelem || false}
                    onChange={(checked) => updateVedoSettings({ vedelem: checked })}
                  />
                </div>
              </div>

              {/* Védő specialitások */}
              <div className="pt-2">
                <div className="divider"></div>
                <h3 className="text-sm font-semibold text-base-content mb-2">Védő specialitások</h3>
                <div className="space-y-1.5">
                  <UnitInput label="Hektár" value={vedoSettings.hektar || 0} onChange={(v) => updateVedoSettings({ hektar: v })} id="vedo_hektar" />
                  <UnitInput label="Őrtorony" value={vedoSettings.ortorony || 0} onChange={(v) => updateVedoSettings({ ortorony: v })} id="vedo_ortorony" />
                  <UnitInput label="Szövetséges íjászok" value={vedoSettings.szovetseges_ijaszok || 0} onChange={(v) => updateVedoSettings({ szovetseges_ijaszok: v })} id="vedo_szovetseges_ijaszok" />
                  <CheckboxInput
                    label="Kitámadási bónusz"
                    checked={vedoSettings.kitamadasi_bonusz || false}
                    onChange={(checked) => updateVedoSettings({ kitamadasi_bonusz: checked })}
                    disabled={vedoSettings.faj !== 'ork'}
                  />
                  <div className="flex items-center justify-between gap-1.5">
                    <label className="text-xs font-medium label-text whitespace-nowrap">Élőhalott szintje:</label>
                    <select
                      value={vedoSettings.elohalott_szint || 5}
                      onChange={(e) => updateVedoSettings({ elohalott_szint: parseInt(e.target.value) })}
                      disabled={vedoSettings.faj !== 'elohalott'}
                    className="select select-bordered select-sm text-xs"
                    style={{ width: FIELD_WIDTH }}
                    >
                      <option value="0">0</option>
                      <option value="1">1.</option>
                      <option value="2">2.</option>
                      <option value="3">3.</option>
                      <option value="4">4.</option>
                      <option value="5">5.</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between gap-1.5">
                    <label className="text-xs font-medium label-text whitespace-nowrap">Szabadságon lévő szövetségesek:</label>
                    <select
                      value={vedoSettings.szabadsagon_szovetsegesek || 0}
                      onChange={(e) => updateVedoSettings({ szabadsagon_szovetsegesek: parseInt(e.target.value) })}
                      disabled={vedoSettings.maganyos_farkas}
                    className="select select-bordered select-sm text-xs"
                    style={{ width: FIELD_WIDTH }}
                    >
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between gap-1.5">
                    <label className="text-xs font-medium label-text whitespace-nowrap">Lakáshelyzeti tekercs:</label>
                  <div className="flex items-center gap-1.5" style={{ width: FIELD_WIDTH }}>
                      <input
                        type="text"
                        value={vedoSettings.lakashelyzeti_tekercs}
                        onChange={(e) => updateVedoSettings({ lakashelyzeti_tekercs: parseInt(e.target.value) || 0 })}
                      className="input input-bordered input-sm w-full text-xs"
                      />
                      <span className="text-xs text-base-content/50">%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Import mezők */}
              <div className="pt-2">
                <div className="divider"></div>
                <h3 className="text-sm font-semibold text-base-content mb-2">Importálás</h3>
                <div className="space-y-2">
                  <div>
                    <label className="label">
                      <span className="label-text text-xs">Kristálygömb:</span>
                    </label>
                    <textarea
                      rows={5}
                      value={vedoKristalygomb}
                      onChange={(e) => setVedoKristalygomb(e.target.value)}
                      className="textarea textarea-bordered textarea-sm w-full text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text text-xs">Épületlista:</span>
                    </label>
                    <textarea
                      rows={5}
                      value={vedoEpuletlista}
                      onChange={(e) => setVedoEpuletlista(e.target.value)}
                      className="textarea textarea-bordered textarea-sm w-full text-xs font-mono"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end mt-4 gap-3 w-full">
                  <button
                    onClick={handleVedoClear}
                    className="btn btn-error btn-sm"
                    style={{ width: '30%' }}
                    type="button"
                  >
                    Törlés
                  </button>
                  <button
                    onClick={handleVedoImport}
                    className="btn btn-primary btn-sm"
                    style={{ width: '65%' }}
                    type="button"
                  >
                    Feldolgozás
                  </button>
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* Támadó oszlop */}
          <div className={`card bg-base-100 shadow-xl border-2 ${tamadoBorderClass}`}>
            <div className="card-body">
              <h2 className="card-title text-xl">
                Támadók
              </h2>
              <div className="divider"></div>
            
            <div className="space-y-3">
              {/* Támadóerő */}
              <div className="pb-2">
                <div className="divider"></div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium label-text">Támadóerő:</span>
                  <span className={`text-lg font-bold ${!vedoWins ? 'text-success' : 'text-error'}`}>
                    {formatNumber(tamadoResults.tamadoero)}
                  </span>
                </div>
              </div>

              {/* Katonai egységek */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-base-content mb-2">Katonai egységek</h3>
                <div className="space-y-1.5">
                  <UnitInput label="Katona" value={tamadoSettings.katona} onChange={(v) => updateTamadoSettings({ katona: v })} id="tamado_katona" />
                  <UnitInput label="Támadó" value={tamadoSettings.tamado} onChange={(v) => updateTamadoSettings({ tamado: v })} id="tamado_tamado" />
                  <UnitInput label="Íjász" value={tamadoSettings.ijsz} onChange={(v) => updateTamadoSettings({ ijsz: v })} id="tamado_ijsz" />
                  <UnitInput label="Lovas" value={tamadoSettings.lovas} onChange={(v) => updateTamadoSettings({ lovas: v })} id="tamado_lovas" />
                  <UnitInput label="Elit" value={tamadoSettings.elit} onChange={(v) => updateTamadoSettings({ elit: v })} id="tamado_elit" />
                </div>
              </div>

              {/* Katonai morál */}
              <div className="pt-2">
                <div className="divider"></div>
                <div className="flex items-center justify-between gap-1.5">
                  <label className="text-xs font-medium label-text whitespace-nowrap">Katonai morál:</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={tamadoSettings.katonai_moral}
                      onChange={(e) => updateTamadoSettings({ katonai_moral: parseInt(e.target.value) || 75 })}
                      className="input input-bordered input-sm w-full max-w-[6ch] text-xs"
                    />
                    <span className="text-xs text-base-content/50">%</span>
                  </div>
                </div>
              </div>

              {/* Faj */}
              <div className="pt-2">
                <div className="divider"></div>
                <label className="label">
                  <span className="label-text text-xs">Faj:</span>
                </label>
                <select
                  value={tamadoSettings.faj}
                  onChange={(e) => updateTamadoSettings({ faj: e.target.value as Race })}
                  className="select select-bordered select-sm w-full text-xs"
                >
                  <option value="none">válassz</option>
                  <option value="elf">Elf</option>
                  <option value="ork">Ork</option>
                  <option value="felelf">Félelf</option>
                  <option value="torpe">Törpe</option>
                  <option value="gnom">Gnóm</option>
                  <option value="orias">Óriás</option>
                  <option value="elohalott">Élőhalott</option>
                  <option value="ember">Ember</option>
                </select>
              </div>

              {/* Speciális képességek */}
              <div className="pt-2">
                <div className="divider"></div>
                <h3 className="text-sm font-semibold text-base-content mb-2">Speciális képességek</h3>
                <div className="space-y-2">
                  <div className="space-y-1.5">
                    <CheckboxInput
                      label="Tudós (Hadi tekercs)"
                      checked={tamadoSettings.tudos || false}
                      onChange={(checked) => updateTamadoSettings({ tudos: checked })}
                    />
                  <CheckboxInput
                    label="Tudomány hónapja"
                    checked={tamadoSettings.tudomany_honapja || false}
                    onChange={handleTudomanyHonapjaToggle}
                  />
                    <div className="flex items-center justify-between gap-1.5">
                      <label className="text-xs font-medium label-text whitespace-nowrap">Hadi tekercs:</label>
                      <div className="flex items-center gap-1.5" style={{ width: FIELD_WIDTH }}>
                        <input
                          type="text"
                          value={tamadoSettings.tudos_szazalek}
                          onChange={(e) => updateTamadoSettings({ tudos_szazalek: parseInt(e.target.value) || 0 })}
                          className="input input-bordered input-sm w-full text-xs"
                        />
                        <span className="text-xs text-base-content/50">%</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <CheckboxInput
                      label="Magányos farkas"
                      checked={tamadoSettings.maganyos_farkas}
                      onChange={(checked) => updateTamadoSettings({ maganyos_farkas: checked })}
                    />
                    <CheckboxInput
                      label="Vérszomj varázslat"
                      checked={tamadoSettings.verszomj || false}
                      onChange={(checked) => updateTamadoSettings({ verszomj: checked })}
                    />
                  </div>
                </div>
              </div>

              {/* Támadó specialitások */}
              <div className="pt-2">
                <div className="divider"></div>
                <h3 className="text-sm font-semibold text-base-content mb-2">Támadó specialitások</h3>
                <div className="space-y-1.5">
                  <CheckboxInput
                    label="Tábornok személyiség (+1 tábornok)"
                    checked={tamadoSettings.tabornok_szemelyiseg || false}
                    onChange={(checked) => updateTamadoSettings({ tabornok_szemelyiseg: checked })}
                  />
                  <div className="flex items-center justify-between gap-1.5">
                    <label className="text-xs font-medium label-text whitespace-nowrap">Tábornok:</label>
                    <select
                      value={tamadoSettings.tabornok || 0}
                      onChange={(e) => updateTamadoSettings({ tabornok: parseInt(e.target.value) })}
                      className="select select-bordered select-sm text-xs"
                      style={{ width: FIELD_WIDTH }}
                    >
                      {tabornokOptions.map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Támadó beállítások */}
              <div className="pt-2">
                <div className="divider"></div>
                <h3 className="text-sm font-semibold text-base-content mb-2">Támadó beállítások</h3>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-1.5">
                    <label className="text-xs font-medium label-text whitespace-nowrap">Kör:</label>
                    <input
                      type="text"
                      value={tamadoSettings.kor || 2}
                      onChange={(e) => updateTamadoSettings({ kor: parseInt(e.target.value) || 2 })}
                      className="input input-bordered input-sm text-xs"
                      style={{ width: FIELD_WIDTH }}
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text text-xs">Irány:</span>
                    </label>
                    <div className="space-y-1">
                      <label className="flex items-center gap-2 text-xs cursor-pointer">
                        <input
                          type="radio"
                          name="tamado_irany"
                          value="felfele"
                          checked={tamadoSettings.irany === 'felfele'}
                          onChange={() => updateTamadoSettings({ irany: 'felfele' })}
                          className="radio radio-primary"
                          style={{ width: '14px', height: '14px' }}
                        />
                        <span>Felfele (nagyobb értékű ország)</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs cursor-pointer">
                        <input
                          type="radio"
                          name="tamado_irany"
                          value="lefele"
                          checked={tamadoSettings.irany === 'lefele'}
                          onChange={() => updateTamadoSettings({ irany: 'lefele' })}
                          className="radio radio-primary"
                          style={{ width: '14px', height: '14px' }}
                        />
                        <span>Lefele (kisebb értékű ország)</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Import mezők */}
              <div className="pt-2">
                <div className="divider"></div>
                <h3 className="text-sm font-semibold text-base-content mb-2">Importálás</h3>
                <div className="space-y-2">
                  <div>
                    <label className="label">
                      <span className="label-text text-xs">Kristálygömb:</span>
                    </label>
                    <textarea
                      rows={5}
                      value={tamadoKristalygomb}
                      onChange={(e) => setTamadoKristalygomb(e.target.value)}
                      className="textarea textarea-bordered textarea-sm w-full text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text text-xs">Épületlista:</span>
                    </label>
                    <textarea
                      rows={5}
                      value={tamadoEpuletlista}
                      onChange={(e) => setTamadoEpuletlista(e.target.value)}
                      className="textarea textarea-bordered textarea-sm w-full text-xs font-mono"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end mt-4 gap-3 w-full">
                  <button
                    onClick={handleTamadoClear}
                    className="btn btn-error btn-sm"
                    style={{ width: '30%' }}
                    type="button"
                  >
                    Törlés
                  </button>
                  <button
                    onClick={handleTamadoImport}
                    className="btn btn-primary btn-sm"
                    style={{ width: '65%' }}
                    type="button"
                  >
                    Feldolgozás
                  </button>
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* Eredmény oszlop */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-xl">
                Eredmény
              </h2>
              <div className="divider"></div>
            
            <div className="space-y-4">
              <div className="flex justify-center">
                <div
                  className={`inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-semibold tracking-wide ${
                    vedoWins ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
                  }`}
                >
                  {vedoWins ? 'A támadás sikertelen' : 'A támadás sikeres'}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-base-content mb-2">Védőerő</h3>
                  <p className={`text-xl font-bold ${vedoWins ? 'text-success' : 'text-error'}`}>
                    {formatNumber(vedoResults.vedoero)}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-base-content mb-2">Támadóerő</h3>
                  <p className={`text-xl font-bold ${!vedoWins ? 'text-success' : 'text-error'}`}>
                    {formatNumber(tamadoResults.tamadoero)}
                  </p>
                </div>

                <div className="bg-base-200/70 rounded-lg p-3">
                  <p className="text-xs font-semibold text-base-content/70 uppercase tracking-wide">Gabonaszükséglet</p>
                  <p className="text-sm text-base-content">
                    Támadó: <span className="font-semibold">{formatNumber(tamadoResults.gabonaszukseglet)} bála</span>
                  </p>
                </div>

                <div className="divider"></div>
                <div className="space-y-3">
                  <div>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm w-full justify-between"
                      onClick={handleArcherRequirement}
                    >
                      Mennyi íjász kell a védéshez?
                    </button>
                    {archerCalcError && <p className="text-xs text-error mt-1">{archerCalcError}</p>}
                    {archerSuggestion && !archerCalcError && (
                      <p className="text-xs text-base-content mt-1">
                        {archerSuggestion.added === 0
                          ? 'A jelenlegi íjász mennyiség elegendő a támadás kivédéséhez.'
                          : `Új íjász összlétszám: ${formatNumber(archerSuggestion.total)} fő ( +${formatNumber(
                              archerSuggestion.added
                            )} ).`}
                      </p>
                    )}
                  </div>
                  <div>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm w-full justify-between"
                      onClick={handleCavalryRequirement}
                    >
                      Mennyi lovas kell a beütéshez?
                    </button>
                    {cavalryCalcError && <p className="text-xs text-error mt-1">{cavalryCalcError}</p>}
                    {cavalrySuggestion && !cavalryCalcError && (
                      <p className="text-xs text-base-content mt-1">
                        {cavalrySuggestion.added === 0
                          ? 'A jelenlegi lovas mennyiség elegendő a védelem áttöréséhez.'
                          : `Új lovas összlétszám: ${formatNumber(cavalrySuggestion.total)} fő ( +${formatNumber(
                              cavalrySuggestion.added
                            )} ).`}
                      </p>
                    )}
                  </div>
                </div>

              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarCalculatorComponent;
