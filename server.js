const express = require('express');

const app = express();

const http = require('http').createServer(app);

const io = require('socket.io')(http);


app.use(express.static("public"));



app.get('/', (req, res) => {
  res.send('Hello Express app!')
});

let AVATARS = new Map();

io.on('connection', async function(socket){
  console.log('a user connected');
  AVATARS.set(socket, {translation: {x: 0, y: 0, z: 0}, rotation: {x: 0, y: 1, z: 0, angle: 0}});
  socket.on("AV", function(msg) {
    msg.id = socket.id;
    msg.wrl = "/avatars/default.wrl";
    console.log(msg);
    console.log(AVATARS.get(socket).room);
    if(AVATARS.get(socket) && AVATARS.get(socket).room) {
      socket.to(AVATARS.get(socket).room).emit("AV", msg);
    }
    if(AVATARS.get(socket)) {
      if(msg.translation) {
        AVATARS.get(socket).translation = msg.translation;
      }
      if(msg.rotation) {
        AVATARS.get(socket).rotation = msg.rotation;
      }
    }
  });
  let initDetail;
  try {
    initDetail = await new Promise((resolve, reject) => { socket.on("JOIN", resolve); setTimeout(() => reject("Timed out waiting for JOIN"), 10000); });
  } catch(e) {
    console.error(e);
    return;
  }
  for(let [other_socket, av] of AVATARS) {
    if(AVATARS.get(other_socket).room === initDetail.room) {
      console.log("Preexisting:", [other_socket.id, av]);
      socket.emit("AV", {id: other_socket.id, wrl: "/avatars/default.wrl", translation: av.translation, rotation: av.rotation});
      other_socket.emit("AV", {id: socket.id, wrl: "/avatars/default.wrl", translation: AVATARS.get(socket).translation, rotation: AVATARS.get(socket).rotation});
      console.log("Telling other user that new avatar is", {id: socket.id, wrl: "/avatars/default.wrl", translation: AVATARS.get(socket).translation, rotation: AVATARS.get(socket).rotation});
    }
  }
  console.log(AVATARS);
  AVATARS.get(socket).avatar = initDetail.avatar;
  AVATARS.get(socket).room = initDetail.room;
  socket.join(initDetail.room);
  socket.on("SE", function(msg) {
    console.log(msg);
    io.to(AVATARS.get(socket).room).emit("SE", msg);
  });
  socket.on("disconnect", function() {
    io.to(AVATARS.get(socket).room).emit("AV:del", socket.id);
    AVATARS.delete(socket);
  });
});


http.listen(process.env.PORT || 8000);