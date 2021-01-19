const jsonServer = require('json-server');
const express = require('express');
const path = require('path');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const root = __dirname + '/build';
const port = process.env.PORT || 8000;
server.use(express.static(root, { maxAge: 86400000 }));
server.use(middlewares);
const reactRouterWhiteList = ['/create','/edit/:itemId']
server.get(reactRouterWhiteList, (request, response) =>{
  response.sendFile(path.resolve(root,'index.html'));
});
server.use(router);
server.listen(port, () => {
  console.log('server is running');
})
