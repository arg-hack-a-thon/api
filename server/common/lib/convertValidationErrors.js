'use strict';

import Boom from 'boom';
import _ from 'lodash';

export default (err) => {
  var httpErr = Boom.badRequest('There was a validation error saving your request');
  httpErr.output.payload.errors = _.map(err.errors, (e) => {
    return _.pick(e, ['message', 'path']);
  });
  throw httpErr;
}
