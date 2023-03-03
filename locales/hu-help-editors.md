## Segítség felmérés készítéséhez {#adminsugo}

Az alábbiakban az admin felület működését mutatjuk be.


### Regisztráció {#regisztracio}

[Regisztrációt](/register) követően bárki teljes körűen és ingyenesen használhatja az alkalmazást. A PARTIMAP jelenleg magyar és angol nyelven érhető el, a nyelvek között a jobb felső sarokban lévő (<i class="fas fa-globe fa-fw"></i>) gombbal lehet váltani. Ha más nyelven használná a programot, és segítene a fordításban, keressen minket a <hello@partimap.eu> címen!

Az admin felületen lehetőség van új felméréseket készíteni, korábbiakat módosítani ([**Projektek**](/admin/projects)), illetve szerkeszteni a felmérésekhez kapcsolódó térképeket ([**Térképek**](/admin/maps)).


### Új projekt létrehozása és korábbiak kezelése {#ujprojekt}

Új projekt a belépést követően a Projektek oldalon, a **projekt elnevezésének megadásával** hozható létre a *Hozzáadás* gombra kattintva.

<div class="row mb-5">
	<div class="col-12 col-lg-10 mx-auto mt-4">
		<figure class="figure">
			<img
				alt="Projekt létrehozása"
				class="figure-img img-fluid rounded shadow-sm"
				src="/help/project.png"
			>
			<figcaption class="figure-caption text-center">
				Projekt létrehozása
			</figcaption>
		</figure>
	</div>
</div>

A Projekt menüpontban megtalálható a saját projektek listája. Itt látható a megtekintések és kitöltések száma, és a **Riport letöltése** gombra kattintva .xlsx formátumban letölthető a kitöltésekből generált riport.

A felméréshez kapcsolódó adatok, kérdések és tartalmak a projekt létrehozását követően a projekt adatlapján adhatóak meg.


### Projekt adatlap {#projektadatlap}

A [Projektek](/admin/projects) menüpontból a listában a projekt nevére kattintva, vagy új projektet létrehozva a projekt adatlapjára jutunk.

Ez két részből áll: az oldal felső részén a felméréshez kapcsolódó általános adatok adhatóak meg, a második felében a munkalapok szerkesztésére van lehetőség.

A kapcsolódó adatoknál és beállításoknál van lehetőség

