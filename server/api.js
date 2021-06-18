const bodyParser = require('body-parser');
const app = require('express')();
const db = require('./db');
const inst = require('./inst/inst.api');

db.init(); // async but no need to wait here

app.use(bodyParser.json());

app.use('/inst', inst);

module.exports = app;
