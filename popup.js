button = document.getElementById('load');
button.onclick = popup;
source = document.getElementById('source');

/*function show_content(content) {
    const reader = new FileReader();

    // This fires after the blob has been read/loaded.
    reader.addEventListener('loadend', (e) => {
      const text = e.srcElement.result.toLowerCase();
      document.getElementById('source').innerHTML = text;
      
    });

    // Start reading the blob as text.
    reader.readAsText(content);
}*/

function detect(text) {
    if (text.includes("igodigital")) {
        alert("iGO");
      }
      if (text.includes("bluekai")) {
        alert("BlueKai");
      }
      if (text.includes("google-analytics")) {
        alert("google-analytics");
      }
      if (text.includes("shoprunner")) {
        alert("ShopRunner");
      }
    if (text.includes("criteo")) {
        alert("criteo");
    }  
    if (text.includes("googletagmanager")) {
        alert("Google Tag Manager");
    }  
}


function query(i, activeTab) {
    chrome.tabs.executeScript(activeTab.id, {code: "document.scripts[" + i + "].src;"}, function (result) {
        //alert(result);
        text = result.toString().toLowerCase();
        detect(text);
    }
    );
}

function popup() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        alert("query");
        var activeTab = tabs[0];
        var length = 0;
        //chrome.pageCapture.saveAsMHTML({tabId: activeTab.id}, show_content);
        //activeTab.getResources
        
        /*chrome.tabs.executeScript(activeTab.id, {code: "document.cookie;"}, function (result) {
            alert(result);
        });
        chrome.tabs.executeScript(activeTab.id, {code: "document.head.innerHTML;"}, function (result) {
            alert(result);
            document.getElementById('source').innerHTML = analyse(result);
        });*/
        chrome.tabs.executeScript(activeTab.id, {code: "document.scripts.length;"}, function(result) {
            length = result;
            for (var i = 0; i < length; i++) {
                query(i, activeTab);
            }
        });

        
        
    });
}

function analyse(source) {
    if (source.includes("<!-- Facebook Pixel Code -->")) {
        return 50;
    }
    return 100;
}
