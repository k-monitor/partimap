const nodemailer = require('nodemailer');
const { htmlToText } = require('nodemailer-html-to-text');
const conf = require('./conf');

const transporter = nodemailer.createTransport({
	host: conf.SMTP_HOST,
	port: conf.SMTP_PORT,
	auth: {
		user: conf.SMTP_USER,
		pass: conf.SMTP_PASS,
	},
	secure: false,
	tls: {
		rejectUnauthorized: false,
	},
});

transporter.use('compile', htmlToText());

function sendEmail(to, subject, html) {
	return new Promise((resolve, reject) => {
		const mailOptions = {
			from: conf.SMTP_FROM,
			replyTo: conf.SMTP_REPLY_TO,
			to,
			subject: `[Partimap] ${subject}`,
			html: `${html}\n<p><b>Partimap</b> by <a href="https://k-monitor.hu/">K-Monitor</a></p>`,
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
