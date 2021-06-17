const app = require('express')();

app.all('/ping', (req, res) => {
	res.send('pong');
});

module.exports = app;
