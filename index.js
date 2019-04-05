const express = require('express');
const request = require('request');
const isValidURL = require('url-validation');





const app = express();

app.get('/', (req, res) => {
  res.send('Hello from the Filtrify Photo backend! :)');
});

app.get('/favicon.ico', (req, res) => res.sendStatus(204));

app.use('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('*', (req, res, next) => {
  const url = req.path.substring(1);

  const error = (req, res) => {
    res.status(500);
    return new Error('Invalid URL, please try again.');
  }

  if (isValidURL(url)) {
    request.get(url)
      .pipe(res)
      .on('error', error => next(error));
  } else {
    return next(error);
  }
});

app.use('*', (err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: err.message,
  });
});

const port = process.env.PORT || 1337;

const host = process.env.HOST || '127.0.0.1'

app.listen(port, host, () => console.log(`Server started at ${host}:${port} | <3 RabbitWerks.js`));
