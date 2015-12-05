'use strict';

import SocketIo from 'socket.io';
import Http from 'http';
import AppConfig from '../config';
import Redis from 'ioredis';

exports.register = (server, options, next) => {

  const subRedis = server.plugins.redis.client;
  const io = SocketIo(server.select('socket').listener);

  io.set('origins', '*:*');

  io.on('connection', function (socket) {
    console.log('a user connected');

    socket.on('disconnect', function () {
      console.log('user disconnected');
    });
  });

  // Subscribe to heartbeat and status channels
  subRedis.subscribe('heartbeat', 'status', 'image', function( err, count ){
    // Handle any errors
    if ( err ) {
      console.log( "Error trying to subscribe to redis events" );
      console.log( err );
    }
  });

  // Now monitor the channels we've subscribed to
  subRedis.on('message', function (channel, message) {
    // Simply broadcast the channel and message used, as the messages and
    // channels will have the same names/data used on the FE as in the BE
    io.sockets.emit(channel, message);
  });

  next();
}

exports.register.attributes = {
  name: 'websocket',
}
