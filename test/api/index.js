import Joi from 'joi';
import Sequelize from 'sequelize';

exports.register = (server, options, next) => {
  server.route({
    method: 'POST',
    path: '/user',
    config: {
      tags: ['api', 'user'],
      description: 'Creates a new user',
      notes: 'Takes a new users information and returns the user info',
      auth: false,
      validate: {
        payload: {
          firstName: Joi.string().required(),
          lastName: Joi.string().required(),
          email: Joi.string().email().required(),
          password: Joi.string().required(),
        }
      },
      handler: (request, reply) => {
        const {User} = request.models;
        const {common} = request.server.plugins;

        const u = User.build({
          firstName: request.payload.firstName,
          lastName: request.payload.lastName,
          email: request.payload.email,
          password: request.payload.password
        });

        u.save()
          .then(savedUser => {
            return savedUser.sanitizeForResponse();
          })
          .catch(Sequelize.ValidationError, common.convertValidationErrors)
          .asCallback(reply);

      }
    }
  });

  // server.route({
  //   method: 'PUT',
  //   path: '/user/{id}',
  //   config: {
  //     tags: ['api', 'user'],
  //     description: 'Updates a user',
  //     notes: 'Takes a set of optional user details and returns the updated user record (cannot be used to update password)',
  //     validate: {
  //       payload: {
  //         firstName: Joi.string(),
  //         lastName: Joi.string(),
  //         email: Joi.string().email(),
  //       }
  //     },
  //     handler: (request, reply) => {
  //       const {User} = request.models;
  //       const {common} = request.server.plugins;
  //
  //       User.findById(request.params.id)
  //         .then(foundUser => {
  //           if (!foundUser) throw Boom.notFound('User was not found');
  //
  //         })
  //
  //       // u.save()
  //       //   .then(savedUser => {
  //       //     return savedUser.sanitizeForResponse();
  //       //   })
  //       //   .catch(Sequelize.ValidationError, common.convertValidationErrors)
  //       //   .catch(Promise.OperationalError, common.processOperationalErrors)
  //       //   .asCallback(reply);
  //
  //     }
  //   }
  // });

  next();
}

exports.register.attributes = {
  name: 'user',
}
