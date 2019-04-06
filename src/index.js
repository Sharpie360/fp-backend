const express = require('express');
const request = require('request');
const isValidURL = require('url-validation');

const corsAdder = require('./middleware/corsAdder');

const repairURL = (url) => {
  if (url.includes(':/') && !url.includes('://')) {
    return `${url.split(':')[0]}:/${url.split(':')[1]}`;
  } else {
    return url;
  }
}


const app = express();

app.use(corsAdder);

app.get('/', (req, res) => {
  res.send('Hello from the Filtrify Photo backend! :)');
});

app.get('/favicon.ico', (req, res) => res.sendStatus(204));

app.get('*', (req, res, next) => {
  const url = repairURL(req.path.substring(1));

  const error = (req, res) => {
    res.status(500);
    return new Error('Invalid URL, please try again.');
  }

  isValidURL(url) 
    ? request.get(url)
      .pipe(res)
      .on('error', error => next(error)) 
    : next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: err.message,
  });
});

const port = process.env.PORT || 1337;

const host = process.env.HOST || '127.0.0.1';

app.listen(port, host, () => console.log(`Server started at ${host}:${port} | <3 RabbitWerks.js`));
