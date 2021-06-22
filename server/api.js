const bodyParser = require('body-parser');
const app = require('express')();
const db = require('./db');
const inst = require('./inst/inst.api');
const user = require('./user/user.api');

db.init(); // async but no need to wait here

app.use(bodyParser.json());

app.use('/', inst);
app.use('/', user);

module.exports = app;
