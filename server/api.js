const bodyParser = require('body-parser');
const app = require('express')();
const auth = require('./auth/setup');
const db = require('./db');
const map = require('./map/map.api');
const project = require('./project/project.api');
const sheet = require('./sheet/sheet.api');
const submission = require('./submission/submission.api');
const user = require('./user/user.api');

db.init(); // async but no need to wait here

app.use(bodyParser.json());

auth.setup(app);

app.use('/', map);
app.use('/', project);
app.use('/', sheet);
app.use('/', submission);
app.use('/', user);

module.exports = app;
