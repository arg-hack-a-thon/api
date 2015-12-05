'use strict';

import Joi from 'joi';
import Modbus from 'jsmodbus';
import Boom from 'boom';
import AppConfig from '../../config';

exports.register = (server, options, next) => {

  const api = server.select('api');

  api.route({
    method: 'POST',
    path: '/door/open',
    config: {
      tags: ['api', 'door', 'open'],
      description: 'Makes the door open magically',
      notes: 'Takes auth info, and if everything\'s okay, it opens the door (with magic).',
      cors: true,
      validate: {
        headers: Joi.object({
          'authorization': Joi.string().required()
        }).unknown(),
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
        // Get the config options
        const config = AppConfig.get('/plc');

        // Initialize the Modbus TCP client
        const client = Modbus.createTCPClient(
          config.doorPort,
          config.doorIP,
          function( err ) {
            // If there's an error, handle it
            if ( err ) {
              return reply(Boom.badImplementation({ message: "Error creating TCP Modbus client", data: err }));
            }
          }
        );

        // Write to M1 (2049) and set it to true
        client.writeSingleCoil( config.doorCoil, true, function( resp, err ) {
          if ( err ) {
            return reply(Boom.badImplementation({ message: "Error writing to door coil", data: err }));
          }

          reply({message: "Door should have opened successfully"});
        })

        // reply({test: "WHAMMMMY"});

        // This is how you should read a coil:
        // client.readCoils( request.payload.address, request.payload.range, function( resp, err ) {
        //   // TODO: Return different BOOMS! depending on the type of error
        //   if ( err ) {
        //     throw Boom.badImplementation({ message: "Error reading coils", data: err });
        //   }
        //   reply({ message:"Probable success", data:resp });
        // });
      }
    }
  });

  next();
}

exports.register.attributes = {
  name: 'door',
}
