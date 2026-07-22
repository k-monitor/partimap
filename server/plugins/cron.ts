import { useScheduler } from '#scheduler';
import * as db from '~/server/data/projects';
import * as udb from '~/server/data/users';
import { env } from '~~/env';

const { NUXT_PUBLIC_BASE_URL, SUB_DAILY_HOUR, SUB_EVENTS_DEBOUNCE_MINS } = env;

export default defineNitroPlugin(() => {
	if (process.env.APP_ENV === 'build') return; // skip during build

	const scheduler = useScheduler();
	scheduler.run(sendDailyNotifications).dailyAt(SUB_DAILY_HOUR, 0);
	scheduler.run(sendEventBasedNotifications).everyFiveMinutes();
	scheduler.run(sendGdprBlockNotices).everyMinutes(1); // FIXME set to hourly
});

function getProjectUrl(lang: string, id: number) {
	return `${NUXT_PUBLIC_BASE_URL}/${lang}/admin/project/${id}`;
}

function getReportUrl(lang: string, id: number) {
	return `${NUXT_PUBLIC_BASE_URL}/${lang}/admin/projects?dlr=${id}`;
}

function getUnsubscribeUrl(lang: string, id: number, token: string) {
	return `${NUXT_PUBLIC_BASE_URL}/${lang}/unsubscribe?id=${id}&token=${token}`;
}

async function sendGdprBlockNotices() {
	const users = await udb.dataForGdprBlockNotices();
	for (const u of users) {
		const projectListItems = u.projects
			.map((p) => `<li><a href="${getProjectUrl(u.lang, p.id)}">${p.title}</a></li>`)
			.join('\n');
		const projectListHtml = `\n<ul>${projectListItems}</ul>\n`;

		const subject = 'FIXME GDPR Block Notice'; // FIXME subject from server messages
		const body = 'FIXME GDPR Block Notice\n{projects}' // FIXME body from server messages
			.replace(/\{user\}/g, u.name)
			.replace(/\{projects\}/g, projectListHtml);

		try {
			await sendEmail(u.email, subject, body);
			await udb.updateGdprBlockNoticeSent(u.id);
		} catch (error) {
			console.error(error);
		}
	}
}

async function sendDailyNotifications() {
	const projects = await db.dataForDailyNotifications();
	sendNotifications(projects);
}

async function sendEventBasedNotifications() {
	const projects = await db.dataForEventBasedNotifications(SUB_EVENTS_DEBOUNCE_MINS);
	sendNotifications(projects);
}

async function sendNotifications(projects: db.NotificationData[]) {
	for (let i = 0; i < projects.length; i++) {
		const p = projects[i] as db.NotificationData;
		const m = i18n(p.lang).notificationEmail;
		const projectUrl = getProjectUrl(p.lang, p.id);
		const reportUrl = getReportUrl(p.lang, p.id);
		const unsubscribeUrl = getUnsubscribeUrl(p.lang, p.id, p.unsubscribeToken);
		const subject = m.subject.replace(/\{title\}/g, p.title);
		const body = (p.newSubmissions === 1 ? m.body_one : m.body_other)
			.replace(/\{user\}/g, p.name)
			.replace(/\{title\}/g, p.title)
			.replace(/\{submissions\}/g, String(p.submissions))
			.replace(/\{newSubmissions\}/g, String(p.newSubmissions))
			.replace(/\{projectUrl\}/g, projectUrl)
			.replace(/\{reportUrl\}/g, reportUrl)
			.replace(/\{unsubscribeUrl\}/g, unsubscribeUrl);

		try {
			await sendEmail(p.email, subject, body, unsubscribeUrl);
			await db.updateLastSent(p.id);
		} catch (error) {
			console.error(error);
		}
	}
}
