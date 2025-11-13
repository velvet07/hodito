var feldolgoz = function() {
	$('#button').attr('disabled','disabled');
	$('#button').val('Feldolgozás...');
	nullaz();
	var lista = $('#lista').val().split('\n');
	var tmp;
	var tmp_array;
	var fullheki = 0;
	var fullbanya = 0;
	for (i=0; i<lista.length; i++) {
		tmp = lista[i];
		tmp = tmp.replace(".", "");
		if(tmp != "" || tmp != "_") {
			tmp_array = tmp.split(':');
			if(tmp_array.length < 2) {
				tmp_array = tmp.split("\t");
			}
			if(tmp_array.length >= 2) {
				if(tmp_array[0] == "Szabad terület" || tmp_array[0] == "Üres") {
					$('#szabad_terulet').val(parseInt(tmp_array[1]));
					fullheki += parseInt(tmp_array[1]);
				} else if(tmp_array[0] == "Ház") {
					$('#haz').val(parseInt(tmp_array[1]));
					fullheki += parseInt(tmp_array[1]);
				} else if(tmp_array[0] == "Barakk") {
					$('#barakk').val(parseInt(tmp_array[1]));
					fullheki += parseInt(tmp_array[1]);
				} else if(tmp_array[0] == "Tanya") {
					$('#tanya').val(parseInt(tmp_array[1]));
					fullheki += parseInt(tmp_array[1]);
				} else if(tmp_array[0] == "Kovácsműhely") {
					$('#kovacsmuhely').val(parseInt(tmp_array[1]));
					fullheki += parseInt(tmp_array[1]);
				} else if(tmp_array[0] == "Könyvtár") {
					$('#konyvtar').val(parseInt(tmp_array[1]));
					fullheki += parseInt(tmp_array[1]);
				} else if(tmp_array[0] == "Raktár") {
					$('#raktar').val(parseInt(tmp_array[1]));
					fullheki += parseInt(tmp_array[1]);
				} else if(tmp_array[0] == "Őrtorony") {
					$('#ortorony').val(parseInt(tmp_array[1]));
					fullheki += parseInt(tmp_array[1]);
				} else if(tmp_array[0] == "Kocsma") {
					$('#kocsma').val(parseInt(tmp_array[1]));
					fullheki += parseInt(tmp_array[1]);
				} else if(tmp_array[0] == "Templom") {
					$('#templom').val(parseInt(tmp_array[1]));
					fullheki += parseInt(tmp_array[1]);
				} else if(tmp_array[0] == "Kórház") {
					$('#korhaz').val(parseInt(tmp_array[1]));
					fullheki += parseInt(tmp_array[1]);
				} else if(tmp_array[0] == "Piac") {
					$('#piac').val(parseInt(tmp_array[1]));
					fullheki += parseInt(tmp_array[1]);
				} else if(tmp_array[0] == "Bank") {
					$('#bank').val(parseInt(tmp_array[1]));
					fullheki += parseInt(tmp_array[1]);
				} else if(tmp_array[0] == "Fatelep") {
					$('#fatelep').val(parseInt(tmp_array[1]));
					fullheki += parseInt(tmp_array[1]);
					fullbanya += parseInt(tmp_array[1]);
				} else if(tmp_array[0] == "Kőbánya") {
					$('#kobanya').val(parseInt(tmp_array[1]));
					fullheki += parseInt(tmp_array[1]);
					fullbanya += parseInt(tmp_array[1]);
				} else if(tmp_array[0] == "Fémbánya") {
					$('#fembanya').val(parseInt(tmp_array[1]));
					fullheki += parseInt(tmp_array[1]);
					fullbanya += parseInt(tmp_array[1]);
				} else if(tmp_array[0] == "Agyagbánya") {
					$('#agyagbanya').val(parseInt(tmp_array[1]));
					fullheki += parseInt(tmp_array[1]);
					fullbanya += parseInt(tmp_array[1]);
				} else if(tmp_array[0] == "Drágakőbánya") {
					$('#dragakobanya').val(parseInt(tmp_array[1]));
					fullheki += parseInt(tmp_array[1]);
					fullbanya += parseInt(tmp_array[1]);
				} else if(tmp_array[0] == "Bányák") {
					$('#banyak').val(fullbanya);
				} else if(tmp_array[0] == "Erdő") {
					$('#erdo').val(parseInt(tmp_array[1]));
					fullheki += parseInt(tmp_array[1]);
				} else if(tmp_array[0] == "Kőlelőhely") {
					$('#kolelohely').val(parseInt(tmp_array[1]));
					fullheki += parseInt(tmp_array[1]);
				} else if(tmp_array[0] == "Fémlelőhely") {
					$('#femlelohely').val(parseInt(tmp_array[1]));
					fullheki += parseInt(tmp_array[1]);
				} else if(tmp_array[0] == "Agyaglelőhely") {
					$('#agyaglelohely').val(parseInt(tmp_array[1]));
					fullheki += parseInt(tmp_array[1]);
				} else if(tmp_array[0] == "Drágakőlelőhely") {
					$('#dragakolelohely').val(parseInt(tmp_array[1]));
					fullheki += parseInt(tmp_array[1]);
				}
			}
		}	
	}
	$('#hektar').val(fullheki);
	szamol();
	$('#button').attr('disabled','');
	$('#button').val('Feldolgoz');
}

