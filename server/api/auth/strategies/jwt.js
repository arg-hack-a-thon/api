'use strict';

export default (decoded, request, callback) => {
  var User = request.models.User;

  if (decoded.id) {
    User.findById(decoded.id)
      .then((user) => {
        if (user) {
          return [true, user];
        } else {
          return [false];
        }
      })
      .asCallback(callback, {spread: true});
  } else {
    return callback(null, false);
  }
}
