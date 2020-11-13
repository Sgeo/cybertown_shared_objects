const express = require('express');

const app = express();

const http = require('http').createServer(app);

const https = require('https');

const io = require('socket.io')(http);

const path = require('path');

function webhook_message(from, message) {
  if(!process.env.CHAT_WEBHOOK_URL) return;
  let embed = {
    author: {name: from},
    description: message
  };
  let body = JSON.stringify({
    embeds: [embed]
  });
  let req = https.request(process.env.CHAT_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(body)
    }
  });
  req.write(body);
  req.end();
}


app.use(express.static("public"));





let AVATARS = new Map();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.htm"));
});

app.get('/population', (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  let population = {};
  for(let avatar of AVATARS.values()) {
    if(avatar.room) {
      if(!population[avatar.room]) {
        population[avatar.room] = 0;
      }
      population[avatar.room] += 1;
    }
  }
  res.send(population);
});

io.on('connection', async function(socket){
  console.log('a user connected');
  webhook_message("System", `${socket.id} connected.`);
  AVATARS.set(socket, {pos: [0, 0, 0], rot: [0, 1, 0, 0]});
  socket.on("AV", function(msg) {
    msg.id = socket.id;
    console.log(msg);
    console.log(AVATARS.get(socket).room);
    if(AVATARS.get(socket) && AVATARS.get(socket).room) {
      socket.to(AVATARS.get(socket).room).emit("AV", msg);
    }
    if(AVATARS.get(socket)) {
      if(msg.pos) {
        AVATARS.get(socket).pos = msg.pos;
      }
      if(msg.rot) {
        AVATARS.get(socket).rot = msg.rot;
      }
    }
  });
  let initDetail;
  let ack; 
  try {
    [initDetail, ack] = await new Promise((resolve, reject) => { socket.on("JOIN", (data, ack) => { resolve([data, ack]); }); setTimeout(() => reject("Timed out waiting for JOIN"), 10000); });
  } catch(e) {
    console.error(e);
    return;
  }
  let incoming_nick;
  if(initDetail.nick) {
    incoming_nick = `"${initDetail.nick}"`;
  } else {
    incoming_nick = `<${socket.id}>`;
  }
  for(let [other_socket, av] of AVATARS) {
    if(AVATARS.get(other_socket).room === initDetail.room) {
      socket.emit("AV:new", {id: other_socket.id, avatar: av.avatar, nick: av.nick});
      socket.emit("AV", {id: other_socket.id, pos: av.pos, rot: av.rot});
      
      other_socket.emit("AV:new", {id: socket.id, avatar: initDetail.avatar, nick: incoming_nick});
    }
  }
  console.log(AVATARS);
  AVATARS.get(socket).avatar = initDetail.avatar;
  AVATARS.get(socket).room = initDetail.room;
  AVATARS.get(socket).nick = incoming_nick;
  webhook_message("System", `${AVATARS.get(socket).nick} entered room \`${initDetail.room}\``);
  socket.join(initDetail.room);
  socket.on("SE", function(msg) {
    console.log(msg);
    io.to(AVATARS.get(socket).room).emit("SE", msg);
  });
  socket.on("CHAT", function(chatdata) {
    if(!chatdata || !chatdata.msg || typeof chatdata.msg !== "string") return;
    console.log(chatdata);
    if(AVATARS.get(socket).room) {
      webhook_message(`${AVATARS.get(socket).nick} in ${AVATARS.get(socket).room}`, chatdata.msg);
      io.to(AVATARS.get(socket).room).emit("CHAT", {nick: AVATARS.get(socket).nick, msg: chatdata.msg});
    }
  });
  socket.on("disconnect", function() {
    io.to(AVATARS.get(socket).room).emit("AV:del", {id: socket.id, nick: AVATARS.get(socket).nick});
    webhook_message("System", `${AVATARS.get(socket).nick} disconnected.`);
    AVATARS.delete(socket);
  });
  ack(); // Acknolwedges to Client's JOIN that server is initialized
});


http.listen(process.env.PORT || 8000);