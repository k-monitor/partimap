const bodyParser = require('body-parser');
const app = require('express')();
const { ensureLoggedIn, ensureAdmin } = require('./auth/middlewares');
const auth = require('./auth/setup');
const db = require('./db');
const inst = require('./inst/inst.api');
const project = require('./project/project.api');
const user = require('./user/user.api');

db.init(); // async but no need to wait here

app.use(bodyParser.json());

auth.setup(app);

app.use('/my', ensureLoggedIn);
app.use('/admin', ensureLoggedIn, ensureAdmin);

app.use('/', inst);
app.use('/', project);
app.use('/', user);

module.exports = app;
