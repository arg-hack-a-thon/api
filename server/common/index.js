'use strict';

exports.register = (server, options, next) => {

  // Expose some shared functions for use throughout the server
  server.expose({
    convertValidationErrors: require('./lib/convertValidationErrors'),
    processOperationalErrors: require('./lib/processOperationalErrors')(server),
    streamFileToS3: require('./lib/streamFileToS3')
  })

  // Make the Sequelize models easily accessible from the request object
  server.ext('onPreAuth', (modelCollections) => {
    return (request, reply) => {
        request.models = modelCollections;
        reply.continue();
    }
  }(server.plugins['sequelize'].db.sequelize.models));

  next();

}

exports.register.attributes = {
  name: 'common',
  version: '1.0.0'
}
