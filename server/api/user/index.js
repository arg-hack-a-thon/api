'use strict';

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
      cors: true,
      validate: {
        payload: {
          firstName: Joi.string().required(),
          lastName: Joi.string().required(),
          email: Joi.string().email().required(),
          password: Joi.string().required(),
        }
      },
      plugins: {
        'hapi-swagger': {
          'responseMessages': [
            { 'code': 400, 'message': 'Validation error' },
            { 'code': 500, 'message': 'Internal Server Error'}
          ]
        }
      },
      handler: (request, reply) => {
        const { User } = request.models;
        const { convertValidationErrors } = request.server.plugins.common;

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
          .catch(Sequelize.ValidationError, convertValidationErrors)
          .asCallback(reply);

      }
    }
  });

  server.route({
    method: 'GET',
    path: '/user/me',
    config: {
      tags: ['api', 'user'],
      description: 'Gets a users info',
      notes: "Returns the authenticated user's details",
      cors: true,
      validate: {
        headers: Joi.object({
         'authorization': Joi.string().required()
        }).unknown(),
      },
      plugins: {
        'hapi-swagger': {
          'responseMessages': [
            { 'code': 500, 'message': 'Internal Server Error'}
          ]
        }
      },
      handler: (request, reply) => {
        const authdUser = request.auth.credentials;
        reply(authdUser.sanitizeForResponse());
      }
    }
  });

  server.route({
    method: 'PUT',
    path: '/user/{id}',
    config: {
      tags: ['api', 'user'],
      description: 'Updates a user',
      notes: 'Takes a set of optional user details and returns the updated user record (cannot be used to update password)',
      cors: true,
      validate: {
        headers: Joi.object({
         'authorization': Joi.string().required()
        }).unknown(),
        params: {
          id: Joi.number().integer().required()
        },
        payload: {
          firstName: Joi.string(),
          lastName: Joi.string(),
          email: Joi.string().email(),
        }
      },
      plugins: {
        'hapi-swagger': {
          'responseMessages': [
            { 'code': 400, 'message': 'Validation error' },
            { 'code': 500, 'message': 'Internal Server Error'}
          ]
        }
      },
      handler: (request, reply) => {
        const { User } = request.models;
        const { convertValidationErrors } = request.server.plugins.common;
        const authdUser = request.auth.credentials;
        const { payload } = request;

        if (request.params.id !== authdUser.id) {
          return reply(Boom.unauthorized('Cannot update a different user'));
        }

        authdUser.update({...payload}, {fields: ['firstName', 'lastName', 'email']})
          .then(updatedUser => {
            return updatedUser.sanitizeForResponse();
          })
          .catch(Sequelize.ValidationError, convertValidationErrors)
          .asCallback(reply)

      }
    }
  });

  next();
}

exports.register.attributes = {
  name: 'user',
}
