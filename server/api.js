const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = require('express')();
const auth = require('./auth/setup');
const db = require('./db');
const map = require('./map/map.api');
const project = require('./project/project.api');
const sheet = require('./sheet/sheet.api');
const submission = require('./submission/submission.api');
const user = require('./user/user.api');

db.init(); // async but no need to wait here

app.use(bodyParser({ limit: '10mb' }));
app.use(bodyParser.json());
app.use(cookieParser());

auth.setup(app);

app.use('/', map);
app.use('/', project);
app.use('/', sheet);
app.use('/', submission);
app.use('/', user);

module.exports = app;