- megadni a projekt elnevezését, ami az adminfelületen túl a böngésző lapcímében és a közösségi médiában megosztáskor jelenik meg;
- szerkeszteni az elérési útvonalát (URL címét - <code>https://partimap.eu/p/*</code>),
- jelszavas védelmet beállítani, amivel szűkíthető a kitöltők köre. Ilyenkor a kérdőív URL-jére navigálva az oldal jelszót kér, ennek megadás után lehet kitölteni a kérdőívet. Ha nem szeretne több kitöltést fogadni, jelszó beállításával passziválhatja is a kérdőívet;
- Facebook megosztáshoz egyedi meta leírást (előnézeti szöveget) adni,
- Facebook megosztáshoz egyedi képet feltölteni;
- az adatkezelő elérhetőségét megadni, ez az adatkezelési nyilatkozatban jelenik meg;
- a kitöltés végén (a beküldés után) megjelenő egyedi köszönő üzenetet és tovább navigáló linket (Tovább URL) megadni, valamint a kitöltés végén a felmérés megosztására felhívó gombokat (Facebook, Twitter, e-mail) ki- és bekapcsolni.


### Munkalapok listája

A projekt munkalapokra tagolódik. Az egyes munkalapok szerkesztőfelületén lehet beállítani különböző kérdőívkérdéseket, tájékoztató szövegeket és kitöltői interakcióra felhívó térképes elemeket.

A munkalapok a felméréshez kapcsolódó általános beállítások alatt szerkeszthetőek. Új projekt esetében ez a rész üres, a *Munkalap hozzáadása* gombra kattintva lehet elkezdeni a kérdőív tartalmának szerkesztését. A már létrehozott munkalapok listanézete is itt érhető el.

<div class="row mb-5">
	<div class="col-12 col-lg-10 mx-auto mt-4">
		<figure class="figure">
			<img
				alt="Munkalapok listája"
				class="figure-img img-fluid rounded shadow-sm"
				src="/help/sheets.png"
			>
			<figcaption class="figure-caption text-center">
				Munkalapok listája
			</figcaption>
		</figure>
	</div>
</div>

Ha már több munkalapot is tartalmaz a projekt, a fel és le nyilakkal változtatható a munkalapok sorrendje, a kuka ikon pedig törli a szükségtelen munkalapot.

A munkalap típusát (*Szöveg, Kérdőív, Térkép* vagy *Interaktív térkép*) a piktogramokra kattintva lehet kiválasztani.

<div class="row mb-5">
	<div class="col-12 col-lg-10 mx-auto mt-4">
		<figure class="figure">
			<img
				alt="Új munkalap hozzáadása"
				class="figure-img img-fluid rounded shadow-sm"
				src="/help/newsheet.gif"
			>
			<figcaption class="figure-caption text-center">
				Új munkalap hozzáadása
			</figcaption>
		</figure>
	</div>
</div>

Az első munkalapon a kitöltőknek el kell fogadniuk a felhasználási feltételeket és az adatkezelési tájékoztatót. Első munkalapként érdemes Szöveg munkalapot megadni, ahol tisztázhatók a felmérés keretei (pl. a kitöltés várható hossza) és célja.

A Projekt adatlap jobb felső sarkában található **Megtekintés** gombra kattintva közvetlenül az épülő kérdőívre léphetünk, nyomon követve a mentett változtatásokat. Érdemes a kérdőív szerkesztésekor itt a szerkesztővel párhuzamosan követni a módosításokat.


### Munkalapok típusai {#munkalapok}


#### Szöveg munkalap {#szoveges}

Szöveg és képek megjelenítésére alkalmas munkalap, ahol többek közt a felmérés céljait, a lebonyolító szervezet vagy intézmény tevékenységét, a döntési helyzet hátterét lehet ismertetni. A munkalap szerkesztése során megadhatók:

-   A *Munkalap címe*, amely megjelenik a publikus kérdőívben is;
-   A *Munkalap leírása*, amely a megjelenő párbeszédablak fő szövege. A szöveg alapvető formátumbeállítási lehetőségekkel testre szabható, lehetőség van link, illetve kép beszúrására is (külső forráslink megadásával);
-   *Saját háttérkép*, amely a párbeszédablak mögötti teret tölti ki;
-   A felmérés *megosztására felhívó gombok*.

A változtatások rögzítéséhez meg kell nyomni a *Mentés* gombot, erre más oldalra navigálás esetén felugró ablak is figyelmeztet. A szerkesztés alatt álló munkalapok közötti navigációra szolgálnak a lap alján található kék jobbra/balra nyilak.

A munkalapok szerkesztőfelületéről a bal felső sarokban található PARTIMAP ikonra kattintva (*Vissza a projektre*) is visszaléphetünk a projekt adatlapjára.


#### Kérdőív munkalap {#kerdoiv}

A Kérdőív munkalap segítségével hagyományos kérdőíves felméréseket készíthetünk. A munkalap szerkesztése során megadhatók:

-   A *Munkalap címe*, amely megjelenik a publikus kérdőívben is;
-   A *Munkalap leírása*, amely a párbeszédablak elején jelenik meg. A szöveg alapvető formátumbeállítási lehetőségekkel testre szabható, lehetőség van link, illetve kép beszúrására is a Szöveg munkalaphoz hasonlóan. Kép hozzáadásával lehetőség van a képre vonatkozó kérdések feltételére;
-   *Kérdőív:* a munkalaphoz itt van lehetőség kérdőívkérdések hozzáadására, amelyek tulajdonságai a megjelenő párbeszédablakban szerkesztők;
-   *Kitöltés után válasz statisztika megjelenítése a látogatónak:* bejelölve a kitöltést követően, lapozás után a látogató számára megjelenik a válaszok egyszerűen összesített statisztikája oszlopdiagramon;
-   *Csak az eredmények megjelenítése:* bejelölve a munkalap kérdései lezárulnak, nem gyűjtenek válaszokat. Ezen a munkalapon csak az eredmények lesznek láthatóak a kitöltők számára. Ez lehetőséget ad arra, hogy a lezárt kérdőívet a link megtartásával egy, az eredményeket bemutató projektté alakítsuk át;
-   *Saját háttérkép*, amely a párbeszédablak mögötti teret tölti ki;
-   A felmérés *megosztására felhívó gombok*. Ezt az utolsó, gyakran demográfiai kérdéseket tartalmazó munkalap esetén érdemes bekapcsolni.

A Kérdőív blokkhoz az alábbi kérdéstípusok adhatók a *Kérdés szövege* megadásával:

*Szöveges válasz:* a szövegmezőbe a kitöltő tetszőleges választ gépelhet. Az eredményriport ezt a szöveges választ tartalmazza.

*Numerikus válasz (bepötyögős):* a mezőbe a kitöltő egy számot gépelhet. Beállítható a megadható válasz minimális és maximális értéke. A riport a választ szám formátumban tartalmazza.

*Numerikus válasz (csúszkával):* a kitöltő itt gépelés nélkül, egy csúszka segítségével állíthatja be számszerű válaszát. Itt is megadhatod a megadható válasz minimális és maximális értékét. A két véglet szövegesen is elnevezhető, ez a kérdőívben a csúszka két oldalán jelenik meg, skálát képezve. A riport a választ szám formátumban tartalmazza.

*Jelölőnégyzetek:* az Opcióknál az *Új opció* gombra kattintva tetszőleges számú válaszlehetőséget lehet megadni, amelyre a kitöltő egyedileg adhat választ a négyzet bejelölésével. Beállítható a maximálisan kiválasztható válaszok száma. Az *Egyéb opció hozzáadása* bejelölésével a válaszok között egy Egyéb... opció is megjelenik, amit megjelölve a kitöltő saját szöveges választ adhat a kérdésre. A riport a megjelölt válaszopciók nevét és a megadott saját egyéb választ tartalmazza szöveges formában, pontosvesszőkkel elválasztva.

*Feleletválasztós:* az Opcióknál az *Új opció* gombra kattintva tetszőleges számú válaszlehetőség adható meg, ezek közül a kitöltő egyet választhat. A riport a válaszopció nevét szöveges formában tartalmazza.

*Opciók lenyíló listában (egyet lehet vál.):* a feleletválasztóshoz hasonlóan a megadott Opciók közül a kitöltő egyet választhat egy lenyíló listából. Az Opciók mellé itt is megadhatunk Egyéb... opciót. A riport a válaszopció nevét szöveges formában tartalmazza.

*Értékelés (5 csillag):* a kitöltő egyszerű kattintással 1-5 csillaggal adhat visszajelzést a megadott kérdésre. A riport a választ szám formátumban tartalmazza.

*Feleletválasztós rács:* a feleletválasztós kérdéstípushoz hasonló, de több Sor is megadható, ezekre nézve kérjük a kitöltőt, hogy jelölje be valamelyik válaszopciót (Oszlop). A kérdéshez tetszőleges számú sor és oszlop adható. Amennyiben kötelező megválaszolni, minden sorra nézve be kell jelölni valamelyik opciót. A riport soronként szétbontva tartalmazza a válaszopció nevét szöveges formában.

*Jelölőnégyzetrács:* a jelölőnégyzetek kérdéstípushoz hasonlóan egy Sorhoz a kitöltő több válaszopciót is bejelölhet, ezeket az *Új oszlop* gombra kattintva állíthatjuk be. A kérdéshez tetszőleges számú sor és oszlop adható. Amennyiben kötelező megválaszolni, minden sorra nézve be kell jelölni legalább egy opciót. A riport soronként szétbontva tartalmazza a válaszopciók nevét szöveges formában, pontosvesszőkkel elválasztva.

Az egyes kérdések a *Kötelező megválaszolni* bepipálásával kötelezővé tehetők a kitöltőknek, enélkül nem tudnak továbblépni, vagy beküldeni a választ.

A munkalap szerkesztőfelületének Kérdőív menüpontjában (a kérdések listájában) a kérdések a kuka ikonra kattintva törölhetőek, illetve sorrendjük a kérdés fiókjára kattintva, vonszolással módosítható.


#### Térképes munkalap (statikus térkép) {#statikus}

A munkalap segítségével olyan térkép alapú felmérés készíthető, amely alkalmas egy megvalósult fejlesztés vagy terv bemutatására, valamint az ezzel kapcsolatos értékelések, visszajelzések gyűjtésére. A kitöltőket itt arra kérjük, hogy a térképen látottakhoz kapcsolódóan válaszoljanak a feltett kérdésekre, de szemben az interaktív térkép munkalappal, ők nem rajzolhatnak a térképre.

A Térkép munkalap létrehozásakor a térkép tartalmát egy már meglévő, a Térképek menüpontban tárolt térképről is importálhatjuk (*Térkép elemek másolása innen*), illetve külső forrásból (pl. Google Maps) egy .kml file segítségével közvetlenül is feltölthetjük. A térkép mozgatásáról a Térképek menüpont bemutatásánál található bővebb leírás.

A munkalap szerkesztése során megadhatók:

-   A *Munkalap címe*, amely megjelenik a publikus kérdőívben is;
-   A *Munkalap leírása*, amely a párbeszédablak elején jelenik meg. Itt érdemes tömören elmagyarázni, mi a kitöltő feladata az adott munkalapon. A szöveg alapvető formátumbeállítási lehetőségekkel testre szabható, itt is lehetőség van link és képek beszúrására.
-   *Kérdőív:* a munkalap egészéhez itt is lehetőség van kérdőívkérdések hozzáadására, amelyek a Kérdőív munkalapnál megismert módon a megjelenő párbeszédablakban szerkeszthető. A kérdőívkérdések a kitöltők számára az oldalsávban, a leírás alatt jelennek meg.
-   *Kitöltés után válasz statisztika megjelenítése a látogatónak:* ha be van jelölve, lapozás után a látogató számára megjelenik a válaszok összesített statisztikája: a munkalapszintű kérdőívkérdések eredményei és az elemekhez rendelt értékelések átlaga is.
-   *Csak az eredmények megjelenítése:* ha be van jelölve, a munkalap nem gyűjt válaszokat, csak a válaszok statisztikája lesz látható a kitöltők számára.
-   *Látogatói interakciók:*ha a *Fix elemek értékelése* be van jelölve, a kitöltők értékelhetik a térképre felrajzolt elemeket. Kétféle értékelés választható:
    -   *Csillagok:* a kitöltő ekkor az elemre kattintva csillagokkal értékelhet. A csillagok száma beállítható (1-10), ha egy csillagot választunk, az igen-nem válaszként használható. Az értékeléshez nem tartozik munkalapszintű kérdés, az ehhez tartozó instrukciót átfogóan a munkalap leírásában, vagy egyedileg az elem leírásában kell megadnunk. Ha a válasz statisztika be van állítva, az elemeknél lapozás után a csillagok átlaga és az értékelések száma jelenik meg a kitöltőknek -- ez az admin felületen alapértelmezetten látható.
    -   *Like/dislike:* a kitöltő pozitív (<i class="fas fa-fw fa-thumbs-up text-success"></i>) vagy negatív (<i class="fas fa-fw fa-thumbs-up fa-flip-both text-danger"></i>) értékelést adhat elemekhez. Ha a válasz statisztika be van állítva, az elemeknél lapozás után a pozitív és negatív értékelések száma jelenik meg a kitöltőknek -- ez az admin felületen alapértelmezetten látható.
    -   A riport az értékelések adatait egy külön Értékelések munkalapon jeleníti meg, ami tartalmazza a kitöltés azonosítóját, amivel az értékelés más válaszokhoz társítható, illetve az értékelt elem nevét és az értékelést szám formátumban (csillagok száma, [1, -1]). Emellett a generált riport egy Összesített értékelések munkalapon az értékelések összesített számát és átlagát is bemutatja.
-   *Alapértelmezett alaptérkép:* itt állítható be a térképre rajzolt elemek mögött megjelenő alaptérkép (pl. úthálózat, szatellit, fekete-fehér, kerékpárutak, topográfiai stb.) A kitöltők maguk is válthatnak az alaptérképek között.
-   *Térkép elemei:* itt jelennek meg az alaptérképre felrajzolt elemek. Az elemekhez tartozó fiókokban szerkeszthető az a tartalom, ami a kitöltők számára az adott elemre vagy a fiókra kattintva megjelenik. Az elemekhez tartozó fiókban név, szín, méret, stílus és képes leírás állítható be.
    -   A *Kategória* mezőt kitöltve a térkép elemeit a kitöltők leszűrhetik az adott kategóriára. A kategória beállításával elkülöníthetőek egymástól és könnyebben elemezhetők különböző elemek.
    -   Az *Elem elrejtése a listában* bejelölésével az adott elem megjelenik ugyan a térképen, de nem lehet vele interaktálni: nem jelenik meg a Térkép elemei között fiókként és a térképen sem lehet belekattintani. Ez akkor hasznos, ha egy olyan segédelemet rajzolunk a térképre, ami csak orientálja a kitöltőket, pl. egy város határvonala.
-   Az elemlista felett található KML gombok segítségével lehetőség van más szerkesztőfelületen készített térkép betöltésére (<i class="fas fa-fw fa-upload"></i>) vagy a térkép elemeinek lementésére (<i class="fas fa-fw fa-download"></i>).

A statikus térkép munkalap szerkesztőfelületén a jobb felső sarokban található *pont, vonal* és *terület* gombokkal közvetlenül is lehet elemeket felrajzolni a munkalapon megjelenített térképre. A térképre tetszőleges számú elem felrajzolható. A térképre a +/- gombokkal vagy kétujjas nagyítással közelíthetünk.

*Pont felrajzolása (piros):* a piros alapon fehér gombostűre kattintva helyezhető el pont jelölő. A jelölőt egyszeri kattintással helyezhetjük el.

*Vonal felrajzolása (kék):* a kék alapon fehér vonalra kattintva lehet vonalat rajzolni. Egyszeri kattintással helyezze le a vonal kezdőpontját a térképen, további kattintásokkal jelölje be a vonal köztes pontjait, majd dupla kattintással a végpontot.

TODO: kép

*Terület felrajzolása (zöld):* a zöld alapon fehér körbezárt alakzatra kattintva lehet területet (poligont) felrajzolni. Egyszeri kattintással helyezze el az alakzat kezdőpontját a térképen, majd további kattintásokkal jelölje ki a határokat, végül a kezdőpontba történő újbóli kattintással fejezze be a rajzolást.

*Mobilnézet:* amennyiben táblagépen vagy mobiltelefonon használja a szerkesztőfelületet, a térképes munkalapok esetén a kérdéseket tartalmazó panel és a térkép között az elrejt (<<) és a kinyit (>>) gombokkal lehet váltani. A rajzoláshoz szükséges gombok a térkép nézetben érhetőek el, az oldalsáv elrejtésével.

#### Interaktív térkép munkalap {#interaktiv}

Ezen a munkalapon a kitöltők rajzolhatnak a térképre. A statikus térképhez hasonlóan az adminnak is lehetősége van elemeket felrajzolni a térképre, amivel orientálhatja a kitöltőket, vagy amihez képest térképes jelöléseket vár. A munkalaphoz és annak elemeihez azonban itt nem adható kérdőívkérdés vagy értékelés.

A *Munkalap címe* és a *Munkalap leírása* kell tartalmazza azokat az információkat, amelyek segítik a kitöltőt, hogy pontos választ adjon a feltett kérdésre.

A *Látogatói interakciók* menüpontban lehet beállítani, hogy a kitöltőtől milyen típusú jelöléseket gyűjtünk (pont, vonal, terület). Egy munkalapon többféle jelölés is kérhető, de egy elemtípushoz csak egy feladat adható. Több különböző feladatot például pont felrajzolásához (kedvenc helyek és kellemetlen helyek) különálló interaktív munkalapokon lehet megadni.

A kiválasztott elemekhez az *Instrukció pont/vonal/terület felrajzolásához* szövegmezőben megadható a kitöltőknek, hogy pontosan mit jelöljenek be (pl. Melyik a kedvenc helyed? [pont], Merre közlekedsz a munkahelyedre? [vonal], Hol lenne szükség több zöldfelületre? [terület]). Ez a szöveg az oldalsávban, a rajzolást elindító gomb mellett jelenik majd meg. Ha a kitöltő felrajzol valamit a térképre, a válaszát szövegesen is kiegészítheti. Az ehhez tartozó utasítást a *Felrajzolt elemekhez rendelt kérdés* mezőben adhatod meg, ezzel irányítva a válaszadást.

A *Térkép elemei* a statikus térképhez hasonlóan az adminfelületen hozzáadott (felrajzolt vagy feltöltött) elemek listáját tartalmazza. Figyelem, a hozzájuk adott leírás nem jelenik meg a kitöltők számára, ezek az elemek csupán a térképen tűnnek fel a statikus térkép elrejtett elemeihez hasonlóan! A felrajzolt elemek itt a kitöltők orientálására használhatók, színük, méretük, stílusuk állítható. Jelezhető velük, milyen területen, zónákon belül várjuk az elemek felrajzolását. Megadásuk azért is hasznos, mert a térkép automatikusan ezekre az elemekre közelít.

Amennyiben egy interaktív térképre már érkeztek kitöltők által felrajzolt elemek, ezek a projekt adatlapján, a listában a munkalap melletti *Új saját térképre küldés* linkkel exportálhatók saját térképre, ahol böngészhetők, szerkeszthetők vagy külső felhasználásra .kml formátumban letölthetők. Az .xlsx riport is tartalmazza a beküldött elemek adatait (kitöltés azonosítója, koordináták, leírás).


### Térképek létrehozása és korábbiak kezelése {#terkepek}

A <a href="/admin/maps" target="_blank">Térképek</a> menüpontban saját térképes jelölések (.kml formátumú shapefile-ok) tárolhatók és szerkeszthetők. Itt lehet gyűjteni és szerkeszteni a felhasználó városáról, környezetéről korábban készített térképeit, és a kérdőívekből összegyűjtött válaszokat. A .kml formátumú file-ok segítségével külső térképszerkesztő programokba egyszerűen exportálhatók az itt tárolt elemek, és onnan a PARTIMAP-ba importálhatók térképek. A Térképek menüpont és a projektek között is egyszerű az átjárás: a saját térképek tartalma átmozgatható a munkalapokra (*Térkép elemek másolása innen*).

A PARTIMAP jelenleg nem kínál grafikus elemző funkciókat, de a saját térképen az egyedi elemek szerkeszthetők: név és leírás mellett a kinézetük (szín, méret, vonalak esetén a vonal stílusa) egyedileg beállítható.

Új saját térkép létrehozása:

- A <a href="/admin/maps" target="_blank">Térképek</a> oldalon az Új térkép elnevezése megadásával a *Hozzáadás* gombra kattintva. Ide .kml fájlból adatot lehet betölteni a szerkesztőfelületen;
- Egy felmérés kitöltőinek beküldéseiből a projekt adatlapon a vonatkozó munkalap sorában megjelenő *Új saját térképre küldés*

Saját térkép szerkesztése során a munkalapokhoz hasonló felületen megadható:

-   *A térkép neve*
-   *Térkép elemei:* itt jelennek meg az alaptérképre felrajzolt objektumok. A lap alján található *KML export/import* gombok segítségével lehetőség van más szerkesztőfelületen készített térkép alaptérképre importálására, és a térkép elemeinek mentésére .kml formátumban.

A PARTIMAP felmérés kitöltéseit tartalmazó .kml kategóriaként tartalmazza a jelölések típusát, így külső elemző program segítségével, vagy a .kml file-t [táblázatos formába konvertálva](https://mygeodata.cloud/converter/kml-to-xlsx) szétválaszthatók a különböző jelölések, és szerkeszthetők az elemek paraméterei.

A PARTIMAP által generált és használt .kml file-ok az alábbi paramétereket használják, ezek a Google Maps-el is átjárhatóságot biztosítanak:

-   Az elemeket alkotó pontok x és y koordinátái;
-   Az elem sorszáma (gid) és neve (Name);
-   Az elemhez rendelt kategória (partimapCategory);
-   A vonal vagy területet határoló vonal stílusa (partimapLineStyle), a pont mérete (partimapPointSize) és további, a Google Maps által automatikusan beolvasott paraméterek (méret, szín) (ExtendedData);
-   A leírás mező tartalma, amit a PARTIMAP használ (partimapDescription);
-   Erről bővebb leírás a projekt [Github oldalán](https://github.com/k-monitor/partimap/blob/master/KML.md) érhető el.


### Riport és eredmények {#riport}

Egy felmérés kitöltéseit a [Projektek](/admin/projects) listanézetének oldalán van lehetőség letölteni .xlsx formátumban. A riport az eredményeket a korábban részletezett formátumban tartalmazza. A térképes elemek azonosítószámok mentén összekapcsolhatók a kérdőívkérdésekre adott válaszokkal, így pl. a kitöltők demográfiai adataival. Az adatok összekapcsolása után a térbeli jelölések is mélyebben elemezhetők, leszűrhetők a kitöltők egyes csoportjai mentén.


### Tippek egy kérdőív elkészítéséhez {#tippek}

Mielőtt elkezdenénk a kérdőív összeállítását, tisztában kell lennünk azzal, hogy milyen döntés vagy tevékenység támogatásához szeretnénk kérni a kitöltők véleményét. Érdemes egy témakörre koncentrálni, ha túl tág a kérdőív fókusza, a kapott válaszok pontatlanabbak lesznek és a kitöltők kedvét is elveheti, ha túl sok, vagy számukra nem releváns kérdésre kell válaszolniuk. Ha megfelelően fókuszálunk, a célcsoportokat is könnyebben beazonosíthatjuk és elérhetjük.

**Tervezzük meg, kiket és hogyan szeretnénk elérni a kérdőívünkkel!**

Egy, a játszóterekkel kapcsolatos kérdőívet például érdemes beküldeni a helyi anyukákat tömörítő Facebook-csoportba, de ha a helyi fiatalokat szeretnénk megkérdezni valamilyen őket érintő problémáról, érdemes olyan platformokon vagy intézményeken keresztül elérni őket, amit napi szinten használnak.

Fektessünk hangsúlyt a nehezebben elérhető társadalmi csoportokra is. Az online kérdőívek jellemzően a fiatal vagy középkorú, magasabb jövedelmű és végzettségű kitöltőket érik el. Megfelelő tervezéssel, és különböző (akár offline) eszközökkel azonban biztosíthatjuk, hogy mindenkinek lehetősége legyen kifejteni a véleményét. Tegyük ki a papíralapú kérdőívet a könyvtárban, tegyünk a kérdőívre mutató QR kódot közösségi terekre, buzdítsuk a civil szervezeteket, hogy osszák meg a kérdőívet ügyeleikkel, követőikkel!

Érdemes tisztában lenni azzal is, hogy a feltérképezni kívánt témakörben milyen adatok állnak már rendelkezésünkre. Ne kérdezzünk olyat, amire már tudjuk a választ, vagy kérdőívezés nélkül is könnyedén megtudhatjuk!

**A kérdőív legyen lényegre törő!**

Egy felmérés készítése során újabb és újabb ötletek merülnek fel a témával kapcsolatban, egyre több részletre leszünk kíváncsiak. A kitöltők azonban nem ennyire elkötelezettek, a hosszabb felmérés láttán lemorzsolódhatnak. Javasoljuk, hogy 6-8 munkalapnál ne használjon többet egy felmérésben. Mérje le, mennyi időbe telik egy kitöltés, **10-12 percnél ne legyen hosszabb!**

A becsült kitöltési időt tüntesse fel a felmérés első munkalapján. Ha a kérdőív kitöltőinek száma jóval elmarad a megtekintések számától (pl. csak minden tizedik megnyitásból lesz kitöltés), akkor a kérdőívünk valószínűleg túl hosszú lett.

Igyekezzünk pontos magyarázatot adni a feladatokhoz, a szöveg kiemelésével, emotív ikonok használatával, lehetőleg minél tömörebben! A kérdések megfogalmazásához további szempontokat a PARTIMAP [részvételi módszertanában](https://drive.google.com/file/d/17p1JALO2iNtYNMhMkCvHCllqUTIFYrb2/view) talál!

**Ellenőrizzük magunkat!**

Egy több munkalapból álló, kérdések és információk sorából álló felmérés összetettsége miatt minden figyelmesség és alaposság miatt becsúszhatnak hibák, elírások. Ha rossz kérdéseket teszünk fel, a válaszok használhatatlanok lesznek.

Az admin felület szerkesztésével párhuzamosan érdemes a publikus felületen ellenőrizni a változtatásokat. A szerkesztőben végrehajtott változások a mentést követően a publikus felületen is frissülnek. Felmérés elindítása után a kérdőívet csak indokolt esetben szabad módosítani, hiszen az átalakított kérdésekre beérkező eredmények nem lesznek összevethetők a korábbi kérdésekre adott válaszokkal. Csináljunk próbakitöltéseket a publikálás előtt!Nézzük át a beérkezett eredményeket, elemezhetőek, használhatóak-e a célnak megfelelően!

**Tervezzük meg a beérkező adatok struktúráját!**

A megfelelő mennyiségű kitöltés beérkezését és a kampány lezárultát követően fel kell dolgozunk a kapott adatokat. Gondoljuk át előre, milyen típusú válaszokat várunk, milyen formában, felületeken és eszközök segítségével tervezzük bemutatni az eredményeket!

-   Jó ötletnek tűnhet a nyitott, kifejtős kérdések alkalmazása, azonban 1-2 ilyennél többet nem érdemes egy kérdőívben feltenni. A nyitott kérdések megválaszolása a kitöltők számára is megerőltetőbb, az adatok feldolgozásakor pedig jóval nehezebben elemezhetők a szöveges válaszok, mintha a megadott opciókból választanának a válaszadók.
-   A PARTIMAP lehetővé teszi, hogy egy feleletválasztós vagy meghatározott számú opciót kiválasztani engedő kérdésnél egyéb választ is fogadjunk a kitöltőktől. Ez a legtöbb nyílt végű kérdést feleslegessé teszi. A kérdőív végén azonban érdemes lehetőséget adni arra, hogy a kitöltő szövegesen leírhassa azokat a szempontjait a témában, ami a kérdőívből kimaradt.
-   A feleletválasztós kérdéseknél fontos, hogy a választható opciók egyértelműek és megkülönböztethetőek legyenek. Nem biztos, hogy minden válaszadó számára nyilvánvaló a ,,Ritkán" és a ,,Néha" közötti különbség.
-   Minden kérdéstípusnál kulcsfontosságú, hogy a feltett kérdés ne legyen sugalmazó, ne befolyásolja a kitöltőket, mert ez torz eredményekhez vezet.
-   Ne kérdezzünk két különböző dologra egy kérdésen belül, és kerüljük a hasonló vagy ismétlődő kérdéseket, mert ez is elveheti a kitöltők kedvét.
-   Kötelezővé tehetjük az egyes kérdések kitöltését, ha az azokra adott válaszokat fontosnak tartjuk, azonban a túl sok kötelező kérdés lemorzsolódáshoz vezet.
-   A térképes interakciónál mindenképp buzdítsuk a kitöltőket, hogy érdemi szöveges indoklásokat adjanak, hiszen ezek nélkül csak találgatni tudunk, miért éppen azt a helyet jelölték meg a térképen!
-   A legtöbb esetben fontos, hogy szocio-demográfiai adatokat (kor, nem, jövedelem, iskolázottsági szint) is gyűjtsünk, hiszen ez alapján tudjuk meghatározni, kik voltak a kitöltőink, lefedte-e a kitöltői kör a teljes érintett csoportot, vagy csak egy szűk réteg válaszait látjuk. Személyes adatokat azonban csak a szükséges mértékig gyűjtsünk, és legyünk egyértelműek ezek felhasználását illetően (összhangban a felhasználási feltételekkel). Ha publikáljuk az adatokat, minden személyes, szenzitív adatot rejtsünk el (pl. szöveges válaszban megadott adatok, lakóhely bejelölése a térképen).
-   A felmérés elindítása előtt határozzunk meg kitöltési célszámokat, és kövessük nyomon, hogy hány kitöltést gyűjtöttünk. Ha elmaradunk a célszámoktól, tegyünk további erőfeszítéseket a kérdőív terjesztésére.

**Legyen egyedi, felismerhető a kérdőívünk!**

A Felhasználók menüpontban saját profilunknál mini logót és webcímet adhatunk meg, ami ezután minden munkalap tetején megjelenik, jelezve, hogy ki a kérdőív gazdája. A munkalapokat ezen felül egyedi háttérképekkel is testre szabhatjuk. Törekedjünk az egyszerű, letisztult, koherens kinézetre!

A leírás mezőkben is el lehet helyezni képeket, ehhez egy külső tárhelyen kell tárolni a képet, vagy jogtiszta, szabadon felhasználható illusztrációt találni. Ezekkel még átélhetőbbé tehetjük a döntést a kitöltők számára.

A statikus térkép munkalap pontjait, vonalaid átszínezhetjük a szervezetünk színére. A térkép elemeihez szintén adható leírás, kép, így könnyebben beazonosíthatóvá tehetők a megjelölt helyek.

A projekt szerkesztőfelületén a kérdőívhez saját url-t és Facebook megoszthatóságot adhatunk. Ez fontos, hiszen a kérdőívet legegyszerűbben a közösségi médiában lehet terjeszteni. Ha akkor adunk hozzá Facebook arculatot, amikor a kérdőívet már megosztották, az előnézet nem az lesz, amit beállítottunk. Ezt [jelezni kell a Facebook felé](https://developers.facebook.com/tools/debug/), ami ezután frissíti a képet és elnevezést.

A kérdőív beágyazható a weboldaladra, ehhez az oldal HTML kódjába, a megfelelő helyre az alábbi kódot kell elhelyezni a projekt linkjével.

```
<embed src="https://partimap.eu/hu/p/példa" style="width:100%; height:550px;">
```

A beágyazott elem szélessége és magassága a width és height értékével állítható.
