import Stackedit from 'stackedit-js';

export default defineNuxtPlugin(async () => {
	return {
		provide: {
			Stackedit,
		},
	};
});
