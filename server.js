const express = require('express');

const app = express();

const http = require('http').createServer(app);

const io = require('socket.io')(http);


app.use(express.static("public"));



app.get('/', (req, res) => {
  res.send('Hello Express app!')
});

let AVATARS = new Map();

io.on('connection', function(socket){
  console.log('a user connected');
  AVATARS.set(socket.id, {translation: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 1, z: 0, angle: 0}});
  for(let [id, av] of AVATARS) {
    console.log("Preexisting:", [id, av]);
    socket.emit("AV", {id: id, wrl: "/avatars/default.wrl", translation: av.translation, rotation: av.rotation});
  }
  socket.on("SE", function(msg) {
    console.log(msg);
    io.emit("SE", msg);
  });
  socket.on("AV", function(msg) {
    msg.id = socket.id;
    msg.wrl = "/avatars/default.wrl";
    console.log(msg);
    socket.broadcast.emit("AV", msg);
    if(AVATARS.get(socket.id)) {
      if(msg.translation) {
        AVATARS.get(socket.id).translation = msg.translation;
      }
      if(msg.rotation) {
        AVATARS.get(socket.id).rotation = msg.rotation;
      }
    }
  });
});


http.listen(process.env.PORT || 8000);