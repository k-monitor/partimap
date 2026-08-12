import { useScheduler } from '#scheduler';
import * as db from '~/server/data/projects';
import * as udb from '~/server/data/users';

const SUB_DAILY_HOUR = Number(process.env.SUB_DAILY_HOUR) || 8;
const SUB_EVENTS_DEBOUNCE_MINS = Number(process.env.SUB_EVENTS_DEBOUNCE_MINS) || 60;

export default defineNitroPlugin(() => {
	if (process.env.APP_ENV === 'build') return; // skip during build

	const scheduler = useScheduler();
	scheduler.run(sendDailyNotifications).dailyAt(SUB_DAILY_HOUR, 0);
	scheduler.run(sendEventBasedNotifications).everyFiveMinutes();
	// FIXME uncomment: scheduler.run(sendGdprBlockNotices).hourly();
});

function getProjectUrl(lang: string, id: number) {
	const {
		public: { baseUrl },
	} = useRuntimeConfig();
	return `${baseUrl}/${lang}/admin/project/${id}`;
}

function getReportUrl(lang: string, id: number) {
	const {
		public: { baseUrl },
	} = useRuntimeConfig();
	return `${baseUrl}/${lang}/admin/projects?dlr=${id}`;
}

function getUnsubscribeUrl(lang: string, id: number, token: string) {
	const {
		public: { baseUrl },
	} = useRuntimeConfig();
	return `${baseUrl}/${lang}/unsubscribe?id=${id}&token=${token}`;
}

async function sendGdprBlockNotices() {
	const {
		public: { gdprBlockFrom },
	} = useRuntimeConfig();
	const blockFrom = new Date(gdprBlockFrom as string);
	if (blockFrom < new Date()) return; // no need for emails, they see it on the UI

	const users = await udb.dataForGdprBlockNotices();
	for (const u of users) {
		const projectListItems = u.projects
			.map((p) => `<li><a href="${getProjectUrl(u.lang, p.id)}">${p.title}</a></li>`)
			.join('\n');
		const projectListHtml = `\n<ul>${projectListItems}</ul>\n`;

		const m = i18n(u.lang).gdprBlockNotice;

		const subject = m.subject;
		const body =
			m.body
				.replace(/\{projects\}/g, projectListHtml)
				.replace(/\{user\}/g, decryptField(u.eFullName) || u.name)
				.replace(
					/\{blockFrom\}/g,
					blockFrom.toLocaleString(u.lang, {
						dateStyle: 'long',
						timeStyle: 'short',
					}),
				) + projectListHtml;

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
			.replace(/\{user\}/g, decryptField(p.eFullName) || p.name)
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
