var string = "URLS:\n\n";



/*chrome.browserAction.onClicked.addListener(function(tab) {
    alert("popup");
    //chrome.runtime.sendMessage(tab.id, {result: string});
});
chrome.browserAction.onClicked.addListener(function(tab) {
    //alert('HELLOOOOO WORLD!!');
    chrome.tabs.sendMessage(tab.id, {result: "string"}, null);
});*/

chrome.extension.onConnect.addListener(function(port) {
        chrome.webRequest.onCompleted.addListener(
            function(details) {
                var thisUrl = details.url;
                //alert(thisUrl);
                string = string + thisUrl + "\n\n";
                alert("send" + string);
                port.postMessage(string);
            },
            {urls: ["<all_urls>"]},
            ["responseHeaders"]
        );
 })