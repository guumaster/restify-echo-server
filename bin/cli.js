#!/usr/bin/env node

var argv = require('yargs')
  .usage('Description:\nStarts a restify-echo server.\n\nUsage: \n\trestify-echo [OPTIONS]')
  .example('restify-echo -p 3000', 'starts the server in port 3000')

  .alias('n', 'name')
  .describe('n', 'server name')

  .alias('p', 'port')
  .describe('p', 'port to listen')

/** ngrok tunnel options */
  .demand('ngrok')
  .describe('ngrok', 'start an ngrok tunnel')
  .default('ngrok', false)

  .alias('s', 'subdomain')
  .describe('s', 'ngrok subdomain (only if you provide a token)')

  .alias('t', 'token')
  .describe('t', 'ngrok auth token')

  .help('h')
  .alias('h', 'help')

  //.epilog('copyright 2015')

  .argv;

var server = require('../lib/server')(argv);

server.start();
