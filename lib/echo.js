var moment = require('moment');
var url = require('url');
var restify = require('restify');

var startDate = Date.now();

module.exports = function echo(req, res, next) {

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
        //serverName: server.name
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
};

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
