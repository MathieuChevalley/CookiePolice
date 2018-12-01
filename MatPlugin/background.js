const TRACKER_LIST_FILE = "http://ec2-3-16-90-230.us-east-2.compute.amazonaws.com/get-trackers";
const CATEGORIES_FILE = "http://ec2-3-16-90-230.us-east-2.compute.amazonaws.com/get-categories";
const CONTROL_SCORE_FILE = "http://ec2-3-16-90-230.us-east-2.compute.amazonaws.com/get-database";
const CONTROL_SCORE_UPDATE = "http://ec2-3-16-90-230.us-east-2.compute.amazonaws.com/update-database";


const SAME_COMPANY_MULTIPLIER = 1;
const ANTI_REQUISITE_MULTIPLIER = 1.5;
const GOOD_BOUNDARY = 15;
const BAD_BOUNDARY = 50;
const GOOD_COLOR = "#32CD32";
const BAD_COLOR = "#DC143C";
const OKAY_COLOR = "#000000";

var trackerList = [];
var trackerTypeList = [];

// Message to send to popup.js
var string = "";

// Tracker dictionary
var allTrackers = new Object();
var controlScores = new Object();
var categories = new Object();
var trackerDict = new Object();
var companyDict = new Object();

// Score
var totalScore = 0;
var trackerScore = 0;
var pageUrl = "https://...";
var thisCategory = "None";
var thisPerformance = "Better / Worse";
var status = "";

var ADVERTISING_SCORE = 3;
var ANALYTICS_SCORE = 7;
var CUSTOMER_SCORE = 1;
var SOCIAL_SCORE = 2;
var AV_SCORE = 1;
var ADULT_SCORE = 5;
var COMMENTS_SCORE = 2;
var ESSENTIAL_SCORE = 2;
var SESSION_REPLAY_SCORE = 15;

// Listens for page reloads or change of url in the implicated tab
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.url || changeInfo.status === "loading") {
        categories = new Object();
        allTrackers = new Object();
        controlScores = new Object();

        importTrackers(TRACKER_LIST_FILE);
        importWebCategory(CATEGORIES_FILE);
        importControlScores(CONTROL_SCORE_FILE);

        string = "";
        status = "";
        trackerDict = new Object;
        companyDict = new Object;
        trackerList = [];
        trackerTypeList = [];
        totalScore = 0;
    }

    pageUrl = tab.url;
    thisHost = getHostName(pageUrl);
    thisCategory = getCategory(thisHost);

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

        thisPerformance = checkScore(thisCategory, thisHost, totalScore);

        chrome.browserAction.setBadgeText({text: totalScore.toString()});

        if (status == "better" || totalScore == 0) {
            chrome.browserAction.setBadgeBackgroundColor({color: GOOD_COLOR});
        } else if (status == "worse") {
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

            // Session replay
            if (value.trackerType == "sr") {
                if (!(value.trackerName in trackerDict)) {
                    trackerScore = SESSION_REPLAY_SCORE;

                    if (!(value.trackerParent in companyDict)) {
                        companyDict[value.trackerParent] = 1;
                    } else {
                        companyDict[value.trackerParent] += 1;
                        trackerScore = trackerScore - 1;
                    }

                    totalScore += trackerScore;
                    if (!(trackerTypeList.includes("session replay"))) {
                        trackerTypeList.push("session replay");
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
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send();
    var response = xhr.responseText;
    var jsonResponse = JSON.parse(response);
    for (var i = 0; i < jsonResponse.List.length; i++) {
        allTrackers[jsonResponse.List[i].trackerPattern] = jsonResponse.List[i];
    }
}

// Function to import category
function importWebCategory(url) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send();
    var response = xhr.responseText;
    var jsonResponse = JSON.parse(response);
    for (var i = 0; i < jsonResponse.List.length; i++) {
        categories[jsonResponse.List[i].website] = new Object();
        categories[jsonResponse.List[i].website] = jsonResponse.List[i];
    }
}

// Function to import database
function importControlScores(url) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send();
    var response = xhr.responseText;
    var jsonResponse = JSON.parse(response);
    for (var key in jsonResponse) {
        if (jsonResponse.hasOwnProperty(key)) {
            controlScores[key] = new Object();
            controlScores[key].score = jsonResponse[key].score;
            controlScores[key].category = jsonResponse[key].category;
        }
    }
}

// Function to check score of website in comparison
function checkScore(cat, thisUrl, score) {
    var better = 0;
    var worse = 0;
    var totalInCategory = 0;

    if (cat == "null") {
        return 403;
    }

    if (!(thisUrl in controlScores)) {
        if (thisUrl != undefined && thisUrl != "...") {
            controlScores[thisUrl] = new Object();
            controlScores[thisUrl].score = score;
            controlScores[thisUrl].category = cat;
        }
    }

    // Loop through all scores
    for (const [key, value] of Object.entries(controlScores)) {
        if (value.category == cat) {
            totalInCategory = totalInCategory + 1;
            if (score <= value.score) {
                better = better + 1;
            } else {
                worse = worse + 1;
            }

            if (key == thisUrl && cat != "null") {
                if (value.score < score) {
                    value.score = score;
                    updateDatabase();
                }
            }
        }
    }

    if (better > worse) {
        status = "better";
        return parseInt(better / totalInCategory * 100);
    } else {
        status = "worse";
        return parseInt(worse / totalInCategory * -100);
    }
}

function getCategory(hostName) {
    if (!(hostName in categories)) {
        return "null";
    }

    return categories[hostName].category;
}

function getHostName(url) {
    var hostName = (new URL(url)).hostname;
    return hostName;
}

function updateDatabase() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", CONTROL_SCORE_UPDATE, false);
    xhr.setRequestHeader('content-type', 'application/json');
    var databaseJsonString = JSON.stringify(controlScores);
    xhr.send(databaseJsonString);
    var response = xhr.responseText;
    var jsonResponse = JSON.parse(response);
    for (var i = 0; i < jsonResponse.List.length; i++) {
        controlScores[jsonResponse.List[i].website] = jsonResponse.List[i];
    }
}