import editorHelp from './en-help-editors.md';
import visitorHelp from './en-help-visitors.md';
import terms from './en-terms.md';

export default {
	meta: {
		description:
			'Engaging the power of community in urban development planning.',
	},

	// pages

	adminHelp: {
		title: 'How it works?',
		content: editorHelp,
	},
	help: {
		title: 'User guide',
		content: visitorHelp,
	},
	landing: {
		title: 'A MAP-BASED SURVEY',
		tagline1:
			'PARTIMAP is a free, easy to use and customizable map-based survey for those',
		tagline2:
			'who believe that affected citizens should have a say in public development projects.',
		column1:
			"When was the last time you were asked for your opinion on a development project that would impact your everyday life? Billions of euros are being used to renovate our urban spaces, public buildings and transport facilities. But public consultation and stakeholder involvement is often reduced to a formality. It is clear however that in order for a project to be successful, the needs and concerns of the people who use the new infrastructure on a daily basis must be taken into account alongside professional considerations. The modernization of a station is not the goal in itself, but rather to increase the number of people travelling by train. Smart benches don't make a public square a community place, only locals, if they grow to like it.",
		column2:
			"Participatory mapping is a process by which the invaluable knowledge of stakeholders is incorporated into community developments designed for their benefit. PARTIMAP's map-based survey application makes engaging with local stakeholders quicker, simpler and more efficient. It is free to use after registration, has customizable design features, and can also be freely developed as it is an open source platform. Whether you represent a public body, a municipality or a local advocacy group, if you're looking for a smart and transparent way to get to know the views of your community, try PARTIMAP and join its development!",
		tryButton: "Let's try it out",
		tryLink: 'https://www.partimap.eu/en/p/DEMO-in-English/0',
		methodTitle: 'PARTIMAP Participatory Methods Toolkit',
		methodDesc:
			'What makes a participatory mapping process successful? How to prepare the questionnaire, what to look out for during dissemination and how to get the most out of the data collected? K-Monitor has summarised the most important methodological know-hows, as surveys comprise only one element of participatory processes. The PARTIMAP participatory toolkit will continue to expand in the future, together with the number of users of the application!',
		methodButton: 'I want to know more',
		methodLink:
			'https://drive.google.com/file/d/17p1JALO2iNtYNMhMkCvHCllqUTIFYrb2/view?usp=sharing',
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
					"<p>The site's questionnaire worksheet can be used to create surveys unrelated to the map feature. The questions can take the form of multiple-choice options, drop-down menus, scaled ratings or text responses - these can be freely customised by adding your own images and additional options. The summary (results) of the answers given by the respondents can be published in chart form at the end of the worksheet with a single click, and the option to display the results on the page after ending the survey period is also provided. The worksheet can be customised in the same way as the other worksheets: background images, illustrations and links can be used to make it more user-friendly.</p>",
			},
			{
				title: 'Mapping existing plans',
				description:
					'<p>A static map worksheet can be added to the questionnaire to illustrate a particular transport, infrastructure or other development or development idea that can be depicted on a map and to collect feedback on it. It is possible to import elements from other mapping interfaces (e.g. Google Maps), which can then be visualised and evaluated individually in PARTIMAP. In addition, the map-based worksheet can include the question types already familiar from the questionnaire, as well as additional explanations, descriptions and links. The edited map can be saved as your own map and used in a future project as well.</p><p>The static map is an ideal tool for asking residents to rate the different infrastructures of a municipality, e.g. accessibility in general and for people with reduced mobility, whether it is bike-friendly, etc. Once the results are in, a complex assessment can be derived. This type of worksheet can also be used to solve specific development dilemmas, e.g. by reviewing the A and B versions of a planned development for an area, respondents can decide which they prefer.</p>',
			},
			{
				title: "Now it's your turn to contribute to the map!",
				description:
					'<p>What makes PARTIMAP unique compared to other online survey tools is that people can express their opinion with a location attached, can illustrate their suggestions or simply share their commuting routes for example. The public spaces in a municipality, district or neighbourhood are used by a wide range of people, whose diverse needs and opinions on their use of space can be assessed using the interactive map worksheet. Respondents can use points, lines and polygon shapes to provide graphical answers to the questions asked. The incoming responses can be easily processed either in the form of a heat map, or the suggestions received can be voted on a static map in a subsequent questionnaire.</p>',
			},
			{
				title: 'Interoperability with other platforms',
				description:
					"<p>Both map worksheets use openstreetmap.org as a background map, for which a custom base map can be drawn highlighting the focal points of the survey. Elements drawn in previous projects can be saved and stored among the user's own maps. For each worksheet, the base map can be imported not only from this own map repository, but also from an external .KML file: an import/export function provides a fast interchange with mapping software such as Google MyMaps or other more complex geospatial softwares.</p><p>The simple editing interface allows you to create maps fitting the survey by drawing coloured points, lines and polygons. With the click of a button, it is also possible to create a base map from data submitted by a survey respondent, and export to .KML file format - providing portability to other map editing applications. In the future, we also intend to create other types of raster background maps and new graphical displays of the plotted elements (e.g. custom icons).</p>",
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
					'<p>PARTIMAP software was developed by K-Monitor with the support of the European Commission (DG Regio) in 2021. Further developments were made in 2022, in cooperation with the Prague office of the Heinrich-Böll-Stiftung. But the project is far from over with the launch of the current version! The free and open platform was created for public authorities, municipalities and NGOs with the aim of helping them enhance participation in their development decisions, so that we can manage our public assets more efficiently.</p><pIf you\'re interested in the project and would like to get involved in its development, or just want to share your thoughts on PARTIMAP with us, please contact us at <a href="mailto:hello@partimap.eu">hello@partimap.eu</a>. If you would like to support the development financially to make the free, open source software available to as many people as possible, please <a href="https://k-monitor.hu/support" target="_blank">support K-Monitor!</a></p>',
			},
		],
		funding:
			'The development is supported by the European Commission (DG Regio) in the framework of the <a href="https://k-monitor.hu/activities/20230201-partimap-hu-en" target="_blank">Participatory Mapping in Cohesion Policy in Hungary (PartiMap)</a> project. Further development of the tool was supported by The Prague Office of the Heinrich Böll Foundation.',
		ec: 'European Commission',
	},
	login: {
		activated: 'Account successfully activated. Welcome to PARTIMAP!',
		activationFailed:
			'Activation failed. Try again or contact the administrator',
		email: 'Email',
		forgotPassword: 'I forgot my password',
		invalidEmail: 'Invalid email address',
		invalidEmailOrPassword: 'Invalid email or password',
		password: 'Password',
		passwordChangeRequested:
			"We've sent you an email with a link to reset your password",
		pwchanged: 'Password changed successfully!',
		pwchangefailed:
			'Password change failed. Please try again or contact the administrator',
		register: 'Create new account',
		registered: 'Verification email sent to your address',
		submit: 'Log In',
		title: 'Log In or Sign Up',
	},
	mapEditor: {
		back: 'Back to map menu',
		error: 'Modification failed',
		name: 'Map title',
		success: 'Map modified successfully',
	},
	maps: {
		add: 'Add',
		creationFailed: 'Map creation failed',
		deleteFailed: 'Deleting your map failed',
		filter: 'Search',
		newMapsName: 'Title of the new map',
		own: 'My own',
		owner: 'Owner',
		ownMaps: 'Filter My Maps',
		title: 'Maps',
	},
	passwordChange: {
		newPassword: 'New password',
		submit: 'Submit',
		title: 'Reset password',
	},
	projectEditor: {
		altThumbnail: 'Facebook thumbnail',
		back: 'Projects',
		changeFailed: 'Modification failed!',
		changeSuccessful: 'Project modified successfully',
		copiedURL: 'Project URL copied to clipboard!',
		generateSlug: 'Generate it from project title!',
		newPassword: 'New password',
		password: 'Password restricted access',
		passwordDescription:
			'If you are logged in, your own projects will not ask for a password. Test in incognito or private mode.',
		passwordSet: 'Password restriction set',
		privacyPolicy: 'Name and contact of the data controller',
		privacyPolicyDescription:
			'This will be displayed as contact information in the Privacy Notice. Visitors will be requested to acknowledge and accept this before submitting a response.',
		privacyPolicyRequired: 'This is a required field!',
		projectDescription: 'Meta description (Facebook Link Preview)',
		projectTitle: 'Project title',
		save: 'Save',
		sheetCreationFailed: 'Failed to create the sheet',
		sheetDeletionFailed: 'Failed to delete the sheet',
		sheetMovingFailed: 'Failed to move the sheet',
		slug: 'Page URL',
		slugDescription: 'The URL you enter may be modified if already used.',
		thanks: 'Acknowledgements',
		thanksDescription:
			'This message will be displayed on the last sheet, after submission.',
		thanksSocial: 'Add share buttons to Acknowledgements.',
		thanksUrl: 'Exit website',
		thanksUrlDescription:
			'If set, a Learn more button appears below Acknowledgements, that leads to the web address linked here.',
		thumbnail: 'Facebook thumbnail (recommended size: 1200x630 pixels)',
		view: 'View Project',
	},
	projects: {
		add: 'Add',
		creationFailed: 'Failed to create the project',
		deletionFailed: 'Failed to delete your project',
		export: 'Generate report',
		filter: 'Search',
		newProjectName: 'Title of the new project',
		owner: 'Owner',
		ownProjects: 'My projects',
		submissions: 'submissions',
		title: 'Projects',
		userName: 'Full name',
		views: 'views',
	},
	register: {
		consent1: 'I acknowledge that I have read and understand',
		consent2:
			'the&nbsp;Terms&nbsp;of&nbsp;Use and the&nbsp;Privacy&nbsp;Policy.',
		email: 'Enter a vaild email',
		login: 'Already have an account?',
		name: 'Name',
		password: 'Password',
		registrationFailed:
			'Registration failed. The email address provided may be registered already. Try again or contact the administrator.',
		submit: 'Register',
		termsTitle: 'Terms of Use and Privacy Policy',
		title: 'Registration',
	},
	sheet: {
		invalidPassword:
			'Wrong password. Try again or click ‘I forgot my password’',
		password: 'Password',
		passwordRequired:
			'Please enter the password or contact the author of this survey.',
		privacyPolicy: 'Terms of Use and Privacy Policy',
		restricted: 'This PARTIMAP survey is currently closed.',
		restrictedTitle: 'Password protected project',
		submitFailed: 'Submit Failed',
		submitSuccess: 'Your form has been submitted successfully. Thank you!',
		view: 'View Project',
	},
	sheetEditor: {
		back: 'Back to project',
		backgroundImage: 'Background image',
		defaultFeatureQuestion: 'Please explain why you gave this response.',
		defaultBaseMap: 'Default base map',
		featureQuestion: "Follow-up request to user's contribution",
		instructions: {
			Point: 'Instruction for placing a Point marker',
			LineString: 'Instruction for drawing a Line',
			Polygon: 'Instruction for drawing a Polygon',
		},
		interactions: {
			Point: 'Place point markers',
			LineString: 'Draw lines',
			Polygon: 'Draw polygons',
			Rating: 'Rate static features',
			SocialSharing: 'Share page on social media',
		},
		numberOfStars: 'Set scale (1-10)',
		ratingType: 'Type of rating:',
		ratingTypes: {
			stars: 'Star-rating',
			likeDislike: 'Upvote/downvote rating',
		},
		saveFailed: 'Saving failed',
		sheetDescription: 'Sheet description',
		sheetName: 'Sheet title',
		success: 'Sheet modified successfully',
		survey: 'Survey',
		visitorInteractions: 'Respondents are allowed to:',
	},
	userEditor: {
		activated: 'Activated',
		administrator: 'Administrator',
		altLogo: 'Logo',
		back: 'Users',
		cancel: 'Cancel',
		changeFailed: 'Modification failed',
		changeSuccessful: 'Account modified successfully',
		confirmDeleteUser: 'Delete account',
		color: 'Brand color',
		colorAdd: 'Set color',
		colorDel: 'Unset color (to default)',
		colorDescription:
			'This will be the color of the buttons and links in the survey. Default is the blue of Partimap.',
		deleteConfirmation:
			"<strong>You are about to permanently delete your account. Are you sure?</strong> I'm sure, delete my account <strong>{email}</strong> with all its data (photos, maps, projects). This action is permanent and irreversible.",
		deleteUser: 'Delete account',
		deletionFailed: 'Failed to delete account',
		enterPassword: 'Please enter your password',
		logo: 'Logo (supported size: 120x30 px)',
		logoDescription:
			'This logo will be displayed in the header of all your projects.',
		name: 'Name',
		newPassword: 'New password',
		oldPassword:
			'Current password (only required for email or password changes)',
		save: 'Save',
		website: 'Your website',
		websiteDescription: 'If yet, the logo will link to that URL.',
	},
	users: {
		add: 'Add',
		admin: 'Admin',
		creationFailed: 'Account creation failed',
		filter: 'Search',
		inactive: 'Inactive',
		newUsersEmail: "Enter the new user's email address",
		registered: 'Active',
		title: 'Users',
	},

	// components

	AdminFrame: {
		help: 'How it works',
		logout: 'Log Out',
		maps: 'Maps',
		profile: 'Edit account',
		projects: 'Projects',
		users: 'Users',
	},
	CheckboxGroup: {
		other: 'Other...',
		required: 'At least one checkbox must be selected',
	},
	DropdownGroup: {
		other: 'Other...',
	},
	FeatureList: {
		features: 'Markers on the map',
		fixedFeatures: 'Fixed features',
		notFound: 'No matches found.',
		ownFeatures: 'Your features',
		search: 'Search...',
	},
	FeatureListElement: {
		category: 'Category name',
		color: 'Color',
		dashType: 'Line',
		dashTypes: {
			p0: 'Solid',
			p11: 'Dotted',
			p21: 'Dashed',
			p41: 'Longdash',
			p1131: 'Dotdash',
		},
		defaultName: {
			Point: 'Point marker',
			LineString: 'Line',
			Polygon: 'Polygon',
		},
		deleteFeature: 'Delete feature',
		description: 'Description',
		hidden: 'Hide from the list of features',
		name: 'Name',
		size: 'Size',
	},
	FooterButtons: {
		save: 'Save',
		saved: 'Saved',
		submit: 'Submit',
		submitted: 'Submitted!',
	},
	Map: {
		changeBaseMap: 'Change base map',
		initialCenter: '48.1036533,4.1777465', // Europe
		initialZoom: '4',
	},
	MapHint: {
		Point: 'Click on the map to place a marker',
		LineString:
			'Click starting point, optionally click more points. Double-click last point to end and save.',
		Polygon:
			'Click border points. Click the starting point again to end and save.',
	},
	MapToolbar: {
		cancel: 'Cancel',
	},
	OptionsEditor: {
		addColumn: 'Add column',
		addOption: 'Add option',
		addRow: 'Add row',
		columns: 'Columns',
		optionPrefix: 'Option',
		options: 'Options',
		rows: 'Rows',
	},
	PublicFrame: {
		contactUs: 'Contact us:',
		help: 'How it works',
		helpTooltip: 'How does it work?',
		login: 'Log In',
		kmonitorUrl: 'https://k-monitor.hu/en',
	},
	ProjectSheetManager: {
		addSheet: 'Add new sheet',
		cancel: 'Cancel',
		copyFeaturesFrom: 'Copy features from this map:',
		sendToMap: 'Send features to a map',
		sheetName: 'Sheet title',
		sheetNameRequired: 'Sheet title is required',
		sheetType: 'Select type of sheet',
		sheetTypes: {
			interactiveMap: 'Interactive map',
			staticMap: 'Static map',
			survey: 'Survey',
			text: 'Text',
		},
		submittedFeatures: 'Submitted features',
		title: 'New Sheet',
		withoutCopying: 'Create without copying from existing map.',
	},
	SheetContent: {
		consent1: 'I acknowledge that I have read and understand',
		consent2:
			'the&nbsp;Terms&nbsp;of&nbsp;Use and the&nbsp;Privacy&nbsp;Policy.',
		next: 'Next',
	},
	Sidebar: {
		back: 'Back',
		hide: 'Hide side panel',
	},
	Survey: {
		removeAnswer: 'Remove answer',
	},
	SurveyEditor: {
		addQuestion: 'Add question',
		cancel: 'Cancel',
		maxName: 'Label (maximum)',
		maxSelect: 'Maximum number of choices:',
		maxValue: 'Maximum value',
		minName: 'Label (minimum)',
		minValue: 'Minimum value',
		other: 'Add "Other..." option',
		questionPrefix: 'Question',
		questionText: 'Question text',
		questionType: 'Question type',
		questionTypes: {
			checkbox: 'Checkboxes',
			dropdown: 'Drop-down (one answer)',
			multipleChoiceMatrix: 'Multiple choice grid',
			number: 'Numeric text box',
			radiogroup: 'Multiple choice',
			range: 'Numeric slider',
			rating: 'Star-rating (1-5)',
			singleChoiceMatrix: 'Checkbox grid',
			text: 'Text box',
		},
		required: 'Required question',
		showOnlyStatsToVisitors: 'Display only the results',
		showStatsToVisitors:
			'Display results to visitors after submitting the sheet',
	},
	SurveyResult: {
		averageValue: 'Average value',
		numberOfSubmissions: 'Number of submissions',
		other: 'Other',
	},
	Terms: {
		content: terms,
	},

	// general

	imageUpload: {
		browse: 'Browse images...',
		dropzone: 'Drop the image here!',
		failed: 'Image uploading failed',
		maxFileSize: 'Maximum size: 5 MB',
		remove: 'Remove image',
	},
	modals: {
		cancel: 'Cancel',
		confirmDeletion: 'Are you sure you wish to delete this',
		confirmUnsaved:
			'There are unsaved changes on this page. Are you sure you want to continue?',
		delete: 'Delete',
		unsaved: 'Warning: Unsaved changes',
		yes: 'Yes',
	},
};
