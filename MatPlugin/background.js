const TRACKER_LIST_FILE = "trackerList.json";
const SAME_COMPANY_MULTIPLIER = 1;
const ANTI_REQUISITE_MULTIPLIER = 1.5;
const GOOD_BOUNDARY = 15;
const BAD_BOUNDARY = 50;
const GOOD_COLOR = "#32CD32";
const OKAY_COLOR = "#FF7F50";
const BAD_COLOR = "#000000";

const trackerListUrl = chrome.runtime.getURL(TRACKER_LIST_FILE);

var trackerList = [];
var trackerTypeList = [];

// Message to send to popup.js
var string = "";

// Tracker dictionary
var allTrackers = new Object();

// Dictionary
var trackerDict = new Object();
var companyDict = new Object();

// Score
var totalScore = 0;
var trackerScore = 0;
var pageUrl = "https://...";

var ADVERTISING_SCORE = 3;
var ANALYTICS_SCORE = 7;
var CUSTOMER_SCORE = 1;
var SOCIAL_SCORE = 2;
var AV_SCORE = 1;
var ADULT_SCORE = 5;
var COMMENTS_SCORE = 2;
var ESSENTIAL_SCORE = 2;

importTrackers(trackerListUrl);

// Listens for page reloads or change of url in the implicated tab
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.url || changeInfo.status === "loading") {
        string = "";
        trackerDict = new Object;
        companyDict = new Object;
        trackerList = [];
        trackerTypeList = [];
        totalScore = 0;

        pageUrl = tab.url;
    }

    chrome.extension.onConnect.addListener(function (message) {
        message.postMessage(string);
    })
});

// Intercepts all outgoing HTTP requests made in Chrome
chrome.webRequest.onSendHeaders.addListener(
    function(details) {
        var thisUrl = details.url;
        var thisTracker = regexChecker(thisUrl);

        if (thisTracker != null) {
            if (!(trackerList.includes(thisTracker.trackerName))) {
                trackerList.push(thisTracker.trackerName + " (" + trackerScore + ")");
            }
        }

        chrome.browserAction.setBadgeText({text: totalScore.toString()});

        if (totalScore <= GOOD_BOUNDARY) {
            chrome.browserAction.setBadgeBackgroundColor({color: GOOD_COLOR});
        } else if (totalScore > BAD_BOUNDARY) {
            chrome.browserAction.setBadgeBackgroundColor({color: BAD_COLOR});
        } else {
            chrome.browserAction.setBadgeBackgroundColor({color: OKAY_COLOR});
        }
    },
    {urls: ["<all_urls>"]},
    ["requestHeaders"]
);

