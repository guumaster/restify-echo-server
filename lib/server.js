var restify = require('restify');
var bunyan = require('bunyan');
var ngrok = require('ngrok');
var extend = require('extend');

var echo = require('./echo');
var config = require('./config');

module.exports = function(options) {

  options.ngrok = {
    enabled: options.ngrok,
    authtoken: options.token,
    subdomain: options.subdomain
  };
  if (options.config) {
    config = require(options.config);
  }

  options = extend(true, config, options);


  var server = restify.createServer({
    log: bunyan.createLogger(options.bunyan),
    name: options.name
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

  server.on('uncaughtException', function(req, res, route, error) {
    req.log.error({err: error}, 'uncaughtException');
    res.send(error);
  });

  return {
    start: startServer.bind(null, server, options)
  }

};

function startServer(server, options) {

  server.listen(options.port, function() {
    console.log('%s listening at %s', server.name, server.url);

    if (!options.ngrok.enabled) {
      return;
    }

    var ngrokOptions = {
      port: options.port
    };

    if (options.ngrok.authtoken) {
      ngrokOptions.authtoken = options.ngrok.authtoken;
      ngrokOptions.subdomain = options.ngrok.subdomain || options.name;

    }

    ngrok.connect(ngrokOptions, function(err, url) {
      console.log('got a tunnel url', url);
    });

  });

}
