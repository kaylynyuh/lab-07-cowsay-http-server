'use strict';

const fs = require('fs');
const http = require('http');
const url = require('url');
const queryString = require('querystring');

const cowsay = require('cowsay');
const parseBody = require('./lib/parse-body.js');

const PORT = process.env.PORT || 3000;

const server = http.createServer(function(req, res) {
  req.url = url.parse(req.url);
  req.url.query = queryString.parse(req.url.query);
  res.write(cowsay.say({text: 'sup'}));
  res.end();

  if(req.method === 'POST') {
    parseBody(req, function(err) {
      if (err) return console.error(err);
    });
  }

  if(req.method === 'GET' && req.url.pathname === '/home') {
    fs.createReadStream('./server.js').pipe(res);
  }

  res.statuscode = 404;
  res.write('no such luck');
  res.end();
});

server.listen(PORT, function() {
  console.log('server is running', PORT);
});
