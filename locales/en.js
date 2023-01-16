import editorHelp from './en-help-editors.md';
import visitorHelp from './en-help-visitors.md';
import terms from './en-terms.md';

export default {
	meta: {
		description: 'Engaging the power of community in urban development planning.',
	},

	// pages

	adminHelp: {
		title: 'Súgó',
		content: editorHelp,
	},
	help: {
		title: 'Hogyan működik az oldal?',
		content: visitorHelp,
	},
	landing: {
		title: 'A MAP-BASED SURVEY',
		tagline1: 'PARTIMAP is a free, easy to use and customizable map-based survey for those',
		tagline2: 'who believe that affected citizens should have a say in public development projects.',
		column1: 'When was the last time you were asked for your opinion on a development project that would impact your everyday life? Billions of euros are being used to renovate our urban spaces, public buildings and transport facilities. But public consultation and stakeholder involvement is often reduced to a formality. It is clear however that in order for a project to be successful, the needs and concerns of the people who use the new infrastructure on a daily basis must be taken into account alongside professional considerations. The modernization of a station is not the goal in itself, but rather to increase the number of people travelling by train. Smart benches don\'t make a public square a community place, only locals, if they grow to like it.',
		column2: 'Participatory mapping is a process by which the invaluable knowledge of stakeholders is incorporated into community developments designed for their benefit. PARTIMAP\'s map-based survey application makes engaging with local stakeholders quicker, simpler and more efficient. It is free to use after registration, has customizable design features, and can also be freely developed as it is an open source platform. Whether you represent a public body, a municipality or a local advocacy group, if you\'re looking for a smart and transparent way to get to know the views of your community, try PARTIMAP and join its development!',
		tryButton: 'Let\'s try it out',
		tryLink: 'https://www.partimap.eu/p/DEMO-in-English/0',
		methodTitle: 'PARTIMAP Participatory Methods Toolkit',
		methodDesc: 'What makes a participatory mapping process successful? How to prepare the questionnaire, what to look out for during dissemination and how to get the most out of the data collected? K-Monitor has summarised the most important methodological know-hows, as surveys comprise only one element of participatory processes. The PARTIMAP participatory toolkit will continue to expand in the future, together with the number of users of the application!',
		methodButton: 'I want to know more',
		methodLink: 'https://drive.google.com/file/d/17p1JALO2iNtYNMhMkCvHCllqUTIFYrb2/view?usp=sharing',
		featuresTitle: 'Features of the application',
		features: [
			{
				title: 'Easy to edit',
				description:
					'<p>With PARTIMAP it is easy to create surveys with various map-based and traditional questionnaire functions. Its interface is designed to allow ordinary computer users to enter questions, create worksheets, share on social media and publish a new project.</p><p>When creating a new project after registering in the application, it is first required to enter basic information such as the project title, the data holder and the text of the welcome page. Subsequently it is possible to create the relevant worksheets. These can be text pages (to present plans and ideas), questionnaires (to collect responses from multiple-choice, drop-down menus, free-text and scale questions), static maps (to present and collect feedback on pre-defined map elements - points, lines and polygons), and interactive maps (where respondents can draw and add their own map elements in response to a question). It is easy to navigate among worksheets, delete them or edit their content and their sequence at any time.</p>',
			},
			{
				title: 'Customizable design',
				description:
					'<p>Questionnaire interfaces are designed to reach the target audience effectively. For this reason, we paid particular attention to the shareability and customisability of projects during development. On the landing and closing worksheets, sharing buttons for the most popular social media platforms are available. Projects can also be set up with a custom Facebook thumbnail image and preview text, allowing users to tailor their survey to their own established designs. In addition to uploading your own photos in the worksheet editing interface, you can also format text, add links and upload background images. In addition, projects can be given a unique url (partimap.eu/en/p/NAME) in the application.</p>',
			},
			{
				title: 'A multi-faceted survey',
				description:
					'<p>The site\'s questionnaire worksheet can be used to create surveys unrelated to the map feature. The questions can take the form of multiple-choice options, drop-down menus, scaled ratings or text responses - these can be freely customised by adding your own images and additional options. The summary (results) of the answers given by the respondents can be published in chart form at the end of the worksheet with a single click, and the option to display the results on the page after ending the survey period is also provided. The worksheet can be customised in the same way as the other worksheets: background images, illustrations and links can be used to make it more user-friendly.</p>',
			},
			{
				title: 'Mapping existing plans',
				description:
					'<p>A static map worksheet can be added to the questionnaire to illustrate a particular transport, infrastructure or other development or development idea that can be depicted on a map and to collect feedback on it. It is possible to import elements from other mapping interfaces (e.g. Google Maps), which can then be visualised and evaluated individually in PARTIMAP. In addition, the map-based worksheet can include the question types already familiar from the questionnaire, as well as additional explanations, descriptions and links. The edited map can be saved as your own map and used in a future project as well.</p><p>The static map is an ideal tool for asking residents to rate the different infrastructures of a municipality, e.g. accessibility in general and for people with reduced mobility, whether it is bike-friendly, etc. Once the results are in, a complex assessment can be derived. This type of worksheet can also be used to solve specific development dilemmas, e.g. by reviewing the A and B versions of a planned development for an area, respondents can decide which they prefer.</p>',
			},
			{
				title: 'Now it\'s your turn to contribute to the map!',
				description:
					'<p>What makes PARTIMAP unique compared to other online survey tools is that people can express their opinion with a location attached, can illustrate their suggestions or simply share their commuting routes for example. The public spaces in a municipality, district or neighbourhood are used by a wide range of people, whose diverse needs and opinions on their use of space can be assessed using the interactive map worksheet. Respondents can use points, lines and polygon shapes to provide graphical answers to the questions asked. The incoming responses can be easily processed either in the form of a heat map, or the suggestions received can be voted on a static map in a subsequent questionnaire.</p>',
			},
			{
				title: 'Interoperability with other platforms',
				description:
					'<p>Both map worksheets use openstreetmap.org as a background map, for which a custom base map can be drawn highlighting the focal points of the survey. Elements drawn in previous projects can be saved and stored among the user\'s own maps. For each worksheet, the base map can be imported not only from this own map repository, but also from an external .KML file: an import/export function provides a fast interchange with mapping software such as Google MyMaps or other more complex geospatial softwares.</p><p>The simple editing interface allows you to create maps fitting the survey by drawing coloured points, lines and polygons. With the click of a button, it is also possible to create a base map from data submitted by a survey respondent, and export to .KML file format - providing portability to other map editing applications. In the future, we also intend to create other types of raster background maps and new graphical displays of the plotted elements (e.g. custom icons).</p>',
			},
			{
				title: 'Communicating your results',
				description:
					'<p>Once a survey is completed, a new phase in the project cycle begins: evaluation. The responses received through the survey interface can be presented in graphs for quick communication: they can be set to display with a single setting, so that the respondents can directly browse the current results of the survey. Additionally, detailed analysis can be performed by downloading the complete dataset of responses in excel format. The report can then be processed with data management softwares using the submitted responses and geographical elements, so that the complexity and visual representation of the final results is dependent only on our data analysis and visualisation capabilities.</p>',
			},
			{
				title: 'Free and open-source',
				description:
					'<p>The app is free to use and after a quick registration you can create your own PARTIMAP survey. Developed by K-Monitor and our partners, the tool is open-source, so it is free to develop, customise and use. Our goal is to create more projects that encourage citizens to get involved in public decision-making, so we greatly welcome the creative use and development of this tool.</p>',
			},
			{
				title: 'How to contribute',
				description:
					'<p>PARTIMAP software was developed by K-Monitor with the support of the European Commission (DG Regio) in 2021. Further developments were made in 2022, in cooperation with the Prague office of the Heinrich-Böll-Stiftung. But the project is far from over with the launch of the current version! The free and open platform was created for public authorities, municipalities and NGOs with the aim of helping them enhance participation in their development decisions, so that we can manage our public assets more efficiently.</p><p>If you\'re interested in the project and would like to get involved in its development, or just want to share your thoughts on Partimap with us, please contact us at <a href="mailto:info@k-monitor.hu">info@k-monitor.hu</a>. If you would like to support the development financially to make the free, open source software available to as many people as possible, please <a href="https://tamogatas.k-monitor.hu/" target="_blank">support K-Monitor!</a></p>',
			},
		],
		funding: 'The development is supported by the European Commission (DG Regio) in the framework of the <a href="https://k-monitor.hu/tevekenysegek/20210324-partimap" target="_blank">Participatory Mapping in Cohesion Policy in Hungary (PartiMap)</a> project. Further development of the tool was supported by The Prague Office of the Heinrich Böll Foundation.',
		ec: 'Európai Bizottság',
	},
	login: {
		activated: 'Sikeres aktiválás, most már bejelentkezhetsz!',
		activationFailed: 'Sikertelen aktiválás, próbálj újra regisztrálni!',
		email: 'Email cím',
		emailSent: 'Aktivációhoz szükséges email kiküldve!',
		forgotPassword: 'Elfelejtettem a jelszavam',
		invalidEmail: 'Érvénytelen email cím',
		invalidEmailOrPassword: 'Érvénytelen email vagy jelszó',
		password: 'Jelszó',
		passwordChangeRequested: 'Jelszócseréhez szükséges email kiküldve',
		pwchanged: 'Jelszó sikeresen cserélve!',
		pwchangefailed: 'Jelszócsere sikertelen, próbáld újra!',
		register: 'Még nincs fiókom',
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
		own: 'Saját',
		owner: 'Tulajdonos',
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
		passwordDescription: 'Ha be vagy jelentkezve, a saját projektjeid nem fognak jelszót kérni. Inkognitó/privát módban tudod tesztelni a védelmet.',
		passwordSet: 'Be van állítva',
		privacyPolicy: 'Adatkezelő elérhetősége',
		privacyPolicyDescription: 'Az Adatkezelési tájékoztatóban jelenik meg kapcsolatfelvételi adatként. Ezt a látogatóknak az 1. munkalapon kell majd elfogadniuk.',
		privacyPolicyRequired: 'Kötelező megadni!',
		projectDescription: 'Meta leírás (Facebook előnézeti szöveg)',
		projectTitle: 'Projekt címe',
		save: 'Mentés',
		sheetCreationFailed: 'Munkalap hozzáadása sikertelen',
		sheetDeletionFailed: 'Munkalap törlése sikertelen',
		sheetMovingFailed: 'Munkalap mozgatása sikertelen',
		slug: 'Elérési útvonal',
		slugDescription: 'Mentéskor a rendszer módosíthatja a fent beírt értéket, ha már van ilyen útvonal.',
		thanks: 'Köszönetnyilvánítás',
		thanksDescription: 'A látogatóknak az utolsó munkalapon fog megjelenni, beküldés után.',
		thanksSocial: 'Megosztás gombok a köszönetnyilvánítás alatt.',
		thanksUrl: 'Tovább URL',
		thanksUrlDescription: 'A köszönetnyilvánítás alatt megjelenő Tovább gomb erre fog linkelni.',
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
		owner: 'Tulajdonos',
		ownProjects: 'Saját projektek',
		submissions: 'kitöltések',
		title: 'Projektek',
		userName: 'Név',
		views: 'megtekintések',
	},
	register: {
		consent1: 'Elolvastam és elfogadom a',
		consent2: 'felhasználási feltételeket és az adatkezelési tájékoztatót.',
		email: 'Email cím',
		login: 'Már van fiókom',
		name: 'Név',
		password: 'Jelszó',
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
		back: 'Vissza a projekthez',
		backgroundImage: 'Háttérkép',
		defaultFeatureQuestion: 'Miért rajzoltad ezt fel?',
		defaultBaseMap: 'Alapértelmezett alaptérkép',
		featureQuestion: 'Felrajzolt elemekhez rendelt kérdés',
		instructions: {
			Point: 'Instrukció pont felrajzolásához',
			LineString: 'Instrukció vonal felrajzolásához',
			Polygon: 'Instrukció terület felrajzolásához',
		},
		interactions: {
			Point: 'Pont felrajzolása',
			LineString: 'Vonal felrajzolása',
			Polygon: 'Terület felrajzolása',
			Rating: 'Fix elemek értékelése',
			SocialSharing: 'Megosztás gombok',
		},
		numberOfStars: 'Csillagok száma',
		saveFailed: 'Módosítás sikertelen',
		sheetDescription: 'Munkalap leírása',
		sheetName: 'Munkalap címe',
		success: 'Módosítás sikeres',
		survey: 'Kérdőív',
		visitorInteractions: 'Látogatói interakciók',
	},
	userEditor: {
		activated: 'Aktiválva',
		administrator: 'Adminisztrátor',
		altLogo: 'Logó',
		back: 'Felhasználók',
		cancel: 'Mégsem',
		changeFailed: 'Módosítás sikertelen',
		changeSuccessful: 'Módosítás sikeres',
		confirmDeleteUser: 'Fiók törlése',
		deleteConfirmation: '<strong>Jól meggondoltam,</strong> törlöm a(z) <strong>{email}</strong> fiókot és annak minden adatát (térképek, projektek, beérkezett adatok, képek).',
		deleteUser: 'Fiók törlése',
		deletionFailed: 'Törlés sikertelen',
		enterPassword: 'Kérlek add meg a jelszavad',
		logo: 'Logó (ajánlott méret: 120x30 pixel)',
		logoDescription: 'Ez a logó minden projektedben meg fog jelenni.',
		name: 'Név',
		newPassword: 'Új jelszó',
		oldPassword: 'Jelenlegi jelszó (csak email vagy jelszó változtatás esetén szükséges)',
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
		newUsersEmail: 'Új felh. email címe',
		registered: 'Regisztrálva',
		title: 'Felhasználók',
	},

	// components

	AdminFrame: {
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
	FeatureList: {
		features: 'Térkép elemei',
		fixedFeatures: 'Fix Elemek',
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
		name: 'Név',
		size: 'Méret',
	},
	FooterButtons: {
		save: 'Mentés',
		saved: 'Mentve',
		submit: 'Beküldés',
		submitted: 'Beküldve',
	},
	Map: {
		changeBaseMap: 'Change base map',
	},
	MapHint: {
		Point: '',
		LineString: 'A vonal kezdetét és köztes pontjait kattintással kell kijelölni, majd dupla kattintással lezárni.',
		Polygon: 'A terület határpontjait kattintással kell kijelölni, majd a kezdőpontra való újbóli kattintással lezárni.',
	},
	MapToolbar: {
		cancel: 'Mégsem',
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
		help: 'How does it work?',
		login: 'Login',
	},
	ProjectSheetManager: {
		addSheet: 'Munkalap hozzáadása',
		cancel: 'Mégsem',
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
		submittedFeatures: 'Beküldött térkép elemek',
		title: 'Új munkalap',
		withoutCopying: 'Nincs másolás',
	},
	SheetContent: {
		consent1: 'Elolvastam és elfogadom a ',
		consent2: 'felhasználási feltételeket és az adatkezelési tájékoztatót.',
		next: 'Tovább',
	},
	Sidebar: {
		back: 'Vissza',
		hide: 'Oldalsáv elrejtése',
	},
	SurveyEditor: {
		addQuestion: 'Új kérdés hozzáadása',
		cancel: 'Mégsem',
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
			dropdown: 'Opciók lenyíló listában (egyet lehet vál.)',
			multipleChoiceMatrix: 'Jelölőnégyzetrács',
			number: 'Numerikus válasz (bepötyögős)',
			radiogroup: 'Feleletválasztós',
			range: 'Numerikus válasz (csúszkával)',
			rating: 'Értékelés (5 csillag)',
			singleChoiceMatrix: 'Feleletválasztós rács',
			text: 'Szöveges válasz',
		},
		required: 'Kötelező megválaszolni',
		showOnlyStatsToVisitors: 'Csak az eredmények megjelenítése',
		showStatsToVisitors: 'Kitöltés után válasz statisztika megjelenítése a látogatónak',
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
};
