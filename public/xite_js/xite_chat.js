document.addEventListener("DOMContentLoaded", function() {
    
    const chatinput = document.querySelector("#chatinput");
    const chatlog = document.querySelector("#chatlog");
    
    document.querySelector("#chatform").addEventListener("submit", function(e) {
        e.preventDefault();
        BxxEvents.dispatchEvent(new CustomEvent("CHAT:toServer", {detail: {msg: chatinput.value}}));
        chatinput.value = "";
    });
    
    BxxEvents.addEventListener("CHAT:fromServer", function(e) {
        let li = document.createElement("li");
        li.textContent = e.detail.id + ":\t" + e.detail.msg;
        chatlog.appendChild(li);
    });
    
    BxxEvents.addEventListener("CHAT:system", function(e) {
        let li = document.createElement("li");
        li.textContent = "System:\t" + e.detail.msg;
        chatlog.appendChild(li);
    });
    
    // System generated chat
    
    function system(msg) {
        console.log("system(", msg, ")");
        BxxEvents.dispatchEvent(new CustomEvent("CHAT:system", {detail: {msg: msg}}));
    }
    
    BxxEvents.addEventListener("AV:fromServer:new", function(e) {
        system(e.detail.id + " enters.");
    });
    
    BxxEvents.addEventListener("AV:fromServer:del", function(e) {
        system(e.detail.id + " leaves.");
    });
});

