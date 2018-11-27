
/*chrome.runtime.onMessage.addListener(function(request, sender, response) {
    alert("message");
    document.getElementById("textBox").innerText = request.result;

});*/
var port = chrome.extension.connect({
    name: "Sample Communication"
});

port.onMessage.addListener(function(msg) {
    alert(msg);
    document.getElementById("textBox").innerText = msg;
});