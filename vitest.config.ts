import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		watchTriggerPatterns: [
			{
				pattern: /locales\/.*\.js$/,
				testsToRun: (id, match) => {
					return `./locales/integrity.test.ts`;
				},
			},
		],
	},
});
