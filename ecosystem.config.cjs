module.exports = {
	apps: [
		{
			name: 'partimap',
			interpreter: 'node@20.14.0',
			node_args: '--env-file=.env',
			script: '.output/server/index.mjs',
		},
	],
};
