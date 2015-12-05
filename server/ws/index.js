'use strict';

import SocketIo from 'socket.io';
import Http from 'http';

exports.register = (server, options, next) => {
  
  var io = SocketIo(server.select('socket').listener);

  io.set('origins', '*:*');

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