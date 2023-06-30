const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = require('express')();
require('express-async-errors');
const auth = require('./auth/setup');
const db = require('./db');
const i18n = require('./i18n/i18n.api');
const map = require('./map/map.api');
const project = require('./project/project.api');
const sheet = require('./sheet/sheet.api');
const submission = require('./submission/submission.api');
const submittedFeatures = require('./submittedFeatures/submittedFeatures.api');
const user = require('./user/user.api');

db.init(); // async but no need to wait here

app.use(bodyParser({ limit: '10mb' }));
app.use(bodyParser.json());
app.use(cookieParser());

auth.setup(app);

app.use('/', i18n);
app.use('/', map);
app.use('/', project);
app.use('/', sheet);
app.use('/', submission);
app.use('/', submittedFeatures);
app.use('/', user);

module.exports = app;
