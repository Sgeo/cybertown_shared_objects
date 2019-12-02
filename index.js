const express = require('express');

const app = express();

const http = require('http').createServer(app);

const io = require('socket.io')(http);


app.use(express.static("public"));



app.get('/', (req, res) => {
  res.send('Hello Express app!')
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on("SE", function(msg) {
    console.log(msg);
    io.emit("SE", msg);
  });
  socket.on("AV", function(msg) {
    msg.id = socket.id;
    msg.wrl = "/avatars/default.wrl";
    console.log(msg);
    socket.broadcast.emit("AV", msg);
  });
});


http.listen(3000);