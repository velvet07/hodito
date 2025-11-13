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

// Számítás főfüggvény
function szamol() {
    const vedoPont = szamolVedoero();
    const tamadoPont = szamolTamadoero();
    
    document.getElementById('vedopont').textContent = formatNumber(vedoPont);
    document.getElementById('tamadopont').textContent = formatNumber(tamadoPont);
    
    const eredmeny = vedoPont >= tamadoPont ? 
        'A támadás sikertelen' : 
        'A támadás sikeres';
    document.getElementById('eredmeny').textContent = eredmeny;
    
    // Gabonaszükséglet számítása
    const gabona = szamolGabonaszukseglet();
    document.getElementById('gabonaszukseglet').textContent = formatNumber(gabona) + ' bála';
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
function extractNumber(text) {
    if (!text) return 0;
    // Eltávolítjuk a szóközöket és pontokat, csak a számokat hagyjuk meg
    return parseInt(text.replace(/[.,\s]/g, '')) || 0;
}

// Kristálygömb importálása
function importKristalygomb(tipus) {
    const text = prompt('Illessze be a kristálygömb szövegét:');
    if (!text) return;
    
    const data = {};
    
    // Faj kinyerése
    const fajMatch = text.match(/Faj:\s*([^\n\r]+)/);
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
            document.getElementById(tipus + '_faj').value = fajMap[fajText];
        }
    }
    
    // Katonai egységek kinyerése - több formátum támogatása
    const katonaMatch = text.match(/Katona:\s*([0-9.,\s]+)/);
    if (katonaMatch) {
        data.katona = extractNumber(katonaMatch[1]);
    }
    
    const vedoMatch = text.match(/Védő:\s*([0-9.,\s]+)/);
    if (vedoMatch) {
        data.vedo = extractNumber(vedoMatch[1]);
    }
    
    const tamadoMatch = text.match(/Támadó:\s*([0-9.,\s]+)/);
    if (tamadoMatch) {
        data.tamado = extractNumber(tamadoMatch[1]);
    }
    
    const ijszMatch = text.match(/Íjász:\s*([0-9.,\s]+)/);
    if (ijszMatch) {
        data.ijsz = extractNumber(ijszMatch[1]);
    }
    
    const lovasMatch = text.match(/Lovas:\s*([0-9.,\s]+)/);
    if (lovasMatch) {
        data.lovas = extractNumber(lovasMatch[1]);
    }
    
    const elitMatch = text.match(/Elit:\s*([0-9.,\s]+)/);
    if (elitMatch) {
        data.elit = extractNumber(elitMatch[1]);
    }
    
    // Katonai morál - több formátum támogatása
    const moralMatch = text.match(/Katonai morál:\s*([0-9.,\s]+)\s*%/);
    if (moralMatch) {
        data.katonai_moral = extractNumber(moralMatch[1]);
    }
    
    // Hektár - több formátum támogatása
    const hektarMatch = text.match(/Föld:\s*([0-9.,\s]+)\s*hektár/i);
    if (hektarMatch) {
        data.hektar = extractNumber(hektarMatch[1]);
    }
    
    // Személyiség (tudós ellenőrzés)
    if (text.includes('Tudós')) {
        document.getElementById(tipus + '_tudos').checked = true;
        // Próbáljuk kinyerni a hadi tekercs százalékát, ha van
        const tudosMatch = text.match(/Tudós.*?(\d+)\s*%/);
        if (tudosMatch) {
            document.getElementById(tipus + '_tudos_szazalek').value = extractNumber(tudosMatch[1]);
        }
    }
    
    // Értékek beállítása
    if (data.katona !== undefined) document.getElementById(tipus + '_katona').value = data.katona;
    if (data.vedo !== undefined && tipus === 'vedo') document.getElementById(tipus + '_vedo').value = data.vedo;
    if (data.tamado !== undefined) document.getElementById(tipus + '_tamado').value = data.tamado;
    if (data.ijsz !== undefined) document.getElementById(tipus + '_ijsz').value = data.ijsz;
    if (data.lovas !== undefined) document.getElementById(tipus + '_lovas').value = data.lovas;
    if (data.elit !== undefined) document.getElementById(tipus + '_elit').value = data.elit;
    if (data.katonai_moral !== undefined) document.getElementById(tipus + '_katonai_moral').value = data.katonai_moral;
    if (data.hektar !== undefined && tipus === 'vedo') document.getElementById('vedo_hektar').value = data.hektar;
    
    szamol();
}

