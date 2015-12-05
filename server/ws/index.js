'use strict';

import SocketIo from 'socket.io';
import Http from 'http';
import axios from 'axios';

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

      axios.get('http://10.0.1.30/snapshot.cgi',{
        responseType: 'blob'
      })
      .then(response => {
        console.log(response.data)
      })

      /*
      Http.get({
          host: '10.0.1.30',
          path: '/snapshot.cgi'
      }, function (res) {
          console.log('Webcam returned a response.');
          var data = [];
          var totalLength = 0;

//console.log(res);
          res.setEncoding('binary');
          res.on('data', function (chunk) {
              console.log('chunk', chunk);
              data.push( chunk );
              totalLength += chunk.length;
              //data += chunk.toString('base64');
          });

          res.on('end', function () {
              console.log('No more data, sending through the socket...');
              // var encoded = new Buffer(data).toString('base64');
              var bufA = Buffer.concat(data);
              var encoded = bufA.toString('base64');
              console.log(encoded.substring(0, 40) + '...' + encoded.substring(encoded.length, encoded.length - 40));
              socket.emit('image', encoded);
              console.log('Done.');
          });

          //setTimeout(fetch, 1000);

          return;
      });
      */

    })();

    return;
  });

  next();
}

exports.register.attributes = {
  name: 'ws',
}