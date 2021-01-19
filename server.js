const jsonServer = require('json-server');
const express = require('express');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const root = __dirname + '/build';
server.use(express.static(root, { maxAge: 86400000 }));
server.use(middlewares);
server.use(router);
server.listen(8000, () => {
  console.log('server is running');
})
