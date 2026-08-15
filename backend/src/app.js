const express = require('express');
const path = require('path');
const cors = require('cors');

const router = require('./router');

const app = express();
const frontendPath = path.resolve(__dirname, '..', '..', 'frontend');

app.use(cors());
app.use(express.json());
app.use(express.static(frontendPath));
app.use(router);

app.get('/', (_request, response) => {
  response.sendFile(path.join(frontendPath, 'index.html'));
});

module.exports = app;