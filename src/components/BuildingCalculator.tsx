import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { BuildingData, CalculationSettings, Scrolls, Race } from '../types';
import { BuildingCalculator } from '../calculations/building-calculator';
import { parseBuildingList } from '../utils/parsers';
import { formatNumber, formatPercent } from '../utils/formatters';
import { BuildingInput } from './BuildingInput';
import { 
  getLakashelyzetiTekercsMax, 
  getMezogazdasagTekercsMax, 
  getBanyaszatTekercsMax 
} from '../constants';
import { initTheme, setStoredTheme, getStoredTheme, Theme } from '../utils/theme';
import { 
  saveBuildings, 
  loadBuildings, 
  saveSettings, 
  loadSettings, 
  saveScrolls, 
  loadScrolls,
  saveBuildingListText,
  loadBuildingListText,
  clearAllData 
} from '../utils/storage';

// Alapértelmezett értékek
const defaultBuildings: BuildingData = {
  hektar: 0,
  szabad_terulet: 0,
  haz: 0,
  barakk: 0,
  kovacsmuhely: 0,
  tanya: 0,
  konyvtar: 0,
  raktar: 0,
  banyak: 0,
  ortorony: 0,
  kocsma: 0,
  templom: 0,
  korhaz: 0,
  piac: 0,
  bank: 0,
  fatelep: 0,
  kobanya: 0,
  fembanya: 0,
  agyagbanya: 0,
  dragakobanya: 0,
  erdo: 0,
  kolelohely: 0,
  femlelohely: 0,
  agyaglelohely: 0,
  dragakolelohely: 0
};

const defaultSettings: CalculationSettings = {
  faj: 'none',
  szemelyisegek: [],
  idoszakok: [],
  skip_tekercs: true
};

const defaultScrolls: Scrolls = {
  lakashelyzeti: 0,
  mezogazdasag: 0,
  banyaszat: 0
};

