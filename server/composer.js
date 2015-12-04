'use strict';

import Glue from 'glue';
import Manifest from './manifest';

const composeOptions = {
  relativeTo: __dirname
};

const Composer = Glue.compose.bind(Glue, Manifest.get('/'), composeOptions);

if (process.env.NODE_ENV != 'test') {
  Composer((err, server) => {
    if (err) throw err;
    server.start(() => {
      server.log(['server', 'info'], 'Server started at ' + server.info.uri);
    });
  })
}

export default Composer;
