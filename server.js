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

  if(req.method === 'GET' && req.url.pathname === '/') {
    res.writeHead(200,{'Content-Type': 'text/plain'});
  }

  if(req.method === 'GET' && req.url.pathname === '/cowsay' && req.url.query.text) {
    res.writeHead(200);
    res.write(cowsay.say({text: req.url.query.text}));
    res.end();
  } else if (!req.url.query.text) {
    res.writeHead(400);
    res.write(cowsay.say({text: 'bad request\ntry: localhost:3000/cowsay?text=howdy'}));
    res.end();
  }

  if(req.method === 'POST' && req.url.pathname === '/cowsay') {
    parseBody(req, function(err) {
      if (err) return console.error(err);
      if(req.body.text){
        res.writeHead(200,{'Content-Type': 'text/plain'});
        res.write(cowsay.say({text: req.body.text}));
        res.end();
      } else {
        res.writeHead(400);
        res.write(cowsay.say({text: 'bad request\ntry: localhost:3000/cowsay?text=howdy'}));
        res.end();
      }
    });
  }
});

server.listen(PORT, function() {
  console.log('server is running', PORT);
});
