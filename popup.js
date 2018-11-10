button = document.getElementById('load');
button.onclick = popup;
source = document.getElementById('source');

function show_content(content) {
    const reader = new FileReader();

    // This fires after the blob has been read/loaded.
    reader.addEventListener('loadend', (e) => {
      const text = e.srcElement.result.toLowerCase();
      document.getElementById('source').innerHTML = text;
      if (text.includes("igodigital")) {
        alert("iGO");
      }
      else if (text.includes("blueKai")) {
        alert("BlueKai");
      }
      else if (text.includes("shoprunner")) {
        alert("ShopRunner");
      }
      else {
        alert("nothing");
      }
    });

    // Start reading the blob as text.
    reader.readAsText(content);
}


function popup() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var activeTab = tabs[0];
        chrome.pageCapture.saveAsMHTML({tabId: activeTab.id}, show_content);
        /*chrome.tabs.executeScript(activeTab.id, {code: "document.cookie;"}, function (result) {
            alert(result);
        });
        chrome.tabs.executeScript(activeTab.id, {code: "document.head.innerHTML;"}, function (result) {
            alert(result);
            document.getElementById('source').innerHTML = analyse(result);
        });
        chrome.tabs.executeScript(activeTab.id, {code: "document.scripts;"}, function (result) {
            result.forEach(alert);
        });*/
    });
}

function analyse(source) {
    if (source.includes("<!-- Facebook Pixel Code -->")) {
        return 50;
    }
    return 100;
}
