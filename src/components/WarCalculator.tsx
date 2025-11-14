import React, { useState, useCallback, useMemo } from 'react';
import { WarSettings, WarResults } from '../types';
import { WarCalculator } from '../calculations/war-calculator';
import { formatNumber } from '../utils/formatters';
import { parseKristalygomb, parseEpuletlistaForWar } from '../utils/war-parsers';
import { Race, GENERAL_BONUSES, getHadiTekercsMax, getLakashelyzetiTekercsMax } from '../constants';

// Segéd komponensek
interface UnitInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  id: string;
}

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
        className="input input-bordered input-sm w-full max-w-[8ch] text-xs"
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
    <label className="label cursor-pointer">
      <span className={`label-text text-xs ${disabled ? 'text-base-content/50' : ''}`}>
        {label}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className={`checkbox checkbox-primary checkbox-sm ${disabled ? 'checkbox-disabled' : ''}`}
      />
    </label>
  );
};

const WarCalculatorComponent: React.FC = () => {
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
    verszomj: false,
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

  const handleVedoImport = useCallback(() => {
    const kristalygombData = parseKristalygomb(vedoKristalygomb, 'vedo');
    const epuletlistaData = parseEpuletlistaForWar(vedoEpuletlista);
    updateVedoSettings({ ...kristalygombData, ...epuletlistaData });
  }, [vedoKristalygomb, vedoEpuletlista]);

  const handleTamadoImport = useCallback(() => {
    const kristalygombData = parseKristalygomb(tamadoKristalygomb, 'tamado');
    const epuletlistaData = parseEpuletlistaForWar(tamadoEpuletlista);
    updateTamadoSettings({ ...kristalygombData, ...epuletlistaData });
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
      verszomj: false,
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
  }, []);

  const updateVedoSettings = useCallback((updates: Partial<WarSettings>) => {
    setVedoSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const updateTamadoSettings = useCallback((updates: Partial<WarSettings>) => {
    setTamadoSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const vedoResults = useMemo(() => WarCalculator.calculate(vedoSettings), [vedoSettings]);
  const tamadoResults = useMemo(() => WarCalculator.calculate(tamadoSettings), [tamadoSettings]);

  const vedoWins = vedoResults.vedoero >= tamadoResults.tamadoero;

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <header className="mb-6">
          <div className="flex items-center justify-between mb-2 gap-3 flex-wrap">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-base-content mb-2">Háború</h1>
              <p className="text-base-content/70">Hódító.hu online stratégia játék csata számító</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a href="docs/war-guide.html" className="btn btn-ghost">
                Leírás
              </a>
              <a href="index.html" className="btn btn-primary">
                Épületek
              </a>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
          {/* Védő oszlop */}
          <div className={`card bg-base-100 shadow-xl ${vedoWins ? 'border-4 border-success' : 'border-4 border-error'}`}>
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
                  <UnitInput label="Támadó" value={vedoSettings.tamado} onChange={(v) => updateVedoSettings({ tamado: v })} id="vedo_tamado" />
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
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={vedoSettings.katonai_moral}
                      onChange={(e) => updateVedoSettings({ katonai_moral: parseInt(e.target.value) || 75 })}
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
                    onChange={(checked) => updateVedoSettings({ tudomany_honapja: checked })}
                  />
                  <div className="flex items-center justify-between gap-1.5">
                    <label className="text-xs font-medium label-text whitespace-nowrap">Hadi tekercs:</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={vedoSettings.tudos_szazalek}
                        onChange={(e) => updateVedoSettings({ tudos_szazalek: parseInt(e.target.value) || 0 })}
                        className="input input-bordered input-sm w-full max-w-[6ch] text-xs"
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
                      className="select select-bordered select-sm w-full max-w-[8ch] text-xs"
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
                      className="select select-bordered select-sm w-full max-w-[8ch] text-xs"
                    >
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between gap-1.5">
                    <label className="text-xs font-medium label-text whitespace-nowrap">Lakáshelyzeti tekercs:</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={vedoSettings.lakashelyzeti_tekercs}
                        onChange={(e) => updateVedoSettings({ lakashelyzeti_tekercs: parseInt(e.target.value) || 0 })}
                        className="input input-bordered input-sm w-full max-w-[6ch] text-xs"
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
                      rows={10}
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
                      rows={10}
                      value={vedoEpuletlista}
                      onChange={(e) => setVedoEpuletlista(e.target.value)}
                      className="textarea textarea-bordered textarea-sm w-full text-xs font-mono"
                    />
                  </div>
                </div>
                <div className="card-actions justify-end mt-3">
                  <button
                    onClick={handleVedoImport}
                    className="btn btn-success btn-sm"
                  >
                    Feldolgozás
                  </button>
                  <button
                    onClick={handleVedoClear}
                    className="btn btn-error btn-sm"
                  >
                    Törlés
                  </button>
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* Támadó oszlop */}
          <div className={`card bg-base-100 shadow-xl ${!vedoWins ? 'border-4 border-success' : 'border-4 border-error'}`}>
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
                  <div className="flex items-center justify-between gap-1.5">
                    <label className="text-xs font-medium label-text whitespace-nowrap">Tábornok:</label>
                    <select
                      value={tamadoSettings.tabornok || 0}
                      onChange={(e) => updateTamadoSettings({ tabornok: parseInt(e.target.value) })}
                      className="select select-bordered select-sm w-full max-w-[8ch] text-xs"
                    >
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center justify-between gap-1.5">
                    <label className="text-xs font-medium label-text whitespace-nowrap">Hadi tekercs:</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={tamadoSettings.tudos_szazalek}
                        onChange={(e) => updateTamadoSettings({ tudos_szazalek: parseInt(e.target.value) || 0 })}
                        className="input input-bordered input-sm w-full max-w-[6ch] text-xs"
                      />
                      <span className="text-xs text-base-content/50">%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-1.5">
                    <label className="text-xs font-medium label-text whitespace-nowrap">Kör:</label>
                    <input
                      type="text"
                      value={tamadoSettings.kor || 2}
                      onChange={(e) => updateTamadoSettings({ kor: parseInt(e.target.value) || 2 })}
                      className="input input-bordered input-sm w-full max-w-[6ch] text-xs"
                    />
                  </div>
                  <div className="pt-2">
                    <label className="label">
                      <span className="label-text text-xs">Irány:</span>
                    </label>
                    <div className="space-y-1">
                      <label className="label cursor-pointer">
                        <span className="label-text text-xs">Felfele (nagyobb értékű ország)</span>
                        <input
                          type="radio"
                          name="tamado_irany"
                          value="felfele"
                          checked={tamadoSettings.irany === 'felfele'}
                          onChange={() => updateTamadoSettings({ irany: 'felfele' })}
                          className="radio radio-primary"
                        />
                      </label>
                      <label className="label cursor-pointer">
                        <span className="label-text text-xs">Lefele (kisebb értékű ország)</span>
                        <input
                          type="radio"
                          name="tamado_irany"
                          value="lefele"
                          checked={tamadoSettings.irany === 'lefele'}
                          onChange={() => updateTamadoSettings({ irany: 'lefele' })}
                          className="radio radio-primary"
                        />
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
                      rows={10}
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
                      rows={10}
                      value={tamadoEpuletlista}
                      onChange={(e) => setTamadoEpuletlista(e.target.value)}
                      className="textarea textarea-bordered textarea-sm w-full text-xs font-mono"
                    />
                  </div>
                </div>
                <div className="card-actions justify-end mt-3">
                  <button
                    onClick={handleTamadoImport}
                    className="btn btn-success btn-sm"
                  >
                    Feldolgozás
                  </button>
                  <button
                    onClick={handleTamadoClear}
                    className="btn btn-error btn-sm"
                  >
                    Törlés
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
              <div className="text-center">
                <div className={`alert ${vedoWins ? 'alert-success' : 'alert-error'}`}>
                  <span className="text-2xl font-bold">
                    {vedoWins ? 'A támadás sikertelen' : 'A támadás sikeres'}
                  </span>
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

                <div>
                  <h3 className="text-sm font-semibold text-base-content mb-2">Gabonaszükséglet</h3>
                  <p className="text-lg">
                    Védő: <span className="font-semibold">{formatNumber(vedoResults.gabonaszukseglet)} bála</span>
                  </p>
                  <p className="text-lg">
                    Támadó: <span className="font-semibold">{formatNumber(tamadoResults.gabonaszukseglet)} bála</span>
                  </p>
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
