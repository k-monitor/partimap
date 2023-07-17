// Yes, it's a CommonJS module, as it is needed on the server.

module.exports = {
	activationEmail: {
		subject: "You're Almost In!",
		body: '<p><b>Hey there, {user}</b>!</p><p>Please complete your PARTIMAP registration by clicking the link below:<br><a href="{url}">{url}</a></p><p>This link is only valid for 24 hours. If the link expires, register again.</p>',
	},
	forgotEmail: {
		subject: 'Forgotten password',
		body: '<p><b>Hey there, {user}</b>!</p><p>You can set a new password for your PARTIMAP account by clicking the link below:<br><a href="{url}">{url}</a></p><p>This link is only valid for 24 hours. If the link expires, request a password change again.</p>',
	},
	newProject: {
		newSheetTitle: 'Survey objectives',
	},
	notificationEmail: {
		subject: 'Your form, {title}, has new responses',
		body_one:
			'<p><b>Dear {user},</b></p><p>Your PARTIMAP form <a href="{projectUrl}">{title}</a>, has a new response.</p><p>View the {submissions} responses you collected by <a href="{reportUrl}">generating a report here.</a></p><p>&nbsp;</p><p><a href="{unsubscribeUrl}">Disable email notification for new responses.</a></p>',
		body_other:
			'<p><b>Dear {user},</b></p><p>Your PARTIMAP form <a href="{projectUrl}">{title}</a>, has {newSubmissions} new responses.</p><p>View the {submissions} responses you collected by <a href="{reportUrl}">generating a report here.</a></p><p>&nbsp;</p><p><a href="{unsubscribeUrl}">Disable email notification for new responses.</a></p>',
	},
	report: {
		aggregatedRating: 'Aggregated ratings',
		aggregatedRatings: 'Aggregated ratings',
		coords: 'Coordinates',
		dateFormat: 'YYYY-MM-DD HH:MM:SS',
		descriptionLabel: 'Follow-up text question',
		dislikeCount: 'Downvote count',
		feature: 'Marker',
		featureDesc: 'Description',
		featureLabel: 'Unique task name',
		featureName: 'Name',
		featureQuestion: 'Checkbox question',
		featureQuestionAnswer: 'Answer',
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
