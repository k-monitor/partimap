import { createEnv } from '@t3-oss/env-nuxt';
import { z } from 'zod';
import { ensureUploadsDirectoryExists } from './server/utils/uploads';

// TODO would be nice to make uploads dir configurable

if (process.env.APP_ENV !== 'build') {
	ensureUploadsDirectoryExists();
}

export const env = createEnv({
	server: {
		// Server
		NITRO_PORT: z.coerce.number().default(3000),

		// Database
		DB_HOST: z.string().min(1).default('localhost'),
		DB_PORT: z.coerce.number().default(3306),
		DB_NAME: z.string().min(1),
		DB_USER: z.string().min(1),
		DB_PASS: z.string(),

		// Auth
		JWT_SECRET: z.string().min(32).optional(),
		SESSION_NAME: z.string().min(1).default('partimap-session'),
		SESSION_SECRET: z.string().min(32).optional(),

		// Mail
		SMTP_FROM: z.string().min(1),
		SMTP_REPLY_TO: z.string().min(1),
		SMTP_HOST: z.string().min(1),
		SMTP_PORT: z.coerce.number(),
		SMTP_USER: z.string().min(1).optional(),
		SMTP_PASS: z.string().min(1).optional(),

		// Captcha
		RECAPTCHA_SECRET_KEY: z.string().min(1).optional(),

		// Email subscription
		SUB_DAILY_HOUR: z.coerce.number().min(0).max(23).default(8),
		SUB_EVENTS_DEBOUNCE_MINS: z.coerce.number().min(1).default(60),
	},
	client: {
		NUXT_PUBLIC_BASE_URL: z.string().url().default('http://localhost:3000'),
		NUXT_PUBLIC_GOOGLE_TAG_MANAGER_ID: z.string().min(1).optional(),
		NUXT_PUBLIC_RECAPTCHA_SITE_KEY: z.string().min(1).optional(),
	},
});
