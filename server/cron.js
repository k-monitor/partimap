const CronJob = require('cron').CronJob;
const { SUB_DAILY_HOUR, SUB_EVENTS_DEBOUNCE_MINS } = require('./conf');
const {
	dataForDailyNotifications,
	dataForEventBasedNotifications,
} = require('./project/project.db');

// eslint-disable-next-line no-new
new CronJob(
	`0 0 ${SUB_DAILY_HOUR} * * *`, // daily at 8
	sendDailyNotifications,
	null,
	true // start now
);

// eslint-disable-next-line no-new
new CronJob(
	'0 */5 * * * *', // every 5 minutes
	sendEventBasedNotifications,
	null,
	true // start now
);

async function sendDailyNotifications() {
	const projects = await dataForDailyNotifications();
	// TODO send email
}

async function sendEventBasedNotifications() {
	const projects = await dataForEventBasedNotifications(
		SUB_EVENTS_DEBOUNCE_MINS
	);
	// TODO email
}
