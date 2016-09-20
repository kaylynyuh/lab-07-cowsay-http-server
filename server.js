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

  if(req.method === 'POST') {
    parseBody(req, function(err) {
      if (err) return console.error(err);
    });
  }

  if(req.method === 'GET' && req.url.pathname === '/') {
    res.writeHead(200,'{Content-Type: text/plain}');
  }

  if(req.method === 'GET' && req.url.pathname === '/cowsay' && req.url.query.text) {
    res.writeHead(200);
    res.write(cowsay.say({text: req.url.query.text}));
    res.end();
  }

  res.statuscode = 404;
  res.write('no such luck');
  res.end();
});

server.listen(PORT, function() {
  console.log('server is running', PORT);
});
