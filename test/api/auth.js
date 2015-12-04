var Lab         = require("lab");
var Code        = require('code');
var AppConfig   = require('../../server/config');
var jwt         = require('jsonwebtoken');
var expect      = Code.expect;
var lab         = exports.lab = Lab.script();

var user = {
  firstName: 'Tester',
  lastName: 'McGee',
  email: 'testy@mcgee.com',
  password: 'ilovetotestthings'
}

lab.experiment("Auth", function() {

  var server;

  lab.before(function(done) {
    // Compose and sync DB
    require('../_helpers/composeServerAndDB')()
      .then(function(composedServer) {
        server = composedServer;
        return server;
      })
      .asCallback(done);
  });

  lab.test('should be able to create a authenticatable user', function(done) {
    var request = {
      method: "POST",
      url: "/user",
      payload: user
    }

    server.inject(request, function(response) {
      var payload = JSON.parse(response.payload);

      expect(response.statusCode).to.equal(200);
      expect(payload.password).to.not.exist();
      expect(payload.firstName).to.exist();
      expect(payload.lastName).to.exist();
      expect(payload.email).to.exist();

      done();
    })
  });

  lab.test('should be able to login as that user', function(done) {
    var request = {
      method: "POST",
      url: "/auth",
      payload: {
        email: user.email,
        password: user.password
      }
    }

    server.inject(request, function(response) {
      var payload = JSON.parse(response.payload);

      expect(response.statusCode).to.equal(200);
      expect(payload.id).to.exist();
      expect(payload.password).to.not.exist();
      expect(payload.firstName).to.exist();
      expect(payload.lastName).to.exist();
      expect(payload.email).to.exist();
      expect(payload.token).to.exist();

      var decodedToken = jwt.verify(payload.token, AppConfig.get('/security/jwtSecret'));

      expect(decodedToken.id).to.equal(payload.id);

      done();
    })
  });

  lab.test('should fail if no user can be found', function(done) {
    var request = {
      method: "POST",
      url: "/auth",
      payload: {
        email: "nonexistant@user.com",
        password: "doesntmatter"
      }
    }

    server.inject(request, function(response) {
      var payload = JSON.parse(response.payload);

      expect(response.statusCode).to.equal(401);
      expect(payload.message).to.equal('invalid login credentials');

      done();
    })
  });

  lab.test('should fail if wrong password used', function(done) {
    var request = {
      method: "POST",
      url: "/auth",
      payload: {
        email: user.email,
        password: "doesntmatter"
      }
    }

    server.inject(request, function(response) {
      var payload = JSON.parse(response.payload);

      expect(response.statusCode).to.equal(401);
      expect(payload.message).to.equal('invalid login credentials');

      done();
    })
  });

});
