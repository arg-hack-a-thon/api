'use strict';

export default (server) => {
  return (err) => {
    server.log(['server', 'error'], err.stack);
    throw err;
  }
}