var nullaz = function() {
	$('#hektar').val("0");
	$('#szabad_terulet').val("0");
	$('#haz').val("0");
	$('#barakk').val("0");
	$('#kovacsmuhely').val("0");
	$('#tanya').val("0");
	$('#konyvtar').val("0");
	$('#raktar').val("0");
	$('#banyak').val("0");
	$('#ortorony').val("0");
	$('#kocsma').val("0");
	$('#templom').val("0");
	$('#korhaz').val("0");
	$('#piac').val("0");
	$('#bank').val("0");
	$('#fatelep').val("0");
	$('#kobanya').val("0");
	$('#fembanya').val("0");
	$('#agyagbanya').val("0");
	$('#dragakobanya').val("0");
	$('#erdo').val("0");
	$('#kolelohely').val("0");
	$('#femlelohely').val("0");
	$('#agyaglelohely').val("0");
	$('#dragakolelohely').val("0");
}

var tekercs = function() {
	$('#skip_tekercs').attr('checked','');
	szamol();
}

var szamol = function() {
	var epuletek = new Array('hektar','szabad_terulet','haz','barakk','kovacsmuhely','tanya','konyvtar','raktar','banyak','ortorony','kocsma','templom','korhaz','piac','bank','fatelep','kobanya','fembanya','agyagbanya','dragakobanya','erdo','kolelohely','femlelohely','agyaglelohely','dragakolelohely');
	
	//tekercsek
	var lakashelyzeti2 = 1;
	var szukseges_lakos = 0;
	var szukseges_lakos2 = 0;
	var foglalkoztatottsag = 0;
	var nepesseg = 0;
	var gabonamodosito2 = 1;
	var nyersanyagmodosito2 = 1;
	var fegyvermodosito = 1;
	var gabonaszukseglet = 0;
	var gabonatermeles = 0;
	var raktarmodosito = 1;
	var tudosszem = false;
	
	
	var lakashelyzeti = 1;
	var gabonamodosito = 1;
	var nyersanyagmodosito = 1;

	
	// valtozok beállítása
	
	for (i = 0; i < epuletek.length; i++) {
		eval('var ' + epuletek[i] + ' = parseInt((document.getElementById("' + epuletek[i] + '").value != "") ? document.getElementById("' + epuletek[i] + '").value  : 0);');
	}
	
	banyak = fatelep + kobanya + fembanya + agyagbanya + dragakobanya; // bányák száma
	szabad_terulet = hektar - (haz + barakk + kovacsmuhely + tanya + konyvtar + raktar + banyak + ortorony + kocsma + templom + korhaz + piac + bank + erdo + kolelohely + femlelohely + agyaglelohely + dragakolelohely); // összes hektár
	
	/* Bányaadtok feltöltése */
	$('#banyak').val(banyak);
	$('#szabad_terulet').val(szabad_terulet);
	
	// százalékok kiszámítása
	for (i = 1; i < epuletek.length; i++) {
		eval('$("#' + epuletek[i] + '_sz").text(Math.round(' + epuletek[i] + ' / hektar * 100) + "%");');
	}

	/*Tudós e?*/
	for (i = 0; i < 10; i++) {
		if (document.getElementById("szemelyiseg").options[i].selected == true) {
			if(document.getElementById("szemelyiseg").options[i].value == "tudos") {
				tudosszem = true;
				break;
			}
		}
	}
	
	/* számítás */
	switch ($("#faj").val()) {
		case "none":		/* nincs bállított faj */
			$("#szint_label, #szint").hide();
			if($('#skip_tekercs').attr('checked')) {
				lakashelyzeti = 1.3;
				gabonamodosito = tudosszem ? 1.35 : 1.3;
				nyersanyagmodosito = tudosszem ? 1.35 : 1.3;
				
				$('#lakashelyzet').val('30');
				tudosszem ? $('#mezogazdasag').val('35') : $('#mezogazdasag').val('30');
				tudosszem ? $('#banyaszat').val('35') : $('#banyaszat').val('30');
				
			} else {
				/* lakáshelyzet */
				if($('#lakashelyzet').val() > 30) {
					lakashelyzeti = 1.3;
					$('#lakashelyzet').val('30');
				} else {
					lakashelyzeti = $('#lakashelyzet').val() / 100 + 1;
				}
				
				/* mezogazdasag */
				if($('#mezogazdasag').val() > (tudosszem ? 35 : 30)) {
					gabonamodosito = tudosszem ? 1.35 : 1.3;
					tudosszem ? $('#mezogazdasag').val('35') : $('#mezogazdasag').val('30');
				} else {
					gabonamodosito = $('#mezogazdasag').val() / 100 + 1;
				}
				
				/* banyaszat */
				if($('#banyaszat').val() >  (tudosszem ? 35 : 30)) {
					nyersanyagmodosito = tudosszem ? 1.35 : 1.3;
					tudosszem ? $('#banyaszat').val('35') : $('#banyaszat').val('30');
				} else {
					nyersanyagmodosito = $('#banyaszat').val() / 100 + 1;
				}
				
			}
			break;
		case "elf":			/* elf faj */
			$("#szint_label, #szint").hide();
			gabonamodosito2 = 1.3;
			nyersanyagmodosito2 = 0.7;

			if($('#skip_tekercs').attr('checked')) {
				lakashelyzeti = 1.3;
				gabonamodosito = tudosszem ? 1.35 : 1.3;
				nyersanyagmodosito = tudosszem ? 1.35 : 1.3;
				
				$('#lakashelyzet').val('30');
				tudosszem ? $('#mezogazdasag').val('35') : $('#mezogazdasag').val('30');
				tudosszem ? $('#banyaszat').val('35') : $('#banyaszat').val('30');
			} else {
				/* lakáshelyzet */
				if($('#lakashelyzet').val() > 30) {
					lakashelyzeti = 1.3;
					$('#lakashelyzet').val('30');
				} else {
					lakashelyzeti = $('#lakashelyzet').val() / 100 + 1;
				}
				
				/* mezogazdasag */
				if($('#mezogazdasag').val() > (tudosszem ? 35 : 30)) {
					gabonamodosito = tudosszem ? 1.35 : 1.3;
					tudosszem ? $('#mezogazdasag').val('35') : $('#mezogazdasag').val('30');
				} else {
					gabonamodosito = $('#mezogazdasag').val() / 100 + 1;
				}
				
				/* banyaszat */
				if($('#banyaszat').val() >  (tudosszem ? 35 : 30)) {
					nyersanyagmodosito = tudosszem ? 1.35 : 1.3;
					tudosszem ? $('#banyaszat').val('35') : $('#banyaszat').val('30');
				} else {
					nyersanyagmodosito = $('#banyaszat').val() / 100 + 1;
				}							
			}			
			break;
		case "ork":			/* ork faj */
			$("#szint_label, #szint").hide();
			if($('#skip_tekercs').attr('checked')) {
				lakashelyzeti = 1.3;
				gabonamodosito = tudosszem ? 1.45 : 1.4;
				nyersanyagmodosito = tudosszem ? 1.35 : 1.3;
				
				$('#lakashelyzet').val('30');
				tudosszem ? $('#mezogazdasag').val('45') : $('#mezogazdasag').val('40');
				tudosszem ? $('#banyaszat').val('35') : $('#banyaszat').val('30');
			} else {
				/* lakáshelyzet */
				if($('#lakashelyzet').val() > 30) {
					lakashelyzeti = 1.3;
					$('#lakashelyzet').val('30');
				} else {
					lakashelyzeti = $('#lakashelyzet').val() / 100 + 1;
				}
				
				/* mezogazdasag */
				if($('#mezogazdasag').val() > (tudosszem ? 45 : 40)) {
					gabonamodosito = tudosszem ? 1.45 : 1.4;
					tudosszem ? $('#mezogazdasag').val('45') : $('#mezogazdasag').val('40');
				} else {
					gabonamodosito = $('#mezogazdasag').val() / 100 + 1;
				}
				
				/* banyaszat */
				if($('#banyaszat').val() >  (tudosszem ? 35 : 30)) {
					nyersanyagmodosito = tudosszem ? 1.35 : 1.3;
					tudosszem ? $('#banyaszat').val('35') : $('#banyaszat').val('30');
				} else {
					nyersanyagmodosito = $('#banyaszat').val() / 100 + 1;
				}								
			}						
			break;
		case "felelf":		/* félelf faj */
			$("#szint_label, #szint").hide();
			gabonamodosito2 = 0.9;
			if($('#skip_tekercs').attr('checked')) {
				lakashelyzeti = 1.4;
				gabonamodosito = tudosszem ? 1.35 : 1.3;
				nyersanyagmodosito = tudosszem ? 1.35 : 1.3;
				
				$('#lakashelyzet').val('40');
				tudosszem ? $('#mezogazdasag').val('35') : $('#mezogazdasag').val('30');
				tudosszem ? $('#banyaszat').val('35') : $('#banyaszat').val('30');
			} else {
				/* lakáshelyzet */
				if($('#lakashelyzet').val() > 40) {
					lakashelyzeti = 1.4;
					$('#lakashelyzet').val('40');
				} else {
					lakashelyzeti = $('#lakashelyzet').val() / 100 + 1;
				}
				
				/* mezogazdasag */
				if($('#mezogazdasag').val() > (tudosszem ? 35 : 30)) {
					gabonamodosito = tudosszem ? 1.35 : 1.3;
					tudosszem ? $('#mezogazdasag').val('35') : $('#mezogazdasag').val('30');
				} else {
					gabonamodosito = $('#mezogazdasag').val() / 100 + 1;
				}
				
				/* banyaszat */
				if($('#banyaszat').val() >  (tudosszem ? 35 : 30)) {
					nyersanyagmodosito = tudosszem ? 1.35 : 1.3;
					tudosszem ? $('#banyaszat').val('35') : $('#banyaszat').val('30');
				} else {
					nyersanyagmodosito = $('#banyaszat').val() / 100 + 1;
				}							
			}				
			break;
		case "torpe":				/*törpe*/
			$("#szint_label, #szint").hide();
			fegyvermodosito = 3;
			raktarmodosito = 1.5;
			nyersanyagmodosito2 = 3;

			if($('#skip_tekercs').attr('checked')) {
				lakashelyzeti = 1.56;
				gabonamodosito = tudosszem ? 1.35 : 1.3;
				nyersanyagmodosito = tudosszem ? 1.35 : 1.3;
				
				$('#lakashelyzet').val('30');
				tudosszem ? $('#mezogazdasag').val('35') : $('#mezogazdasag').val('30');
				tudosszem ? $('#banyaszat').val('35') : $('#banyaszat').val('30');
			} else {
				/* lakáshelyzet */
				if($('#lakashelyzet').val() > 30) {
					lakashelyzeti = 1.56;
					$('#lakashelyzet').val('30');
				} else {
					lakashelyzeti = ($('#lakashelyzet').val() / 100 + 1) * 1.2;
				}
				
				/* mezogazdasag */
				if($('#mezogazdasag').val() > (tudosszem ? 35 : 30)) {
					gabonamodosito = tudosszem ? 1.35 : 1.3;
					tudosszem ? $('#mezogazdasag').val('35') : $('#mezogazdasag').val('30');
				} else {
					gabonamodosito = $('#mezogazdasag').val() / 100 + 1;
				}
				
				/* banyaszat */
				if($('#banyaszat').val() >  (tudosszem ? 35 : 30)) {
					nyersanyagmodosito = tudosszem ? 1.35 : 1.3;
					tudosszem ? $('#banyaszat').val('35') : $('#banyaszat').val('30');
				} else {
					nyersanyagmodosito = $('#banyaszat').val() / 100 + 1;
				}							
			}
			break;
		case "gnom":				/*gnóm*/
			$("#szint_label, #szint").hide();
			raktarmodosito = 0.9;
			if($('#skip_tekercs').attr('checked')) {
				lakashelyzeti = 1.5;		
				gabonamodosito = tudosszem ? 1.55 : 1.5;
				nyersanyagmodosito = tudosszem ? 1.55 : 1.5;	
				
				$('#lakashelyzet').val('50');
				tudosszem ? $('#mezogazdasag').val('55') : $('#mezogazdasag').val('50');
				tudosszem ? $('#banyaszat').val('55') : $('#banyaszat').val('50');
			} else {
				/* lakáshelyzet */
				if($('#lakashelyzet').val() > 50) {
					lakashelyzeti = 1.5;
					$('#lakashelyzet').val('50');
				} else {
					lakashelyzeti = $('#lakashelyzet').val() / 100 + 1;
				}
				
				/* mezogazdasag */
				if($('#mezogazdasag').val() > (tudosszem ? 55 : 50)) {
					gabonamodosito = tudosszem ? 1.55 : 1.5;
					tudosszem ? $('#mezogazdasag').val('55') : $('#mezogazdasag').val('50');
				} else {
					gabonamodosito = $('#mezogazdasag').val() / 100 + 1;
				}
				
				/* banyaszat */
				if($('#banyaszat').val() >  (tudosszem ? 55 : 50)) {
					nyersanyagmodosito = tudosszem ? 1.55 : 1.5;
					tudosszem ? $('#banyaszat').val('55') : $('#banyaszat').val('50');
				} else {
					nyersanyagmodosito = $('#banyaszat').val() / 100 + 1;
				}								
			}
			break;
		case "orias":				/*óriás*/
			$("#szint_label, #szint").hide();
			gabonamodosito2 = 1.2;
					
			if($('#skip_tekercs').attr('checked')) {
				lakashelyzeti = 1.4;
				gabonamodosito = tudosszem ? 1.35 : 1.3;
				nyersanyagmodosito = tudosszem ? 1.35 : 1.3;
				
				$('#lakashelyzet').val('40');
				tudosszem ? $('#mezogazdasag').val('35') : $('#mezogazdasag').val('30');
				tudosszem ? $('#banyaszat').val('35') : $('#banyaszat').val('30');
				
			} else {
				/* lakáshelyzet */
				if($('#lakashelyzet').val() > 40) {
					lakashelyzeti = 1.4;
					$('#lakashelyzet').val('40');
				} else {
					lakashelyzeti = $('#lakashelyzet').val() / 100 + 1;
				}
				
				/* mezogazdasag */
				if($('#mezogazdasag').val() > (tudosszem ? 35 : 30)) {
					gabonamodosito = tudosszem ? 1.35 : 1.3;
					tudosszem ? $('#mezogazdasag').val('35') : $('#mezogazdasag').val('30');
				} else {
					gabonamodosito = $('#mezogazdasag').val() / 100 + 1;
				}
				
				/* banyaszat */
				if($('#banyaszat').val() >  (tudosszem ? 35 : 30)) {
					nyersanyagmodosito = tudosszem ? 1.35 : 1.3;
					tudosszem ? $('#banyaszat').val('35') : $('#banyaszat').val('30');
				} else {
					nyersanyagmodosito = $('#banyaszat').val() / 100 + 1;
				}	
				
			}
			
			break;
		case "elohalott":             /*élőhalott*/
			$("#szint_label, #szint").show();
			lakashelyzeti2 = 0;

			lakashelyzeti = 1;
			gabonamodosito = 1;
			nyersanyagmodosito = 1;
			
			var szint = $("#szint").val();
			
			if($('#skip_tekercs').attr('checked')) {
				switch(szint) {
					case "5":
						lakashelyzeti = 1.2;
						break;
					case "4":
						lakashelyzeti = 1.3;
						break;
					case "3":
						lakashelyzeti = 1.4;
						break;
					case "2":
						lakashelyzeti = 1.5;
						break;
					case "1":
						lakashelyzeti = 1.6;
						break;
					default:
						lakashelyzeti = 1.2;
						break;
				}
				
				gabonamodosito = 1;
				nyersanyagmodosito = 1;
				
				$('#lakashelyzet').val('0');
				$('#mezogazdasag').val('0');
				$('#banyaszat').val('0');
				
			} else {
				/* lakáshelyzet */
					$('#lakashelyzet').val('0');
					switch(szint) {
						case "5":
							lakashelyzeti = 1.2;
							break;
						case "4":
							lakashelyzeti = 1.3;
							break;
						case "3":
							lakashelyzeti = 1.4;
							break;
						case "2":
							lakashelyzeti = 1.5;
							break;
						case "1":
							lakashelyzeti = 1.6;
							break;
						default:
							lakashelyzeti = 1.2;
							break;
					}
				
				/* mezogazdasag */
				if($('#mezogazdasag').val() > 0) {
					gabonamodosito = 1;
					$('#mezogazdasag').val('0');
				} else {
					gabonamodosito = $('#mezogazdasag').val() / 100 + 1;
				}
				
				/* banyaszat */
				if($('#banyaszat').val() > 0) {
					nyersanyagmodosito = 1;
					$('#banyaszat').val('0');
				} else {
					nyersanyagmodosito = $('#banyaszat').val() / 100 + 1;
				}
				
			}			
			break;
		case "ember":
			$("#szint_label, #szint").hide();
			if($('#skip_tekercs').attr('checked')) {
				lakashelyzeti = 1.3;
				gabonamodosito = tudosszem ? 1.35 : 1.3;
				nyersanyagmodosito = tudosszem ? 1.35 : 1.3;
				
				$('#lakashelyzet').val('30');
				tudosszem ? $('#mezogazdasag').val('35') : $('#mezogazdasag').val('30');
				tudosszem ? $('#banyaszat').val('35') : $('#banyaszat').val('30');
				
			} else {
				/* lakáshelyzet */
				if($('#lakashelyzet').val() > 30) {
					lakashelyzeti = 1.3;
					$('#lakashelyzet').val('30');
				} else {
					lakashelyzeti = $('#lakashelyzet').val() / 100 + 1;
				}
				
				/* mezogazdasag */
				if($('#mezogazdasag').val() > (tudosszem ? 35 : 30)) {
					gabonamodosito = tudosszem ? 1.35 : 1.3;
					tudosszem ? $('#mezogazdasag').val('35') : $('#mezogazdasag').val('30');
				} else {
					gabonamodosito = $('#mezogazdasag').val() / 100 + 1;
				}
				
				/* banyaszat */
				if($('#banyaszat').val() >  (tudosszem ? 35 : 30)) {
					nyersanyagmodosito = tudosszem ? 1.35 : 1.3;
					tudosszem ? $('#banyaszat').val('35') : $('#banyaszat').val('30');
				} else {
					nyersanyagmodosito = $('#banyaszat').val() / 100 + 1;
				}	
				
			}
			break;
	}
	
	/*
	Lakáshelyzetet nem befolyosolja a személyiség
	*/
	
	for (i = 0; i < 10; i++) {
		if (document.getElementById("szemelyiseg").options[i].selected == true) {
			if(document.getElementById("szemelyiseg").options[i].value == "gazdalkodo") {
				nyersanyagmodosito *= 1.1;
				gabonamodosito *= 1.1;
			}
		}
	}
	
	// Lakosság: ház * 50 * módosító + üres terület * 8 * módosító
	
	nepesseg = haz * 50 * lakashelyzeti + (szabad_terulet + erdo + kolelohely + femlelohely + agyaglelohely + dragakolelohely) * 8 * lakashelyzeti;
	$("#nepesseg").text(Math.round(nepesseg));
	
	// Szükséges népesség: minden épület * 15 kivéve a piac, az *50
	for (i = 3; i < epuletek.length-5; i++) {
		if(epuletek[i] == "piac") {
			eval('szukseges_lakos +=' + epuletek[i] + '*50;');
		} else if (epuletek[i] == "banyak") {
			
		} else{
			eval('szukseges_lakos +=' + epuletek[i] + '*15;');
		}
	}
	szukseges_lakos2 = (szukseges_lakos - bank * 15); //lakosok bank nélkül
	
	// Foglalkoztatottság
	foglalkoztatottsag = Math.round(szukseges_lakos / nepesseg * 100);
	if(foglalkoztatottsag > 100) {
		$("#foglalkoztatottsag").html('100% <span class="text-red-600 font-semibold">' + Math.round(nepesseg-szukseges_lakos) + '</span>');
	} else {
		$("#foglalkoztatottsag").html(foglalkoztatottsag + '% <span class="text-green-600">' + szukseges_lakos + ' dolgozik</span>');
	}
	foglalkoztatottsag_n= Math.round(szukseges_lakos2 / nepesseg * 100);
	if(foglalkoztatottsag_n > 100) {
		$("#foglalkoztatottsag2").html('100% <span class="text-red-600 font-semibold">' + Math.round(nepesseg-szukseges_lakos2) + '</span>');
	} else {
		$("#foglalkoztatottsag2").html(foglalkoztatottsag_n + '% <span class="text-green-600">' + szukseges_lakos2 + ' dolgozik</span>');
	}
	
	// Barakkhely, Templomhely, Kocsmahely, Őrtoronyhely
	$("#barakkhely").text(Math.round(barakk * 40 * lakashelyzeti));
	$("#templomhely").text(Math.round(templom * 100 * lakashelyzeti));
	$("#kocsmahely").text(Math.round(kocsma * 40 * lakashelyzeti));
	$("#ortoronyhely").text(Math.round(ortorony * 40 * lakashelyzeti));
	$("#barakk_torony").text(Math.round(barakk * 40 * lakashelyzeti - ortorony * 40 * lakashelyzeti));
	
	// Raktár
	$("#gabona").text(Math.round(raktar * 1000 * raktarmodosito));
	$("#agyag").text(Math.round(raktar * 300 * raktarmodosito));
	$("#fa").text(Math.round(raktar * 300 * raktarmodosito));
	$("#ko").text(Math.round(raktar * 300 * raktarmodosito));
	$("#fem").text(Math.round(raktar * 300 * raktarmodosito));
	$("#fegyver").text(Math.round(raktar * 100 * raktarmodosito));
	$("#dragako").text(Math.round(raktar * 300 * raktarmodosito));
	
	// Termelés
	$("#gabona_t").text(Math.round(tanya * 50 * gabonamodosito * gabonamodosito2));
	$("#agyag_t").text(Math.round(agyagbanya * 7 * nyersanyagmodosito * nyersanyagmodosito2));
	$("#fa_t").text(Math.round(fatelep * 7 * nyersanyagmodosito * nyersanyagmodosito2));
	$("#ko_t").text(Math.round(kobanya * 7 * nyersanyagmodosito * nyersanyagmodosito2));
	$("#fem_t").text(Math.round(fembanya * 7 * nyersanyagmodosito * nyersanyagmodosito2));
	$("#fegyver_t").text(Math.round(kovacsmuhely * 3 * fegyvermodosito));
	$("#dragako_t").text(Math.round(dragakobanya * 7 * nyersanyagmodosito * nyersanyagmodosito2));
	
	if($("#faj").val() == "ork") {
		gabonaszukseglet = Math.round((barakk * 40 * lakashelyzeti * 0.7 + templom * 100 * lakashelyzeti * 0.7 + kocsma * 40 * lakashelyzeti * 0.7 + nepesseg) / 5) * lakashelyzeti2;
	} else {
		gabonaszukseglet = Math.round((barakk * 40 * lakashelyzeti + templom * 100 * lakashelyzeti + kocsma * 40 * lakashelyzeti + nepesseg) / 5) * lakashelyzeti2;
	}
	gabonaszukseglet_n = Math.round((templom * 100 * lakashelyzeti + kocsma * 40 * lakashelyzeti + nepesseg) / 5) * lakashelyzeti2;
	gabonatermeles = Math.round(tanya * 50 * gabonamodosito * gabonamodosito2);
	
	if((gabonatermeles-gabonaszukseglet) >= 0) {
		$("#gabonaszukseglet").html(gabonaszukseglet + ' <span class="text-green-600 font-semibold">+' + (gabonatermeles-gabonaszukseglet) + ' </span>');
	} else {
		$("#gabonaszukseglet").html(gabonaszukseglet + ' <span class="text-red-600 font-semibold">' + (gabonatermeles-gabonaszukseglet) + '</span> <span class="text-gray-500 text-xs">(' + Math.floor((raktar * 1000 * raktarmodosito)/(gabonaszukseglet-gabonatermeles)) + ' körre elegendő)</span>');
	}
	if((gabonatermeles-gabonaszukseglet_n) >= 0) {
		$("#gabonaszukseglet2").html(gabonaszukseglet_n + ' <span class="text-green-600 font-semibold">+' + (gabonatermeles-gabonaszukseglet_n) + ' </span>');
	} else {
		$("#gabonaszukseglet2").html(gabonaszukseglet_n + ' <span class="text-red-600 font-semibold">' + (gabonatermeles-gabonaszukseglet_n) + '</span> <span class="text-gray-500 text-xs">(' + Math.floor((raktar * 1000 * raktarmodosito)/(gabonaszukseglet_n-gabonatermeles)) + ' körre elegendő)</span>');
	}

	$("#fontos_epuletek").text(15 * (barakk + templom + kocsma + ortorony + raktar));
	
	/* ország értéke */
	var beepitett = haz + barakk + kovacsmuhely + tanya + konyvtar + raktar + banyak + ortorony + kocsma + templom + korhaz + piac + bank;
	if(nepesseg > (hektar * 70)) {
		var nepesseg_ertek = hektar * 70;
	} else {
		var nepesseg_ertek = nepesseg;
	}
	$("#ertek").text(Math.round(szabad_terulet * 30 + beepitett * 45 + nepesseg_ertek / 5));
	
	/* ellopható pénz */
	if(bank > 0) {
		lop = 100;
		for(i=1; i<=bank; i++)
			lop *= 0.8;
		$("#penz_lop").text(Math.round(lop*10000)/10000 + '%');
	} else {
		$("#penz_lop").text('100%');
	}	
	/* kamat */
	min_penz = bank * 150000;
	$("#kamat").text(Math.round(min_penz * 0.05) + ' ehhez ' + min_penz + ' arany kell');
		
}

