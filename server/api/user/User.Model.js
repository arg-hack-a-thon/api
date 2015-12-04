'use strict';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Promise from 'bluebird';
import AppConfig from '../../config';

Promise.promisifyAll(bcrypt);

export default (sequelize, DataTypes) => {

  var User = sequelize.define(
    // Model Name
    'User',

    // Define Schema
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        validate: {
          isUnique: isEmailUnique
        }
      },
      password: DataTypes.STRING,
    },

    // Model Extensions
    {
      instanceMethods: {
        sanitizeForResponse: sanitizeForResponse,
        generateToken: generateToken,
        comparePassword: comparePassword,
        updatePassword: updatePassword
      }
    }
  );

  // Hooks
  User.addHook('beforeCreate', 'hashPassword', hashPasswordHook);

  return User;

};

// Validation Functions

function isEmailUnique(value, next) {
  var User = this.Model;

  User.findAndCountAll( { where: { email: value } } ).then(function(response) {
    if (response.count > 0) {
      next(new Error('A User with same email already exists'));
    } else {
      next()
    }
  });
}

// Instance Methods

function sanitizeForResponse() {
  var data = this.get();

  delete data.password;
  delete data.createdAt;
  delete data.updatedAt;
  delete data.deletedAt;

  return data;
}

function generateToken() {
  return jwt.sign(this.get(), AppConfig.get('/security/jwtSecret'));
}

function comparePassword(cadidatePassword) {
  return bcrypt.compareAsync(cadidatePassword, this.password);
}

function updatePassword(unhashedPassword) {
  return hashPassword(unhashedPassword).then(function(hashedPassword) {
    return hashedPassword;
  });
}

// Hook Handlers

function hashPasswordHook(user) {
  return hashPassword(user.password).then(hashedPassword => {
    user.password = hashedPassword;
  });
}

// Private Methods

function hashPassword(unhashedPassword) {
  return bcrypt.genSaltAsync(AppConfig.get('/security/saltWorkFactor')).then(function(salt) {
    return bcrypt.hashAsync(unhashedPassword, salt);
  });
}
