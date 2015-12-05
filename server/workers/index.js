'use strict';

import Ping from 'net-ping';
import AppConfig from '../config';
import Modbus from 'jsmodbus';
import Boom from 'boom';

exports.register = (server, options, next) => {

  // Get the config options
  const config = AppConfig.get('/plc');


  // Initialize the Modbus TCP client
  const client = Modbus.createTCPClient(
    config.doorPort,
    config.doorIP,
    function( err ) {
      // If there's an error, handle it
      if ( err ) {
        throw Boom.badImplementation({ message: "Error creating TCP Modbus client", data: err });
      }
    }
  );


  // Initialize net-ping instance/session
  const session = Ping.createSession();


  // PLC Heartbeat function
  var heartbeat = function() {
    // Do ping
    session.pingHost( config.doorIP, function( error, target ) {
      // If there's an error, then the PLC is offline
      if (error)
        console.log (target + " : " + error.toString());
      else {
        // Else everything's alright
        console.log (target + " : HEARTBEAT");
      }
    });
    // Call ourselves again
    setTimeout(function(){
      heartbeat();
    }, 100);
  }
  // Start the loop
  heartbeat();


  // PLC Status function
  var status = function() {
    // Read the coils status ( Open door, Door opening )
    client.readCoils( config.doorCoil, 8, function( resp, err ) {
      // TODO: Return different BOOMS! depending on the type of error
      if ( err ) {
        throw Boom.badImplementation({ message: "Error reading coils", data: err });
      }
      // TODO: Replace this with socket magic
      console.log( resp );
    });
    // Call ourselves again
    setTimeout(function(){
      status();
    }, 500);
  }
  // Start the loop
  status();

}

exports.register.attributes = {
  name: 'workers',
}
