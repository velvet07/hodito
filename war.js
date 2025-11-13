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

// Feldolgozás és számítás - a számítás gomb lenyomásakor
function feldolgozEsSzamol() {
    // Védők textarea értékeinek feldolgozása
    const vedoKristalygomb = document.getElementById('vedo_kristalygomb');
    const vedoEpuletlista = document.getElementById('vedo_epuletlista');
    if (vedoKristalygomb && vedoKristalygomb.value.trim() !== '') {
        importKristalygomb('vedo');
    }
    if (vedoEpuletlista && vedoEpuletlista.value.trim() !== '') {
        importEpuletlista('vedo');
    }
    
    // Támadók textarea értékeinek feldolgozása
    const tamadoKristalygomb = document.getElementById('tamado_kristalygomb');
    const tamadoEpuletlista = document.getElementById('tamado_epuletlista');
    if (tamadoKristalygomb && tamadoKristalygomb.value.trim() !== '') {
        importKristalygomb('tamado');
    }
    if (tamadoEpuletlista && tamadoEpuletlista.value.trim() !== '') {
        importEpuletlista('tamado');
    }
    
    // Számítás
    szamol();
}

// Számítás főfüggvény
function szamol() {
    const vedoPont = szamolVedoero();
    const tamadoPont = szamolTamadoero();
    
    // Eredmények oszlopban
    document.getElementById('vedopont').textContent = formatNumber(vedoPont);
    document.getElementById('tamadopont').textContent = formatNumber(tamadoPont);
    
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
    
    // Hadi tekercs (tudós)
    if (document.getElementById('vedo_tudos').checked) {
        const tudosSzazalek = parseFloat(document.getElementById('vedo_tudos_szazalek').value) || 0;
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
    
    // Hadi tekercs (tudós)
    if (document.getElementById('tamado_tudos').checked) {
        const tudosSzazalek = parseFloat(document.getElementById('tamado_tudos_szazalek').value) || 0;
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
function szamolGabonaszukseglet() {
    const katona = parseInt(document.getElementById('tamado_katona').value) || 0;
    const tamado = parseInt(document.getElementById('tamado_tamado').value) || 0;
    const ijsz = parseInt(document.getElementById('tamado_ijasz').value) || 0;
    const lovas = parseInt(document.getElementById('tamado_lovas').value) || 0;
    const elit = parseInt(document.getElementById('tamado_elit').value) || 0;
    const kor = parseInt(document.getElementById('tamado_kor').value) || 2;
    
    const osszesKatona = katona + tamado + ijsz + lovas + elit;
    // Egyszerű számítás: 1 katona = 1 bála/kör
    return osszesKatona * kor;
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

// Hadi tekercs maximum értékek faj és személyiség alapján
function getHadiTekercsMax(faj, hasTudos) {
    // Gnóm: 50%, más fajok: 30%
    let baseMax = (faj === 'gnom') ? 50 : 30;
    
    // Tudós személyiség: +5%
    if (hasTudos) {
        baseMax += 5;
    }
    
    return baseMax;
}

// Lakáshelyzeti tekercs maximum értékek faj alapján
function getLakashelyzetiTekercsMax(faj) {
    // Alapértelmezett: 30%
    // Gnóm: 50% (minden tudományág)
    // Óriás: 40% (mágia és lakáshelyzet területén)
    // Félelf: 40% (tolvajlás és lakáshelyzet területén)
    // Törpe: 30% (csak ipar és hadügy 40%)
    // Elf: 30% (csak hadügy és mágia 40%)
    // Ork: 30% (csak hadügy és mezőgazdaság 40%)
    // Élőhalott: 30%
    // Ember: 30%
    
    if (faj === 'gnom') return 50;
    if (faj === 'orias' || faj === 'felelf') return 40;
    return 30;
}

// Kristálygömb importálása
function importKristalygomb(tipus) {
    const textarea = document.getElementById(tipus + '_kristalygomb');
    const text = textarea ? textarea.value : '';
    if (!text || text.trim() === '') return;
    
    const data = {};
    let selectedFaj = 'none';
    let hasTudos = false;
    
    // Faj kinyerése - formátum: "Faj:\tTörpe" vagy "Faj:<tab>Törpe"
    // A tab után lehet még tab vagy szóköz, majd jön az érték
    const fajMatch = text.match(/Faj:\s*\t+\s*([^\t\n\r]+)/);
    if (fajMatch) {
        const fajText = fajMatch[1].trim();
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
    
    // Személyiség kinyerése (több személyiség is lehet, vesszővel elválasztva)
    // Formátum: "Személyiség:\tKereskedő, Vándor, Gazdálkodó, Tudós, ..."
    const szemelyisegMatch = text.match(/Személyiség:\s*\t+\s*([^\t\n\r]+)/);
    let szemelyisegek = [];
    if (szemelyisegMatch) {
        const szemelyisegText = szemelyisegMatch[1].trim();
        // Eltávolítjuk a felesleges szóközöket a vesszők körül
        szemelyisegek = szemelyisegText.split(',').map(s => s.trim()).filter(s => s.length > 0);
        
        // Tudós ellenőrzés
        hasTudos = szemelyisegek.some(s => s.includes('Tudós'));
        if (hasTudos) {
            document.getElementById(tipus + '_tudos').checked = true;
        }
    }
    
    // Katonai egységek kinyerése - formátum: "Paraméter:\térték" ahol a tab a tabulátor
    // A pont a számokban a tizes csoport elválasztója (pl. 1.688 = 1688)
    // A regex-ek több variációt is elfogadnak: lehet szóköz a kettőspont után, lehet több tab
    const katonaMatch = text.match(/Katona:\s*\t+\s*([0-9.,\s]+)/);
    if (katonaMatch) {
        data.katona = extractNumber(katonaMatch[1]);
    }
    
    const vedoMatch = text.match(/Védő:\s*\t+\s*([0-9.,\s]+)/);
    if (vedoMatch) {
        data.vedo = extractNumber(vedoMatch[1]);
    }
    
    const tamadoMatch = text.match(/Támadó:\s*\t+\s*([0-9.,\s]+)/);
    if (tamadoMatch) {
        data.tamado = extractNumber(tamadoMatch[1]);
    }
    
    // Íjász, Lovas, Elit - a formátum: "Íjász:\t20.000" vagy "Íjász:\t\t20.000"
    // A szám után lehet tab, newline vagy sor vége
    const ijszMatch = text.match(/Íjász:\s*\t+\s*([0-9.,\s]+?)(?:\t|\n|$)/);
    if (ijszMatch) {
        data.ijsz = extractNumber(ijszMatch[1]);
    }
    
    const lovasMatch = text.match(/Lovas:\s*\t+\s*([0-9.,\s]+?)(?:\t|\n|$)/);
    if (lovasMatch) {
        data.lovas = extractNumber(lovasMatch[1]);
    }
    
    const elitMatch = text.match(/Elit:\s*\t+\s*([0-9.,\s]+?)(?:\t|\n|$)/);
    if (elitMatch) {
        data.elit = extractNumber(elitMatch[1]);
    }
    
    // Katonai morál - formátum: "Katonai morál:\t95 %" (százalékban van megadva)
    // A "Katonai morál" tartalmaz szóközt
    const moralMatch = text.match(/Katonai\s+morál:\s*\t+\s*([0-9.,\s]+?)\s*%/);
    if (moralMatch) {
        data.katonai_moral = extractNumber(moralMatch[1]);
    }
    
    // Hektár - formátum: "Föld:\t2.482 hektár"
    // Az érték után lehet szóköz és "hektár" szó, majd tab
    // A "Föld:" mezőből kinyerjük a hektárt
    const hektarMatch = text.match(/Föld:\s*\t+\s*([0-9.,\s]+?)\s*hektár/i);
    if (hektarMatch) {
        data.hektar = extractNumber(hektarMatch[1]);
    }
    
    // Szövetség állapot (magányos farkas ellenőrzés) - formátum: "Szövetség:\tszövetség tagja" vagy "Szövetség:\tMagányos farkas"
    const szovetsegMatch = text.match(/Szövetség:\t+([^\t\n\r]+?)(?:\t|\n|$)/);
    if (szovetsegMatch) {
        const szovetsegText = szovetsegMatch[1].trim();
        if (szovetsegText.includes('Magányos farkas') || szovetsegText.includes('magányos farkas')) {
            document.getElementById(tipus + '_maganyos_farkas').checked = true;
        }
    }
    
    // Hadi tekercs automatikus beállítása faj és tudós személyiség alapján
    if (hasTudos && selectedFaj !== 'none') {
        const maxTekercs = getHadiTekercsMax(selectedFaj, hasTudos);
        document.getElementById(tipus + '_tudos_szazalek').value = maxTekercs;
    }
    
    // Lakáshelyzeti tekercs max beállítása faj alapján
    if (selectedFaj !== 'none' && tipus === 'vedo') {
        const maxLakashelyzeti = getLakashelyzetiTekercsMax(selectedFaj);
        document.getElementById('vedo_lakashelyzeti_tekercs').value = maxLakashelyzeti;
    }
    
    // Értékek beállítása - csak akkor írjuk felül, ha az adott mező 0 vagy üres
    if (data.katona !== undefined) {
        const katonaField = document.getElementById(tipus + '_katona');
        if (!katonaField.value || parseInt(katonaField.value) === 0) {
            katonaField.value = data.katona;
        }
    }
    if (data.vedo !== undefined && tipus === 'vedo') {
        const vedoField = document.getElementById(tipus + '_vedo');
        if (!vedoField.value || parseInt(vedoField.value) === 0) {
            vedoField.value = data.vedo;
        }
    }
    if (data.tamado !== undefined) {
        const tamadoField = document.getElementById(tipus + '_tamado');
        if (!tamadoField.value || parseInt(tamadoField.value) === 0) {
            tamadoField.value = data.tamado;
        }
    }
    if (data.ijsz !== undefined) {
        const ijszField = document.getElementById(tipus + '_ijsz');
        if (!ijszField.value || parseInt(ijszField.value) === 0) {
            ijszField.value = data.ijsz;
        }
    }
    if (data.lovas !== undefined) {
        const lovasField = document.getElementById(tipus + '_lovas');
        if (!lovasField.value || parseInt(lovasField.value) === 0) {
            lovasField.value = data.lovas;
        }
    }
    if (data.elit !== undefined) {
        const elitField = document.getElementById(tipus + '_elit');
        if (!elitField.value || parseInt(elitField.value) === 0) {
            elitField.value = data.elit;
        }
    }
    if (data.katonai_moral !== undefined) {
        const moralField = document.getElementById(tipus + '_katonai_moral');
        if (!moralField.value || parseInt(moralField.value) === 0) {
            moralField.value = data.katonai_moral;
        }
    }
    if (data.hektar !== undefined && tipus === 'vedo') {
        const hektarField = document.getElementById('vedo_hektar');
        if (!hektarField.value || parseInt(hektarField.value) === 0) {
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
            if (!ortoronyField.value || parseInt(ortoronyField.value) === 0) {
                ortoronyField.value = data.ortorony;
            }
        }
    } else {
        // Ha nincs kristálygömb adat, akkor mindent feldolgozunk
        // Hektár - több formátum támogatása
        const hektarMatch = text.match(/Hektár:\s*([0-9.,\s]+)/i);
        if (hektarMatch && tipus === 'vedo') {
            data.hektar = extractNumber(hektarMatch[1]);
        }
        
        // Őrtorony - több formátum támogatása
        const ortoronyMatch = text.match(/Őrtorony:\s*([0-9.,\s]+)/i);
        if (ortoronyMatch && tipus === 'vedo') {
            data.ortorony = extractNumber(ortoronyMatch[1]);
        }
        
        // Ha nincs "Hektár:" formátum, próbáljuk a "Föld:" formátumot
        if (!data.hektar) {
            const foldMatch = text.match(/Föld:\s*([0-9.,\s]+)\s*hektár/i);
            if (foldMatch && tipus === 'vedo') {
                data.hektar = extractNumber(foldMatch[1]);
            }
        }
        
        // Értékek beállítása - csak akkor írjuk felül, ha az adott mező 0 vagy üres
        if (data.hektar !== undefined && tipus === 'vedo') {
            const hektarField = document.getElementById('vedo_hektar');
            if (!hektarField.value || parseInt(hektarField.value) === 0) {
                hektarField.value = data.hektar;
            }
        }
        if (data.ortorony !== undefined && tipus === 'vedo') {
            const ortoronyField = document.getElementById('vedo_ortorony');
            if (!ortoronyField.value || parseInt(ortoronyField.value) === 0) {
                ortoronyField.value = data.ortorony;
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
        const maxLakashelyzeti = getLakashelyzetiTekercsMax(vedoFaj);
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

