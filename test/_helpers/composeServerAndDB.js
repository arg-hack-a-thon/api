import Composer from '../../server/composer';
import Promise from 'bluebird';

module.exports = () => {
  // Promisify our Server Composer
  const ComposerAsync = Promise.promisify(Composer);

  // Compose the server
  return ComposerAsync()
    // Then sync DB
    .then(function syncDB(composedServer) {
      // console.log(composedServer.plugins);
      var db = composedServer.plugins['sequelize'].db;
      // After our DB syncs, return the composed server
      return db.sequelize.sync({force: true}).return(composedServer);
    })
}
