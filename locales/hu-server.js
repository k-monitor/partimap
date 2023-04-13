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
		newSheetTitle: 'Új szöveges munkalap',
	},
	report: {
		aggregatedRating: 'Összesített értékelése',
		aggregatedRatings: 'Összesített értékelések',
		coords: 'Koordináták',
		dateFormat: 'YYYY-MM-DD HH:MM:SS',
		dislikeCount: 'Diszlájkok száma',
		feature: 'Térkép elem',
		featureDesc: 'Leírás',
		featureName: 'Név',
		featureType: 'Elem típusa',
		filename: 'export.xlsx',
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
