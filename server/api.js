const bodyParser = require('body-parser');
const app = require('express')();
const auth = require('./auth/setup');
const db = require('./db');
const inst = require('./inst/inst.api');
const project = require('./project/project.api');
const user = require('./user/user.api');

db.init(); // async but no need to wait here

app.use(bodyParser.json());

auth.setup(app);

app.use('/', inst);
app.use('/', project);
app.use('/', user);

module.exports = app;
