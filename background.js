/*function show_content(content) {
    var reader = new FileReader();
    reader.addEventListener("loadend", function() {
        alert(reader.result);
    });
    reader.readAsBinaryString(content);
}

function resources(resources) {
    alert("resources");
    alert(resources);
}

chrome.browserAction.setPopup(popup.html, function(tab) {
    alert("on click listener");
    chrome.devtools.inspectedWindow.getResources(resources(result));
    //chrome.pageCapture.saveAsMHTML({tabId: tab.id}, show_content)
});
*/
