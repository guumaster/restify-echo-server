#!/usr/bin/env node

var restify = require('restify');
var moment = require('moment');
var url = require('url');
var bunyan = require('bunyan');

var startDate = Date.now();
var serverName = process.env.SERVER_NAME || 'echo-server';

var log = bunyan.createLogger({
  name: serverName,
  stream: process.stdout,
  level: 'debug'
});

var server = restify.createServer({
  log: log,
  name: serverName
});

server.pre(restify.pre.sanitizePath());
server.pre(restify.pre.userAgentConnection());
server.use(restify.acceptParser(server.acceptable));
server.use(restify.gzipResponse());
server.use(restify.CORS());
server.use(restify.queryParser({mapParams: false}));
server.use(restify.bodyParser({mapParams: false}));

server.get('/(.*)', echo);
server.post('/(.*)', echo);
server.put('/(.*)', echo);
server.del('/(.*)', echo);

function echo(req, res, next) {

  var fullUrl, err, msg, delay, statusCode;

  delay = parseInt(req.query.delay, 10) || 0;
  statusCode = parseInt(req.query.statusCode, 10) || 200;

  fullUrl = (req.isSecure()) ? 'https' : 'http' + '://' + req.headers.host + req.url;

  req.echo = {
    statusCode: statusCode,
    delay: delay,
    response: {
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
    }
  };


  if (req.query.json) {
    try {
      req.echo.response.body = JSON.parse(req.query.json);
    } catch (e) {}
  }

  req.query.meta = !(req.query.meta === 'false');

  req.echo.response = req.query.meta ? req.echo.response : req.echo.response.body;


  if (req.query.throw) {
    err = restify.errors[req.query.throw + 'Error'] || Error;
    msg = req.query.msg || 'You requested an ' + req.query.throw + ' error';
    return deferedResponse(new err(msg), req, res, next);
  }

  return deferedResponse(null, req, res, next);
}

function deferedResponse(err, req, res, next) {
  if (req.echo.delay) {

    return setTimeout(function() {
      if (err) {
        req.log.error(err, 'RESTIFY-ERROR');
        return next(err);
      }
      req.log.info({echo: req.echo.response}, 'RESTIFY-ECHO');
      res.send(req.echo.statusCode, req.echo.response);
    }, req.echo.delay);

  }

  if (err) {
    req.log.error(err, 'RESTIFY-ERROR');
    return next(err);
  }

  req.log.info({echo: req.echo.response}, 'RESTIFY-ECHO');
  res.send(req.echo.statusCode, req.echo.response);
  return next();
}

server.on('uncaughtException', function(req, res, route, error) {
  req.log.error({err: error}, 'uncaughtException');
  res.send(error);
});

server.listen(process.env.PORT || 3000, function() {
  console.log('%s listening at %s', server.name, server.url);
});
