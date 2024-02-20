// Yes, it's a CommonJS module, as it is needed on the server.

module.exports = {
	activationEmail: {
		subject: 'Liko tik vienas žingsnis!',
		body: '<p><b>Sveiki, {user}</b>!</p><p>Užbaikite PARTIMAP registraciją spustelėdami toliau pateiktą nuorodą:<br><a href="{url}">{ url}</a></p><p>Ši nuoroda galioja tik 24 valandas. Jei nuoroda baigs galioti, užsiregistruokite dar kartą.</p>',
	},
	forgotEmail: {
		subject: 'Pamiršau slaptažodį',
		body: '<p><b>Sveiki, {user}</b>!</p><p>Galite nustatyti naują slaptažodį savo PARTIMAP paskyrai spustelėdami toliau pateiktą nuorodą:<br><a href="{ url}">{url}</a></p><p>Ši nuoroda galioja tik 24 valandas. Jei nuorodos galiojimo laikas baigiasi, pateikite slaptažodžio keitimo užklausą dar kartą.</p>',
	},
	newProject: {
		newSheetTitle: 'Apklausos tikslas',
	},
	notificationEmail: {
		subject: 'Jūsų apklausa, {title}, turi naują atsakymą',
		body_one:
			'<p><b>Sveiki, {user},</b></p><p>Jūsų PARTIMAP forma <a href="{projectUrl}">{title}</a> gavo naują atsakymą.< /p><p>Peržiūrėkite {submissions} atsakymus, kuriuos surinkote <a href="{reportUrl}">čia sugeneruodami ataskaitą.</a></p><p>&nbsp;</p><p><a href="{unsubscribeUrl}">Išjungti el. pašto pranešimus apie naujus atsakymus.</a></p>',
		body_other:
			'<p><b>Sveiki, {user},</b></p><p>Jūsų PARTIMAP formoje <a href="{projectUrl}">{title}</a> yra {newSubmissions} naujų atsakymų.</p><p>Peržiūrėkite {submissions} atsakymus, kuriuos surinkote <a href="{reportUrl}">sugeneruodami ataskaitą čia.</a></p><p>&nbsp;</p><p><a href="{unsubscribeUrl}">Išjungti el. pašto pranešimus apie naujus atsakymus.</a></p>',
	},
	report: {
		aggregatedRating: 'Apibendrintas įvertinimas',
		aggregatedRatings: 'Apibendrinti įvertinimai',
		coords: 'Koordinatės',
		dateFormat: 'YYYY-MM-DD HH:MM:SS',
		descriptionLabel: 'Papildomas tekstinis klausimas',
		dislikeCount: 'Atsakymų ‘nepatinka’ kiekis',
		feature: 'Žymeklis',
		featureDesc: 'Apibūdinimas',
		featureLabel: 'Unikalus užduoties pavadinimas',
		featureName: 'Pavadinimas',
		featureQuestion: 'Klausimas',
		featureQuestionAnswer: 'Atsakymas',
		featureType: 'Žymeklio tipas',
		geometry: {
			Point: 'Taško žymeklis',
			LineString: 'Linija',
			Polygon: 'Daugiakampis',
		},
		isMobile: 'Prietaisas',
		isMobileNo: 'Kompiuteris',
		isMobileYes: 'Mobilusis telefonas',
		likeCount: 'Atsakymų ‘patinka’ kiekis',
		rating: 'Įvertinimas',
		ratingAnswer: 'Szöveges értékelés', // TODO
		ratingCons: 'Taškai prieš',
		ratingCount: 'Įvertinimų kiekis',
		ratingPros: 'Taškai už',
		ratingQuestion: 'Kérdés a szöveges értékeléshez', // TODO
		ratings: 'Įvertinimai',
		sheetTitle: 'Darbalapio pavadinimas',
		submissionId: 'Respondento ID',
		submittedAnswers: 'Gauti atsakymai',
		submittedFeatures: 'Pateikti žymekliai',
		timestamp: 'Atsakymo laikas',
	},
};
