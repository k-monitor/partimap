import nodemailer from 'nodemailer';
import { htmlToText } from 'nodemailer-html-to-text';
import type Mail from 'nodemailer/lib/mailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

const smtpConf: SMTPTransport.Options = {
	host: process.env.SMTP_HOST,
	port: Number(process.env.SMTP_PORT),
	secure: false,
	tls: {
		rejectUnauthorized: false,
	},
};
if (process.env.SMTP_USER) {
	smtpConf.auth = {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	};
}

const transporter = nodemailer.createTransport(smtpConf);

transporter.use('compile', htmlToText());

export function sendEmail(to: string, subject: string, html: string, listUnsubscribe?: string) {
	return new Promise<void>((resolve, reject) => {
		const mailOptions: Mail.Options = {
			from: process.env.SMTP_FROM,
			replyTo: process.env.SMTP_REPLY_TO,
			to,
			subject,
			html: `${html}\n<p><b>PARTIMAP</b> by <a href="https://k-monitor.hu/">K-Monitor</a></p>`,
			// TODO i18n
		};
		if (listUnsubscribe) {
			mailOptions.list = {
				unsubscribe: listUnsubscribe,
			};
		}

		transporter.sendMail(mailOptions, (error) => {
			if (error) {
				reject(error);
			} else {
				resolve();
			}
		});
	});
}