// Épületlista importálása
function importEpuletlista(tipus) {
    const text = prompt('Illessze be az épületlista szövegét:');
    if (!text) return;
    
    const data = {};
    
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
    
    // Értékek beállítása
    if (data.hektar !== undefined) document.getElementById('vedo_hektar').value = data.hektar;
    if (data.ortorony !== undefined) document.getElementById('vedo_ortorony').value = data.ortorony;
    
    szamol();
}

// Segítő számítások
function szamolIjaszVedohoz() {
    const celVedoero = parseFloat(prompt('Mekkora védőerőt szeretnél elérni?'));
    if (!celVedoero || isNaN(celVedoero)) return;
    
    // Egyszerűsített számítás
    alert('Ez a funkció még fejlesztés alatt áll.');
}

function szamolLovasTamadashoz() {
    const celTamadoero = parseFloat(prompt('Mekkora támadóerőt szeretnél elérni?'));
    if (!celTamadoero || isNaN(celTamadoero)) return;
    
    // Egyszerűsített számítás
    alert('Ez a funkció még fejlesztés alatt áll.');
}

// Mentés/Betöltés
function save() {
    const data = {};
    
    // Védők adatai
    data.vedo = {
        katona: document.getElementById('vedo_katona').value,
        vedo: document.getElementById('vedo_vedo').value,
        tamado: document.getElementById('vedo_tamado').value,
        ijsz: document.getElementById('vedo_ijasz').value,
        lovas: document.getElementById('vedo_lovas').value,
        elit: document.getElementById('vedo_elit').value,
        katonai_moral: document.getElementById('vedo_katonai_moral').value,
        faj: document.getElementById('vedo_faj').value,
        tudos: document.getElementById('vedo_tudos').checked,
        tudos_szazalek: document.getElementById('vedo_tudos_szazalek').value,
        maganyos_farkas: document.getElementById('vedo_maganyos_farkas').checked,
        vedelem: document.getElementById('vedo_vedelem').checked,
        hektar: document.getElementById('vedo_hektar').value,
        ortorony: document.getElementById('vedo_ortorony').value,
        szovetseges_ijaszok: document.getElementById('vedo_szovetseges_ijaszok').value,
        kitamadasi_bonusz: document.getElementById('vedo_kitamadasi_bonusz').checked,
        elohalott_szint: document.getElementById('vedo_elohalott_szint').value,
        szabadsagon_szovetsegesek: document.getElementById('vedo_szabadsagon_szovetsegesek').value,
        lakashelyzeti_tekercs: document.getElementById('vedo_lakashelyzeti_tekercs').value
    };
    
    // Támadók adatai
    data.tamado = {
        katona: document.getElementById('tamado_katona').value,
        tamado: document.getElementById('tamado_tamado').value,
        ijsz: document.getElementById('tamado_ijasz').value,
        lovas: document.getElementById('tamado_lovas').value,
        elit: document.getElementById('tamado_elit').value,
        katonai_moral: document.getElementById('tamado_katonai_moral').value,
        faj: document.getElementById('tamado_faj').value,
        tudos: document.getElementById('tamado_tudos').checked,
        tudos_szazalek: document.getElementById('tamado_tudos_szazalek').value,
        maganyos_farkas: document.getElementById('tamado_maganyos_farkas').checked,
        verszomj: document.getElementById('tamado_verszomj').checked,
        tabornok: document.getElementById('tamado_tabornok').value,
        elohalott_szint: document.getElementById('tamado_elohalott_szint').value,
        kor: document.getElementById('tamado_kor').value,
        irany: document.querySelector('input[name="tamado_irany"]:checked').value
    };
    
    $.cookie('war_calculator_data', JSON.stringify(data), { expires: 365 });
    alert('Adatok mentve!');
}

