// Yes, it's a CommonJS module, as it is needed on the server.

module.exports = {
	activationEmail: {
		subject: 'Új fiók aktiválása',
		body: '<p><b>Kedves {user}!</p><p>Kérlek véglegesítsd Partimap regisztrációdat az alábbi hivatkozás megnyitásával:<br><a href="{url}">{url}</a></p><p>Ez a link 24 óráig érvényes, utána újra kell regisztrálnod.</p>',
	},
	forgotEmail: {
		subject: 'Elfelejtett jelszó',
		body: '<p><b>Kedves {user}!</p><p>A Partimap fiókodhoz tartozó jelszavadat az alábbi hivatkozás megnyitásával cserélheted:<br><a href="{url}">{url}</a></p><p>Ez a link 24 óráig érvényes, utána újra kell kérvényezned a jelszócserét az "Elfelejtettem a jelszavam" opcióval.</p>',
	},
	newProject: {
		newSheetTitle: 'A felmérés célja',
	},
	report: {
		aggregatedRating: 'Összesített értékelése',
		aggregatedRatings: 'Összesített értékelések',
		coords: 'Koordináták',
		dateFormat: 'YYYY-MM-DD HH:MM:SS',
		descriptionLabel: 'Felrajzolt elemekhez rendelt kérdés',
		dislikeCount: 'Diszlájkok száma',
		feature: 'Térkép elem',
		featureDesc: 'Leírás',
		featureLabel: 'Feladat egyedi neve',
		featureName: 'Név',
		featureQuestion: 'Jelölőnégyzetes kérdés',
		featureQuestionAnswer: 'Válasz',
		featureType: 'Elem típusa',
		filename: 'export.xlsx',
		geometry: {
			Point: 'Pont',
			LineString: 'Útvonal',
			Polygon: 'Terület',
		},
		isMobile: 'Eszköz',
		isMobileNo: 'pc',
		isMobileYes: 'mobil',
		likeCount: 'Lájkok száma',
		rating: 'Értékelés',
		ratingCount: 'Értékelések száma',
		ratings: 'Értékelések',
		sheetTitle: 'Munkalap elnevezése',
		submissionId: 'Kitöltés azon.',
		submittedAnswers: 'Beküldött válaszok',
		submittedFeatures: 'Beküldött térkép elemek',
		timestamp: 'Időbélyeg',
	},
};
