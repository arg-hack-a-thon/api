'use strict';

import Confidence from 'confidence';
import AppConfig from './config';

const criteria = {
  env: process.env.NODE_ENV
};


const manifest = {
  $meta: 'Our main server manifest',
  server: AppConfig.get('/server'),
  connections: [{
    host: AppConfig.get('/connection/host'),
    port: AppConfig.get('/connection/port')
  }],
  plugins: {
    'inert': {},
    'vision': {},
    'good': AppConfig.get('/logging'),
    'hapi-auth-jwt2': {},
    './sequelize': AppConfig.get('/db/sequelize'),
    './common': {},
    './api/auth': {},
    './api/user': {},
    'hapi-swagger': AppConfig.get('/api/swagger')
  }
};


const store = new Confidence.Store(manifest);


export default {
  get(key) {
    return store.get(key, criteria);
  },
  meta(key) {
    return store.meta(key, criteria);
  }
}