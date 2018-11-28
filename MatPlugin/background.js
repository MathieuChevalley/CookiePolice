var TRACKERLIST = "tracker.csv";

// Message to send to popup.js
var string = "URLS:\n\n";

// Tracker dictionary
var advertising = new Object();
var analytics = new Object();
var customer = new Object();
var social = new Object();
var player = new Object();
var adult = new Object();
var comments = new Object();

// Dictionary
var trackerDict = new Object();
var companyDict = new Object();

// Score
var totalScore = 0;
var ADVERTISING_SCORE = 3;
var ANALYTICS_SCORE = 7;
var CUSTOMER_SCORE = 1;
var SOCIAL_SCORE = 0;
var PLAYER_SCORE = 0;
var ADULT_SCORE = 0;
var COMMENTS_SCORE = 0;

// Temporary TrackerList
advertising = {"omtrdc.net":"Adobe", "ad.doubleclick.net":"Google", "static.criteo.net":"Criteo", "bat.bing.com":"Bing"};
analytics = {"ws.sessioncam.com":"SessionCam"};
customer = {"dp.shoprunner.com":"Shoprunner"};
social = {};
player = {};
adult = {};
comments = {};


// Intercepts all outgoing HTTP requests and returns it as a string
chrome.webRequest.onCompleted.addListener(
    function(details) {
        var thisUrl = details.url;
        var thisTracker = regexChecker(thisUrl);
        if (thisTracker != null) {
            string = string + totalScore + "\: " + thisTracker + "\n";
        }
    },
    {urls: ["<all_urls>"]},
    ["responseHeaders"]
);

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    chrome.extension.onConnect.addListener(function(port) {
        port.postMessage(string);
    });
});

function regexChecker(url) {

    // ORDER THIS IN ORDER OF SEVERITY

    for (const [key, value] of Object.entries(advertising)) {
        if (url.includes(key)) {
            if (!(key in trackerDict)) {
                totalScore += ADVERTISING_SCORE;
                trackerDict[key] = value;
                return value + " Advertising";
            }
        }
    }

    for (const [key, value] of Object.entries(analytics)) {
        if (url.includes(key)) {
            if (!(key in trackerDict)) {
                totalScore += ANALYTICS_SCORE;
                trackerDict[key] = value;
                return value + " Analytics";
            }
        }
    }

    for (const [key, value] of Object.entries(customer)) {
        if (url.includes(key)) {
            if (!(key in trackerDict)) {
                totalScore += CUSTOMER_SCORE;
                trackerDict[key] = value;
                return value + " Customer Interaction";
            }
        }
    }

    return null;
}