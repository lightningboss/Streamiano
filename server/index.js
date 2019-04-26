const express = require('express');
const { Server } = require('http');
const socketIO = require('socket.io');

const app = express();
const http = Server(app);
const io = socketIO(http);

const clients = [];

io.on('connection', function(socket){
  socket.on('audiodata', function(blob) {
      if (clients.length > 0){
        for (client in clients){
            clients[client].write(blob);
        };
    }
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

app.get('/stream', (req, res) => {
    res.writeHead(200,{
        "Content-Type": "audio/wav",
        'Transfer-Encoding': 'chunked'
    });
    // Add the response to the clients array to receive streaming
    clients.push(res);
    console.log('Client connected; streaming');
})
