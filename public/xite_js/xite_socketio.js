BxxEvents.addEventListener("INIT:network", function(e){
  let initDetail = e.detail;
  let socket = io();
  BxxEvents.addEventListener("SE:toServer", function(e) {
    socket.emit("SE", e.detail);
  });
  socket.on("SE", function(e) {
    BxxEvents.dispatchEvent(new CustomEvent("SE:fromServer", {detail: e}));
  });
  BxxEvents.addEventListener("AV:toServer", function(e) {
    socket.emit("AV", e.detail);
  });
  socket.on("AV", function(e) {
    BxxEvents.dispatchEvent(new CustomEvent("AV:fromServer", {detail: e}));
  });
  socket.on("AV:del", function(e) {
    BxxEvents.dispatchEvent(new CustomEvent("AV:fromServer:del", {detail: e}));
  });
  socket.emit("JOIN", initDetail);
});