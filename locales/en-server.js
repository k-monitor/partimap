// Yes, it's a CommonJS module, as it is needed on the server.

module.exports = {
	activationEmail: {
		subject: "You're Almost In!",
		body: '<p><b>Hey there, {user}!</p><p>Please complete your Partimap registration by clicking the link below:<br><a href="{url}">{url}</a></p><p>This link is only valid for 24 hours. If the link expires, register again.</p>',
	},
	forgotEmail: {
		subject: 'Forgotten password',
		body: '<p><b>Hey there, {user}!</p><p>You can set a new password for your Partimap account by clicking the link below:<br><a href="{url}">{url}</a></p><p>This link is only valid for 24 hours. If the link expires, request a password change again.</p>',
	},
	newProject: {
		newSheetTitle: 'Survey objectives',
	},
	report: {
		aggregatedRating: 'Aggregated ratings',
		aggregatedRatings: 'Aggregated ratings',
		coords: 'Coordinates',
		dateFormat: 'YYYY-MM-DD HH:MM:SS',
		dislikeCount: 'Downvote count',
		feature: 'Marker',
		featureDesc: 'Description',
		featureLabel: 'Unique task name',
		featureName: 'Name',
		featureType: 'Type of marker',
		filename: 'export.xlsx',
		geometry: {
			Point: 'Point marker',
			LineString: 'Line',
			Polygon: 'Polygon',
		},
		isMobile: 'Device',
		isMobileNo: 'pc',
		isMobileYes: 'mobile',
		likeCount: 'Upvote count',
		rating: 'Rating',
		ratingCount: 'Rating count',
		ratings: 'Ratings',
		sheetTitle: 'Sheet title',
		submissionId: 'Submission ID',
		submittedAnswers: 'Submitted answers',
		submittedFeatures: 'Submitted markers',
		timestamp: 'Timestamp',
	},
};
