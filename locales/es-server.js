// Yes, it's a CommonJS module, as it is needed on the server.

module.exports = {
	activationEmail: {
		subject: '¡Ya casi está!',
		body: '<p><b>Hola, {user}</b>!</p><p>Para confirmar tu inscripción en el PARTIMAP, haz clic en el siguiente enlace:<br><a href="{url}">{url}</a></p><p>Este enlace solo es válido durante 24 horas. Si el enlace caduca, deberás solicitar otro enlace de activación.</p>',
	},
	forgotEmail: {
		subject: 'Contraseña olvidada',
		body: '<p><b>Hola, {user}</b></p><p>¿Le gustaría establecer una nueva contraseña para su cuenta? Haz clic en el siguente enlace:<br><a href="{url}">{url}</a></p><p>Este enlace solo es válido durante 24 horas. Si el enlace caduca, deberás solicitar otro enlace de restablecimiento de contraseña.</p>',
	},
	newProject: {
		newSheetTitle: 'Objetivos de la encuesta',
	},
	notificationEmail: {
		subject: '{title} - nuevas respuestas recibidas',
		body_one:
			'<p><b>Hola, {user}</b>!</p><p>Tu formulario PARTIMAP <a href="{projectUrl}">{title}</a>, tiene una nueva respuesta.</p><p>Tus {submissions} respuestas recopiladas están disponibles <a href="{reportUrl}">en el informe aquí.</a></p><p>&nbsp;</p><p><a href="{unsubscribeUrl}">Desactive la notificación por correo electrónico de nuevas respuestas.</a></p>',
		body_other:
			'<p><b>Hola, {user},</b></p><p>Tu formulario PARTIMAP <a href="{projectUrl}">{title}</a>, tiene {newSubmissions} nuevas respuestas.</p><p>Tus {submissions} respuestas recopiladas están disponibles <a href="{reportUrl}">en el informe aquí.</a></p><p>&nbsp;</p><p><a href="{unsubscribeUrl}">Desactive la notificación por correo electrónico de nuevas respuestas.</a></p>',
	},
	report: {
		aggregatedRating: 'Calificación Agregada',
		aggregatedRatings: 'Calificación Agregada',
		coords: 'Coordenadas',
		dateFormat: 'DD-MM-YYYY HH:MM:SS',
		descriptionLabel: 'Pregunta de seguimiento de texto',
		dislikeCount: 'Calificación negativa',
		feature: 'Caracteristica',
		featureDesc: 'Descripción',
		featureLabel: 'Nombre de tarea único',
		featureName: 'Título',
		featureQuestion: 'Pregunta de la casilla',
		featureQuestionAnswer: 'Respuesta',
		featureType: 'Tipo de caracteristica',
		geometry: {
			Point: 'Marcador de punto',
			LineString: 'Línea',
			Polygon: 'Polígono',
		},
		isMobile: 'Dispositivo',
		isMobileNo: 'pc',
		isMobileYes: 'móvil',
		likeCount: 'Calificación positiva',
		rating: 'Calificación por estrellas',
		ratingAnswer: 'Explicación textual',
		ratingCons: 'Puntos en contra',
		ratingCount: 'Calificación',
		ratingPros: 'Puntos a favor',
		ratingQuestion: 'Pregunta de seguimiento de texto',
		ratings: 'Calificación',
		sheetTitle: 'Título de la ficha',
		submissionId: 'Número de identificación',
		submittedAnswers: 'Respuestas enviadas',
		submittedFeatures: 'Características enviadas',
		timestamp: 'Marca de tiempo',
	},
};
