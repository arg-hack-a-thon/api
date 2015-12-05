'use strict';

import Hoek from 'hoek';
import Redis from 'ioredis';

/**
 * Creates database connection, imports models, and exposes them via the db object
 * @param plugin
 * @param options
 * @param next
 */
exports.register = (plugin, options, next) => {

  const redis = new Redis(options);

  plugin.expose('redis', redis);

  next();

};

exports.register.attributes = {
  name: 'redis',
};
