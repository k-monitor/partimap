# Térképi elemek importálása

A [Térképek](/hu/admin/maps) menüpontban saját térképes jelölések (.kml formátumú shapefile-ok) tárolhatók és szerkeszthetők. Itt lehet gyűjteni és szerkeszteni a felhasználó városáról, környezetéről korábban készített térképeit, és a kérdőívekből összegyűjtött válaszokat. A .kml formátumú file-ok segítségével külső térképszerkesztő programokba egyszerűen exportálhatók az itt tárolt elemek, és onnan a PARTIMAP-ba importálhatók térképek.

A PARTIMAP jelenleg nem kínál grafikus elemző funkciókat, de a saját térképen az egyedi elemek szerkeszthetők: név és leírás mellett a kinézetük (szín, méret, vonalak esetén a vonal stílusa) egyedileg beállítható.

Új saját térkép létrehozása:

- A [Térképek](/hu/admin/maps) oldalon az Új térkép elnevezése megadásával a Hozzáadás gombra kattintva. Ide .kml fájlból adatot lehet betölteni a szerkesztőfelületen;
- Egy felmérés kitöltőinek beküldéseiből a kérdőív adatlapon a vonatkozó munkalap sorában megjelenő Új saját térképre küldés

A PARTIMAP felmérés kitöltéseit tartalmazó .kml kategóriaként tartalmazza a jelölések típusát, így külső elemző program segítségével, vagy a .kml file-t [táblázatos formába konvertálva](https://mygeodata.cloud/converter/kml-to-xlsx) szétválaszthatók a különböző jelölések, és szerkeszthetők az elemek paraméterei.

A PARTIMAP által generált és használt .kml file-ok az alábbi paramétereket használják, ezek a Google Maps-el is átjárhatóságot biztosítanak:

- Az elemeket alkotó pontok x és y koordinátái;
- Az elem sorszáma (gid) és neve (Name);
- Az elemhez rendelt kategória (PARTIMAPCategory);
- A vonal vagy területet határoló vonal stílusa (PARTIMAPLineStyle), a pont mérete (PARTIMAPPointSize), az elem (körvonalának) átlátszósága (PARTIMAPOpacity), terület esetén a kitöltés átlátszósága (PARTIMAPFillOpacity) és további, a Google Maps által automatikusan beolvasott paraméterek (méret, szín) (ExtendedData);
- A leírás mező tartalma, amit a PARTIMAP használ (PARTIMAPDescription);
- A Válaszok hozzáadása a térképes jelölésekhez elemzés céljára opcióval hozzáadott kérdések és válaszok (PARTIMAPQuestion);
- Minderről bővebb leírás a projekt [Github oldalán](https://github.com/k-monitor/partimap/blob/master/KML.md) érhető el.
