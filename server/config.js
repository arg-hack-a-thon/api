'use strict';

import Confidence from 'confidence';
import path from 'path';

const criteria = {
    env: process.env.NODE_ENV
};

const config = {

  $meta: 'Our main Application config',

  pkg: require('../package.json'),

  server : {
    debug: {
      $filter: 'env',
      production: false,
      test: false,
      $default: {
        request: ['error']
      }
    }
  },

  connection : {
    port : '8010',
    host : '0.0.0.0'
  },

  api: {
    swagger: {
      info: {
        title: 'API',
        description: 'The official API',
      },
      basepath: 'http://docker.local:8010',
      apiVersion: require('../package.json').version,
      authorizations: {
        jwt: {
          type: 'apiKey',
          passAs: 'header',
          keyname: 'Authorization'
        }
      }
    }
  },

  security: {
    saltWorkFactor: 10,
    jwtSecret: 'QVVDeFjx7BVwcEQ87i$3B{x'
  },

  logging : {
    opsInterval: 1000,
    reporters: {
      $filter: 'env',
      test: [],
      $default: [{
        reporter: require('good-console'),
        events: { log: '*', response: '*' }
      }]
    }
  },

  aws: {
    accessKeyId: '',
    secretAccessKey: '',
    region: 'us-west-2'
  },

  media: {
    bucket: '',
    prefix: ''
  },

  db: {
    sequelize: {
      name: process.env.DB_NAME,
      user: process.env.DB_USER,
      pass: process.env.DB_PASS,
      port: 5432,
      host: process.env.DB_HOST,
      dialect: 'postgres',
      logging: {
        $filter: 'env',
        test: false,
        $default: console.log
      },
      models: 'server/**/*.Model.js',
      sequelize: {
        define: {
          paranoid: true // Data should never be deleted, only flagged as deleted
        }
      }
    }
  }

}

const store = new Confidence.Store(config);

export default {
  get(key) {
    return store.get(key, criteria);
  },
  meta(key) {
    return store.meta(key, criteria);
  }
}
