import { useScheduler } from '#scheduler';
import * as db from '~/server/data/projects';
import { env } from '~~/env';

const { NUXT_PUBLIC_BASE_URL, SUB_DAILY_HOUR, SUB_EVENTS_DEBOUNCE_MINS } = env;

export default defineNitroPlugin(() => {
	if (process.env.APP_ENV === 'build') return; // skip during build

	const scheduler = useScheduler();
	scheduler.run(sendDailyNotifications).dailyAt(SUB_DAILY_HOUR, 0);
	scheduler.run(sendEventBasedNotifications).everyFiveMinutes();
});

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
		const p = projects[i];
		const m = i18n(p.lang).notificationEmail;
		const projectUrl = `${NUXT_PUBLIC_BASE_URL}/${p.lang}/admin/project/${p.id}`;
		const reportUrl = `${NUXT_PUBLIC_BASE_URL}/${p.lang}/admin/projects?dlr=${p.id}`;
		const unsubscribeUrl = `${NUXT_PUBLIC_BASE_URL}/${p.lang}/unsubscribe?id=${p.id}&token=${p.unsubscribeToken}`;
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
