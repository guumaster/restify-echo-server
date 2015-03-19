#!/usr/bin/env node

var config = require('../lib/config');

var argv = require('yargs')
  .usage('Description:\nStarts a restify-echo server.\n\nUsage: \n\trestify-echo [OPTIONS]')
  .example('restify-echo -p 3000', 'starts the server in port 3000')

  .alias('c', 'config')
  .describe('c', 'config file')
  .default('c', false)

  .alias('n', 'name')
  .describe('n', 'server name')

  .alias('p', 'port')
  .describe('p', 'port to listen')

/** ngrok tunnel options */
  .alias('ng', 'ngrok')
  .describe('ng', 'start an ngrok tunnel')

  .alias('s', 'subdomain')
  .describe('s', 'ngrok subdomain (only if you provide a token)')

  .alias('t', 'token')
  .describe('t', 'ngrok auth token')

  .help('h')
  .alias('h', 'help')

  .argv;


var server = require('../lib/server')(argv);

server.start();
