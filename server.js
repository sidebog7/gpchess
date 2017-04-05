'use strict';

const Path = require('path');
const Hapi = require('hapi');
const Inert = require('inert');
const Hoek = require('hoek');
const enc = require('./src/util/encrypt').encrypt;
const dec = require('./src/util/encrypt').decrypt;


// Create a server with a host and port
const server = new Hapi.Server({
  connections: {
    routes: {
      files: {
        relativeTo: Path.join(__dirname, 'public')
      }
    }
  }
});
server.connection({
  host: 'localhost',
  port: 8000
});

server.register(Inert, () => {});

server.register(require('vision'), (err) => {

  Hoek.assert(!err, err);

  server.views({
    engines: {
      'html': {
        module: require('handlebars'),
        compileMode: 'sync' // engine specific
      }
    },
    compileMode: 'async', // global setting
    relativeTo: __dirname,
    path: './templates',
    layout: true,
    layoutPath: './templates/layout',
    helpersPath: './templates/helpers'
  });
});



server.route({
  method: 'GET',
  path: '/{param*}',
  handler: {
    directory: {
      path: '.',
      redirectToSlash: true,
      index: true
    }
  }
});

// Add the route
server.route({
  method: 'GET',
  path: '/hello',
  handler: function(request, reply) {

    reply.view('index');
  }
});

// Start the server
server.start((err) => {

  if (err) {
    throw err;
  }
  console.log('Server running at:', server.info.uri);
});
