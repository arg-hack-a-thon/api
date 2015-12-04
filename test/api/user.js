import Lab from 'lab';
import Code from 'code';
import async from 'async';
import composeServerAndDB from '../_helpers/composeServerAndDB';

const {expect} = Code
const lab = exports.lab = Lab.script();

lab.experiment("User", () => {

  let server;

  let newUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@doe.com',
        password: 'ThisIsJustATest14344'
      }
    , existingUser
    , loggedInUser;

  lab.before(done => {
    // Compose and sync DB
    require('../_helpers/composeServerAndDB')()
      .then(composedServer => {
        server = composedServer;
        return server;
      })
      .asCallback(done);
  });

  lab.test("Should be able to CREATE a NEW USER", done => {
    var options = {
      method: "POST",
      url: "/user",
      payload: newUser
    };

    server.inject(options, response => {
      var payload = JSON.parse(response.payload);

      expect(response.statusCode).to.equal(200);
      expect(payload.password).to.not.exist();
      expect(payload.firstName).to.exist();
      expect(payload.lastName).to.exist();
      expect(payload.email).to.exist();

      existingUser = payload;

      done();
    });
  });

  lab.test("Should FAIL CREATION of a user with the same email as existing user", done => {
    var options = {
      method: "POST",
      url: "/user",
      payload: newUser
    };

    server.inject(options, response => {
      var payload = JSON.parse(response.payload);

      expect(response.statusCode).to.equal(400);
      expect(payload.errors).to.exist();
      expect(payload.errors).to.deep.include([{ path: 'email' }])

      done();
    });
  });

  // lab.test('Should be able to UPDATE existing user', function(done) {
  //
  //   async.waterfall([
  //     // Login the user
  //     function(next) {
  //       var loginReq = {
  //         method: "POST",
  //         url: "/auth/login",
  //         payload: {
  //           email: existingUser.email,
  //           password: newUser.password
  //         }
  //       }
  //
  //       server.inject(loginReq, function(response) {
  //         var payload = JSON.parse(response.payload);
  //
  //         expect(response.statusCode).to.equal(200);
  //         expect(payload.token).to.exist();
  //
  //         next(null, payload);
  //       })
  //     },
  //     // Update user
  //     function(payload, next) {
  //       var updateReq = {
  //         method: "PATCH",
  //         url: "/users/me",
  //         headers: {
  //           Authorization: payload.token
  //         },
  //         payload: {
  //           firstName: "Love",
  //           lastName: "Lamp",
  //           email: "newemail@email.com",
  //         }
  //       }
  //
  //       server.inject(updateReq, function(response) {
  //         var payload = JSON.parse(response.payload);
  //
  //         expect(response.statusCode).to.equal(200);
  //         expect(payload.first_name).to.equal(updateReq.payload.first_name);
  //         expect(payload.last_name).to.equal(updateReq.payload.last_name);
  //         expect(payload.email).to.equal(updateReq.payload.email);
  //         expect(payload.password).to.not.exist();
  //         expect(payload.birthday).to.equal(updateReq.payload.birthday);
  //         expect(payload.gender).to.equal(updateReq.payload.gender);
  //
  //         existingUser = payload;
  //
  //         next(null);
  //       });
  //
  //     }
  //   ], function(err) {
  //     done(err);
  //   });
  //
  //   lab.test('Should FAIL UPDATE if user tries to change email to one that is used by another user', function(done) {
  //
  //     async.waterfall([
  //       // Create new user
  //       function(next) {
  //         var createUser = {
  //           method: "POST",
  //           url: "/users",
  //           payload: {
  //             first_name: "Second",
  //             last_name: "User",
  //             email: "blah@whammy.com",
  //             password: "hamsandwitch"
  //           }
  //         }
  //         server.inject(createUser, function(response) {
  //           var payload = JSON.parse(response.payload);
  //
  //           expect(response.statusCode).to.equal(200);
  //           expect(payload.password).to.not.exist();
  //           expect(payload.first_name).to.be.string();
  //           expect(payload.last_name).to.string();
  //           expect(payload.email).to.string();
  //
  //           next(null, payload);
  //
  //         });
  //       },
  //       // Login user
  //       function(createdUser, next) {
  //         var loginReq = {
  //           method: "POST",
  //           url: "/auth/login",
  //           payload: {
  //             email: createdUser.email,
  //             password: "hamsandwitch"
  //           }
  //         }
  //
  //         server.inject(loginReq, function(response) {
  //           var payload = JSON.parse(response.payload);
  //
  //           expect(response.statusCode).to.equal(200);
  //           expect(payload.token).to.be.string();
  //
  //           loggedInUser = payload;
  //
  //           next(null, payload);
  //         })
  //       },
  //       // Update user
  //       function(loggedInUser, next) {
  //         var updateUser = {
  //           method: "PATCH",
  //           url: "/users/me",
  //           headers: {
  //             Authorization: loggedInUser.token
  //           },
  //           payload: {
  //             email: "newemail@email.com",
  //           }
  //         }
  //         server.inject(updateUser, function(response) {
  //           var payload = JSON.parse(response.payload);
  //
  //           expect(payload.errors).to.exist();
  //           expect(payload.errors).to.deep.include([{ path: 'email' }])
  //
  //           next(null, payload);
  //
  //         });
  //       }
  //     ], function(err) {
  //       done(err);
  //     });
  //
  //   });
  //
  // });
  //
  // lab.test("Should RETURN the current user's login details", function(done) {
  //
  //   async.waterfall([
  //     // Login the user
  //     function(next) {
  //       var loginReq = {
  //         method: "POST",
  //         url: "/auth/login",
  //         payload: {
  //           email: existingUser.email,
  //           password: newUser.password
  //         }
  //       }
  //
  //       server.inject(loginReq, function(response) {
  //         var payload = JSON.parse(response.payload);
  //
  //         expect(response.statusCode).to.equal(200);
  //         expect(payload.token).to.exist();
  //
  //         next(null, payload);
  //       })
  //     },
  //     // fetch the user
  //     function(payload, next) {
  //       var updateReq = {
  //         method: "GET",
  //         url: "/users/me",
  //         headers: {
  //           Authorization: payload.token
  //         }
  //       }
  //
  //       server.inject(updateReq, function(response) {
  //         var payload = JSON.parse(response.payload);
  //
  //         expect(response.statusCode).to.equal(200);
  //         expect(payload.first_name).to.exist();
  //         expect(payload.last_name).to.exist();
  //         expect(payload.email).to.exist();
  //         expect(payload.password).to.not.exist();
  //         expect(payload.birthday).to.exist();
  //         expect(payload.gender).to.exist();
  //
  //         next(null);
  //       });
  //
  //     }
  //   ], function(err) {
  //     done(err);
  //   });
  //
  // });

});
