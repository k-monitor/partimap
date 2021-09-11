const express = require('express');
const app = express();

app.use(express.static('uploads'));

module.exports = app;
