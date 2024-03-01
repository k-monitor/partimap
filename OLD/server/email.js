const nodemailer = require('nodemailer');
const { htmlToText } = require('nodemailer-html-to-text');
const conf = require('./conf');

const smtpConf = {
	host: conf.SMTP_HOST,
	port: conf.SMTP_PORT,
	secure: false,
	tls: {
		rejectUnauthorized: false,
	},
};
if (conf.SMTP_USER) {
	smtpConf.auth = {
		user: conf.SMTP_USER,
		pass: conf.SMTP_PASS,
	};
}

const transporter = nodemailer.createTransport(smtpConf);

transporter.use('compile', htmlToText());

function sendEmail(to, subject, html, listUnsubscribe) {
	return new Promise((resolve, reject) => {
		const mailOptions = {
			from: conf.SMTP_FROM,
			replyTo: conf.SMTP_REPLY_TO,
			to,
			subject,
			html: `${html}\n<p><b>PARTIMAP</b> by <a href="https://k-monitor.hu/">K-Monitor</a></p>`,
			list: {
				unsubscribe: listUnsubscribe,
			},
		};
		transporter.sendMail(mailOptions, error => {
			if (error) {
				reject(error);
			} else {
				resolve();
			}
		});
	});
}

module.exports = { sendEmail };

/*
(async () => {
	await sendEmail('to', 'subject', 'html');
})();
*/
