const CronJob = require('cron').CronJob;
const {
	BASE_URL,
	SUB_DAILY_HOUR,
	SUB_EVENTS_DEBOUNCE_MINS,
} = require('./server/conf');
const i18n = require('./server/common/i18n');
const { sendEmail } = require('./server/email');
const {
	dataForDailyNotifications,
	dataForEventBasedNotifications,
	updateLastSent,
} = require('./server/project/project.db');

// eslint-disable-next-line no-new
new CronJob(
	`0 0 ${SUB_DAILY_HOUR} * * *`, // daily at XX:00
	sendDailyNotifications,
	null,
	true // start now
);

// eslint-disable-next-line no-new
new CronJob(
	'0 */5 * * * *', // every X minutes
	sendEventBasedNotifications,
	null,
	true // start now
);

async function sendDailyNotifications() {
	const projects = await dataForDailyNotifications();
	sendNotifications(projects);
}

async function sendEventBasedNotifications() {
	const projects = await dataForEventBasedNotifications(
		SUB_EVENTS_DEBOUNCE_MINS
	);
	sendNotifications(projects);
}

/**
 * @param {{ id: Number, lang: String, title: String, unsubscribeToken: String, email: String, name: String, submissions: Number, newSubmissions: Number }[]} projects
 */
async function sendNotifications(projects) {
	for (let i = 0; i < projects.length; i++) {
		const p = projects[i];
		const m = i18n(p.lang).notificationEmail;
		const projectUrl = `${BASE_URL}/${p.lang}/admin/project/${p.id}`;
		const reportUrl = `${BASE_URL}/api/submission/export/${p.lang}/${p.id}`;
		const unsubscribeUrl = `${BASE_URL}/${p.lang}/unsubscribe?id=${p.id}&token=${p.unsubscribeToken}`;
		const subject = m.subject.replace(/\{title\}/g, p.title);
		const body = (p.newSubmissions === 1 ? m.body_one : m.body_other)
			.replace(/\{user\}/g, p.name)
			.replace(/\{title\}/g, p.title)
			.replace(/\{submissions\}/g, p.submissions)
			.replace(/\{newSubmissions\}/g, p.newSubmissions)
			.replace(/\{projectUrl\}/g, projectUrl)
			.replace(/\{reportUrl\}/g, reportUrl)
			.replace(/\{unsubscribeUrl\}/g, unsubscribeUrl);

		try {
			await sendEmail(p.email, subject, body, unsubscribeUrl);
			await updateLastSent(p.id);
		} catch (error) {
			console.error(error);
		}
	}
}
