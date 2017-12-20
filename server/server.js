'use strict';

const express = require('express');
const fs = require('fs');
const https = require('https');
const app = express();
const env = require('./env');

let httpsOptions = null;

/* Load https certificates */
if (!env.HTTPS_DISABLED) {
  let key = fs.readFileSync(env.PRIVATE_KEY, 'utf8');
  let cert = fs.readFileSync(env.PUBLIC_KEY, 'utf8');
  httpsOptions = {key: key, cert: cert};
}

app.use(express.static(env.DISTR_PATCH));

app.get('/config', (req, res, next) => {
  res.json({server_url: env.BACKEND_URL});
});

app.get(/.*/, (req, res) => {
  res.sendFile(`${env.DISTR_PATCH}/index.html`);
});

const logServerRunning = () => console.log("Server is running on port", env.PORT);

/* Start server */
httpsOptions ?
  https.createServer(httpsOptions, app).listen(env.PORT, logServerRunning) : app.listen(env.PORT, logServerRunning);