var string = "URLS:\n\n";

document.addEventListener(
    "DOMContentLoaded",
    function() {
      document.getElementById("welcomeBox").innerText = "Changed.";
    }
);

chrome.webRequest.onCompleted.addListener(
    function(details) {
        var thisUrl = details.url;
        string = string + thisUrl + "\n\n";
        document.getElementById("textBox").innerText = string;
    },
    {urls: ["<all_urls>"]},
    ["responseHeaders"]
);