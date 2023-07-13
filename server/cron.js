const CronJob = require('cron').CronJob;
const { SUB_EVENTS_DEBOUNCE_MINS } = require('./conf');
const { dataForEventlySubscriptions } = require('./project/project.db');

// eslint-disable-next-line no-new
new CronJob(
	'0 */5 * * * *', // every 5 minutes
	sendEventEmails,
	null,
	true // start now
);

// eslint-disable-next-line no-new
new CronJob(
	'0 0 8 * * *', // daily at 8
	sendDigestEmails(),
	null,
	true // start now
);

async function sendEventEmails() {
	const projects = await dataForEventlySubscriptions(
		SUB_EVENTS_DEBOUNCE_MINS
	);
	// TODO
}

function sendDigestEmails() {
	// TODO
}

sendEventEmails();
