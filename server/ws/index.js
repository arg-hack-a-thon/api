'use strict';

import SocketIo from 'socket.io';
import Http from 'http';
import request from 'request';

exports.register = (server, options, next) => {

  var io = SocketIo(server.select('socket').listener);

  io.set('origins', '*:*');

  io.on('connection', function (socket) {
    console.log('a user connected');

    socket.on('disconnect', function () {
      console.log('user disconnected');
    });
  });

  (function fetch () {
    // console.log('Getting image from webcam');

    request({
      url: 'http://10.0.1.30/snapshot.cgi',
      method: 'GET',
      encoding: null
    }, (error, response, body) => {
      if (error) {
        setTimeout(fetch, 100);
        return console.log(error);
      }

      if (response.statusCode == 200) {
        const base64Data = body.toString('base64');
        const contentType = response.headers["content-type"];
        const imageData = `data:${contentType};base64,${base64Data}`;

        io.sockets.emit('image', imageData);

        setTimeout(fetch, 100);
      }
    })
  })();

  next();
}

exports.register.attributes = {
  name: 'ws',
}
