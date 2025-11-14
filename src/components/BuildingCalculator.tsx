import React, { useState, useCallback, useMemo } from 'react';
import { BuildingData, CalculationSettings, Scrolls, Race } from '../types';
import { BuildingCalculator } from '../calculations/building-calculator';
import { parseBuildingList } from '../utils/parsers';
import { formatNumber, formatPercent } from '../utils/formatters';
import { BuildingInput } from './BuildingInput';
import { RACE_BONUSES } from '../constants';

const BuildingCalculatorComponent: React.FC = () => {
  const [buildings, setBuildings] = useState<BuildingData>({
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
  });

  const [settings, setSettings] = useState<CalculationSettings>({
    faj: 'none',
    szemelyisegek: [],
    idoszakok: [],
    skip_tekercs: false
  });

  const [scrolls, setScrolls] = useState<Scrolls>({
    lakashelyzeti: 0,
    mezogazdasag: 0,
    banyaszat: 0
  });

  const [buildingListText, setBuildingListText] = useState('');

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
            <a href="docs/buildings-guide.html" className="btn btn-ghost">
              Leírás
            </a>
            <a href="war.html" className="btn btn-primary">
              Háború
            </a>
          </div>
        </header>

        {/* Épületlista beillesztés */}
        <div className="mb-6 card bg-base-100 shadow-xl max-w-6xl mx-auto">
          <div className="card-body">
            <h2 className="card-title">Épületlista beillesztése</h2>
            <textarea
              className="textarea textarea-bordered w-full"
              rows={10}
              value={buildingListText}
              onChange={(e) => setBuildingListText(e.target.value)}
              placeholder="Szabad terület: 100&#10;Ház: 50&#10;Barakk: 20..."
            />
            <div className="card-actions justify-end mt-4">
              <button
                onClick={handleBuildingListPaste}
                className="btn btn-primary"
              >
                Feldolgoz
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
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

          {/* Middle Column: Beállítások */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-xl">
                Beállítások
              </h2>
              <div className="divider"></div>
            
            <div className="space-y-4">
              {/* Faj */}
              <div>
                <label className="label">
                  <span className="label-text">Faj</span>
                </label>
                <select
                  value={settings.faj}
                  onChange={(e) => setSettings(prev => ({ ...prev, faj: e.target.value as Race }))}
                  className="select select-bordered w-full"
                >
                  <option value="none">Nincs</option>
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

              {/* Személyiségek */}
              <div>
                <label className="label">
                  <span className="label-text">Személyiségek</span>
                </label>
                <div className="space-y-2">
                  {['kereskedo', 'tolvaj', 'varazslo', 'harcos', 'tabornok', 'vandor', 'tudos', 'gazdalkodo', 'tulelo'].map(personality => (
                    <label key={personality} className="label cursor-pointer">
                      <span className="label-text capitalize">{personality}</span>
                      <input
                        type="checkbox"
                        checked={settings.szemelyisegek.includes(personality)}
                        onChange={() => handlePersonalityToggle(personality)}
                        className="checkbox checkbox-primary"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Időszakok */}
              <div>
                <label className="label">
                  <span className="label-text">Időszakok</span>
                </label>
                <div className="space-y-2">
                  {[
                    { key: 'bo_termes', label: 'Bő termés' },
                    { key: 'ragcsalok', label: 'Rágcsálók' },
                    { key: 'nyersanyag_plus', label: 'Nyersanyag+' },
                    { key: 'nyersanyag_minus', label: 'Nyersanyag-' },
                    { key: 'tudomany_honapja', label: 'Tudomány hónapja' },
                    { key: 'zsugoraru', label: 'Zsugoráru' }
                  ].map(period => (
                    <label key={period.key} className="label cursor-pointer">
                      <span className="label-text">{period.label}</span>
                      <input
                        type="checkbox"
                        checked={settings.idoszakok.includes(period.key)}
                        onChange={() => handlePeriodToggle(period.key)}
                        className="checkbox checkbox-primary"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Élőhalott szint */}
              {settings.faj === 'elohalott' && (
                <div>
                  <label className="label">
                    <span className="label-text">Élőhalott szint</span>
                  </label>
                  <select
                    value={settings.szint || 5}
                    onChange={(e) => setSettings(prev => ({ ...prev, szint: parseInt(e.target.value) }))}
                    className="select select-bordered w-full"
                  >
                    <option value="0">0</option>
                    <option value="1">1.</option>
                    <option value="2">2.</option>
                    <option value="3">3.</option>
                    <option value="4">4.</option>
                    <option value="5">5.</option>
                  </select>
                </div>
              )}

              {/* Tekercsek */}
              <div className="space-y-3">
                <div>
                  <label className="label">
                    <span className="label-text">Lakáshelyzet tekercs (%)</span>
                  </label>
                  <input
                    type="number"
                    value={scrolls.lakashelyzeti}
                    onChange={(e) => setScrolls(prev => ({ ...prev, lakashelyzeti: parseInt(e.target.value) || 0 }))}
                    className="input input-bordered w-full"
                    min="0"
                    max="55"
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Mezőgazdaság tekercs (%)</span>
                  </label>
                  <input
                    type="number"
                    value={scrolls.mezogazdasag}
                    onChange={(e) => setScrolls(prev => ({ ...prev, mezogazdasag: parseInt(e.target.value) || 0 }))}
                    className="input input-bordered w-full"
                    min="0"
                    max="55"
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Bányászat tekercs (%)</span>
                  </label>
                  <input
                    type="number"
                    value={scrolls.banyaszat}
                    onChange={(e) => setScrolls(prev => ({ ...prev, banyaszat: parseInt(e.target.value) || 0 }))}
                    className="input input-bordered w-full"
                    min="0"
                    max="55"
                  />
                </div>
                <label className="label cursor-pointer">
                  <span className="label-text">Skip tekercs (max értékek)</span>
                  <input
                    type="checkbox"
                    checked={settings.skip_tekercs}
                    onChange={(e) => setSettings(prev => ({ ...prev, skip_tekercs: e.target.checked }))}
                    className="checkbox checkbox-primary"
                  />
                </label>
              </div>
            </div>
            </div>
          </div>

          {/* Right Column: Eredmények */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-xl">
                Eredmények
              </h2>
              <div className="divider"></div>
            
            <div className="space-y-4">
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

              <div>
                <h3 className="text-sm font-semibold text-base-content mb-2">Egyéb</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Gabonaszükséglet:</span>
                    <span className="font-semibold">{formatNumber(results.gabonaszukseglet)} bála</span>
                  </div>
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
        </div>
      </div>
    </div>
  );
};

export default BuildingCalculatorComponent;