var save = function() {
	var epuletek = new Array('hektar','szabad_terulet','haz','barakk','kovacsmuhely','tanya','konyvtar','raktar','ortorony','kocsma','templom','korhaz','piac','bank','fatelep','kobanya','fembanya','agyagbanya','dragakobanya','erdo','kolelohely','femlelohely','agyaglelohely','dragakolelohely','faj', 'szint', 'mezogazdasag', 'lakashelyzet', 'banyaszat');
	var saveString = "";
	
	for(i = 0; i < epuletek.length; i++) {
		saveString += $('#' + epuletek[i]).val() + "~";
	}
	
	var szemelyiseg = []; 
	$('#szemelyiseg :selected').each(function(i, selected){ 
	  szemelyiseg[i] = $(selected).text(); 
	});
	
	var skip_tekercs = $('#skip_tekercs').attr('checked');
	
	del();
	
	$.cookie('epuletek', saveString);
	$.cookie('szemelyiseg', szemelyiseg);
	$.cookie('skip_tekercs', skip_tekercs);
	
	$('#tip2').html('<span style="color: green;">Épületlista elmentve!</span>');
}

var load = function() {
	if($.cookie('epuletek') == null || $.cookie('szemelyiseg') == null || $.cookie('skip_tekercs') == null) {
		$('#tip2').html('<span style="color: red;">Nincs mit betölteni!</span>');
	} 
	nullaz();
	
	var epuletek = new Array('hektar','szabad_terulet','haz','barakk','kovacsmuhely','tanya','konyvtar','raktar','ortorony','kocsma','templom','korhaz','piac','bank','fatelep','kobanya','fembanya','agyagbanya','dragakobanya','erdo','kolelohely','femlelohely','agyaglelohely','dragakolelohely','faj', 'szint', 'mezogazdasag', 'lakashelyzet', 'banyaszat');	
	var cookieEpuletek = new Array();
	cookieEpuletek = $.cookie('epuletek').split('~');

	for(i = 0; i < epuletek.length; i++) {
		$('#' + epuletek[i]).val(cookieEpuletek[i]);
	}
	
	if($.cookie('skip_tekercs') == 'true') {
		$('#skip_tekercs').attr('checked', true);
	} else {
		$('#skip_tekercs').attr('checked', false);
	}
	
	$('#szemelyiseg :selected').each(function(i, selected){ 
		$(selected).attr("selected", false); 
	});
	
	var cookieSzemelyiseg = new Array();
	cookieSzemelyiseg = $.cookie('szemelyiseg').split(',');
	for(i = 0; i < cookieSzemelyiseg.length; i++) {
		$("#szemelyiseg option:contains(" + cookieSzemelyiseg[i] + ")").attr("selected", "selected");
	}
	
	szamol();
	
	$('#tip2').html('<span style="color: green;">Épületlista betöltve!</span>');
}

var del = function() {
	$.cookie('epuletek', null);
	$.cookie('szemelyiseg', null);
	$.cookie('skip_tekercs', null);
	
	$('#tip2').html('<span style="color: green;">Épületlista törölve!</span>');
}

var overSave = function() {
	$('#tip').html('Elmenti az épp beállított épületlistát.');
}
var overDel = function() {
	$('#tip').html('Törli az elmentett épületlistát.');
}
var overLoad = function() {
	$('#tip').html('Betölti a mentett épületlistát.');
}