import nodemailer from 'nodemailer';
import { htmlToText } from 'nodemailer-html-to-text';
import type Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { env } from '~/env';

const smtpConf: SMTPTransport.Options = {
	host: env.SMTP_HOST,
	port: env.SMTP_PORT,
	secure: false,
	tls: {
		rejectUnauthorized: false,
	},
};
if (env.SMTP_USER) {
	smtpConf.auth = {
		user: env.SMTP_USER,
		pass: env.SMTP_PASS,
	};
}

const transporter = nodemailer.createTransport(smtpConf);

transporter.use('compile', htmlToText());

export function sendEmail(to: string, subject: string, html: string, listUnsubscribe?: string) {
	return new Promise<void>((resolve, reject) => {
		const mailOptions: Mail.Options = {
			from: env.SMTP_FROM,
			replyTo: env.SMTP_REPLY_TO,
			to,
			subject,
			html: `${html}\n<p><b>PARTIMAP</b> by <a href="https://k-monitor.hu/">K-Monitor</a></p>`,
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
