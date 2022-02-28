<template>
	<div class="help">
		<div class="mb-5">
			<h2 id="adminsugo">Segítség felmérés készítéséhez</h2>
			<p>Az alábbiakban az admin felület működését mutatjuk be.</p>
		</div>
		<div class="mb-5">
			<h3 id="regisztracio">Regisztráció</h3>
			<p>
				<a
					href="/register"
					target="_blank"
				>Regisztrációt</a>
				követően bárki teljes körűen használhatja az alkalmazást: az admin felületen keresztül lehetőség van új felméréseket (Projekt) készíteni, korábbiakat módosítani, valamint rendezni és szerkeszteni a felmérésekhez kapcsolódó alaptérképeket.
			</p>
		</div>
		<div class="mb-5">
			<h3 id="ujprojekt">Új projekt létrehozása és korábbiak kezelése</h3>
			<p>Új projekt a belépést követő admin felületen a projekt elnevezésének megadásával hozható létre. A felméréshez kapcsolódó adatok, kérdések és tartalom a létrehozást követően a felmérés adatlapján adhatók meg.</p>
			<div class="row">
				<div class="col-12 col-lg-10 mx-auto mt-4">
					<figure class="figure">
						<img
							alt="Poligon felrajzolása"
							class="figure-img img-fluid rounded shadow-sm"
							:src="`/help/project.png`"
						>
						<figcaption class="figure-caption text-center">
							Projekt létrehozása
						</figcaption>
					</figure>
				</div>
			</div>
			<p>
				Az admin felület rögzített fenti menüsorában van lehetőség a
				<a
					href="/admin/projects"
					target="_blank"
				>Projektek</a>
				és a
				<a
					href="/admin/maps"
					target="_blank"
				>Térképek</a>
				listanézetének és szerkesztő felületének közötti váltásra.
			</p>
		</div>
		<div class="mb-5">
			<h3 id="projektadatlap">Projekt adatlap</h3>
			<p>
				A
				<a
					href="/admin/projects"
					target="_blank"
				>Projektek</a>
				menüpontból egy projekt kiválasztását vagy új létrehozását követően a Projekt adatlapjára jutunk. Minden projekt adatlapja két részből áll: az oldal felső részén a felméréshez kapcsolódó adatok és beállítások, a második felében a munkalapok szerkesztésére van lehetőség.
			</p>
			<p>A kapcsolódó adatoknál és beállításoknál van lehetőség</p>
			<ul>
				<li>
					<p>megadni a projekt elnevezését, ami az adminfelületen túl a böngésző lapcímében és a közösségi médiában megosztáskor jelenik meg;</p>
				</li>
				<li>
					<p>szerkeszteni az elérési útvonalát (url címét - <code>https://partimap.eu/p/*</code>),</p>
				</li>
				<li>
					<p>jelszavas védelmet beállítani, amivel szűkítheted a kitöltők körét. Ilyenkor a kérdőív url-jére navigálva az oldal jelszót kér, megadás után lehet kitölteni a kérdőívet,</p>
				</li>
				<li>
					<p>Facebook megosztáshoz egyedi meta leírást adni,</p>
				</li>
				<li>
					<p>Facebook megosztáshoz egyedi képet feltölteni,</p>
				</li>
				<li>
					<p>az adatkezelő elérhetőségét megadni (ez az adatkezelési nyilatkozatban jelenik meg),</p>
				</li>
				<li>
					<p>a kitöltés végén (a beküldés után) megjelenő egyedi köszönő üzenetet és tovább navigáló linket (url) megadni, </p>
				</li>
				<li>
					<p>a felmérés megosztására felhívó gombokat (Facebook, Twitter, e-mail) ki- és bekapcsolni.</p>
				</li>
			</ul>
			<p>Egy projekt tartalmi része munkalapokra tagolódik. Az egyes munkalapokon felületén van lehetőség megjeleníteni a különböző típusú kérdéseket, tájékoztató szövegeket és kitöltői interakcióra felhívó térképes elemeket. Új munkalapot a projekt adatlap alsó felében található munkalap szerkesztő résznél lehet hozzáadni (<em>Munkalap hozzáadása</em>). A már létrehozott munkalapok sorba rendezett listanézete is itt érhető el.</p>
			<div class="row">
				<div class="col-12 col-lg-10 mx-auto mt-4">
					<figure class="figure">
						<img
							alt="Poligon felrajzolása"
							class="figure-img img-fluid rounded shadow-sm"
							:src="`/help/sheets.png`"
						>
						<figcaption class="figure-caption text-center">
							Munkalapok listája
						</figcaption>
					</figure>
				</div>
			</div>
			<p>A munkalapok szerkesztőfelület a munkalap elnevezésére kattintva érhető el. Az első piktogram jelzi a munkalap típusát (<em>Szöveg, Kérdőív, Térkép</em> vagy <em>Interaktív térkép</em>), a fel és le nyilakkal változtatható a munkalapok sorrendje, a kuka ikon pedig törli a már nem szükséges munkalapot. Amennyiben egy interaktív térképes munkalapra már érkeztek beküldések, ezek az <em>Új saját térképre küldés</em> linkkel exportálhatók saját térképre, ahol böngészhetők, szerkeszthetők a kitöltők által felrajzolt elemek.</p>
		</div>
		<div class="mb-5">
			<h3 id="munkalapok">Munkalapok típusai</h3>
			<div class="row">
				<div class="col-12 col-lg-10 mx-auto mt-4">
					<figure class="figure">
						<img
							alt="Poligon felrajzolása"
							class="figure-img img-fluid rounded shadow-sm"
							:src="`/help/newsheet.gif`"
						>
						<figcaption class="figure-caption text-center">
							Új munkalap hozzáadása
						</figcaption>
					</figure>
				</div>
			</div>
			<h4 id="szoveges">Szöveges munkalap</h4>
			<p>Szöveg és képek megjelenítésére alkalmas munkalap. Többek közt alkalmas a felmérés céljainak, a lebonyolító szervezet vagy intézmény bemutatkozásának, fejlesztések hátterének leírására, további kapcsolódó információk megjelenítésére. A munkalap szerkesztése során megadható:</p>
			<ul>
				<li>
					<p><em>A munkalap címe</em>, amely megjelenik a publikus felületen is.</p>
				</li>
				<li>
					<p><em>Munkalap leírása</em>, amely a megjelenő párbeszédablak fő szövege. A szöveg alapvető formátumbeállítási lehetőségekkel testre szabható, lehetőség van link, illetve kép beszúrására is.</p>
				</li>
				<li>
					<p><em>Saját háttérkép</em>, amely a párbeszédablak mögötti teret tölti ki.</p>
				</li>
				<li>
					<p>A felmérés megosztására felhívó gombok (Facebook, Twitter, e-mail).</p>
				</li>
			</ul>
			<p>A szerkesztések rögzítéséhez meg kell nyomni a <em>Mentés</em> gombot, különben a hozzáadott tartalom más oldalra navigálás esetén elvész. A szerkesztés alatt álló munkalapok közötti navigációra szolgálnak a lap alján található kék jobbra/balra nyilak.</p>
		</div>
		<div class="mb-5">
			<h4 id="kerdoiv">Kérdőíves munkalap</h4>
			<p>Kérdőíves munkalap segítségével kérdőíves felméréseket készíthet. A munkalap szerkesztése során megadható:</p>
			<ul>
				<li>
					<p><em>A munkalap címe</em>, amely megjelenik a publikus felületen is.</p>
				</li>
				<li>
					<p><em>Munkalap leírása</em>, amely a párbeszédablak elején jelenik meg. A szöveg alapvető formátumbeállítási lehetőségekkel testre szabható, lehetőség van link, illetve kép beszúrására is.</p>
				</li>
				<li>
					<p><em>Kérdőív:</em> a munkalaphoz itt van lehetőség kérdések hozzáadására amelyek tulajdonságait a megjelenő párbeszédablakban szerkesztheti. </p>
				</li>
				<li>
					<p><em>Kitöltés után válasz statisztika megjelenítése a látogatónak:</em> kipipálva a kitöltést követően, lapozás után a látogató számára megjelenik a válaszok egyszerűen összesített statisztikája oszlopdiagramon.</p>
				</li>
				<li>
					<p><em>Csak az eredmények megjelenítése:</em> kipipálva a munkalap kérdései lezárulnak, nem gyűjtenek válaszokat, csak az eredmények lesznek láthatók a látogatók számára.</p>
				</li>
				<li>
					<p><em>Saját háttérkép</em>, amely a párbeszédablak mögötti teret tölti ki.</p>
				</li>
				<li>
					<p>A felmérés megosztására felhívó gombok (Facebook, Twitter, e-mail). Ezt a záró, demográfiai kérdéseket tartalmazó munkalap esetében érdemes bekapcsolni.</p>
				</li>
			</ul>
			<p>A kérdőív kérdéseinek formája lehet f<em>eleletválasztós, legördülő menü, lineáris értékelés</em> vagy <em>szöveges válasz</em> - ezek saját képek hozzáadásával és további beállításokkal szabadon testre szabhatók. A kitöltők által adott válaszok összesítése egy gombnyomással publikálható a munkalap végére.</p>
			<p>A szerkesztések rögzítéséhez meg kell nyomni a <em>Mentés</em> gombot, különben a hozzáadott tartalom más oldalra navigálás esetén elvész. Munkalapok közötti navigációra szolgálnak a lap alján található kék jobbra/balra nyilak.</p>
		</div>
		<div class="mb-5">
			<h4 id="statikus">Statikus térképes munkalap</h4>
			<p>Statikus térképes munkalap segítségével olyan térkép alapú felmérést készíthető, amely alkalmas egy fejlesztés vagy fejlesztési ötlet bemutatására valamint az ezzel kapcsolatos javaslatok, értékelések gyűjtésére. A munkalap a klasszikus kérdőíves funkciókat ötvözi a térképes nézettel, de a térkép elemeit az admin adja meg, a látogatók önállóan itt nem rajzolhatnak a térképre.</p>
			<p>A munkalap szerkesztése során megadható:</p>
			<ul>
				<li>
					<p><em>A munkalap címe</em>, amely megjelenik a publikus felületen is.</p>
				</li>
				<li>
					<p><em>Munkalap leírása</em>, amely a párbeszédablak elején jelenik meg. A látogatótól várt interakció leírásának a helye. A szöveg alapvető formátumbeállítási lehetőségekkel testre szabható, lehetőség van link, illetve kép beszúrására is. </p>
				</li>
				<li>
					<p><em>Kérdőív:</em> a munkalap egészéhez itt is van lehetőség kérdések hozzáadására, amelyek tulajdonságait a megjelenő párbeszédablakban szerkesztheti. A kérdőívkérdés a munkalap térképe melletti oldaldobozban, a leírás alatt jelenik meg.</p>
				</li>
				<li>
					<p><em>Statisztika:</em> kipipálva a kitöltést követően a látogató számára megjelenik a kérdőívkérdésre adott válaszok összesített statisztikája.</p>
				</li>
				<li>
					<p><em>Csak eredmények:</em> kipipálva a munkalap kérdései lezártnak minősülnek, csak az eredmények lesznek láthatók a látogatók számára.</p>
				</li>
				<li>
					<p><em>Látogatói interakciók:</em> kipipálva engedélyezi, hogy a látogatók értékelést adjanak az alaptérképen felrajzolt elemekhez. Erre nincs szükség pl. ha csak prezentációt készít vagy kérdőíves elemeket alkalmaz, de praktikus lehet, ha a felrajzolt elemekről vár értékelést.</p>
				</li>
				<li>
					<p><em>Térkép elemei:</em> itt jelennek meg az alaptérképre felrajzolt objektumok. A lap alján található <em>KML export/import</em> gombok segítségével lehetőség van más szerkesztőfelületen készített térkép alaptérképként való importálására, illetve a kérdőívhez az admin által felrajzolt elemek lementésére.</p>
				</li>
			</ul>
			<p>Az alaptérképre elemeket a jobb felső sarokban található <em>pont, vonal</em> és <em>terület</em> gombokkal van lehetőség rajzolni. A hozzáadást követően az elemek részletei (elnevezés, szín, méret, leírás, elem törlése) a térképen kiválasztva vagy az oldalsáv <em>Térkép elemei</em> részből nyithatóak meg és szerkeszthetőek.</p>
			<p>A szerkesztések rögzítéséhez meg kell nyomni a <em>Mentés</em> gombot, különben a hozzáadott tartalom más oldalra navigálás esetén elvész. Munkalapok közötti navigációra szolgálnak a lap alján található kék jobbra/balra nyilak.</p>
		</div>
		<div class="mb-5">
			<h4 id="interaktiv">Interaktív térképes munkalap</h4>
			<p>Interaktív térképes munkalappal a kitöltők rajzolhatnak a térképre! Segítségével olyan térkép alapú felmérés készíthető, amely a látogatótól pontokkal, vonalakkal és poligonokkal (területekkel) kifejezett aktivitást, a véleménye, ötletei térképre való felrajzolását várja.</p>
			<p>A munkalap szerkesztése során megadható:</p>
			<ul>
				<li>
					<p><em>A munkalap címe</em>, amely megjelenik a publikus felületen is.</p>
				</li>
				<li>
					<p><em>Munkalap leírása</em>, amely a párbeszédablak elején jelenik meg. A látogatótól várt interakció leírásának a helye. A szöveg alapvető formátumbeállítási lehetőségekkel testre szabható, lehetőség van link, illetve kép beszúrására is. </p>
				</li>
				<li>
					<p><em>Látogatói interakciók:</em> kipipálással kiválasztható, a látogató milyen geometriai formákat használhat interakciója során. A választható lehetőségek (<em>pont, vonal, terület</em>) kijelölése esetén a publikus felületen a jobb felső sarokban jelennek meg.</p>
				</li>
				<li>
					<p><em>Felrajzolt elemekhez rendelt kérdés:</em> A látogatók rövid szöveget írhatnak az általuk felrajzolt elemekhez. Itt megadható kérdés segítségével irányíthatja válaszukat.</p>
				</li>
				<li>
					<p><em>Térkép elemei:</em> itt jelennek meg az alaptérképre felrajzolt objektumok. A lap alján található <em>KML export/import</em> gombok segítségével lehetőség van más szerkesztőfelületen készített térkép alaptérképként való importálására.</p>
				</li>
			</ul>
			<p>Az alaptérképre elemeket a jobb felső sarokban található <em>pont, vonal</em> és <em>terület</em> gombokkal van lehetőség rajzolni. Ezek segítségével érdemes többek közt felrajzolni azt a területet, ahová a jelöléseket várjuk. Az egyes elemek hozzáadását követően az elemek részletei (elnevezés, szín, méret, leírás, elem törlése) a térképen kiválasztva vagy az oldalsáv <em>Térkép elemei</em> részből nyithatóak meg és szerkeszthetőek.</p>
			<p>A szerkesztések rögzítéséhez meg kell nyomni a <em>Mentés</em> gombot, különben a hozzáadott tartalom más oldalra navigálás esetén elvész. Munkalapok közötti navigációra szolgálnak a lap alján található kék jobbra/balra nyilak.</p>
		</div>
		<div class="mb-5">
			<h3 id="terkepek">Térképek létrehozása és korábbiak kezelése</h3>
			<p>
				A Partimap lényege a klasszikus kérdőíves funkciók ötvözése a térképes felülettel. A
				<a
					href="/admin/maps"
					target="_blank"
				>Térképek</a>
				menüpont alatt a felméréseket segítő alaptérképek érhetők el. Itt lehet gyűjteni és szerkeszteni egy adott felhasználó városáról, környezetéről korábban készített térképeit, és a kérdőívekből összegyűjtött válaszokat. A Partimap jelenleg nem kínál grafikus elemző funkciókat, de a saját térképen az egyedi elemek szerkeszthetők: név és leírás mellett a kinézetük (szín, méret, vonalak esetén a vonal stílusa) beállítható.
			</p>
			<p>Új alaptérkép létrehozása:</p>
			<ul>
				<li>
					<p>
						Üres térkép esetén a
						<a
							href="/admin/maps"
							target="_blank"
						>Térképek</a>
						aloladon.
					</p>
				</li>
				<li>
					<p>Egy felmérés kitöltőinek beküldéseiből a <em>Projekt adatlapon</em> a vonatkozó munkalap sorában megjelenő <em>Új saját térképre küldés</em> linkkel.</p>
				</li>
				<li>
					<p>KML fájlból adatot betölteni a térképet a szerkesztőfelületen megnyitva vagy egy munkalapon a <em>KML import</em> gomb segítségével.</p>
				</li>
			</ul>
			<p>Saját térkép szerkesztése során a munkalapokhoz hasonló felületen megadható: </p>
			<ul>
				<li>
					<p><em>A térkép neve</em></p>
				</li>
				<li>
					<p><em>Térkép elemei:</em> itt jelennek meg az alaptérképre felrajzolt objektumok. A lap alján található <em>KML export/import</em> gombok segítségével lehetőség van más szerkesztőfelületen készített térkép alaptérképre importálására.</p>
				</li>
			</ul>
		</div>
		<div class="mb-5">
			<h3 id="riport">Riport és eredmények</h3>
			<p>
				Egy felmérésre kitöltéseit a
				<a
					href="/admin/projects"
					target="_blank"
				>Projektek</a>
				listanézetének oldalán van lehetőség letölteni excel formátumban (.xlsx). A beérkezett válaszok összességét tartalmazó fájl a felmérésben használt kérdések és interakciók típusától függően az alábbiak szerint külön lapokra tagolja az adatokat.
			</p>
			<ul>
				<li>
					<p><em>Beküldött válaszok</em>: a kérdőívekre adott válaszok;</p>
				</li>
				<li>
					<p><em>Értékelések</em>: a térképes munkalapok alaptérképein megjelenített objektumokra adott egyedi értékelések;</p>
				</li>
			</ul>
		</div>
		<div class="mb-5">
			<h3 id="tippek">Tippek egy jó Partimap felmérés elkészítéséhez</h3>
			<p><strong>Fogd rövidre, légy lényegretörő!</strong> Valószínű, hogy egy felmérés során egyre újabb és újabb ötleteid lesznek a témával kapcsolatban, egyre mély részletekre leszel kíváncsi. A kitöltők azonban nem feltétlenül ennyire elkötelezettek, a hosszabb felmérés láttán lemorzsolódhatnak, félbehagyhatják azt.</p>
			<ul>
				<li>Javasoljuk, hogy 6-8 munkalapnál ne használj többet egy felmérésben!</li>
				<li>Publikálás előtt kérd meg kollégádat, ismerősödet, hogy töltse ki azt! Mérd le, mennyi időbe telik egy kitöltés, 10-12 percnél ne legyen hosszabb!</li>
				<li>
					Igyekezz pontos magyarázatot adni a feladatokhoz, a szöveg kiemelésével, ikonok használatával lehetőleg minél tömörebben! Ehhez, és a jó kérdőívkérdések megfogalmazásához további javaslatokat a Partimap
					<a
						href="https://drive.google.com/file/d/17p1JALO2iNtYNMhMkCvHCllqUTIFYrb2/view"
						target="_blank"
					>részvételi módszertanában</a>
					találsz!
				</li>
			</ul>
			<p><strong>Ellenőrizd magad!</strong> Egy több munkalapból álló, kérdések és információk sorából álló felmérés összetettsége miatt minden figyelmesség és alaposság miatt becsúszhatnak hibák, elírások.</p>
			<ul>
				<li>Az admin felület szerkesztésével párhuzamosan érdemes a publikus felületen ellenőrizni a változtatásokat!</li>
				<li>A szerkesztőn végrehajtott változások a mentést követően a publikus felületen is frissülnek. Felmérés elindítása után azonban csak indokolt esetben módosíts a munkalapok tartalmán, hiszen az átalakított kérdésekre beérkező eredmények nem lesznek összevethetők a korábbi kérdésekre adott válaszokkal!</li>
				<li>Ha úgy érzed készen van a felmérésed, csinálj próbakitöltéseket a publikálás előtt!</li>
			</ul>
			<p><strong>Tervezd meg a beérkező adatok struktúráját!</strong> Megfelelő mennyiségű kitöltés beérkezését és a kampány lezárultát követően munkád lesz még az adatok kiértékelésével is. Gondold át előre, milyen típusú válaszokat vársz, milyen formában, felületeken és eszközök segítségével tervezed bemutatni az eredményeket!</p>
			<ul>
				<li>Készíts pár próbakitöltést a felmérés publikálását megelőzően!</li>
				<li>Nézd meg a beérkezett eredményeket, elemezhetőek-használhatóak-e a célodnak megfelelően!</li>
			</ul>
			<p><strong>Legyen egyedi, felismerhető a kérdőíved!</strong> A Felhasználók menüpontban saját profilodnál saját mini logót és webcímet adhatsz meg, ami ezután minden munkalapod telején megjelenik, jelezve, hogy te vagy a kérdőív gazdája. A munkalapokat ezen felül egyedi háttérképekkel is testre szabhatod. Törekedj az egyszerű, letisztult, koherens kinézetre!</p>
			<ul>
				<li>A leírás mezőkben is el tudsz helyezni képeket, ehhez egy külső tárhelyen kell elhelyezned a képet, vagy jogtiszta, szabadon felhasználható illusztrációt találni. Ezekkel még átélhetőbbé teheted a döntést a kitöltők számára</li>
				<li>A statikus térkép munkalap pontjait, vonalaid átszínezheted a szervezeted színére. A térkép elemeihez szintén adhatsz leírást, képeket, így könnyebben beazonosíthatóvá teheted azt a helyet, amit megjelöltél.</li>
				<li>
					A projekt szerkesztőfelületén a kérdőívhez saját url-t és Facebook megoszthatóságot adhatsz. Ez fontos, hiszen a kérdőívet legegyszerűbben a közösségi médiában tudod terjeszteni. Ha később adod hozzá a Facebook arculatot, amikor a kérdőívet már megosztottad, akkor ezt jelezned kell a Facebook felé, ami ezután frissíti a korábbi képet és elnevezést. Ezt
					<a
						href="https://developers.facebook.com/tools/debug/"
						target="_blank"
					>itt tudod megtenni</a>.
				</li>
			</ul>
		</div>
	</div>
</template>
