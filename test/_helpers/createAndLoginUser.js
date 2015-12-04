import async from 'async';
import Promise from 'bluebird';

module.exports = function(server) {

  return new Promise((resolve, reject) => {
    let user;

    async.waterfall([
        // Create User
        (next) => {
          const newUserReq = {
            method: "POST",
            url: "/user",
            payload: {
              firstName: 'Adam',
              lastName: 'Test',
              email: 'adam@duromedia.com',
              password: 'whammmmy'
            }
          };
          server.inject(newUserReq, (response) => {
            user = JSON.parse(response.payload);
            next(null, user);
          });
        },
        // Login User
        (user, next) => {
          const loginReq = {
            method: "POST",
            url: "/auth",
            payload: {
              email: user.email,
              password: 'whammmmy'
            }
          }
          server.inject(loginReq, (response) => {
            const payload = JSON.parse(response.payload);
            next(null, payload);
          });
        }
      ],
      (err, payload) => {
        if (err) return reject(err);
        resolve(payload);
      }
    );
  })

}
