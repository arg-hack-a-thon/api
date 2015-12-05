'use strict';

import SocketIo from 'socket.io';
import Http from 'http';
import AppConfig from '../config';
import Redis from 'ioredis';

exports.register = (server, options, next) => {
  
  var io = SocketIo(server.select('socket').listener);

  io.set('origins', '*:*');

  // Initialize Redis connection
  const redisConfig = AppConfig.get('/redis');
  const subRedis = new Redis( redisConfig );
  // Subscribe to heartbeat and status channels
  subRedis.subscribe('heartbeat', 'status', function( err, count ){
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

  io.on('connection', function (socket) {
    console.log('a user connected');

    socket.on('disconnect', function () {
      console.log('user disconnected');
    });

    (function fetch () {
      console.log('Getting image from webcam');

        Http.get({
            host: '10.0.1.30',
            path: '/snapshot.cgi'
        }, function (res) {
            console.log('Webcam returned a response.');
            var data = '';

            res.setEncoding('binary');
            res.on('data', function (chunk) {
                data += chunk;
            });

            res.on('end', function () {
                console.log('No more data, sending through the socket...');
                var encoded = new Buffer(data).toString('base64');
                console.log(encoded.substring(0, 40) + '...' + encoded.substring(encoded.length, encoded.length - 40));
                socket.emit('image', encoded);
                console.log('Done.');
            });

            setTimeout(fetch, 1000);

            return;
        });

    })();

    return;
  });

  next();
}

exports.register.attributes = {
  name: 'ws',
}
