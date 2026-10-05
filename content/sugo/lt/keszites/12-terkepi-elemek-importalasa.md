# Žemėlapio elementų importavimas

Meniu [Žemėlapiai](/lt/admin/maps) galima saugoti ir redaguoti savo žemėlapio žymes (.kml formato „shapefile“ failus). Čia galima kaupti ir redaguoti anksčiau sukurtus naudotojo miesto ar aplinkos žemėlapius bei iš apklausų surinktus atsakymus. Naudojant .kml formato failus, čia saugomus elementus galima lengvai eksportuoti į išorines žemėlapių redagavimo programas, o iš jų importuoti žemėlapius į PARTIMAP.

Šiuo metu PARTIMAP nesiūlo grafinės analizės funkcijų, tačiau savo žemėlapyje atskirus elementus galima redaguoti: be pavadinimo ir aprašymo, galima individualiai nustatyti jų išvaizdą (spalvą, dydį, o linijų atveju – linijos stilių).

Naujo savo žemėlapio kūrimas:

- Puslapyje [Žemėlapiai](/lt/admin/maps) įvedus naujo žemėlapio pavadinimą ir spustelėjus mygtuką Pridėti. Čia redagavimo sąsajoje galima įkelti duomenis iš .kml failo;
- Iš apklausos respondentų pateiktų duomenų – apklausos duomenų lape, atitinkamo darbalapio eilutėje esančia nuoroda Pridėkite elementus kitame žemėlapyje

.kml faile su PARTIMAP apklausos atsakymais žymių tipas pateikiamas kaip kategorija, todėl naudojant išorinę analizės programą arba [konvertavus .kml failą į lentelę](https://mygeodata.cloud/converter/kml-to-xlsx) galima atskirti skirtingas žymes ir redaguoti elementų parametrus.

PARTIMAP generuojami ir naudojami .kml failai naudoja šiuos parametrus, kurie užtikrina suderinamumą ir su „Google Maps“:

- Elementus sudarančių taškų x ir y koordinatės;
- Elemento eilės numeris (gid) ir pavadinimas (Name);
- Elementui priskirta kategorija (PARTIMAPCategory);
- Linijos ar teritoriją ribojančios linijos stilius (PARTIMAPLineStyle), taško dydis (PARTIMAPPointSize), elemento (kontūro) neskaidrumas (PARTIMAPOpacity), teritorijos atveju – užpildo neskaidrumas (PARTIMAPFillOpacity) ir kiti „Google Maps“ automatiškai nuskaitomi parametrai (dydis, spalva) (ExtendedData);
- PARTIMAP naudojamo aprašymo lauko turinys (PARTIMAPDescription);
- Klausimai ir atsakymai, pridėti parinktimi „Pridėti klausimus kaip žymeklius žemėlapyje analizei“ (PARTIMAPQuestion);
- Išsamiau apie visa tai galima paskaityti projekto [GitHub puslapyje](https://github.com/k-monitor/partimap/blob/master/KML.md).
