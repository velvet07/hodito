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
            const hasTudomanyHonapja = document.getElementById('tamado_tudomany_honapja') && document.getElementById('tamado_tudomany_honapja').checked;
            const maxLakashelyzeti = getLakashelyzetiTekercsMax(tamadoFaj, hasTudomanyHonapja);
            const tamadoLakashelyzetiField = document.getElementById('tamado_lakashelyzeti_tekercs');
            if (tamadoLakashelyzetiField) {
                tamadoLakashelyzetiField.value = maxLakashelyzeti;
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

// Védőerő számítása
function szamolVedoero() {
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
    
    // Őrtorony íjászok (8 pont helyett 6, de elf esetén 8)
    const ortorony = parseInt(document.getElementById('vedo_ortorony').value) || 0;
    const faj = document.getElementById('vedo_faj').value;
    const ortoronyBonus = (faj === 'elf') ? 8 : 6;
    const ortoronyIjsz = Math.min(ijsz, ortorony * 100); // 1 őrtorony = 100 íjász
    alapVedoero += ortoronyIjsz * (ortoronyBonus - EGYSEG_ERTEK.ijsz.vedo);
    
    // Szövetséges íjászok
    const szovetsegesIjsz = parseInt(document.getElementById('vedo_szovetseges_ijaszok').value) || 0;
    alapVedoero += szovetsegesIjsz * EGYSEG_ERTEK.ijsz.vedo;
    
    // Minimális védőerő (hektár)
    const hektar = parseInt(document.getElementById('vedo_hektar').value) || 0;
    if (alapVedoero < hektar) {
        alapVedoero = hektar;
    }
    
    // Módosítók
    let vedoero = alapVedoero;
    
    // Faji bónusz
    const fajBonus = FAJ_BONUSZ[faj] || FAJ_BONUSZ.none;
    vedoero *= fajBonus.vedo;
    
    // Katonai morál
    const moral = parseFloat(document.getElementById('vedo_katonai_moral').value) || 75;
    vedoero *= (moral / 100);
    
    // Magányos farkas
    if (document.getElementById('vedo_maganyos_farkas').checked) {
        vedoero *= 1.40;
    }
    
    // Védelem varázslat
    if (document.getElementById('vedo_vedelem').checked) {
        vedoero *= 1.30;
    }
    
    // Kitámadási bónusz (ork)
    if (document.getElementById('vedo_kitamadasi_bonusz').checked && faj === 'ork') {
        vedoero *= 1.20;
    }
    
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
    
    // Lakáshelyzeti tekercs (őrtorony kapacitás)
    const lakashelyzeti = parseFloat(document.getElementById('vedo_lakashelyzeti_tekercs').value) || 0;
    // Ez a számításban már benne van az őrtorony számításban
    
    // Hadi tekercs (tudós) - a mezőből olvassuk, de max-ig korlátozva
    if (document.getElementById('vedo_tudos').checked) {
        const faj = document.getElementById('vedo_faj').value;
        const maxHadiTekercs = getHadiTekercsMax(faj, false);
        let tudosSzazalek = parseFloat(document.getElementById('vedo_tudos_szazalek').value) || 0;
        // Ha több mint max, akkor max-szal számolunk
        if (tudosSzazalek > maxHadiTekercs) {
            tudosSzazalek = maxHadiTekercs;
        }
        // Ha kevesebb mint max, akkor azzal számolunk, ami be van írva (nem csak a max-ot)
        vedoero *= (1 + tudosSzazalek / 100);
    }
    
    // Őrtorony területarányos védőérték
    if (hektar > 0 && ortorony > 0) {
        const ortoronyArany = (ortorony / hektar) * 100;
        const ortoronyVedoBonus = Math.min(ortoronyArany * 2, 30) / 100; // Maximum 30%
        vedoero *= (1 + ortoronyVedoBonus);
    }
    
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
    
    // Hadi tekercs (tudós) - a mezőből olvassuk, de max-ig korlátozva
    if (document.getElementById('tamado_tudos').checked) {
        const faj = document.getElementById('tamado_faj').value;
        const maxHadiTekercs = getHadiTekercsMax(faj, false);
        let tudosSzazalek = parseFloat(document.getElementById('tamado_tudos_szazalek').value) || 0;
        // Ha több mint max, akkor max-szal számolunk
        if (tudosSzazalek > maxHadiTekercs) {
            tudosSzazalek = maxHadiTekercs;
        }
        // Ha kevesebb mint max, akkor azzal számolunk, ami be van írva (nem csak a max-ot)
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
    const szuksegesVedoero = tamadoPont - jelenlegiVedoPont;
    
    // Íjász védőértéke (faj alapján)
    const faj = document.getElementById('vedo_faj').value;
    const ortoronyBonus = (faj === 'elf') ? 8 : 6;
    
    // Szükséges íjászok száma
    const szuksegesIjsz = Math.ceil(szuksegesVedoero / ortoronyBonus);
    
    // Beállítjuk az íjászok számát
    const ijszField = document.getElementById('vedo_ijasz');
    const jelenlegiIjsz = parseInt(ijszField.value) || 0;
    ijszField.value = jelenlegiIjsz + szuksegesIjsz;
    
    // Újraszámolás
    szamol();
    
    alert(`Szükséges ${formatNumber(szuksegesIjsz)} további íjász a védéshez.`);
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
    const szuksegesTamadoero = vedoPont - jelenlegiTamadoPont;
    
    // Lovas támadóértéke
    const lovasTamadoErtek = EGYSEG_ERTEK.lovas.tamado;
    
    // Faji bónusz
    const faj = document.getElementById('tamado_faj').value;
    const fajBonus = FAJ_BONUSZ[faj] || FAJ_BONUSZ.none;
    const lovasTamadoErtekBonusszal = lovasTamadoErtek * fajBonus.tamado;
    
    // Katonai morál
    const moral = parseFloat(document.getElementById('tamado_katonai_moral').value) || 75;
    const lovasTamadoErtekMoralral = lovasTamadoErtekBonusszal * (moral / 100);
    
    // Szükséges lovasok száma
    const szuksegesLovas = Math.ceil(szuksegesTamadoero / lovasTamadoErtekMoralral);
    
    // Beállítjuk a lovasok számát
    const lovasField = document.getElementById('tamado_lovas');
    const jelenlegiLovas = parseInt(lovasField.value) || 0;
    lovasField.value = jelenlegiLovas + szuksegesLovas;
    
    // Újraszámolás
    szamol();
    
    alert(`Szükséges ${formatNumber(szuksegesLovas)} további lovas a beütéshez.`);
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

// Hadi tekercs maximum értékek faj alapján (tudós személyiség nem ad extra százalékot)
function getHadiTekercsMax(faj, hasTudos) {
    // Gnóm: 50%, más fajok: 30%
    // A tudós személyiség nem ad hozzá extra százalékot a hadi tekercshez
    return (faj === 'gnom') ? 50 : 30;
}

// Hadi tekercs értékének beállítása faj és checkboxok alapján
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
    
    // Max érték számítása
    const maxHadiTekercs = getHadiTekercsMax(faj, hasTudos);
    
    // Jelenlegi érték
    let currentValue = parseFloat(tudosSzazalekField.value) || 0;
    
    // Ha 0 vagy üres, beállítjuk a max-ot
    if (currentValue === 0) {
        tudosSzazalekField.value = maxHadiTekercs;
        currentValue = maxHadiTekercs;
    }
    
    // Ha mindkettő be van kapcsolva (Tudós + Tudomány hónapja), módosítjuk az értéket
    if (hasTudos && hasTudomanyHonapja) {
        // Tudomány hónapja: +5% bónusz a hadi tekercshez
        const modifiedValue = currentValue + 5;
        // De ne lépjük túl a max-ot
        if (modifiedValue <= maxHadiTekercs) {
            tudosSzazalekField.value = modifiedValue;
        } else {
            tudosSzazalekField.value = maxHadiTekercs;
        }
    } else if (hasTudos && !hasTudomanyHonapja) {
        // Ha csak Tudós van bekapcsolva, akkor a max-ot használjuk (ha 0 volt)
        if (currentValue === 0 || currentValue > maxHadiTekercs) {
            tudosSzazalekField.value = maxHadiTekercs;
        }
    } else if (!hasTudos && hasTudomanyHonapja) {
        // Ha csak Tudomány hónapja van bekapcsolva, akkor nem módosítunk (csak ha Tudós is be van)
        // De ha 0 volt, akkor beállítjuk a base max-ot
        const baseMax = (faj === 'gnom') ? 50 : 30;
        if (currentValue === 0) {
            tudosSzazalekField.value = baseMax;
        }
    } else {
        // Ha egyik sincs bekapcsolva, akkor csak a base max-ot használjuk
        const baseMax = (faj === 'gnom') ? 50 : 30;
        if (currentValue === 0 || currentValue > baseMax) {
            tudosSzazalekField.value = baseMax;
        }
    }
    
    // Ha a jelenlegi érték több mint a max, akkor max-ra korlátozzuk
    const finalMax = getHadiTekercsMax(faj, hasTudos);
    const finalValue = parseFloat(tudosSzazalekField.value) || 0;
    if (finalValue > finalMax) {
        tudosSzazalekField.value = finalMax;
    }
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
    
    // Katonai morál
    const moralValue = extractValue('Katonai morál');
    if (moralValue) {
        // Eltávolítjuk a % jelet, ha van
        const moralNum = moralValue.replace(/%/g, '').trim();
        if (moralNum) {
            data.katonai_moral = extractNumber(moralNum);
        }
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
    
    // Hadi tekercs automatikus beállítása faj és tudós személyiség alapján
    if (hasTudos && selectedFaj !== 'none') {
        const maxTekercs = getHadiTekercsMax(selectedFaj, hasTudos);
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
        if (moralField && (!moralField.value || parseInt(moralField.value) === 0)) {
            moralField.value = data.katonai_moral;
        }
    }
    if (data.hektar !== undefined && tipus === 'vedo') {
        const hektarField = document.getElementById('vedo_hektar');
        if (hektarField && (!hektarField.value || parseInt(hektarField.value) === 0)) {
            hektarField.value = data.hektar;
        }
    }
    
    // Mezők állapotának frissítése
    updateFieldStates();
    
    // Tábornok maximum értékek beállítása (csak támadóknál)
    if (tipus === 'tamado') {
        const tamadoFaj = document.getElementById('tamado_faj').value;
        const tamadoTabornok = document.getElementById('tamado_tabornok');
        let hasTabornokSzemelyiseg = szemelyisegek.some(s => s.includes('Tábornok'));
        
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
        
        // Értékek beállítása - csak akkor írjuk felül, ha az adott mező 0 vagy üres
        if (data.ortorony !== undefined) {
            const ortoronyField = document.getElementById('vedo_ortorony');
            if (ortoronyField && (!ortoronyField.value || parseInt(ortoronyField.value) === 0)) {
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
            if (ortoronyField && (!ortoronyField.value || parseInt(ortoronyField.value) === 0)) {
                ortoronyField.value = data.ortorony;
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
            const maxLakashelyzeti = getLakashelyzetiTekercsMax(fajField.value, hasTudomanyHonapja);
            const lakashelyzetiField = document.getElementById('tamado_lakashelyzeti_tekercs');
            if (lakashelyzetiField) {
                // Támadóknál mindig max lakáshelyzeti tekercssel számolunk
                lakashelyzetiField.value = maxLakashelyzeti;
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
    let hasTabornokSzemelyiseg = false;
    
    // Ellenőrizzük, hogy van-e Tábornok személyiség a kristálygömb szövegében
    if (tamadoKristalygomb && tamadoKristalygomb.value.trim() !== '') {
        const szemelyisegMatch = tamadoKristalygomb.value.match(/Személyiség:\s*\t+\s*([^\t\n\r]+)/);
        if (szemelyisegMatch) {
            const szemelyisegText = szemelyisegMatch[1].trim();
            const szemelyisegek = szemelyisegText.split(',').map(s => s.trim()).filter(s => s.length > 0);
            hasTabornokSzemelyiseg = szemelyisegek.some(s => s.includes('Tábornok'));
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

// Segítő számítások
function szamolIjaszVedohoz() {
    // Ez a funkció még fejlesztés alatt áll.
    // TODO: Implementálni textarea mezővel
}

function szamolLovasTamadashoz() {
    // Ez a funkció még fejlesztés alatt áll.
    // TODO: Implementálni textarea mezővel
}

// Oldal betöltésekor számolás
$(document).ready(function() {
    updateFieldStates();
    szamol();
});

