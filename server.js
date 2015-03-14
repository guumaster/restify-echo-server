#!/usr/bin/env node

var restify = require('restify');
var moment = require('moment');
var url = require('url');

var server = restify.createServer({
  name: process.env.SERVER_NAME || 'echo-server'

});

server.use(restify.CORS());
server.use(restify.queryParser({mapParams: false}));
server.use(restify.bodyParser({mapParams: false}));
server.use(restify.requestLogger());

var startDate = Date.now();

function echo(req, res, next) {

  var statusCode = parseInt(req.query.status, 10) || 200;
  var fullUrl = (req.isSecure()) ? 'https' : 'http' + '://' + req.headers.host + req.url;
  var delay = parseInt(req.query.delay, 10) || 0;

  var echo = {
    ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
    method: req.method,
    url: url.parse(fullUrl),
    headers: req.headers,
    query: req.query,
    body: req.body,
    meta: {
      uptime: moment(startDate).fromNow(),
      status: statusCode,
      delay: delay,
      serverName: server.name
    }
  };


  if (delay) {
    setTimeout(function(){
      res.send(statusCode, echo);
    }, delay);
    return next();
  }

  res.send(statusCode, echo);
  return next();
}

server.get('/(.*)', echo);
server.post('/(.*)', echo);
server.put('/(.*)', echo);
server.del('/(.*)', echo);

server.listen(process.env.PORT || 3000, function() {
  console.log('%s listening at %s', server.name, server.url);
});
