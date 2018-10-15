function show_content(content) {
    var reader = new FileReader();
    reader.addEventListener("loadend", function() {
        alert(reader.result);
    });
    reader.readAsBinaryString(content);
}


chrome.browserAction.onClicked.addListener(function(tab) {
    console.log("on click listener");
    chrome.pageCapture.saveAsMHTML({tabId: tab.id}, show_content)
});