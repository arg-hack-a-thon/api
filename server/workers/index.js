'use strict';

import Ping from 'net-ping';
import AppConfig from '../config';
import Modbus from 'jsmodbus';
import Boom from 'boom';
import Redis from 'ioredis';
import request from 'request';

exports.register = (server, options, next) => {

  // Get the config options
  const config = AppConfig.get('/plc');
  const redisConfig = AppConfig.get('/redis');

  // Initialize the Modbus TCP client
  const client = Modbus.createTCPClient(
    config.doorPort,
    config.doorIP,
    function( err ) {
      // If there's an error, handle it
      if ( err ) {
        console.log( "Error creating TCP Modbus client" );
        console.log( err );
      }
    }
  );

  // Initialize net-ping instance/session
  const session = Ping.createSession();

  // Initialize Redis connection
  const pubRedis = new Redis( redisConfig );

  // PLC Heartbeat function
  (function heartbeat() {
    // Do ping
    session.pingHost( config.doorIP, function( error, target ) {
      // If there's an error, then the PLC is offline
      if (error) {
        pubRedis.publish( 'heartbeat', 0 );
      } else {
        // Else everything's alright
        pubRedis.publish( 'heartbeat', 1 );
      }
    });
    // Call ourselves again
    setTimeout(heartbeat, 1000);
  })();


  // PLC Status function
  (function status() {
    // Read the coils status ( Open door, Door opening )
    client.readCoils( config.doorCoil, 8, function( resp, err ) {
      // TODO: Maybe check the kind of error
      if ( err ) {
        console.log( "Error reading coils" );
        console.log( err );
      }
      // Publish the status to redis
      pubRedis.publish( 'status', resp );
    });
    // Call ourselves again
    setTimeout(status, 500);
  })();

  (function fetch () {
    // console.log('Getting image from webcam');

    request({
      url: 'http://10.0.1.30/snapshot.cgi',
      method: 'GET',
      encoding: null
    }, (error, response, body) => {

      if (!error && response.statusCode == 200) {
        const base64Data = body.toString('base64');
        const contentType = response.headers["content-type"];
        const imageData = `data:${contentType};base64,${base64Data}`;

        pubRedis.publish( 'image', imageData );
        // io.sockets.emit('image', imageData);
      }

      setTimeout(fetch, 100);
    })
  })();


  next();

}

exports.register.attributes = {
  name: 'workers',
}
