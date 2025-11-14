// Katonai egységek alapértékei
const EGYSEG_ERTEK = {
    katona: { vedo: 1, tamado: 1 },
    vedo: { vedo: 4, tamado: 0 },
    tamado: { vedo: 0, tamado: 4 },
    ijsz: { vedo: 6, tamado: 2 },
    lovas: { vedo: 2, tamado: 6 },
    elit: { vedo: 5, tamado: 5 }
};

// Faji bónuszok
const FAJ_BONUSZ = {
    elf: { vedo: 1.30, tamado: 1.0 },
    ork: { vedo: 1.0, tamado: 1.30 },
    felelf: { vedo: 1.10, tamado: 0.90 },
    torpe: { vedo: 1.0, tamado: 1.0 },
    gnom: { vedo: 1.0, tamado: 1.0 },
    orias: { vedo: 1.0, tamado: 1.0 },
    elohalott: { vedo: 1.0, tamado: 1.0 },
    ember: { vedo: 1.0, tamado: 1.0 },
    none: { vedo: 1.0, tamado: 1.0 }
};

// Tábornok bónuszok
const TABORNOK_BONUSZ = {
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
const ELOHALOTT_SZINT_BONUSZ = {
    0: 0,
    1: 0.40,
    2: 0.30,
    3: 0.20,
    4: 0.10,
    5: 0
};

// Feldolgozás - csak feldolgozza a textarea-kat és beírja az adatokat
function feldolgozas(tipus) {
    // Kristálygömb feldolgozása
    const kristalygomb = document.getElementById(tipus + '_kristalygomb');
    if (kristalygomb && kristalygomb.value.trim() !== '') {
        importKristalygomb(tipus);
    }
    
    // Épületlista feldolgozása
    const epuletlista = document.getElementById(tipus + '_epuletlista');
    if (epuletlista && epuletlista.value.trim() !== '') {
        importEpuletlista(tipus);
    }
    
    // Mezők állapotának frissítése
    updateFieldStates();
    
    // Hadi tekercs beállítása
    updateHadiTekercs(tipus);
    
    // Támadóknál mindig max lakáshelyzeti tekercssel számolunk
    if (tipus === 'tamado') {
        const tamadoFaj = document.getElementById('tamado_faj').value;
        if (tamadoFaj !== 'none') {
            const tamadoLakashelyzetiField = document.getElementById('tamado_lakashelyzeti_tekercs');
            const hasTudomanyHonapja = document.getElementById('tamado_tudomany_honapja') && document.getElementById('tamado_tudomany_honapja').checked;
            const maxLakashelyzeti = getLakashelyzetiTekercsMax(tamadoFaj, hasTudomanyHonapja);
            if (tamadoLakashelyzetiField) {
                const currentValue = parseInt(tamadoLakashelyzetiField.value) || 0;
                if (currentValue === 0 || currentValue > maxLakashelyzeti) {
                    tamadoLakashelyzetiField.value = maxLakashelyzeti;
                }
            }
            
            // Lovasok max számának számítása barakkok és lakáshelyzet alapján
            const epuletlista = document.getElementById('tamado_epuletlista');
            if (epuletlista && epuletlista.value.trim() !== '') {
                const text = epuletlista.value;
                const lines = text.split('\n');
                let barakkok = 0;
                for (let i = 0; i < lines.length; i++) {
                    let line = lines[i];
                    if (!line || !line.trim()) continue;
                    let parts = line.split(':');
                    if (parts.length < 2) {
                        parts = line.split('\t');
                    }
                    if (parts.length >= 2) {
                        const epuletNev = parts[0].trim();
                        if (epuletNev.includes('Barakk')) {
                            barakkok = extractNumber(parts[1].trim());
                            break;
                        }
                    }
                }
                if (barakkok > 0) {
                    const lakashelyzeti = parseFloat(tamadoLakashelyzetiField.value) || 0;
                    const maxFerhely = Math.floor(barakkok * 40 * (1 + lakashelyzeti / 100));
                    const lovasField = document.getElementById('tamado_lovas');
                    if (lovasField) {
                        lovasField.value = maxFerhely;
                    }
                }
            }
        }
    }
    
    // Védőknél íjászok max számának számítása, ha faj van kiválasztva
    if (tipus === 'vedo') {
        const vedoFaj = document.getElementById('vedo_faj').value;
        if (vedoFaj !== 'none') {
            const hasTudomanyHonapja = document.getElementById('vedo_tudomany_honapja') && document.getElementById('vedo_tudomany_honapja').checked;
            const maxLakashelyzeti = getLakashelyzetiTekercsMax(vedoFaj, hasTudomanyHonapja);
            const vedoLakashelyzetiField = document.getElementById('vedo_lakashelyzeti_tekercs');
            if (vedoLakashelyzetiField) {
                const currentValue = parseInt(vedoLakashelyzetiField.value) || 0;
                if (currentValue === 0 || currentValue > maxLakashelyzeti) {
                    vedoLakashelyzetiField.value = maxLakashelyzeti;
                }
            }
            
            // Íjászok max számának számítása barakkok és lakáshelyzet alapján
            const epuletlista = document.getElementById('vedo_epuletlista');
            if (epuletlista && epuletlista.value.trim() !== '') {
                const text = epuletlista.value;
                const lines = text.split('\n');
                let barakkok = 0;
                for (let i = 0; i < lines.length; i++) {
                    let line = lines[i];
                    if (!line || !line.trim()) continue;
                    let parts = line.split(':');
                    if (parts.length < 2) {
                        parts = line.split('\t');
                    }
                    if (parts.length >= 2) {
                        const epuletNev = parts[0].trim();
                        if (epuletNev.includes('Barakk')) {
                            barakkok = extractNumber(parts[1].trim());
                            break;
                        }
                    }
                }
                if (barakkok > 0) {
                    const lakashelyzeti = parseFloat(vedoLakashelyzetiField.value) || 0;
                    const maxFerhely = Math.floor(barakkok * 40 * (1 + lakashelyzeti / 100));
                    const ijszField = document.getElementById('vedo_ijasz');
                    if (ijszField) {
                        ijszField.value = maxFerhely;
                    }
                }
            }
        }
    }
    
    // Számítás
    szamol();
}

// Számítás gomb - csak számol, nem ír felül semmit
function feldolgozEsSzamol() {
    szamol();
}

// Számítás főfüggvény
function szamol() {
    const vedoPont = szamolVedoero();
    const tamadoPont = szamolTamadoero();
    
    // Eredmények oszlopban
    document.getElementById('vedopont').textContent = formatNumber(vedoPont);
    document.getElementById('tamadopont').textContent = formatNumber(tamadoPont);
    
    // Eredmények színezése (zöld/piros)
    const vedopontElement = document.getElementById('vedopont');
    const tamadopontElement = document.getElementById('tamadopont');
    
    // Eltávolítjuk az előző színeket
    vedopontElement.classList.remove('text-green-600', 'text-red-600');
    tamadopontElement.classList.remove('text-green-600', 'text-red-600');
    
    // Csak akkor színezünk, ha mindkét érték nagyobb mint 0
    if (vedoPont > 0 && tamadoPont > 0) {
        if (vedoPont >= tamadoPont) {
            // Védők nyernek vagy döntetlen
            vedopontElement.classList.add('text-green-600');
            tamadopontElement.classList.add('text-red-600');
        } else {
            // Támadók nyernek
            tamadopontElement.classList.add('text-green-600');
            vedopontElement.classList.add('text-red-600');
        }
    }
    
    // Oszlopokban megjelenítés
    document.getElementById('vedo_ero_megjelenites').textContent = formatNumber(vedoPont);
    document.getElementById('tamado_ero_megjelenites').textContent = formatNumber(tamadoPont);
    
    const eredmeny = vedoPont >= tamadoPont ? 
        'A támadás sikertelen' : 
        'A támadás sikeres';
    document.getElementById('eredmeny').textContent = eredmeny;
    
    // Győztes/vesztes keretek - csak akkor ne legyen keret, ha mindkét érték 0
    const vedoOszlop = document.getElementById('vedo_oszlop');
    const tamadoOszlop = document.getElementById('tamado_oszlop');
    
    // Eltávolítjuk az előző kereteket
    vedoOszlop.classList.remove('border-4', 'border-green-500', 'border-red-500');
    tamadoOszlop.classList.remove('border-4', 'border-green-500', 'border-red-500');
    
    // Csak akkor ne legyen keret, ha mindkét érték 0
    if (vedoPont > 0 || tamadoPont > 0) {
        if (vedoPont >= tamadoPont) {
            // Védők nyernek
            vedoOszlop.classList.add('border-4', 'border-green-500');
            tamadoOszlop.classList.add('border-4', 'border-red-500');
        } else {
            // Támadók nyernek
            tamadoOszlop.classList.add('border-4', 'border-green-500');
            vedoOszlop.classList.add('border-4', 'border-red-500');
        }
    }
    
    // Gabonaszükséglet számítása
    const gabona = szamolGabonaszukseglet();
    document.getElementById('gabonaszukseglet').textContent = formatNumber(gabona) + ' bála';
    
    // Támadóknál is megjelenítjük a gabonaszükségletet
    const tamadoGabona = szamolGabonaszukseglet('tamado');
    const tamadoGabonaElement = document.getElementById('tamado_gabonaszukseglet');
    if (tamadoGabonaElement) {
        tamadoGabonaElement.textContent = formatNumber(tamadoGabona) + ' bála';
    }
    
    // Faj alapján mezők aktiválása/deaktiválása
    updateFieldStates();
}

function findRequiredUnitValue(fieldId, targetPoints, calculatorFn) {
    const field = document.getElementById(fieldId);
    if (!field) {
        return null;
    }
    
    const originalValue = parseInt(field.value) || 0;
    const basePoints = calculatorFn();
    if (basePoints >= targetPoints) {
        return {
            finalValue: originalValue,
            added: 0
        };
    }
    
    const MAX_UNITS = 2000000;
    
    const simulatePoints = (value) => {
        const previous = field.value;
        field.value = value.toString();
        const points = calculatorFn();
        field.value = previous;
        return points;
    };
    
    let high = originalValue;
    let highPoints = basePoints;
    let iterations = 0;
    
    while (highPoints < targetPoints && high < MAX_UNITS && iterations < 60) {
        if (high === 0) {
            high = 1;
        } else {
            high = Math.min(MAX_UNITS, high * 2);
        }
        highPoints = simulatePoints(high);
        iterations++;
    }
    
    if (highPoints < targetPoints) {
        return null;
    }
    
    let low = originalValue;
    let result = high;
    
    while (low < high) {
        const mid = Math.floor((low + high) / 2);
        const midPoints = simulatePoints(mid);
        if (midPoints >= targetPoints) {
            result = mid;
            high = mid;
        } else {
            low = mid + 1;
        }
    }
    
    return {
        finalValue: result,
        added: result - originalValue
    };
}

// Védőerő számítása
// Dokumentáció szerinti sorrend:
// 1. Először: saját sereg védőértéke (őrtornyokkal együtt)
// 2. Másodszor: hozzáadni a segítő seregek értékét
// 3. Harmadszor: szorozni a többi tényezővel (ork kitámadási bónusz, katonai morál, stb.)
function szamolVedoero() {
    // ===== 1. LÉPÉS: Saját sereg védőértéke (őrtornyokkal együtt) =====
    
    // Alapértékek
    const katona = parseInt(document.getElementById('vedo_katona').value) || 0;
    const vedo = parseInt(document.getElementById('vedo_vedo').value) || 0;
    const tamado = parseInt(document.getElementById('vedo_tamado').value) || 0;
    const ijsz = parseInt(document.getElementById('vedo_ijasz').value) || 0;
    const lovas = parseInt(document.getElementById('vedo_lovas').value) || 0;
    const elit = parseInt(document.getElementById('vedo_elit').value) || 0;
    
    let alapVedoero = 
        katona * EGYSEG_ERTEK.katona.vedo +
        vedo * EGYSEG_ERTEK.vedo.vedo +
        tamado * EGYSEG_ERTEK.tamado.vedo +
        ijsz * EGYSEG_ERTEK.ijsz.vedo +
        lovas * EGYSEG_ERTEK.lovas.vedo +
        elit * EGYSEG_ERTEK.elit.vedo;
    
    // Őrtorony íjászok (csak a saját sereg íjászai vonulnak toronyba)
    // Dokumentáció szerint: alapértelmezetten 1 őrtorony = 40 íjász
    // Lakáshelyzeti tekercs módosítja: 40 * (1 + lakashelyzeti / 100)
    // Elf esetén az őrtoronyban lévő íjászok 8 pontot adnak (helyett 6)
    // FONTOS: Minden őrtornyot úgy kezelünk, hogy 100%-ban működik (teljes foglalkoztatottság)
    const ortorony = parseInt(document.getElementById('vedo_ortorony').value) || 0;
    const faj = document.getElementById('vedo_faj').value;
    const lakashelyzeti = parseFloat(document.getElementById('vedo_lakashelyzeti_tekercs').value) || 0;
    
    // Alap kapacitás: 40 íjász/őrtorony, módosítva lakáshelyzeti tekercssel
    // Minden őrtorony 100%-ban működik (nincs működési százalék számítás)
    const ortoronyKapacitas = Math.round(40 * (1 + lakashelyzeti / 100));
    const maxOrtoronyIjsz = ortorony * ortoronyKapacitas;
    const ortoronyIjsz = Math.min(ijsz, maxOrtoronyIjsz);
    
    // Dokumentáció szerint: az őrtoronyban lévő íjászok védőereje megduplázódik
    // Normál íjász védőérték: 6
    // Őrtoronyban íjász védőérték: 6 * 2 = 12
    // Elf esetén: az őrtornyokban lévő íjászoknak az őrtorony 8 pontot ad (nem 6)
    // Szóval elf esetén: 8 * 2 = 16 pont
    const alapIjszVedo = EGYSEG_ERTEK.ijsz.vedo; // 6
    const ortoronyIjszVedo = (faj === 'elf') ? 16 : 12; // Megduplázódik: elf 8*2=16, egyéb 6*2=12
    alapVedoero += ortoronyIjsz * (ortoronyIjszVedo - alapIjszVedo);
    
    // ===== 2. LÉPÉS: Segítő seregek értékének hozzáadása =====
    // Dokumentáció szerint: "majd ehhez add hozzá a segítő seregek értékét"
    // FONTOS: Szövetséges íjászok NEM mennek toronyba, csak normál védőértékkel számolódnak
    const szovetsegesIjsz = parseInt(document.getElementById('vedo_szovetseges_ijaszok').value) || 0;
    alapVedoero += szovetsegesIjsz * EGYSEG_ERTEK.ijsz.vedo;
    
    // Minimális védőerő (hektár)
    // Dokumentáció szerint: Ha a védelem kisebb mint a minimális védőérték (hektár), 
    // akkor a minimális védőérték érvényesül.
    // Példa: 200 hektáros országban 50 katona (50 védőérték) → minimális védőérték 200 érvényesül
    const hektar = parseInt(document.getElementById('vedo_hektar').value) || 0;
    if (alapVedoero < hektar) {
        alapVedoero = hektar;
    }
    
    // ===== 3. LÉPÉS: Módosítók alkalmazása (szorzás) =====
    // Dokumentáció szerint: "A többi tényezőt ezzel szorozd"
    // Sorrend: ork kitámadási bónusz, katonai morál, védelem varázslat, 
    // magányos farkas bónusza, őrtornyok területarányos védőértéke, országod hadügyi fejlettsége, faji bónuszok
    // Mivel minden szorzás, a sorrend közömbös, de követjük a dokumentáció sorrendjét az átláthatóságért
    let vedoero = alapVedoero;
    
    // 1. Kitámadási bónusz (ork) - dokumentáció szerint első
    if (document.getElementById('vedo_kitamadasi_bonusz').checked && faj === 'ork') {
        vedoero *= 1.20;
    }
    
    // 2. Katonai morál - dokumentáció szerint második
    const moral = parseFloat(document.getElementById('vedo_katonai_moral').value) || 75;
    vedoero *= (moral / 100);
    
    // 3. Védelem varázslat - dokumentáció szerint harmadik
    if (document.getElementById('vedo_vedelem').checked) {
        vedoero *= 1.30;
    }
    
    // 4. Magányos farkas bónusza - dokumentáció szerint negyedik
    if (document.getElementById('vedo_maganyos_farkas').checked) {
        vedoero *= 1.40;
    }
    
    // 5. Őrtornyok területarányos védőértéke - dokumentáció szerint ötödik
    // Gnóm esetén háromszorosa, egyébként kétszerese, de maximum 30%
    if (hektar > 0 && ortorony > 0) {
        const ortoronyArany = (ortorony / hektar) * 100;
        const multiplier = (faj === 'gnom') ? 3 : 2;
        const ortoronyVedoBonus = Math.min(ortoronyArany * multiplier, 30) / 100; // Maximum 30%
        vedoero *= (1 + ortoronyVedoBonus);
    }
    
    // 6. Országod hadügyi fejlettsége (hadi tekercs) - dokumentáció szerint hatodik
    let tudosSzazalek = parseFloat(document.getElementById('vedo_tudos_szazalek').value) || 0;
    if (tudosSzazalek > 0) {
        vedoero *= (1 + tudosSzazalek / 100);
    }
    
    // 7. Faji bónuszok - dokumentáció szerint hetedik (utolsó)
    const fajBonus = FAJ_BONUSZ[faj] || FAJ_BONUSZ.none;
    vedoero *= fajBonus.vedo;
    
    // További módosítók (dokumentációban nem szerepelnek, de a játékban léteznek):
    
    // Élőhalott szint
    const elohalottSzint = parseInt(document.getElementById('vedo_elohalott_szint').value) || 0;
    if (faj === 'elohalott') {
        vedoero *= (1 + ELOHALOTT_SZINT_BONUSZ[elohalottSzint]);
    }
    
    // Szabadságon lévő szövetségesek bónusz
    const szabadsagon = parseInt(document.getElementById('vedo_szabadsagon_szovetsegesek').value) || 0;
    if (szabadsagon > 0) {
        vedoero *= (1 + szabadsagon * 0.10);
    }
    
    // Lakáshelyzeti tekercs (őrtorony kapacitás) - már benne van az őrtorony számításban fentebb
    
    return Math.round(vedoero);
}

// Támadóerő számítása
function szamolTamadoero() {
    // Alapértékek
    const katona = parseInt(document.getElementById('tamado_katona').value) || 0;
    const tamado = parseInt(document.getElementById('tamado_tamado').value) || 0;
    const ijsz = parseInt(document.getElementById('tamado_ijasz').value) || 0;
    const lovas = parseInt(document.getElementById('tamado_lovas').value) || 0;
    const elit = parseInt(document.getElementById('tamado_elit').value) || 0;
    
    let alapTamadoero = 
        katona * EGYSEG_ERTEK.katona.tamado +
        tamado * EGYSEG_ERTEK.tamado.tamado +
        ijsz * EGYSEG_ERTEK.ijsz.tamado +
        lovas * EGYSEG_ERTEK.lovas.tamado +
        elit * EGYSEG_ERTEK.elit.tamado;
    
    // Módosítók
    let tamadoero = alapTamadoero;
    
    // Faji bónusz
    const faj = document.getElementById('tamado_faj').value;
    const fajBonus = FAJ_BONUSZ[faj] || FAJ_BONUSZ.none;
    tamadoero *= fajBonus.tamado;
    
    // Katonai morál
    const moral = parseFloat(document.getElementById('tamado_katonai_moral').value) || 75;
    tamadoero *= (moral / 100);
    
    // Magányos farkas
    if (document.getElementById('tamado_maganyos_farkas').checked) {
        tamadoero *= 1.40;
    }
    
    // Vérszomj varázslat
    if (document.getElementById('tamado_verszomj').checked) {
        tamadoero *= 1.30;
    }
    
    // Tábornok bónusz
    const tabornok = parseInt(document.getElementById('tamado_tabornok').value) || 0;
    tamadoero *= (1 + TABORNOK_BONUSZ[tabornok]);
    
    // Élőhalott szint
    const elohalottSzint = parseInt(document.getElementById('tamado_elohalott_szint').value) || 0;
    if (faj === 'elohalott') {
        tamadoero *= (1 + ELOHALOTT_SZINT_BONUSZ[elohalottSzint]);
    }
    
    // Hadi tekercs - a szövegmezőben lévő értékkel mindig számol
    let tudosSzazalek = parseFloat(document.getElementById('tamado_tudos_szazalek').value) || 0;
    if (tudosSzazalek > 0) {
        tamadoero *= (1 + tudosSzazalek / 100);
    }
    
    // Felfele/Lefele (nagyobb értékű ország támadása +10%)
    const irany = document.querySelector('input[name="tamado_irany"]:checked').value;
    if (irany === 'felfele') {
        tamadoero *= 1.10;
    }
    
    return Math.round(tamadoero);
}

// Gabonaszükséglet számítása
function szamolGabonaszukseglet(tipus) {
    if (!tipus) tipus = 'vedo';
    
    const katona = parseInt(document.getElementById(tipus + '_katona').value) || 0;
    const tamado = parseInt(document.getElementById(tipus + '_tamado').value) || 0;
    const ijsz = parseInt(document.getElementById(tipus + '_ijsz').value) || 0;
    const lovas = parseInt(document.getElementById(tipus + '_lovas').value) || 0;
    const elit = parseInt(document.getElementById(tipus + '_elit').value) || 0;
    const kor = parseInt(document.getElementById(tipus + '_kor').value) || 2;
    
    const osszesKatona = katona + tamado + ijsz + lovas + elit;
    // Egyszerű számítás: 1 katona = 1 bála/kör
    return osszesKatona * kor;
}

// Mennyi íjász kell a védéshez - számítja, hogy mennyi íjász kell, hogy a védőerő elérje a támadóerőt
function szamolIjaszVedohoz() {
    const tamadoPont = szamolTamadoero();
    const jelenlegiVedoPont = szamolVedoero();
    
    // Ha már elég a védőerő, akkor 0
    if (jelenlegiVedoPont >= tamadoPont) {
        alert('A védőerő már elég magas, nincs szükség további íjászokra.');
        return;
    }
    
    // Szükséges védőerő különbség
    const celVedoero = tamadoPont;
    const eredmeny = findRequiredUnitValue('vedo_ijasz', celVedoero, szamolVedoero);
    
    if (!eredmeny) {
        alert('A beállított feltételek mellett nem lehet elegendő íjászt számolni a védéshez.');
        return;
    }
    
    if (eredmeny.added === 0) {
        alert('A védőerő már elég magas, nincs szükség további íjászokra.');
        return;
    }
    
    const ijszField = document.getElementById('vedo_ijasz');
    ijszField.value = eredmeny.finalValue;
    
    szamol();
    
    alert(`Szükséges ${formatNumber(eredmeny.added)} további íjász a védéshez.`);
}

// Mennyi lovas kell a beütéshez - számítja, hogy mennyi lovas kell, hogy a támadóerő elérje a védőerőt
function szamolLovasTamadashoz() {
    const vedoPont = szamolVedoero();
    const jelenlegiTamadoPont = szamolTamadoero();
    
    // Ha már elég a támadóerő, akkor 0
    if (jelenlegiTamadoPont >= vedoPont) {
        alert('A támadóerő már elég magas, nincs szükség további lovasokra.');
        return;
    }
    
    // Szükséges támadóerő különbség
    const celTamadoero = vedoPont;
    
    const tamadoKatona = parseInt(document.getElementById('tamado_katona').value) || 0;
    const tamadoTamado = parseInt(document.getElementById('tamado_tamado').value) || 0;
    const tamadoIjasz = parseInt(document.getElementById('tamado_ijasz').value) || 0;
    const tamadoLovas = parseInt(document.getElementById('tamado_lovas').value) || 0;
    
    const kellElitreValtani = (tamadoKatona + tamadoTamado + tamadoIjasz + tamadoLovas) === 0;
    const celMezoId = kellElitreValtani ? 'tamado_elit' : 'tamado_lovas';
    const eredmeny = findRequiredUnitValue(celMezoId, celTamadoero, szamolTamadoero);
    
    if (!eredmeny) {
        alert('A beállított feltételek mellett nem lehet elegendő sereget számolni a támadáshoz.');
        return;
    }
    
    if (eredmeny.added === 0) {
        alert('A támadóerő már elég magas, nincs szükség további egységekre.');
        return;
    }
    
    const celMezo = document.getElementById(celMezoId);
    celMezo.value = eredmeny.finalValue;
    
    szamol();
    
    if (kellElitreValtani) {
        alert(`Szükséges ${formatNumber(eredmeny.added)} további elit a beütéshez.`);
    } else {
        alert(`Szükséges ${formatNumber(eredmeny.added)} további lovas a beütéshez.`);
    }
}

// Szám formázása
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Szám kinyerése szövegből (kezeli a szóközöket és pontokat)
// A pont a tizes csoport elválasztója, nem tizedesvessző
function extractNumber(text) {
    if (!text) return 0;
    // Eltávolítjuk a szóközöket és pontokat (tizes csoport elválasztók), csak a számokat hagyjuk meg
    return parseInt(text.replace(/[.,\s]/g, '')) || 0;
}

// Hadi tekercs maximum értékek faj, tudós és tudomány hónapja alapján
function getHadiTekercsMax(faj, hasTudomanyHonapja, hasTudos) {
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

// Hadi tekercs értékének beállítása faj és tudomány hónapja alapján
function updateHadiTekercs(tipus) {
    const fajField = document.getElementById(tipus + '_faj');
    const faj = fajField ? fajField.value : 'none';
    
    if (faj === 'none') return;
    
    const tudosCheckbox = document.getElementById(tipus + '_tudos');
    const tudomanyHonapjaCheckbox = document.getElementById(tipus + '_tudomany_honapja');
    const tudosSzazalekField = document.getElementById(tipus + '_tudos_szazalek');
    
    if (!tudosSzazalekField) return;
    
    const hasTudos = tudosCheckbox && tudosCheckbox.checked;
    const hasTudomanyHonapja = tudomanyHonapjaCheckbox && tudomanyHonapjaCheckbox.checked;
    
    const maxHadiTekercs = getHadiTekercsMax(faj, hasTudomanyHonapja, hasTudos);
    tudosSzazalekField.value = maxHadiTekercs;
}

// Lakáshelyzeti tekercs maximum értékek faj és tudomány hónapja alapján
function getLakashelyzetiTekercsMax(faj, hasTudomanyHonapja) {
    // Alapértelmezett: 30%
    // Gnóm: 50% (minden tudományág)
    // Óriás: 40% (mágia és lakáshelyzet területén)
    // Félelf: 40% (tolvajlás és lakáshelyzet területén)
    // Törpe: 30% (csak ipar és hadügy 40%)
    // Elf: 30% (csak hadügy és mágia 40%)
    // Ork: 30% (csak hadügy és mezőgazdaság 40%)
    // Élőhalott: 30%
    // Ember: 30%
    
    let baseMax = 30;
    if (faj === 'gnom') baseMax = 50;
    else if (faj === 'orias' || faj === 'felelf') baseMax = 40;
    
    // Tudomány hónapja: +5%
    if (hasTudomanyHonapja) {
        baseMax += 5;
    }
    
    return baseMax;
}

// Lakáshelyzeti tekercs frissítése
function updateLakashelyzetiTekercs(tipus) {
    const fajField = document.getElementById(tipus + '_faj');
    const faj = fajField ? fajField.value : 'none';
    
    if (faj === 'none') return;
    
    const tudomanyHonapjaCheckbox = document.getElementById(tipus + '_tudomany_honapja');
    const lakashelyzetiField = document.getElementById(tipus + '_lakashelyzeti_tekercs');
    
    if (!lakashelyzetiField) return;
    
    const hasTudomanyHonapja = tudomanyHonapjaCheckbox && tudomanyHonapjaCheckbox.checked;
    const maxLakashelyzeti = getLakashelyzetiTekercsMax(faj, hasTudomanyHonapja);
    
    // Frissítjük az értéket a max-ra
    lakashelyzetiField.value = maxLakashelyzeti;
}

// Kristálygömb importálása - új, egyszerűbb megközelítés
function importKristalygomb(tipus) {
    const textarea = document.getElementById(tipus + '_kristalygomb');
    const text = textarea ? textarea.value : '';
    if (!text || text.trim() === '') return;
    
    const data = {};
    let selectedFaj = 'none';
    let hasTudos = false;
    let szemelyisegek = [];
    
    // Normalizáljuk a szöveget: tab-okat szóközökké, de megtartjuk a sorokat
    // Többszörös szóközöket egy szóközzé (de nem a sorok közötti szóközöket)
    let normalizedText = text.replace(/\t/g, ' ');
    // Többszörös szóközöket egy szóközzé (de nem a newline-okat)
    normalizedText = normalizedText.replace(/[ \t]+/g, ' ');
    
    // Segédfüggvény: érték kinyerése kulcsszó után
    function extractValue(keyword) {
        // Keresünk a kulcsszóra, majd a kettőspont után vesszük az értéket
        // Case-insensitive keresés
        const regex = new RegExp(keyword + ':\\s*([^\\n]+)', 'i');
        const match = normalizedText.match(regex);
        if (match) {
            // Az érték a kettőspont után, sor végéig
            let value = match[1].trim();
            // Ha szám, akkor csak a számot vesszük (pont és szóköz eltávolítása)
            if (/^[0-9.,\s]+/.test(value)) {
                // Kivesszük a számot (pont, vessző, szóköz nélkül)
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
        // Eltávolítjuk a "hektár" szót, ha van
        const hektarNum = foldValue.replace(/hektár/gi, '').trim();
        if (hektarNum) {
            data.hektar = extractNumber(hektarNum);
        }
    }
    
    // Katona
    const katonaValue = extractValue('Katona');
    if (katonaValue) {
        data.katona = extractNumber(katonaValue);
    }
    
    // Védő
    const vedoValue = extractValue('Védő');
    if (vedoValue) {
        data.vedo = extractNumber(vedoValue);
    }
    
    // Támadó
    const tamadoValue = extractValue('Támadó');
    if (tamadoValue) {
        data.tamado = extractNumber(tamadoValue);
    }
    
    // Íjász
    const ijszValue = extractValue('Íjász');
    if (ijszValue) {
        data.ijsz = extractNumber(ijszValue);
    }
    
    // Lovas
    const lovasValue = extractValue('Lovas');
    if (lovasValue) {
        data.lovas = extractNumber(lovasValue);
    }
    
    // Elit
    const elitValue = extractValue('Elit');
    if (elitValue) {
        data.elit = extractNumber(elitValue);
    }
    
    // Katonai morál - javított regex tab karakterekkel is
    // Több formátum támogatása: "Katonai morál:\t94 %" vagy "Katonai morál: 94 %"
    let moralValue = null;
    // Először próbáljuk meg az eredeti szöveggel (tab karakterekkel)
    const moralRegexTab = /Katonai morál\s*:\s*(\d+)\s*%/i;
    const moralMatchTab = textarea.value.match(moralRegexTab);
    if (moralMatchTab) {
        moralValue = moralMatchTab[1];
    } else {
        // Ha nem található, próbáljuk meg az extractValue függvénnyel (normalizált szöveggel)
        moralValue = extractValue('Katonai morál');
        if (moralValue) {
            // Eltávolítjuk a % jelet, ha van
            const moralNum = moralValue.replace(/%/g, '').trim();
            if (moralNum) {
                moralValue = extractNumber(moralNum).toString();
            }
        }
    }
    
    if (moralValue) {
        data.katonai_moral = parseInt(moralValue) || 0;
    }
    
    // Szövetség
    const szovetsegValue = extractValue('Szövetség');
    if (szovetsegValue) {
        // Ha "magányos"-ra kezdődik (kisbetűvel), akkor magányos farkas
        const szovetsegLower = szovetsegValue.trim().toLowerCase();
        if (szovetsegLower.startsWith('magányos')) {
            document.getElementById(tipus + '_maganyos_farkas').checked = true;
        }
    }
    
    // Faj
    const fajValue = extractValue('Faj');
    if (fajValue) {
        const fajText = fajValue.trim();
        const fajMap = {
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
            selectedFaj = fajMap[fajText];
            document.getElementById(tipus + '_faj').value = selectedFaj;
        }
    }
    
    // Személyiség
    const szemelyisegValue = extractValue('Személyiség');
    if (szemelyisegValue) {
        // Vesszővel elválasztott személyiségek
        szemelyisegek = szemelyisegValue.split(',').map(s => s.trim()).filter(s => s.length > 0);
        
        // Tudós ellenőrzés
        hasTudos = szemelyisegek.some(s => s.includes('Tudós'));
        if (hasTudos) {
            document.getElementById(tipus + '_tudos').checked = true;
        }
    }
    
    // Hadi tekercs automatikus beállítása faj alapján
    if (selectedFaj !== 'none') {
        const hasTudomanyHonapja = document.getElementById(tipus + '_tudomany_honapja') && document.getElementById(tipus + '_tudomany_honapja').checked;
        const maxTekercs = getHadiTekercsMax(selectedFaj, hasTudomanyHonapja, hasTudos);
        document.getElementById(tipus + '_tudos_szazalek').value = maxTekercs;
    }
    
    // Lakáshelyzeti tekercs max beállítása faj alapján
    if (selectedFaj !== 'none' && tipus === 'vedo') {
        const hasTudomanyHonapja = document.getElementById('vedo_tudomany_honapja') && document.getElementById('vedo_tudomany_honapja').checked;
        const maxLakashelyzeti = getLakashelyzetiTekercsMax(selectedFaj, hasTudomanyHonapja);
        document.getElementById('vedo_lakashelyzeti_tekercs').value = maxLakashelyzeti;
    }
    
    // Értékek beállítása - csak akkor írjuk felül, ha az adott mező 0 vagy üres
    if (data.katona !== undefined) {
        const katonaField = document.getElementById(tipus + '_katona');
        if (katonaField && (!katonaField.value || parseInt(katonaField.value) === 0)) {
            katonaField.value = data.katona;
        }
    }
    if (data.vedo !== undefined && tipus === 'vedo') {
        const vedoField = document.getElementById(tipus + '_vedo');
        if (vedoField && (!vedoField.value || parseInt(vedoField.value) === 0)) {
            vedoField.value = data.vedo;
        }
    }
    if (data.tamado !== undefined) {
        const tamadoField = document.getElementById(tipus + '_tamado');
        if (tamadoField && (!tamadoField.value || parseInt(tamadoField.value) === 0)) {
            tamadoField.value = data.tamado;
        }
    }
    if (data.ijsz !== undefined) {
        const ijszField = document.getElementById(tipus + '_ijasz');
        if (ijszField && (!ijszField.value || parseInt(ijszField.value) === 0)) {
            ijszField.value = data.ijsz;
        }
    }
    if (data.lovas !== undefined) {
        const lovasField = document.getElementById(tipus + '_lovas');
        if (lovasField && (!lovasField.value || parseInt(lovasField.value) === 0)) {
            lovasField.value = data.lovas;
        }
    }
    if (data.elit !== undefined) {
        const elitField = document.getElementById(tipus + '_elit');
        if (elitField && (!elitField.value || parseInt(elitField.value) === 0)) {
            elitField.value = data.elit;
        }
    }
    if (data.katonai_moral !== undefined) {
        const moralField = document.getElementById(tipus + '_katonai_moral');
        if (moralField) {
            // Mindig felülírjuk az értéket, ha van a kristálygömb-ben
            moralField.value = data.katonai_moral;
        }
    }
    if (data.hektar !== undefined && tipus === 'vedo') {
        const hektarField = document.getElementById('vedo_hektar');
        if (hektarField && (!hektarField.value || parseInt(hektarField.value) === 0)) {
            hektarField.value = data.hektar;
        }
        
        // Automatikus őrtorony számítás: összterület 10%-a
        // De csak akkor, ha nincs épületlista adat vagy az őrtorony mező üres
        const epuletlistaTextarea = document.getElementById('vedo_epuletlista');
        const hasEpuletlista = epuletlistaTextarea && epuletlistaTextarea.value.trim() !== '';
        const ortoronyField = document.getElementById('vedo_ortorony');
        
        if (ortoronyField && (!ortoronyField.value || parseInt(ortoronyField.value) === 0)) {
            // Ha nincs épületlista, akkor számoljuk ki: hektár * 0.1 (10%)
            if (!hasEpuletlista) {
                const ortoronySzam = Math.round(data.hektar * 0.1);
                ortoronyField.value = ortoronySzam;
            }
            // Ha van épületlista, akkor az importEpuletlista függvény fogja beállítani
        }
    }
    
    // Mezők állapotának frissítése
    updateFieldStates();
    
    // Tábornok maximum értékek beállítása (csak támadóknál)
    if (tipus === 'tamado') {
        const tamadoFaj = document.getElementById('tamado_faj').value;
        const tamadoTabornok = document.getElementById('tamado_tabornok');
        const tamadoTabornokSzemelyisegCheckbox = document.getElementById('tamado_tabornok_szemelyiseg');
        
        // Ellenőrizzük a checkboxot és a személyiségeket
        let hasTabornokSzemelyiseg = false;
        if (tamadoTabornokSzemelyisegCheckbox && tamadoTabornokSzemelyisegCheckbox.checked) {
            hasTabornokSzemelyiseg = true;
        } else {
            hasTabornokSzemelyiseg = szemelyisegek.some(s => s.includes('Tábornok'));
        }
        
        // Ha a kristálygömb-ben van Tábornok személyiség, akkor automatikusan bejelöljük a checkboxot is
        if (hasTabornokSzemelyiseg && tamadoTabornokSzemelyisegCheckbox && !tamadoTabornokSzemelyisegCheckbox.checked) {
            if (szemelyisegek.some(s => s.includes('Tábornok'))) {
                tamadoTabornokSzemelyisegCheckbox.checked = true;
            }
        }
        
        // Tábornok maximum értékek:
        // - Gnóm: max 4, ha van Tábornok személyiség: max 5
        // - Ork: max 6, ha van Tábornok személyiség: max 7
        // - Más fajok: max 5, ha van Tábornok személyiség: max 6
        let maxTabornok = 5;
        if (tamadoFaj === 'gnom') {
            maxTabornok = 4;
        } else if (tamadoFaj === 'ork') {
            maxTabornok = 6;
        }
        
        // Ha van Tábornok személyiség, +1
        if (hasTabornokSzemelyiseg) {
            maxTabornok += 1;
        }
        
        // Frissítjük a select opciókat
        const currentValue = parseInt(tamadoTabornok.value) || 0;
        tamadoTabornok.innerHTML = '';
        for (let i = 0; i <= maxTabornok; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            if (i === currentValue || (i === 5 && currentValue > maxTabornok)) {
                option.selected = true;
            }
            tamadoTabornok.appendChild(option);
        }
        
        // Ha a jelenlegi érték nagyobb mint a maximum, akkor állítsuk be a maximumra
        if (currentValue > maxTabornok) {
            tamadoTabornok.value = maxTabornok;
        }
    }
    
    // Ne hívjuk meg a szamol() függvényt itt, mert a feldolgozEsSzamol() vagy az onBlur hívja meg
    // Az onBlur eseményben már meghívjuk: importKristalygomb('vedo'); szamol();
}

// Épületlista importálása
function importEpuletlista(tipus) {
    const textarea = document.getElementById(tipus + '_epuletlista');
    const text = textarea ? textarea.value : '';
    if (!text || text.trim() === '') return;
    
    const data = {};
    
    // Ellenőrizzük, hogy van-e kristálygömb adat
    const kristalygombTextarea = document.getElementById(tipus + '_kristalygomb');
    const hasKristalygomb = kristalygombTextarea && kristalygombTextarea.value.trim() !== '';
    
    // Ha van kristálygömb adat, csak az Őrtornyok számát vegyük ki
    if (hasKristalygomb && tipus === 'vedo') {
        // Őrtorony - több formátum támogatása
        const ortoronyMatch = text.match(/Őrtorony:\s*([0-9.,\s]+)/i);
        if (ortoronyMatch) {
            data.ortorony = extractNumber(ortoronyMatch[1]);
        }
        
        // Értékek beállítása - ha van őrtorony az épületlistában, mindig azt használjuk
        if (data.ortorony !== undefined) {
            const ortoronyField = document.getElementById('vedo_ortorony');
            if (ortoronyField) {
                ortoronyField.value = data.ortorony;
            }
        }
    } else if (tipus === 'vedo') {
        // Ha nincs kristálygömb adat, akkor mindent feldolgozunk
        // Összes épület összeadása a hektár számításához
        let totalHektar = 0;
        let barakkok = 0;
        
        // Épületek listája (ugyanazok, mint az index.html-ben)
        const epuletek = [
            'Szabad terület', 'Üres', 'Ház', 'Barakk', 'Kovácsműhely', 'Tanya',
            'Könyvtár', 'Raktár', 'Őrtorony', 'Kocsma', 'Templom', 'Kórház',
            'Piac', 'Bank', 'Fatelep', 'Kőbánya', 'Fémbánya', 'Agyagbánya',
            'Drágakőbánya', 'Erdő', 'Kőlelőhely', 'Fémlelőhely', 'Agyaglelőhely',
            'Drágakőlelőhely'
        ];
        
        // Feldolgozzuk a sorokat (megtartjuk a newline-okat)
        const lines = text.split('\n');
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            if (!line || !line.trim()) continue;
            
            // Kettőspont vagy tab alapján szétválasztás
            let parts = line.split(':');
            if (parts.length < 2) {
                parts = line.split('\t');
            }
            
            if (parts.length >= 2) {
                const epuletNev = parts[0].trim();
                // A számot kinyerjük, eltávolítva a pontokat és szóközöket
                const epuletSzam = extractNumber(parts[1].trim());
                
                // Ha ez egy épület, adjuk hozzá a hektárhoz
                if (epuletek.some(e => epuletNev.includes(e))) {
                    totalHektar += epuletSzam;
                    
                    // Barakkok számának mentése
                    if (epuletNev.includes('Barakk')) {
                        barakkok = epuletSzam;
                    }
                    
                    // Őrtorony mentése
                    if (epuletNev.includes('Őrtorony')) {
                        data.ortorony = epuletSzam;
                    }
                }
            }
        }
        
        // Hektár beállítása (összes épület összege)
        if (totalHektar > 0) {
            const hektarField = document.getElementById('vedo_hektar');
            if (hektarField && (!hektarField.value || parseInt(hektarField.value) === 0)) {
                hektarField.value = totalHektar;
            }
        }
        
        // Őrtorony beállítása
        if (data.ortorony !== undefined) {
            const ortoronyField = document.getElementById('vedo_ortorony');
            if (ortoronyField) {
                // Ha van őrtorony az épületlistában, mindig azt használjuk
                ortoronyField.value = data.ortorony;
            }
        } else {
            // Ha nincs őrtorony az épületlistában, de van hektár adat, számoljuk ki: hektár * 0.1 (10%)
            const hektarField = document.getElementById('vedo_hektar');
            const ortoronyField = document.getElementById('vedo_ortorony');
            if (hektarField && ortoronyField) {
                const hektar = parseInt(hektarField.value) || 0;
                if (hektar > 0 && (!ortoronyField.value || parseInt(ortoronyField.value) === 0)) {
                    const ortoronySzam = Math.round(hektar * 0.1);
                    ortoronyField.value = ortoronySzam;
                }
            }
        }
        
        // Ha faj kiválasztásra kerül, beállítjuk a max lakáshelyzeti tekercs értékét
        const fajField = document.getElementById('vedo_faj');
        if (fajField && fajField.value !== 'none') {
            const hasTudomanyHonapja = document.getElementById('vedo_tudomany_honapja') && document.getElementById('vedo_tudomany_honapja').checked;
            const maxLakashelyzeti = getLakashelyzetiTekercsMax(fajField.value, hasTudomanyHonapja);
            const lakashelyzetiField = document.getElementById('vedo_lakashelyzeti_tekercs');
            if (lakashelyzetiField) {
                const currentValue = parseInt(lakashelyzetiField.value) || 0;
                if (currentValue === 0 || currentValue > maxLakashelyzeti) {
                    lakashelyzetiField.value = maxLakashelyzeti;
                }
            }
            
            // Íjászok max számának számítása barakkok és lakáshelyzet alapján
            // Barakk: 40 katonai egység alapból, lakáshelyzeti tekercs növeli
            if (barakkok > 0) {
                const lakashelyzeti = parseFloat(lakashelyzetiField.value) || 0;
                // Férőhely = barakkok * 40 * (1 + lakashelyzeti / 100)
                const maxFerhely = Math.floor(barakkok * 40 * (1 + lakashelyzeti / 100));
                const ijszField = document.getElementById('vedo_ijasz');
                if (ijszField && (!ijszField.value || parseInt(ijszField.value) === 0)) {
                    ijszField.value = maxFerhely;
                }
            }
        }
    } else if (tipus === 'tamado') {
        // Támadóknál is ugyanez, ha nincs kristálygömb adat
        // Összes épület összeadása a hektár számításához
        let totalHektar = 0;
        let barakkok = 0;
        
        // Épületek listája
        const epuletek = [
            'Szabad terület', 'Üres', 'Ház', 'Barakk', 'Kovácsműhely', 'Tanya',
            'Könyvtár', 'Raktár', 'Őrtorony', 'Kocsma', 'Templom', 'Kórház',
            'Piac', 'Bank', 'Fatelep', 'Kőbánya', 'Fémbánya', 'Agyagbánya',
            'Drágakőbánya', 'Erdő', 'Kőlelőhely', 'Fémlelőhely', 'Agyaglelőhely',
            'Drágakőlelőhely'
        ];
        
        // Feldolgozzuk a sorokat
        const lines = text.split('\n');
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            if (!line || !line.trim()) continue;
            
            // Kettőspont vagy tab alapján szétválasztás
            let parts = line.split(':');
            if (parts.length < 2) {
                parts = line.split('\t');
            }
            
            if (parts.length >= 2) {
                const epuletNev = parts[0].trim();
                const epuletSzam = extractNumber(parts[1].trim());
                
                // Ha ez egy épület, adjuk hozzá a hektárhoz
                if (epuletek.some(e => epuletNev.includes(e))) {
                    totalHektar += epuletSzam;
                    
                    // Barakkok számának mentése
                    if (epuletNev.includes('Barakk')) {
                        barakkok = epuletSzam;
                    }
                }
            }
        }
        
        // Ha faj kiválasztásra kerül, beállítjuk a max lakáshelyzeti tekercs értékét
        const fajField = document.getElementById('tamado_faj');
        if (fajField && fajField.value !== 'none') {
            const hasTudomanyHonapja = document.getElementById('tamado_tudomany_honapja') && document.getElementById('tamado_tudomany_honapja').checked;
            const lakashelyzetiField = document.getElementById('tamado_lakashelyzeti_tekercs');
            const maxLakashelyzeti = getLakashelyzetiTekercsMax(fajField.value, hasTudomanyHonapja);
            if (lakashelyzetiField) {
                const currentValue = parseInt(lakashelyzetiField.value) || 0;
                if (currentValue === 0 || currentValue > maxLakashelyzeti) {
                    lakashelyzetiField.value = maxLakashelyzeti;
                }
            }
            
            // Lovasok max számának számítása barakkok és lakáshelyzet alapján
            // Barakk: 40 katonai egység alapból, lakáshelyzeti tekercs növeli
            if (barakkok > 0) {
                const lakashelyzeti = parseFloat(lakashelyzetiField.value) || 0;
                // Férőhely = barakkok * 40 * (1 + lakashelyzeti / 100)
                const maxFerhely = Math.floor(barakkok * 40 * (1 + lakashelyzeti / 100));
                const lovasField = document.getElementById('tamado_lovas');
                if (lovasField && (!lovasField.value || parseInt(lovasField.value) === 0)) {
                    lovasField.value = maxFerhely;
                }
            }
        }
    }
    
    // Ne hívjuk meg a szamol() függvényt itt, mert a feldolgozEsSzamol() hívja meg
}

// Törlés függvény - kitörli az adatokat, de a textarea mezőket nem
function torles(tipus) {
    // Katonai egységek törlése
    document.getElementById(tipus + '_katona').value = '0';
    if (tipus === 'vedo') {
        document.getElementById('vedo_vedo').value = '0';
    }
    document.getElementById(tipus + '_tamado').value = '0';
    document.getElementById(tipus + '_ijasz').value = '0';
    document.getElementById(tipus + '_lovas').value = '0';
    document.getElementById(tipus + '_elit').value = '0';
    
    // Katonai morál alapértékre
    document.getElementById(tipus + '_katonai_moral').value = '75';
    
    // Faj alapértékre
    document.getElementById(tipus + '_faj').value = 'none';
    
    // Checkboxok törlése
    document.getElementById(tipus + '_tudos').checked = false;
    document.getElementById(tipus + '_tudos_szazalek').value = '0';
    document.getElementById(tipus + '_maganyos_farkas').checked = false;
    
    if (tipus === 'vedo') {
        document.getElementById('vedo_vedelem').checked = false;
        document.getElementById('vedo_hektar').value = '0';
        document.getElementById('vedo_ortorony').value = '0';
        document.getElementById('vedo_szovetseges_ijaszok').value = '0';
        document.getElementById('vedo_kitamadasi_bonusz').checked = false;
        document.getElementById('vedo_elohalott_szint').value = '5';
        document.getElementById('vedo_szabadsagon_szovetsegesek').value = '0';
        document.getElementById('vedo_lakashelyzeti_tekercs').value = '0';
    } else {
        document.getElementById('tamado_verszomj').checked = false;
        document.getElementById('tamado_tabornok').value = '0';
        document.getElementById('tamado_elohalott_szint').value = '0';
        document.getElementById('tamado_kor').value = '2';
        const felfeleRadio = document.getElementById('tamado_felfele');
        if (felfeleRadio) felfeleRadio.checked = true;
    }
    
    // Számítás újra
    szamol();
}

// Mezők aktiválása/deaktiválása faj alapján
function updateFieldStates() {
    // Védők
    const vedoFaj = document.getElementById('vedo_faj').value;
    const vedoMaganyosFarkas = document.getElementById('vedo_maganyos_farkas').checked;
    
    // Kitámadási bónusz csak ork esetén
    const vedoKitamadasiBonusz = document.getElementById('vedo_kitamadasi_bonusz');
    if (vedoFaj === 'ork') {
        vedoKitamadasiBonusz.disabled = false;
        vedoKitamadasiBonusz.classList.remove('bg-gray-100');
    } else {
        vedoKitamadasiBonusz.disabled = true;
        vedoKitamadasiBonusz.classList.add('bg-gray-100');
        vedoKitamadasiBonusz.checked = false;
    }
    
    // Élőhalott szint csak élőhalott esetén
    const vedoElohalottSzint = document.getElementById('vedo_elohalott_szint');
    if (vedoFaj === 'elohalott') {
        vedoElohalottSzint.disabled = false;
        vedoElohalottSzint.classList.remove('bg-gray-100');
    } else {
        vedoElohalottSzint.disabled = true;
        vedoElohalottSzint.classList.add('bg-gray-100');
        vedoElohalottSzint.value = '5';
    }
    
    // Szabadságon lévő szövetségesek csak ha nem magányos farkas
    const vedoSzabadsagon = document.getElementById('vedo_szabadsagon_szovetsegesek');
    if (vedoMaganyosFarkas) {
        vedoSzabadsagon.disabled = true;
        vedoSzabadsagon.classList.add('bg-gray-100');
        vedoSzabadsagon.value = '0';
    } else {
        vedoSzabadsagon.disabled = false;
        vedoSzabadsagon.classList.remove('bg-gray-100');
    }
    
    // Szövetséges íjászok csak ha nem magányos farkas
    const vedoSzovetsegesIjszok = document.getElementById('vedo_szovetseges_ijaszok');
    if (vedoSzovetsegesIjszok) {
        if (vedoMaganyosFarkas) {
            vedoSzovetsegesIjszok.disabled = true;
            vedoSzovetsegesIjszok.classList.add('bg-gray-100');
            vedoSzovetsegesIjszok.value = '0';
        } else {
            vedoSzovetsegesIjszok.disabled = false;
            vedoSzovetsegesIjszok.classList.remove('bg-gray-100');
        }
    }
    
    // Lakáshelyzeti tekercs max beállítása
    if (vedoFaj !== 'none') {
        const hasTudomanyHonapja = document.getElementById('vedo_tudomany_honapja') && document.getElementById('vedo_tudomany_honapja').checked;
        const maxLakashelyzeti = getLakashelyzetiTekercsMax(vedoFaj, hasTudomanyHonapja);
        const vedoLakashelyzeti = document.getElementById('vedo_lakashelyzeti_tekercs');
        const currentValue = parseInt(vedoLakashelyzeti.value) || 0;
        if (currentValue === 0 || currentValue > maxLakashelyzeti) {
            vedoLakashelyzeti.value = maxLakashelyzeti;
        }
    }
    
    // Támadók
    const tamadoFaj = document.getElementById('tamado_faj').value;
    const tamadoMaganyosFarkas = document.getElementById('tamado_maganyos_farkas').checked;
    
    // Lakáshelyzeti tekercs max beállítása
    if (tamadoFaj !== 'none') {
        const hasTudomanyHonapja = document.getElementById('tamado_tudomany_honapja') && document.getElementById('tamado_tudomany_honapja').checked;
        const maxLakashelyzeti = getLakashelyzetiTekercsMax(tamadoFaj, hasTudomanyHonapja);
        const tamadoLakashelyzeti = document.getElementById('tamado_lakashelyzeti_tekercs');
        const currentValue = parseInt(tamadoLakashelyzeti.value) || 0;
        if (currentValue === 0 || currentValue > maxLakashelyzeti) {
            tamadoLakashelyzeti.value = maxLakashelyzeti;
        }
    }
    
    // Élőhalott szint csak élőhalott esetén
    const tamadoElohalottSzint = document.getElementById('tamado_elohalott_szint');
    if (tamadoFaj === 'elohalott') {
        tamadoElohalottSzint.disabled = false;
        tamadoElohalottSzint.classList.remove('bg-gray-100');
    } else {
        tamadoElohalottSzint.disabled = true;
        tamadoElohalottSzint.classList.add('bg-gray-100');
        tamadoElohalottSzint.value = '0';
    }
    
    // Tábornok maximum értékek faj és személyiség alapján
    const tamadoTabornok = document.getElementById('tamado_tabornok');
    const tamadoKristalygomb = document.getElementById('tamado_kristalygomb');
    const tamadoTabornokSzemelyisegCheckbox = document.getElementById('tamado_tabornok_szemelyiseg');
    let hasTabornokSzemelyiseg = false;
    
    // Először ellenőrizzük a checkboxot (manuális beállítás)
    if (tamadoTabornokSzemelyisegCheckbox && tamadoTabornokSzemelyisegCheckbox.checked) {
        hasTabornokSzemelyiseg = true;
    } else {
        // Ha nincs bejelölve, akkor ellenőrizzük a kristálygömb szövegét
        if (tamadoKristalygomb && tamadoKristalygomb.value.trim() !== '') {
            const szemelyisegMatch = tamadoKristalygomb.value.match(/Személyiség:\s*\t+\s*([^\t\n\r]+)/);
            if (szemelyisegMatch) {
                const szemelyisegText = szemelyisegMatch[1].trim();
                const szemelyisegek = szemelyisegText.split(',').map(s => s.trim()).filter(s => s.length > 0);
                hasTabornokSzemelyiseg = szemelyisegek.some(s => s.includes('Tábornok'));
            }
        }
    }
    
    // Ha a kristálygömb-ben van Tábornok személyiség, akkor automatikusan bejelöljük a checkboxot is
    if (hasTabornokSzemelyiseg && tamadoTabornokSzemelyisegCheckbox && !tamadoTabornokSzemelyisegCheckbox.checked) {
        // Csak akkor jelöljük be automatikusan, ha a kristálygömb-ből jött
        if (tamadoKristalygomb && tamadoKristalygomb.value.trim() !== '') {
            const szemelyisegMatch = tamadoKristalygomb.value.match(/Személyiség:\s*\t+\s*([^\t\n\r]+)/);
            if (szemelyisegMatch) {
                const szemelyisegText = szemelyisegMatch[1].trim();
                const szemelyisegek = szemelyisegText.split(',').map(s => s.trim()).filter(s => s.length > 0);
                if (szemelyisegek.some(s => s.includes('Tábornok'))) {
                    tamadoTabornokSzemelyisegCheckbox.checked = true;
                }
            }
        }
    }
    
    // Tábornok maximum értékek:
    // - Gnóm: max 4, ha van Tábornok személyiség: max 5
    // - Ork: max 6, ha van Tábornok személyiség: max 7
    // - Más fajok: max 5, ha van Tábornok személyiség: max 6
    let maxTabornok = 5;
    if (tamadoFaj === 'gnom') {
        maxTabornok = 4;
    } else if (tamadoFaj === 'ork') {
        maxTabornok = 6;
    }
    
    // Ha van Tábornok személyiség, +1
    if (hasTabornokSzemelyiseg) {
        maxTabornok += 1;
    }
    
    // Frissítjük a select opciókat
    const currentValue = parseInt(tamadoTabornok.value) || 0;
    tamadoTabornok.innerHTML = '';
    for (let i = 0; i <= maxTabornok; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        if (i === currentValue || (i === 5 && currentValue > maxTabornok)) {
            option.selected = true;
        }
        tamadoTabornok.appendChild(option);
    }
    
    // Ha a jelenlegi érték nagyobb mint a maximum, akkor állítsuk be a maximumra
    if (currentValue > maxTabornok) {
        tamadoTabornok.value = maxTabornok;
    }
}

// Oldal betöltésekor számolás
$(document).ready(function() {
    updateFieldStates();
    szamol();
});

