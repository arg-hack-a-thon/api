'use strict';

import Ping from 'net-ping';
import AppConfig from '../config';
import Modbus from 'jsmodbus';
import Boom from 'boom';
import Redis from 'ioredis';

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
  var heartbeat = function() {
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
    setTimeout(function(){
      heartbeat();
    }, 1000);
  }
  // Start the loop
  heartbeat();


  // PLC Status function
  var status = function() {
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
    setTimeout(function(){
      status();
    }, 500);
  }
  // Start the loop
  status();


  next();

}

exports.register.attributes = {
  name: 'workers',
}