function regexChecker(url) {
    for (const [key, value] of Object.entries(allTrackers)) {
        if (url.includes(key)) {
            // Advertising
            if (value.trackerType == "ad") {
                if (!(value.trackerName in trackerDict)) {
                    trackerScore = ADVERTISING_SCORE;

                    if (!(value.trackerParent in companyDict)) {
                        companyDict[value.trackerParent] = 1;
                    } else {
                        companyDict[value.trackerParent] += 1;
                        trackerScore = trackerScore - 1;
                    }

                    totalScore += trackerScore;

                    if (!(trackerTypeList.includes("advertising"))) {
                        trackerTypeList.push("advertising");
                    }

                    trackerDict[value.trackerName] = 1;

                    return value;
                }
            }

            // Analytics
            if (value.trackerType == "an") {
                if (!(value.trackerName in trackerDict)) {
                    trackerScore = ANALYTICS_SCORE;

                    if (!(value.trackerParent in companyDict)) {
                        companyDict[value.trackerParent] = 1;
                    } else {
                        companyDict[value.trackerParent] += 1;
                        trackerScore = trackerScore - 1;
                    }

                    totalScore += trackerScore;

                    if (!(trackerTypeList.includes("analytics"))) {
                        trackerTypeList.push("analytics");
                    }

                    trackerDict[value.trackerName] = 1;

                    return value;
                }
            }

            // Customer Service
            if (value.trackerType == "cu") {
                if (!(value.trackerName in trackerDict)) {
                    trackerScore = CUSTOMER_SCORE;

                    if (!(value.trackerParent in companyDict)) {
                        companyDict[value.trackerParent] = 1;
                    } else {
                        companyDict[value.trackerParent] += 1;
                        trackerScore = trackerScore - 1;
                    }

                    totalScore += trackerScore;
                    if (!(trackerTypeList.includes("customer service"))) {
                        trackerTypeList.push("customer service");
                    }

                    trackerDict[value.trackerName] = 1;

                    return value;
                }
            }

            // Adult
            if (value.trackerType == "xx") {
                if (!(value.trackerName in trackerDict)) {
                    trackerScore = ADULT_SCORE;

                    if (!(value.trackerParent in companyDict)) {
                        companyDict[value.trackerParent] = 1;
                    } else {
                        companyDict[value.trackerParent] += 1;
                        trackerScore = trackerScore - 1;
                    }

                    totalScore += trackerScore;

                    if (!(trackerTypeList.includes("adult websites"))) {
                        trackerTypeList.push("adult websites");
                    }

                    trackerDict[value.trackerName] = 1;

                    return value;
                }
            }

            // Essentials
            if (value.trackerType == "es") {
                if (!(value.trackerName in trackerDict)) {
                    trackerScore = ESSENTIAL_SCORE;

                    if (!(value.trackerParent in companyDict)) {
                        companyDict[value.trackerParent] = 1;
                    } else {
                        companyDict[value.trackerParent] += 1;
                        trackerScore = trackerScore - 1;
                    }

                    totalScore += trackerScore;

                    if (!(trackerTypeList.includes("essentials"))) {
                        trackerTypeList.push("essentials");
                    }

                    trackerDict[value.trackerName] = 1;

                    return value;
                }
            }

            // Social Media
            if (value.trackerType == "so") {
                if (!(value.trackerName in trackerDict)) {
                    trackerScore = SOCIAL_SCORE;

                    if (!(value.trackerParent in companyDict)) {
                        companyDict[value.trackerParent] = 1;
                    } else {
                        companyDict[value.trackerParent] += 1;
                        trackerScore = trackerScore - 1;
                    }

                    totalScore += trackerScore;

                    if (!(trackerTypeList.includes("social media"))) {
                        trackerTypeList.push("social media");
                    }

                    trackerDict[value.trackerName] = 1;

                    return value;
                }
            }

            // AVP
            if (value.trackerType == "av") {
                if (!(value.trackerName in trackerDict)) {
                    trackerScore = AV_SCORE;

                    if (!(value.trackerParent in companyDict)) {
                        companyDict[value.trackerParent] = 1;
                    } else {
                        companyDict[value.trackerParent] += 1;
                        trackerScore = trackerScore - 1;
                    }

                    totalScore += trackerScore;

                    if (!(trackerTypeList.includes("audio & video player"))) {
                        trackerTypeList.push("audio & video player");
                    }

                    trackerDict[value.trackerName] = 1;

                    return value;
                }
            }

            // Comments
            if (value.trackerType == "co") {
                if (!(value.trackerName in trackerDict)) {
                    trackerScore = COMMENTS_SCORE;

                    if (!(value.trackerParent in companyDict)) {
                        companyDict[value.trackerParent] = 1;
                    } else {
                        companyDict[value.trackerParent] += 1;
                        trackerScore = trackerScore - 1;
                    }

                    totalScore += trackerScore;
                    if (!(trackerTypeList.includes("comments"))) {
                        trackerTypeList.push("comments");
                    }

                    trackerDict[value.trackerName] = 1;

                    return value;
                }
            }
        }
    }

    return null;
}

// Function to import tracker list
function importTrackers(url) {
    fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(json) {
            for (var i = 0; i < json.List.length; i++) {
                allTrackers[json.List[i].trackerPattern] = json.List[i];
            }
        });
}