import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	plugins: [tsconfigPaths()],
	// ^ TS error but copied from docs
	// https://vitest.dev/guide/common-errors.html#cannot-find-module-relative-path
});
