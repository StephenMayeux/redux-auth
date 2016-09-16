const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const logger = require('morgan');

const app = express();
const router = require('./router');
const mongoose = require('mongoose');

// DB set up
mongoose.connect('mongodb://localhost/auth');

// app set up
app.use(logger('combined'));
app.use(bodyParser.json({ type: '*/*' }));
router(app);

// Server set up
const port = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(port);
console.log('Server spinning on port ', port);