const BuildingCalculatorComponent: React.FC = () => {
  // Sötét/világos mód kezelése localStorage-ral
  const [theme, setTheme] = useState<Theme>(() => initTheme());
  
  useEffect(() => {
    // Téma változásakor mentés és alkalmazás
    setStoredTheme(theme);
  }, [theme]);
  
  // Hallgatás más oldalak változásaira (pl. storage event)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent | CustomEvent) => {
      if (e instanceof StorageEvent) {
        // Más ablakból érkező változás
        if (e.key === 'hodito-theme' && e.newValue) {
          const newTheme = e.newValue as Theme;
          setTheme(newTheme);
        }
      } else if (e instanceof CustomEvent) {
        // Ugyanabból az ablakból érkező változás (custom event)
        if (e.detail && (e.detail === 'light' || e.detail === 'dark')) {
          setTheme(e.detail as Theme);
        }
      }
    };
    
    // Storage event (más ablakokból)
    window.addEventListener('storage', handleStorageChange as EventListener);
    // Custom event (ugyanabból az ablakból)
    window.addEventListener('themechange', handleStorageChange as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange as EventListener);
      window.removeEventListener('themechange', handleStorageChange as EventListener);
    };
  }, []);

  // Adatok betöltése localStorage-ból
  const [buildings, setBuildings] = useState<BuildingData>(() => {
    const loaded = loadBuildings();
    return loaded || defaultBuildings;
  });

  const [settings, setSettings] = useState<CalculationSettings>(() => {
    const loaded = loadSettings();
    return loaded || defaultSettings;
  });

  const [scrolls, setScrolls] = useState<Scrolls>(() => {
    const loaded = loadScrolls();
    return loaded || defaultScrolls;
  });

  const [buildingListText, setBuildingListText] = useState(() => {
    return loadBuildingListText();
  });

  // Adatok mentése localStorage-ba változáskor
  useEffect(() => {
    saveBuildings(buildings);
  }, [buildings]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveScrolls(scrolls);
  }, [scrolls]);

  useEffect(() => {
    saveBuildingListText(buildingListText);
  }, [buildingListText]);

  // Törlés gomb kezelője
  const handleClearAll = useCallback(() => {
    setBuildings(defaultBuildings);
    setSettings(defaultSettings);
    setScrolls(defaultScrolls);
    // A textarea tartalma megmarad
    clearAllData();
    // A textarea tartalmát nem töröljük, csak az épületek, beállítások és tekercsek adatait
  }, []);

  // Textarea törlés gomb kezelője
  const handleClearTextarea = useCallback(() => {
    setBuildingListText('');
    saveBuildingListText('');
  }, []);

  // Max tekercs értékek automatikus kitöltése skip_tekercs bekapcsolásakor
  useEffect(() => {
    if (settings.skip_tekercs) {
      const hasTudos = settings.szemelyisegek.includes('tudos');
      const hasTudomanyHonapja = settings.idoszakok.includes('tudomany_honapja');
      
      const lakashelyzetiMax = getLakashelyzetiTekercsMax(settings.faj, hasTudomanyHonapja);
      const mezogazdasagMax = getMezogazdasagTekercsMax(settings.faj, hasTudos, hasTudomanyHonapja);
      const banyaszatMax = getBanyaszatTekercsMax(settings.faj, hasTudos, hasTudomanyHonapja);
      
      setScrolls({
        lakashelyzeti: lakashelyzetiMax,
        mezogazdasag: mezogazdasagMax,
        banyaszat: banyaszatMax
      });
    }
  }, [settings.skip_tekercs, settings.faj, settings.szemelyisegek, settings.idoszakok]);

  // Bányák automatikus számítása
  const updatedBuildings = useMemo(() => {
    const banyak = buildings.fatelep + buildings.kobanya + buildings.fembanya + 
                   buildings.agyagbanya + buildings.dragakobanya;
    const szabad_terulet = buildings.hektar - (
      buildings.haz + buildings.barakk + buildings.kovacsmuhely + buildings.tanya +
      buildings.konyvtar + buildings.raktar + banyak + buildings.ortorony +
      buildings.kocsma + buildings.templom + buildings.korhaz + buildings.piac +
      buildings.bank + buildings.erdo + buildings.kolelohely + buildings.femlelohely +
      buildings.agyaglelohely + buildings.dragakolelohely
    );
    
    return { ...buildings, banyak, szabad_terulet };
  }, [buildings]);

  const handleBuildingListPaste = useCallback(() => {
    const parsed = parseBuildingList(buildingListText);
    setBuildings(prev => ({ ...prev, ...parsed }));
  }, [buildingListText]);

  const handleBuildingChange = useCallback((key: keyof BuildingData, value: number) => {
    setBuildings(prev => ({ ...prev, [key]: value }));
  }, []);

  const handlePersonalityToggle = useCallback((personality: string) => {
    setSettings(prev => ({
      ...prev,
      szemelyisegek: prev.szemelyisegek.includes(personality)
        ? prev.szemelyisegek.filter(p => p !== personality)
        : [...prev.szemelyisegek, personality]
    }));
  }, []);

  const handlePeriodToggle = useCallback((period: string) => {
    setSettings(prev => ({
      ...prev,
      idoszakok: prev.idoszakok.includes(period)
        ? prev.idoszakok.filter(p => p !== period)
        : [...prev.idoszakok, period]
    }));
  }, []);

  const calculator = useMemo(() => 
    new BuildingCalculator(updatedBuildings, settings, scrolls),
    [updatedBuildings, settings, scrolls]
  );
  
  const results = calculator.calculate();

  const updateBuilding = (key: keyof BuildingData) => (value: number) => {
    handleBuildingChange(key, value);
  };

  const getPercent = (value: number) => {
    return updatedBuildings.hektar > 0 ? (value / updatedBuildings.hektar) * 100 : 0;
  };

  const personalityLabels: Record<string, string> = {
    kereskedo: 'Kereskedő',
    tolvaj: 'Tolvaj',
    varazslo: 'Varázsló',
    harcos: 'Harcos',
    tabornok: 'Tábornok',
    vandor: 'Vándor',
    tudos: 'Tudós',
    gazdalkodo: 'Gazdálkodó',
    tulelo: 'Túlélő'
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-6">
        <header className="mb-6 flex items-center justify-between flex-wrap gap-4 max-w-6xl mx-auto">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-base-content mb-2">
              Épületlista számító
            </h1>
            <p className="text-base-content/70">
              Hódító.hu online stratégia játék épület számítási eszköze
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      const newTheme = theme === 'light' ? 'dark' : 'light';
                      setTheme(newTheme);
                    }}
                    className="btn btn-ghost btn-sm gap-2"
                    title={theme === 'light' ? 'Sötét mód' : 'Világos mód'}
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
                  <a href="docs/buildings-guide.html" className="btn btn-outline btn-sm gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                    Leírás
                  </a>
            <a href="war.html" className="btn btn-primary btn-sm gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              Háború
            </a>
          </div>
        </header>

        {/* Épületlista beillesztés */}
        <div className="mb-6 card bg-base-100 shadow-xl max-w-6xl mx-auto">
          <div className="card-body">
            <h2 className="card-title">Épületlista beillesztése</h2>
            <div className="relative">
              <textarea
                className="textarea textarea-bordered w-full"
                rows={5}
                value={buildingListText}
                onChange={(e) => setBuildingListText(e.target.value)}
                placeholder="Szabad terület: 100&#10;Ház: 50&#10;Barakk: 20..."
              />
              {buildingListText && buildingListText.trim().length > 0 && (
                <button
                  onClick={handleClearTextarea}
                  className="btn btn-ghost btn-xs absolute top-2 right-2 z-10"
                  title="Textarea tartalmának törlése"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
                  <div className="card-actions justify-end mt-4 gap-4">
                    <button
                      onClick={handleClearAll}
                      className="btn btn-error btn-sm gap-2 flex-none"
                      title="Összes adat törlése (kivéve az épületlista beillesztés mezőt)"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                      Törlés
                    </button>
                    <button
                      onClick={handleBuildingListPaste}
                      className="btn btn-primary btn-sm gap-2 flex-[3]"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                      </svg>
                      Feldolgoz
                    </button>
                  </div>
          </div>
        </div>

        {/* Main Content Grid - Épületek, Eredmények, Beállítások */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 max-w-6xl mx-auto">
          {/* Left Column: Épületek */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-xl">
                Épületek
              </h2>
              <div className="divider"></div>
            
            <div className="space-y-3">
              <BuildingInput
                label="Hektár"
                value={updatedBuildings.hektar}
                onChange={updateBuilding('hektar')}
                percent={100}
                id="hektar"
              />
              
              <BuildingInput
                label="Szabad terület"
                value={updatedBuildings.szabad_terulet}
                onChange={() => {}}
                disabled
                percent={getPercent(updatedBuildings.szabad_terulet)}
                id="szabad_terulet"
              />

              <div className="mt-4 space-y-2">
                <h3 className="text-sm font-semibold text-base-content mb-2">Lakóépületek</h3>
                <div className="space-y-1.5">
                  <BuildingInput label="Ház" value={updatedBuildings.haz} onChange={updateBuilding('haz')} percent={getPercent(updatedBuildings.haz)} id="haz" />
                  <BuildingInput label="Barakk" value={updatedBuildings.barakk} onChange={updateBuilding('barakk')} percent={getPercent(updatedBuildings.barakk)} id="barakk" />
                  <BuildingInput label="Kovácsműhely" value={updatedBuildings.kovacsmuhely} onChange={updateBuilding('kovacsmuhely')} percent={getPercent(updatedBuildings.kovacsmuhely)} id="kovacsmuhely" />
                  <BuildingInput label="Tanya" value={updatedBuildings.tanya} onChange={updateBuilding('tanya')} percent={getPercent(updatedBuildings.tanya)} id="tanya" />
                  <BuildingInput label="Könyvtár" value={updatedBuildings.konyvtar} onChange={updateBuilding('konyvtar')} percent={getPercent(updatedBuildings.konyvtar)} id="konyvtar" />
                  <BuildingInput label="Raktár" value={updatedBuildings.raktar} onChange={updateBuilding('raktar')} percent={getPercent(updatedBuildings.raktar)} id="raktar" />
                  <BuildingInput label="Őrtorony" value={updatedBuildings.ortorony} onChange={updateBuilding('ortorony')} percent={getPercent(updatedBuildings.ortorony)} id="ortorony" />
                  <BuildingInput label="Kocsma" value={updatedBuildings.kocsma} onChange={updateBuilding('kocsma')} percent={getPercent(updatedBuildings.kocsma)} id="kocsma" />
                  <BuildingInput label="Templom" value={updatedBuildings.templom} onChange={updateBuilding('templom')} percent={getPercent(updatedBuildings.templom)} id="templom" />
                  <BuildingInput label="Kórház" value={updatedBuildings.korhaz} onChange={updateBuilding('korhaz')} percent={getPercent(updatedBuildings.korhaz)} id="korhaz" />
                  <BuildingInput label="Piac" value={updatedBuildings.piac} onChange={updateBuilding('piac')} percent={getPercent(updatedBuildings.piac)} id="piac" />
                  <BuildingInput label="Bank" value={updatedBuildings.bank} onChange={updateBuilding('bank')} percent={getPercent(updatedBuildings.bank)} id="bank" />
                </div>
              </div>

              <div className="mt-4 pt-4">
                <div className="divider"></div>
                <h3 className="text-sm font-semibold text-base-content mb-2">Bányák</h3>
                <div className="space-y-1.5">
                  <BuildingInput label="Bányák" value={updatedBuildings.banyak} onChange={() => {}} disabled percent={getPercent(updatedBuildings.banyak)} id="banyak" />
                  <BuildingInput label="Fatelep" value={updatedBuildings.fatelep} onChange={updateBuilding('fatelep')} percent={getPercent(updatedBuildings.fatelep)} id="fatelep" />
                  <BuildingInput label="Kőbánya" value={updatedBuildings.kobanya} onChange={updateBuilding('kobanya')} percent={getPercent(updatedBuildings.kobanya)} id="kobanya" />
                  <BuildingInput label="Fémbánya" value={updatedBuildings.fembanya} onChange={updateBuilding('fembanya')} percent={getPercent(updatedBuildings.fembanya)} id="fembanya" />
                  <BuildingInput label="Agyagbánya" value={updatedBuildings.agyagbanya} onChange={updateBuilding('agyagbanya')} percent={getPercent(updatedBuildings.agyagbanya)} id="agyagbanya" />
                  <BuildingInput label="Drágakőbánya" value={updatedBuildings.dragakobanya} onChange={updateBuilding('dragakobanya')} percent={getPercent(updatedBuildings.dragakobanya)} id="dragakobanya" />
                </div>
              </div>

              <div className="mt-4 pt-4">
                <div className="divider"></div>
                <h3 className="text-sm font-semibold text-base-content mb-2">Lelőhelyek</h3>
                <div className="space-y-1.5">
                  <BuildingInput label="Erdő" value={updatedBuildings.erdo} onChange={updateBuilding('erdo')} percent={getPercent(updatedBuildings.erdo)} id="erdo" />
                  <BuildingInput label="Kőlelőhely" value={updatedBuildings.kolelohely} onChange={updateBuilding('kolelohely')} percent={getPercent(updatedBuildings.kolelohely)} id="kolelohely" />
                  <BuildingInput label="Fémlelőhely" value={updatedBuildings.femlelohely} onChange={updateBuilding('femlelohely')} percent={getPercent(updatedBuildings.femlelohely)} id="femlelohely" />
                  <BuildingInput label="Agyaglelőhely" value={updatedBuildings.agyaglelohely} onChange={updateBuilding('agyaglelohely')} percent={getPercent(updatedBuildings.agyaglelohely)} id="agyaglelohely" />
                  <BuildingInput label="Drágakőlelőhely" value={updatedBuildings.dragakolelohely} onChange={updateBuilding('dragakolelohely')} percent={getPercent(updatedBuildings.dragakolelohely)} id="dragakolelohely" />
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* Middle Column: Eredmények */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-xl">
                Eredmények
              </h2>
              <div className="divider"></div>
            
            <div className="space-y-4">
              {/* Alapadatok */}
              <div>
                <h3 className="text-sm font-semibold text-base-content mb-2">Alapadatok</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Népesség:</span>
                    <span className="font-semibold">{formatNumber(results.nepesseg)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Foglalkoztatottság:</span>
                    <span className="font-semibold">{results.foglalkoztatottsag}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Érték:</span>
                    <span className="font-semibold">{formatNumber(results.ertek)}</span>
                  </div>
                </div>
              </div>

              <div className="divider my-2"></div>

              {/* Férőhelyek */}
              <div>
                <h3 className="text-sm font-semibold text-base-content mb-2">Férőhelyek</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Barakk:</span>
                    <span className="font-semibold">{formatNumber(results.barakkhely)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Templom:</span>
                    <span className="font-semibold">{formatNumber(results.templomhely)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Kocsma:</span>
                    <span className="font-semibold">{formatNumber(results.kocsmahely)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Őrtorony:</span>
                    <span className="font-semibold">{formatNumber(results.ortoronyhely)}</span>
                  </div>
                </div>
              </div>

              <div className="divider my-2"></div>

              {/* Raktár kapacitás */}
              <div>
                <h3 className="text-sm font-semibold text-base-content mb-2">Raktár kapacitás</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Gabona:</span>
                    <span className="font-semibold">{formatNumber(results.gabona)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Agyag:</span>
                    <span className="font-semibold">{formatNumber(results.agyag)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Fa:</span>
                    <span className="font-semibold">{formatNumber(results.fa)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Kő:</span>
                    <span className="font-semibold">{formatNumber(results.ko)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Fém:</span>
                    <span className="font-semibold">{formatNumber(results.fem)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Fegyver:</span>
                    <span className="font-semibold">{formatNumber(results.fegyver)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Drágakő:</span>
                    <span className="font-semibold">{formatNumber(results.dragako)}</span>
                  </div>
                </div>
              </div>

              <div className="divider my-2"></div>

              {/* Termelés */}
              <div>
                <h3 className="text-sm font-semibold text-base-content mb-2">Termelés</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Gabona:</span>
                    <span className="font-semibold">{formatNumber(results.gabona_t)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Agyag:</span>
                    <span className="font-semibold">{formatNumber(results.agyag_t)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Fa:</span>
                    <span className="font-semibold">{formatNumber(results.fa_t)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Kő:</span>
                    <span className="font-semibold">{formatNumber(results.ko_t)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Fém:</span>
                    <span className="font-semibold">{formatNumber(results.fem_t)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Fegyver:</span>
                    <span className="font-semibold">{formatNumber(results.fegyver_t)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Drágakő:</span>
                    <span className="font-semibold">{formatNumber(results.dragako_t)}</span>
                  </div>
                </div>
              </div>

              <div className="divider my-2"></div>

              {/* Gabona */}
              <div>
                <h3 className="text-sm font-semibold text-base-content mb-2">Gabona</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between">
                      <span className="text-base-content/70">Szükséglet (teljes):</span>
                      <span className={`font-semibold ${results.gabona_t - results.gabonaszukseglet >= 0 ? 'text-success' : 'text-error'}`}>
                        {formatNumber(results.gabonaszukseglet)} bála
                        {results.gabona_t - results.gabonaszukseglet >= 0 ? (
                          <span className="ml-2 text-success">+{formatNumber(results.gabona_t - results.gabonaszukseglet)}</span>
                        ) : (
                          <span className="ml-2 text-error">{formatNumber(results.gabona_t - results.gabonaszukseglet)}</span>
                        )}
                      </span>
                    </div>
                    {results.gabona_kor_re_elég !== null && (
                      <div className="text-xs text-base-content/50 ml-auto">
                        ({formatNumber(results.gabona_kor_re_elég)} körre elég)
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between">
                      <span className="text-base-content/70">Szükséglet (sereg nélkül):</span>
                      <span className={`font-semibold ${results.gabona_t - results.gabonaszukseglet_n >= 0 ? 'text-success' : 'text-error'}`}>
                        {formatNumber(results.gabonaszukseglet_n)} bála
                        {results.gabona_t - results.gabonaszukseglet_n >= 0 ? (
                          <span className="ml-2 text-success">+{formatNumber(results.gabona_t - results.gabonaszukseglet_n)}</span>
                        ) : (
                          <span className="ml-2 text-error">{formatNumber(results.gabona_t - results.gabonaszukseglet_n)}</span>
                        )}
                      </span>
                    </div>
                    {results.gabona_kor_re_elég_n !== null && (
                      <div className="text-xs text-base-content/50 ml-auto">
                        ({formatNumber(results.gabona_kor_re_elég_n)} körre elég)
                      </div>
                    )}
                  </div>
                  <div className="divider my-1"></div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Termelés:</span>
                    <span className="font-semibold">{formatNumber(results.gabona_t)} bála/kör</span>
                  </div>
                </div>
              </div>

              <div className="divider my-2"></div>

              {/* Egyéb */}
              <div>
                <h3 className="text-sm font-semibold text-base-content mb-2">Egyéb</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Ellopható pénz:</span>
                    <span className="font-semibold">{results.penz_lop}</span>
                  </div>
                  <div className="text-xs text-base-content/50">{results.kamat}</div>
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* Right Column: Beállítások */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-xl">
                Beállítások
              </h2>
              <div className="divider"></div>
            
            <div className="space-y-3">
              {/* Faj */}
              <div>
                <label className="block text-xs font-medium text-base-content mb-2">Faj:</label>
                <select
                  value={settings.faj}
                  onChange={(e) => setSettings(prev => ({ ...prev, faj: e.target.value as Race }))}
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

              {/* Személyiség és Időszakok - két oszlopban */}
              <div className="grid grid-cols-2 gap-x-4">
                {/* Személyiségek */}
                <div>
                  <label className="block text-xs font-medium text-base-content mb-2">Személyiség(ek):</label>
                  <div className="space-y-1.5">
                    {['kereskedo', 'tolvaj', 'varazslo', 'harcos', 'tabornok', 'vandor', 'tudos', 'gazdalkodo', 'tulelo'].map(personality => (
                      <label key={personality} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          id={`szemelyiseg_${personality}`}
                          checked={settings.szemelyisegek.includes(personality)}
                          onChange={() => handlePersonalityToggle(personality)}
                          className="checkbox checkbox-primary"
                          style={{ height: '14px', width: '14px' }}
                        />
                        <span className="ml-2 text-xs text-base-content">
                          {personalityLabels[personality]}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Időszakok */}
                <div>
                  <label className="block text-xs font-medium text-base-content mb-2">Időszakok:</label>
                  <div className="space-y-1.5">
                    {[
                      { key: 'bo_termes', label: 'Bő termés (+20%)' },
                      { key: 'ragcsalok', label: 'Rágcsálók (-10%)' },
                      { key: 'nyersanyag_plus', label: 'Nyersanyag+ (+20%)' },
                      { key: 'nyersanyag_minus', label: 'Nyersanyag- (-10%)' },
                      { key: 'tudomany_honapja', label: 'Tudomány hónapja' },
                      { key: 'zsugoraru', label: 'Zsugoráru (3x)' }
                    ].map(period => (
                      <label key={period.key} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          id={`idoszak_${period.key}`}
                          checked={settings.idoszakok.includes(period.key)}
                          onChange={() => handlePeriodToggle(period.key)}
                          className="checkbox checkbox-primary"
                          style={{ height: '14px', width: '14px' }}
                        />
                        <span className="ml-2 text-xs text-base-content">
                          {period.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Élőhalott szint */}
              {settings.faj === 'elohalott' && (
                <div>
                  <label className="block text-xs font-medium text-base-content mb-2">Szint:</label>
                  <select
                    value={settings.szint || 5}
                    onChange={(e) => setSettings(prev => ({ ...prev, szint: parseInt(e.target.value) }))}
                    className="select select-bordered select-sm w-full text-xs"
                  >
                    <option value="5">5.</option>
                    <option value="4">4.</option>
                    <option value="3">3.</option>
                    <option value="2">2.</option>
                    <option value="1">1.</option>
                  </select>
                </div>
              )}

              {/* Skip tekercs checkbox */}
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  id="skip_tekercs"
                  checked={settings.skip_tekercs}
                  onChange={(e) => setSettings(prev => ({ ...prev, skip_tekercs: e.target.checked }))}
                  className="checkbox checkbox-primary mt-1"
                  style={{ height: '14px', width: '14px' }}
                />
                <span className="ml-2 text-xs text-base-content">
                  Számolás az elérhető legmagasabb tekercsszámmal.
                  <span className="block text-xs text-base-content/50 mt-0.5">
                    (ekkor figyelmen kívül hagyja a tekercsekhez beírt értékeket)
                  </span>
                </span>
              </label>

              {/* Tekercsek */}
              <div className="pt-2 border-t border-base-300">
                <h3 className="text-xs font-semibold text-base-content mb-2">Tekercsek</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs text-base-content mb-1">Mezőgazdaság:</label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={scrolls.mezogazdasag || ''}
                        onChange={(e) => {
                          const num = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
                          setScrolls(prev => ({ ...prev, mezogazdasag: num }));
                        }}
                        disabled={settings.skip_tekercs}
                        className="input input-bordered input-sm w-full max-w-[6ch] text-xs"
                      />
                      <span className="ml-1 text-xs text-base-content/50">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-base-content mb-1">Lakáshelyzet:</label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={scrolls.lakashelyzeti || ''}
                        onChange={(e) => {
                          const num = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
                          setScrolls(prev => ({ ...prev, lakashelyzeti: num }));
                        }}
                        disabled={settings.skip_tekercs}
                        className="input input-bordered input-sm w-full max-w-[6ch] text-xs"
                      />
                      <span className="ml-1 text-xs text-base-content/50">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-base-content mb-1">Bányászat:</label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={scrolls.banyaszat || ''}
                        onChange={(e) => {
                          const num = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
                          setScrolls(prev => ({ ...prev, banyaszat: num }));
                        }}
                        disabled={settings.skip_tekercs}
                        className="input input-bordered input-sm w-full max-w-[6ch] text-xs"
                      />
                      <span className="ml-1 text-xs text-base-content/50">%</span>
                    </div>
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

export default BuildingCalculatorComponent;
