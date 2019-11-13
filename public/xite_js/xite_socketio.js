(function(){
  let socket = io();
  BxxEvents.addEventListener("SE:toServer", function(e) {
    socket.emit("SE", e.detail);
  });
  socket.on("SE", function(e) {
    BxxEvents.dispatchEvent(new CustomEvent("SE:fromServer", {detail: e}));
  })
})();