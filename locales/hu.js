import terms from './hu-terms.md';

export default {
	meta: {
		description:
			'Ingyenes, könnyen kezelhető és testreszabható térképes kérdőív.',
	},

	// pages

	adminHelp: {
		title: 'Súgó',
	},
	help: {
		title: 'Hogyan működik az oldal?',
	},
	landing: {
		title: 'TÉRKÉPES KÉRDŐÍV',
		tagline1:
			'A PARTIMAP egy ingyenes, könnyen kezelhető és testreszabható térképes kérdőív azoknak,',
		tagline2:
			'akik szerint a közpénzből megvalósuló fejlesztésekről meg kell kérdezni az érintetteket is.',
		column1:
			'Mikor kérték ki legutóbb a véleményed egy olyan fejlesztésről, amit naponta használsz? Hazai és európai uniós milliárdokból sorra újulnak meg városi tereink, közintézményeink és a közlekedési létesítmények. A társadalmi egyeztetés és az érintettek bevonása azonban sokszor csak formalitás. Pedig könnyen belátható, hogy a lebonyolítás szakmai szempontjai mellett a fejlesztéseket napi szinten használók igényeit, elvárásait is számításba kell venni ahhoz, hogy egy projekt sikeres legyen. A cél nem az, hogy modernebb legyen a vasútállomás, hanem az, hogy többen járjanak vonattal. Nem attól kap közösségi funkciót egy tér, okospadokat szerelünk fel, hanem attól, hogy a környékbeliek megkedvelik.',
		column2:
			'Participatory mapping, azaz részvételi térképezés: így nevezik a folyamatot, amelynek révén az érintettek pótolhatatlan tudása beépül a számukra készülő közösségi fejlesztésekbe. A PARTIMAP térképes kérdőívező felülete ahhoz nyújt segítséget, hogy lakosokkal való kapcsolat gyorsabbá, hatékonyabbá és egyszerűbbé váljon. A program regisztráció után ingyenesen használható, saját arculattal látható el és nyílt forráskódjának köszönhetően szabadon továbbfejleszthető. Legyél állami szerv, önkormányzat, vagy helyi érdekérvényesítő csoport - ha egy okos és átlátható megoldást keresel arra, hogyan ismerd meg a környezeted véleményét, próbáld ki a PARTIMAPot és csatlakozz te is a fejlesztéshez!',
		tryButton: 'Kipróbálom',
		tryLink: 'https://www.partimap.eu/p/Demo/0',
		methodTitle: 'PARTIMAP részvételi módszertan',
		methodDesc:
			'Mitől lesz sikeres egy részvételi térképezés? Hogyan kell elkészíteni a kérdőívet, mire kell odafigyelni a terjesztés során és hogyan lehet a legtöbbet kihozni az összegyűjtött adatokból? A K-Monitor összefoglalta a legfontosabb tudnivalókat, hiszen a kérdőívezés csak egy eleme a fejlesztések társadalmasításának. A PARTIMAP részvételi módszertana - a program használói körével együtt - a jövőben folyamatosan bővülni fog!',
		methodButton: 'Elolvasom',
		methodLink:
			'https://drive.google.com/file/d/17p1JALO2iNtYNMhMkCvHCllqUTIFYrb2/view?usp=sharing',
		featuresTitle: 'Mit tud a program?',
		features: [
			{
				title: 'Egyszerű szerkeszthetőség',
				description:
					'<p>A PARTIMAPpal egyszerűen lehet létrehozni többféle térképes és hagyományos kérdőíves funkciókat tartalmazó felméréseket. Munkafelületet úgy alakítottuk ki, hogy hétköznapi számítógépes felhasználói tudás elegendő legyen a kérdések megadáshoz, munkalapok létrehozásához, közösségi médiában való megosztás adatainak megadásához és egy új projekt élesítéséhez.</p><p>A projekt szerkesztőfelületébe regisztrálva az új projekt létrehozásakor először az olyan alapadatok megadására van szükség, mint a projekt címe, az adatkezelő adatai és a köszönőoldal szövege, ezt követően pedig a saját témához kapcsolódó munkalapok létrehozására van lehetőség. Ezek lehetnek szöveges oldalak (a tervek, elképzelések bemutatására), kérdőívek (feleletválasztó, legördülő menüs, szabadszavas és skálán mérhető válaszok begyűjtésére), statikus térképek (előre meghatározott térképes elemek - pontok, vonalak és poligonok - bemutatása és értékelése), valamint interaktív térképek (itt egy kérdésre válaszolva a kitöltők rajzolhatnak fel saját elemeket). A munkalapok között könnyen lehet törölni, navigálni és a sorrendjük is bármikor tetszőlegesen szerkeszthető.</p>',
			},
			{
				title: 'Testre szabható megjelenés',
				description:
					'<p>A kérdőíves felületek feladata, hogy könnyen eljusson a célközönséghez. Ezért külön figyelmet fordítottunk a fejlesztés során a megoszthatóságra és a projektek testre szabhatóságára. A bemutatkozó és záró munkalapokon elérhetők a legnépszerűbb közösségi médiafelületek megosztás gombjai. A projektekhez egyedi Facebook bélyegkép és előnézeti szöveg is beállítható, amivel a felhasználó szervezet saját kreatív képi világához igazíthatja felmérését. A munkalapok szerkesztőfelületén saját fényképek feltöltésén túl lehetőség van a szövegek formázására, linkek megadására, és háttérképek feltöltésére is. A projekteknek ezen felül a felületen egyedi (partimap.eu/p/NÉV) url cím adható.</p>',
			},
			{
				title: 'Sokoldalú kérdőív',
				description:
					'<p>Az oldal kérdőíves munkalapja segítségével a térképes nézethez nem kapcsolódó felméréseket lehet készíteni. A kérdések formája lehet feleletválasztós, legördülő menü, lineáris értékelés vagy szöveges válasz - ezek saját képek hozzáadásával és további beállításokkal szabadon testre szabhatók. A kitöltők által adott válaszok összesítése (eredménye) egy gombnyomással publikálható grafikus formában a munkalap végén, a kitöltés lezárása után pedig lehetőség van csak az eredményeket megmutatni. A munkalap ugyanúgy testre szabható, mint a többi: háttérképet, illusztrációt, linkeket lehet használni rajta, hogy könnyebb legyen a kitöltők dolga.</p>',
			},
			{
				title: 'Fejlesztések bemutatása térképen',
				description:
					'<p>Adott közlekedési, infrastrukturális vagy más térképen ábrázolható fejlesztés vagy fejlesztési ötlet bemutatására és visszajelzések gyűjtésére a kérdőívhez statikus térkép munkalap adható. Ehhez más térképes felületekről (pl. Google Maps) könnyen importálhatóak korábban felrajzolt elemek, amelyekhez a PARTIMAPon egyedi megjelenítés és értékelési lehetőség adható. Ezen felül magához a munkalaphoz is hozzáadhatóak a kérdőívnél már megismert kérdéstípusok, illetve további magyarázat, leírás, linkek. A felrajzolt térképet saját térképként elmentve egy következő projektnél is fel lehet használni.</p><p>A statikus térkép kiválóan alkalmas arra, hogy egy település különböző létesítményeihez értékelést kérjünk a lakosoktól, pl. Mennyire könnyen megközelíthető, mennyire akadálymentes, jól járható-e kerékpárral stb. Ezekből az eredmények letöltése után egy komplex értékelés rajzolódik ki. A munkalaptípus konkrét fejlesztési dilemmák eldöntésére is használható, például egy területre tervezett A és B verziójú fejlesztést megismerve dönthetnek a kitöltők, melyiket kedvelik jobban.</p>',
			},
			{
				title: 'Most te jössz - rajzolj a térképre!',
				description:
					'<p>A PARTIMAP egyediségét az adja más térképes felületekhez képest, hogy a kitöltők térképre rajzolva is kifejezhetik a véleményüket, illusztrálhatják a javaslataikat, vagy egyszerűen megoszthatják, merre közlekednek. Egy település, kerület vagy környék köztereit számos ember használja, akiknek szerteágazó térhasználati igényei és véleményei felmérésére alkalmas az interaktív térképes munkalap. A megkérdezett felhasználók pont, vonal és alakzat segítségével adhatnak grafikus választ a feltett kérdésekre. A bejövő eredményeket könnyen fel lehet dolgozni akár egy hőtérkép formájában, vagy akár egy következő kérdőívben a beérkezett javaslatokat lehet egy statikus térképen szavazásra bocsátani.</p>',
			},
			{
				title: 'Átjárhatóság más felületekkel',
				description:
					'<p>Mindkét térképes munkalap az openstreetmap.org-ot használja háttértérképként, amelyhez egyedi alaptérkép rajzolható kiemelve a felmérés fókuszpontjait. A korábbi projektekben felrajzolt elemeket a felhasználó saját térképei között lehet elmenteni és tárolni. Az egyes munkalapokhoz az alaptérkép nem csak ebből a saját térképtárból, hanem külső KML fájlból is behúzható: import/export funkcióval gyors átjárást biztosít olyan térképes szoftverekkel, mint például a Google MyMaps vagy más, komplexebb térinformatikai programok.</p><p>Az egyszerű szerkesztőfelületen színezhető pontok, vonalak és poligonok felrajzolásával készíthetők a felméréshez illeszkedő térképek. Egy gombnyomással lehetőség van egy felmérés kitöltői által beküldött adatokból is alaptérképet létrehozni, valamint KML fájlformátumban történő exportra - így biztosított az átjárás más térképszerkesztő alkalmazások felé. A későbbiekben más típusú raszteres háttérképeket, és a felrajzolt elemek újfajta grafikai megjelenítését is meg kívánjuk teremteni (pl. egyedi ikonok).</p>',
			},
			{
				title: 'Az eredmények kommunikálása',
				description:
					'<p>Egy felmérés lezárultával új szakasz nyílik egy projekt életében: a kiértékelés. A kérdőíves felületen beérkező válaszokat a gyors kommunikáció érdekében grafikonokon mutathatjuk be: ezek megjelenítése egy gombnyomással beállítható, így a kitöltők közvetlenül is böngészhetik a kérdőívezés aktuális eredményét. További, részletes elemzéseket a beérkezett adatok teljeskörű excel formátumban történő letöltésével lehet megkezdeni. A riportból ezt követően adatkezelő programokkal lehet feldolgozni a beküldött válaszokat, földrajzi elemeket, így a végeredmény összetettsége és látványossága már csak adatelemző és -vizualizáló kapacitásunk határaitól függ.</p>',
			},
			{
				title: 'Ingyenes, szabadon felhasználható',
				description:
					'<p>Az alkalmazás használata ingyenes, gyors regisztrációt követően máris létrehozható egy saját PARTIMAP kérdőív. A K-Monitor és partnerei által fejlesztett eszköz nyílt forráskóddal rendelkezik, így szabadon továbbfejleszthető, alakítható és felhasználható. Célunk, hogy minél több olyan projekt szülessen, ami ösztönzi az állampolgárok bevonását a közügyek eldöntésébe, így kifejezetten örülünk, ha az eszköz kreatív alkalmazásának, fejlesztésének. </p>',
			},
			{
				title: 'Szeretném segíteni a projektet!',
				description:
					'<p>A PARTIMAP szoftvert a K-Monitor egyesület az Európai Bizottság (DG Regio) támogatásából valósította meg 2021-ben. A jelenlegi verzió publikálásával a projekt azonban korántsem ért véget! Az ingyenes, szabadon felhasználható felületet állami szerveknek, önkormányzatoknak, érdekérvényesítő civil szervezeteknek készítettük azzal a céllal, hogy az eszköz segíti őket a fejlesztésekkel kapcsolatos döntések társadalmasításában, így közös vagyonunkkal takarékosabban gazdálkodhatunk.</p><p>Ha érdekel a projekt, és szeretnél bekapcsolódni a fejlesztésbe, vagy csak megosztanád velünk a gondolataidat a PARTIMAP-ról, írj nekünk a <a href="mailto:hello@partimap.eu-ra.">hello@partimap.eu-ra.</a>-ra. Ha anyagilag támogatnád a fejlesztést, hogy az ingyenes, szabadon felhasználható szoftver minél többek számára legyen elérhető, <a href="https://tamogatas.k-monitor.hu/" target="_blank">támogasd a K-Monitort!</a></p>',
			},
		],
		funding:
			'A fejlesztés az Európai Bizottság (DG Regio) által támogatott <a href="https://k-monitor.hu/tevekenysegek/20210324-partimap" target="_blank">Participatory Mapping in Cohesion Policy in Hungary (PartiMap)</a> elnevezésű projekt keretében valósul meg. Az eszköz továbbfejlesztését a Heinrich Böll Alapítvány prágai irodája támogatta.',
		ec: 'Európai Bizottság',
	},
	login: {
		activated: 'Sikeres aktiválás, most már bejelentkezhetsz!',
		activationFailed: 'Sikertelen aktiválás, próbálj újra regisztrálni!',
		email: 'Email cím',
		forgotPassword: 'Elfelejtettem a jelszavam',
		invalidEmail: 'Érvénytelen email cím',
		invalidEmailOrPassword: 'Érvénytelen email vagy jelszó',
		password: 'Jelszó',
		passwordChangeRequested: 'Jelszócseréhez szükséges email kiküldve',
		pwchanged: 'Jelszó sikeresen cserélve!',
		pwchangefailed: 'Jelszócsere sikertelen, próbáld újra!',
		register: 'Még nincs fiókom',
		registered:
			'A fiók aktiválásához szükséges e-mail kiküldve. Ellenőrizze a postafiókját!',
		submit: 'Bejelentkezés',
		title: 'Bejelentkezés',
	},
	mapEditor: {
		back: 'Vissza a térképekhez',
		error: 'Módosítás sikertelen',
		name: 'Térkép neve',
		success: 'Módosítás sikeres',
	},
	maps: {
		add: 'Hozzáadás',
		creationFailed: 'Létrehozás sikertelen',
		deleteFailed: 'Törlés sikertelen',
		filter: 'Szűrés',
		newMapsName: 'Új térkép elnevezése',
		ownMaps: 'Saját térképek',
		title: 'Térképek',
	},
	passwordChange: {
		newPassword: 'Új jelszó',
		submit: 'Mentés',
		title: 'Jelszócsere',
	},
	projectEditor: {
		altThumbnail: 'Facebook bélyegkép',
		back: 'Projektek',
		changeFailed: 'Módosítás sikertelen',
		changeSuccessful: 'Módosítás sikeres',
		copiedURL: 'Projekt URL vágólapra másolva!',
		generateSlug: 'Generálás a projekt címéből',
		newPassword: 'Új jelszó',
		password: 'Jelszavas védelem',
		passwordDescription:
			'Ha be vagy jelentkezve, a saját projektjeid nem fognak jelszót kérni. Inkognitó/privát módban tudod tesztelni a védelmet.',
		passwordSet: 'Be van állítva',
		privacyPolicy: 'Adatkezelő elérhetősége',
		privacyPolicyDescription:
			'Az Adatkezelési tájékoztatóban jelenik meg kapcsolatfelvételi adatként. Ezt a látogatóknak az 1. munkalapon kell majd elfogadniuk.',
		privacyPolicyRequired: 'Kötelező megadni!',
		projectDescription: 'Meta leírás (Facebook előnézeti szöveg)',
		projectTitle: 'Projekt címe',
		save: 'Mentés',
		sheetCreationFailed: 'Munkalap hozzáadása sikertelen',
		sheetDeletionFailed: 'Munkalap törlése sikertelen',
		sheetMovingFailed: 'Munkalap mozgatása sikertelen',
		slug: 'Elérési útvonal',
		slugDescription:
			'Mentéskor a rendszer módosíthatja a fent beírt értéket, ha már van ilyen útvonal.',
		subscribe: 'Feliratkozás kitöltésekre',
		subscribeDescription:
			'Az emailt arra a címedre küldjük, amivel regisztráltál.',
		subscribeD: 'Napi email értesítés kitöltésekről',
		subscribeE: 'Egyedi email értesítés kitöltésről (óránként)',
		subscribeN: 'Nem kérek emailt a kitöltésekről',
		thanks: 'Köszönetnyilvánítás',
		thanksDefault: 'Köszönjük a kitöltést!',
		thanksDescription:
			'A látogatóknak az utolsó munkalapon fog megjelenni, beküldés után.',
		thanksSocial: 'Megosztás gombok a köszönetnyilvánítás alatt.',
		thanksUrl: 'Tovább URL',
		thanksUrlDescription:
			'A köszönetnyilvánítás alatt megjelenő Tovább gomb erre fog linkelni.',
		thumbnail: 'Facebook bélyegkép (ajánlott méret: 1200x630 pixel)',
		view: 'Megtekintés',
	},
	projects: {
		add: 'Hozzáadás',
		creationFailed: 'Létrehozás sikertelen',
		deletionFailed: 'Törlés sikertelen',
		export: 'Riport letöltése',
		filter: 'Szűrés',
		newProjectName: 'Új projekt elnevezése',
		ownProjects: 'Saját projektek',
		submissions: 'kitöltések',
		title: 'Projektek',
		userName: 'Név',
		views: 'megtekintések',
	},
	register: {
		consent1: 'Elolvastam és elfogadom a',
		consent2:
			'felhasználási&nbsp;feltételeket és az&nbsp;adatkezelési&nbsp;tájékoztatót.',
		email: 'Email cím',
		login: 'Már van fiókom',
		name: 'Név',
		password: 'Jelszó',
		procedure:
			'A fiók aktiválásához a Regisztráció gomb megnyomása után a megadott e-mail címére küldünk egy levelet, amellyel aktiválhatja a regisztrációját.',
		registrationFailed: 'Regisztráció sikertelen',
		submit: 'Regisztráció',
		termsTitle: 'Felhasználási feltételek és adatvédelmi nyilatkozat',
		title: 'Regisztráció',
	},
	sheet: {
		invalidPassword: 'Érvénytelen jelszó!',
		password: 'Jelszó',
		passwordRequired: 'Kérlek írd be a jelszót a megtekintéshez!',
		privacyPolicy: 'Felhasználási feltételek és adatvédelmi nyilatkozat',
		restricted: 'Ez a kérdőív jelenleg le van zárva.',
		restrictedTitle: 'Jelszóval védett projekt',
		submitFailed: 'Beküldés sikertelen',
		submitSuccess: 'Beküldés sikeres',
		view: 'Megtekintés',
	},
	sheetEditor: {
		addFeatureQuestion: 'Jelölőnégyzetes kérdés hozzáadása',
		back: 'Vissza a projekthez',
		backgroundImage: 'Háttérkép',
		defaultDescriptionLabel: 'Miért rajzoltad ezt fel?',
		defaultBaseMap: 'Alapértelmezett alaptérkép',
		featureLabel: 'Feladat egyedi neve a riportban',
		descriptionLabel: 'Szöveges kifejtéshez rendelt kérdés',
		descriptionLabelDescription:
			'A kért elem felrajzolása után a kitöltő szöveges indoklást adhat, az ehhez tartozó kérdés vagy utasítás adható meg itt.',
		instructions: {
			Point: 'Instrukció pont felrajzolásához',
			LineString: 'Instrukció vonal felrajzolásához',
			Polygon: 'Instrukció terület felrajzolásához',
		},
		interactions: {
			Point: 'Pont felrajzolása',
			LineString: 'Vonal felrajzolása',
			Polygon: 'Terület felrajzolása',
			naming: 'Felrajzolt elemek elnevezése',
			Rating: 'Fix elemek értékelése',
			RatingResults: 'Értékelés eredmények megjelenítése',
			ShowResultsOnly: 'Csak az eredmények megjelenítése',
			SocialSharing: 'Megosztás gombok',
		},
		numberOfStars: 'Csillagok száma (1-10)',
		ratingType: 'Értékelés típusa',
		ratingTypes: {
			stars: 'Csillagok',
			likeDislike: 'Like/dislike',
		},
		saveFailed: 'Módosítás sikertelen',
		sheetDescription: 'Munkalap leírása',
		sheetName: 'Munkalap címe',
		showAllResults:
			'Kitöltés után válasz statisztika megjelenítése a látogatónak (minden kérdést módosít)',
		success: 'Módosítás sikeres',
		survey: 'Kérdőív',
		visitorInteractions: 'Látogatói interakciók',
	},
	unsubscribe: {
		home: 'Tovább a PARTIMAP-ra',
		failed: 'Nem sikerült leiratkozni. Kérlek jelentkezz be és a projekt beállításainál kapcsold ki az email értesítéseket.',
		success: 'Sikeresen leiratkoztál a projekt email értesítéseiről.',
		title: 'Leiratkozás',
	},
	userEditor: {
		activated: 'Aktiválva',
		administrator: 'Adminisztrátor',
		altLogo: 'Logó',
		back: 'Felhasználók',
		changeFailed: 'Módosítás sikertelen',
		changeSuccessful: 'Módosítás sikeres',
		color: 'Brand szín',
		colorAdd: 'Szín beállítása',
		colorDel: 'Szín törlése (alapértelmezés)',
		colorDescription:
			'A kérdőív vezérlőgombjainak és linkjeinek színét lehet itt beállítani. Az alapértelmezés a PARTIMAP kékje.',
		colorTooBright: 'Ez a szín túl világos!',
		confirmDeleteUser: 'Fiók törlése',
		deleteConfirmation:
			'<strong>Jól meggondoltam,</strong> törlöm a(z) <strong>{email}</strong> fiókot és annak minden adatát (térképek, projektek, beérkezett adatok, képek).',
		deleteUser: 'Fiók törlése',
		deletionFailed: 'Törlés sikertelen',
		enterPassword: 'Kérlek add meg a jelszavad',
		logo: 'Logó (ajánlott méret: 120x30 pixel)',
		logoDescription: 'Ez a logó minden projektedben meg fog jelenni.',
		name: 'Név',
		newPassword: 'Új jelszó',
		oldPassword:
			'Jelenlegi jelszó (csak email vagy jelszó változtatás esetén szükséges)',
		save: 'Mentés',
		website: 'Weboldal URL',
		websiteDescription: 'Ha feltöltesz logót, ide fog linkelni.',
	},
	users: {
		add: 'Hozzáadás',
		admin: 'Admin',
		creationFailed: 'Létrehozás sikertelen',
		filter: 'Szűrés',
		inactive: 'Még nem aktivált',
		lastLogin: 'Utolsó bejelentkezés',
		newUsersEmail: 'Új felh. email címe',
		registered: 'Regisztrálva',
		title: 'Felhasználók',
	},

	// components

	AdminFrame: {
		editEditorsHelp: 'Kérdőív készítési útmutató szerk.',
		editHelp: 'Súgó szerk.',
		editVisitorsHelp: 'Kitöltési útmutató szerk.',
		help: 'Súgó',
		logout: 'Kijelentkezés',
		maps: 'Térképek',
		profile: 'Adataim',
		projects: 'Projektek',
		users: 'Felhasználók',
	},
	CheckboxGroup: {
		other: 'Egyéb...',
		required: 'Kérjük, jelölje be valamelyik jelölőnégyzetet!',
	},
	DropdownGroup: {
		other: 'Egyéb...',
	},
	FeatureImportModal: {
		doImportFixed: `{n} fix elem importálása`,
		doImportFromMap: '{n} elem importálása',
		doImportSubmitted: `{n} beküldött elem importálása`,
		importFromMap: 'Importálás térképről',
		importFromSheet: 'Importálás munkalapról',
		selectMap: 'Válassz egy térképet',
		selectProject: 'Válassz egy projektet',
		selectSheet: 'Válassz egy munkalapot',
		title: 'Elemek importálása',
	},
	FeatureList: {
		deleteAll: 'Törlés',
		features: 'Térkép elemei',
		fixedFeatures: 'Fix Elemek',
		importFromSheet: 'Importálás...',
		notFound: 'Nem található ilyen elem a térképen.',
		ownFeatures: 'Saját elemeid',
		search: 'Keresés...',
	},
	FeatureListElement: {
		category: 'Kategória',
		color: 'Szín',
		dashType: 'Vonal',
		dashTypes: {
			p0: 'Folytonos',
			p11: 'Pontozott',
			p21: 'Szaggatott',
			p41: 'Hosszan szagg.',
			p1131: 'Pont-vonal',
		},
		defaultName: {
			Point: 'Pont',
			LineString: 'Útvonal',
			Polygon: 'Terület',
		},
		deleteFeature: 'Elem törlése',
		description: 'Leírás',
		hidden: 'Elem elrejtése a listában',
		jumpToMap: 'Megnézem a térképen',
		mapLabel: 'Térképen megjelenő címke',
		name: 'Név',
		size: 'Méret',
	},
	FooterButtons: {
		submit: 'Beküldés',
		submitted: 'Beküldve',
	},
	HelpEditor: {
		editor: 'Szerkesztő',
		instructions:
			'A súgószövegek Markdown-ban vannak tárolva és ebben a formában is szerkeszthetők.',
		preview: 'Előnézet',
		saveFailed: 'Nem sikerült menteni',
		saveSuccess: 'Mentve!',
		stackeditButton: 'Szerkesztés StackEdit-tel',
		stackeditInfo:
			'Barátságosabb szerkesztő, de az előnézete nem tud mindent megjeleníteni. A bal felső sarokban levő gombbal zárható be.',
	},
	ListItem: {
		clone: 'Másolat készítése',
		delete: 'Törlés',
		own: 'Saját',
		owner: 'Tulajdonos',
	},
	Map: {
		changeBaseMap: 'Alaptérkép váltás',
		initialCenter: '47.4811281,18.9902211', // Budapest
		initialZoom: '10',
	},
	MapHint: {
		Point: 'Pont jelölő elhelyezéséhez közelíts a szükséges léptékig és kattints a megjelölni kívánt helyre.',
		LineString:
			'A vonal kezdetét és köztes pontjait kattintással kell kijelölni, majd dupla kattintással lezárni.',
		Polygon:
			'A terület határpontjait kattintással kell kijelölni, majd a kezdőpontra való újbóli kattintással lezárni.',
	},
	OptionsEditor: {
		addColumn: 'Új Oszlop',
		addOption: 'Új Opció',
		addRow: 'Új Sor',
		columns: 'Oszlopok',
		optionPrefix: 'Opció',
		options: 'Opciók',
		rows: 'Sorok',
	},
	PublicFrame: {
		contactUs: 'Írj nekünk!',
		help: 'Hogyan működik?',
		helpTooltip: 'Hogyan működik?',
		login: 'Belépés',
		kmonitorUrl: 'https://k-monitor.hu/hu',
	},
	ProjectSheetManager: {
		addSheet: 'Munkalap hozzáadása',
		copyFeaturesFrom: 'Térkép elemek másolása innen',
		sendToMap: 'Új saját térképre küldés',
		sheetName: 'Munkalap elnevezése',
		sheetNameRequired: 'Név megadása kötelező',
		sheetType: 'Munkalap típusa',
		sheetTypes: {
			interactiveMap: 'Interaktív térkép',
			staticMap: 'Térkép',
			survey: 'Kérdőív',
			text: 'Szöveg',
		},
		submittedFeatures: 'beküldött térkép elem',
		title: 'Új munkalap',
		warnForReferencedSheets:
			'Egy feltételes kérdést tartalmazó munkalap nem előzheti meg azt a munkalapot, amely a rá vonatkozó feltételt tartalmazza.',
		withoutCopying: 'Nincs másolás',
	},
	QuestionConditionEditor: {
		selectQuestion: 'a következő kérdésre',
		selectAnswer: 'az alábbi választ adják',
	},
	SaveButton: {
		save: 'Mentés',
		saved: 'Mentve',
	},
	SheetContent: {
		consent1: 'Elolvastam és elfogadom a',
		consent2:
			'felhasználási&nbsp;feltételeket és az&nbsp;adatkezelési&nbsp;tájékoztatót.',
		next: 'Tovább',
		results: 'Eredmények',
		resultsDescription:
			'Ezen az oldalon továbblépés előtt a mások által eddig beküldött válaszok statisztikája böngészhető.',
	},
	Sidebar: {
		back: 'Vissza',
		hide: 'Oldalsáv elrejtése',
	},
	Survey: {
		removeAnswer: 'Válasz törlése',
	},
	SurveyEditor: {
		addCondition: 'Új feltétel (ÉS)',
		addQuestion: 'Új kérdés hozzáadása',
		addToFeatures:
			'Válaszok hozzáadása a térképes jelölésekhez elemzés céljára',
		and: 'ÉS',
		conditionalQuestion: 'Feltételesen jelenik meg',
		deleteCondition: 'Feltétel törlése',
		deleteQuestion: 'Kérdés törlése',
		maxName: 'Maximum elnevezés',
		maxSelect: 'Maximálisan kiválasztható',
		maxValue: 'Maximum érték',
		minName: 'Minimum elnevezés',
		minValue: 'Minimum érték',
		other: 'Egyéb opció hozzáadása',
		questionPrefix: 'Kérdés',
		questionText: 'Kérdés szövege',
		questionType: 'Kérdés típusa',
		questionTypes: {
			checkbox: 'Jelölőnégyzetek',
			distributeUnits: '100 egység elosztása',
			dropdown: 'Opciók lenyíló listában (egyet lehet vál.)',
			multipleChoiceMatrix: 'Jelölőnégyzetrács',
			number: 'Numerikus válasz (bepötyögős)',
			radiogroup: 'Feleletválasztós',
			range: 'Numerikus válasz (csúszkával)',
			rating: 'Értékelés (5 csillag)',
			singleChoiceMatrix: 'Feleletválasztós rács',
			text: 'Szöveges válasz',
		},
		referencedQuestion: 'Más kérdés hivatkozik erre',
		required: 'Kötelező megválaszolni',
		showIf: 'Megjelenik, ha...',
		showResult: 'Kitöltés után válasz statisztika megjelenítése',
		warnForReferencedQuestion:
			'Ettől a kérdéstől legalább egy másik kérdés megjelenítése függ, így bizonyos tulajdonságai nem módosíthatók.',
	},
	SurveyResult: {
		averageValue: 'Átlagos érték',
		numberOfSubmissions: 'Válaszadók száma',
		other: 'Egyéb',
	},
	Terms: {
		content: terms,
	},

	// general

	imageUpload: {
		browse: 'Kép tallózása...',
		dropzone: 'Húzd ide a fájlt!',
		failed: 'Kép feltöltése sikertelen',
		maxFileSize: 'Maximális fájlméret: 5 MB',
		remove: 'Kép törlése',
	},
	modals: {
		cancel: 'Mégsem',
		confirmDeleteFeatures: 'Biztosan törlöd ezt a(z) {count} elemet?',
		confirmDeletion: 'Biztosan törlöd ezt',
		confirmFeatureClose:
			'A válasz segíti a felmérést. Mentés a jelölésre vonatkozó kiegészítés nélkül?',
		confirmUnsaved:
			'Még nem mentetted el a módosításokat. Biztosan kilépsz?',
		delete: 'Törlés',
		unsaved: 'Nem mentett módosítások',
		yes: 'Igen',
	},
};