function load() {
    const saved = $.cookie('war_calculator_data');
    if (!saved) {
        alert('Nincs mentett adat!');
        return;
    }
    
    try {
        const data = JSON.parse(saved);
        
        // Védők adatainak betöltése
        if (data.vedo) {
            document.getElementById('vedo_katona').value = data.vedo.katona || 0;
            document.getElementById('vedo_vedo').value = data.vedo.vedo || 0;
            document.getElementById('vedo_tamado').value = data.vedo.tamado || 0;
            document.getElementById('vedo_ijasz').value = data.vedo.ijsz || 0;
            document.getElementById('vedo_lovas').value = data.vedo.lovas || 0;
            document.getElementById('vedo_elit').value = data.vedo.elit || 0;
            document.getElementById('vedo_katonai_moral').value = data.vedo.katonai_moral || 75;
            document.getElementById('vedo_faj').value = data.vedo.faj || 'none';
            document.getElementById('vedo_tudos').checked = data.vedo.tudos || false;
            document.getElementById('vedo_tudos_szazalek').value = data.vedo.tudos_szazalek || 0;
            document.getElementById('vedo_maganyos_farkas').checked = data.vedo.maganyos_farkas || false;
            document.getElementById('vedo_vedelem').checked = data.vedo.vedelem || false;
            document.getElementById('vedo_hektar').value = data.vedo.hektar || 0;
            document.getElementById('vedo_ortorony').value = data.vedo.ortorony || 0;
            document.getElementById('vedo_szovetseges_ijaszok').value = data.vedo.szovetseges_ijaszok || 0;
            document.getElementById('vedo_kitamadasi_bonusz').checked = data.vedo.kitamadasi_bonusz || false;
            document.getElementById('vedo_elohalott_szint').value = data.vedo.elohalott_szint || 5;
            document.getElementById('vedo_szabadsagon_szovetsegesek').value = data.vedo.szabadsagon_szovetsegesek || 0;
            document.getElementById('vedo_lakashelyzeti_tekercs').value = data.vedo.lakashelyzeti_tekercs || 0;
        }
        
        // Támadók adatainak betöltése
        if (data.tamado) {
            document.getElementById('tamado_katona').value = data.tamado.katona || 0;
            document.getElementById('tamado_tamado').value = data.tamado.tamado || 0;
            document.getElementById('tamado_ijasz').value = data.tamado.ijsz || 0;
            document.getElementById('tamado_lovas').value = data.tamado.lovas || 0;
            document.getElementById('tamado_elit').value = data.tamado.elit || 0;
            document.getElementById('tamado_katonai_moral').value = data.tamado.katonai_moral || 75;
            document.getElementById('tamado_faj').value = data.tamado.faj || 'none';
            document.getElementById('tamado_tudos').checked = data.tamado.tudos || false;
            document.getElementById('tamado_tudos_szazalek').value = data.tamado.tudos_szazalek || 0;
            document.getElementById('tamado_maganyos_farkas').checked = data.tamado.maganyos_farkas || false;
            document.getElementById('tamado_verszomj').checked = data.tamado.verszomj || false;
            document.getElementById('tamado_tabornok').value = data.tamado.tabornok || 0;
            document.getElementById('tamado_elohalott_szint').value = data.tamado.elohalott_szint || 0;
            document.getElementById('tamado_kor').value = data.tamado.kor || 2;
            const iranyRadio = document.querySelector('input[name="tamado_irany"][value="' + (data.tamado.irany || 'felfele') + '"]');
            if (iranyRadio) iranyRadio.checked = true;
        }
        
        szamol();
        alert('Adatok betöltve!');
    } catch (e) {
        alert('Hiba történt az adatok betöltése során!');
    }
}

// Oldal betöltésekor számolás
$(document).ready(function() {
    szamol();
});

