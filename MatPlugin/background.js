const AWS_DNS = "http://" + "ec2-3-16-37-17.us-east-2.compute.amazonaws.com";

const TRACKER_LIST_FILE = AWS_DNS + "/get-trackers";
const CATEGORIES_FILE = AWS_DNS + "/get-categories";
const CONTROL_SCORE_FILE = AWS_DNS + "/get-database";
const CONTROL_SCORE_UPDATE = AWS_DNS + "/update-database";

const BLACKLIST_MULTIPLIER = 1.5;
const GOOD_COLOR = "#00A2FF";
const BAD_COLOR = "#DC143C";
const OKAY_COLOR = "#000000";

var serverCheck = "off";

var ADVERTISING_SCORE = 4;
var ANALYTICS_SCORE = 5;
var CUSTOMER_SCORE = 1;
var SOCIAL_SCORE = 6;
var AV_SCORE = 2;
var ADULT_SCORE = 7;
var COMMENTS_SCORE = 3;
var ESSENTIAL_SCORE = 1;
var SESSION_REPLAY_SCORE = 8;

var ADVERTISING_BLACKLIST = ["banking", "adult", "healthcare"];
var ANALYTICS_BLACKLIST = ["banking"];
var CUSTOMER_BLACKLIST = ["adult"];
var SOCIAL_BLACKLIST = ["banking", "healthcare"];
var AV_BLACKLIST = ["na"];
var ADULT_BLACKLIST = ["na"];
var COMMENTS_BLACKLIST = ["political", "banking", "healthcare"];
var ESSENTIAL_BLACKLIST = ["na"];
// var SESSION_REPLAY_BLACKLIST = ["e-commerce", "banking"];
var urlBlacklist =["...", "extensions", "newtab", ""];


var trackerList = [];
var trackerTypeList = [];
var blackList = [];

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
var pageUrl = "...";
var thisCategory = "None";
var allPerformance, thisPerformance, thisPerformance2;
var status = "";
var status2 = "";

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
        status = "NOSTAT";
        status2 = "NOSTAT";
        trackerDict = new Object;
        companyDict = new Object;
        trackerList = [];
        trackerTypeList = [];
        blackList = [];
        totalScore = 0;
    }

    pageUrl = getHostName(tab.url);
    thisCategory = getCategory(pageUrl);

    chrome.extension.onConnect.addListener(function (message) {
        message.postMessage(string);
    })
});

// Intercepts all outgoing HTTP requests made in Chrome
chrome.webRequest.onSendHeaders.addListener(
    function(details) {
        if (serverCheck != "off") {
            var thisUrl = details.url;
            var result = regexChecker(thisUrl, thisCategory);
            var thisTracker = result[0];

            if (thisTracker != null) {
                if (!(trackerList.includes(thisTracker.trackerName))) {
                    var thisTrackerName = thisTracker.trackerName + " [" + result[3] + "]";
                    if (result[1] == 1) {
                        thisTrackerName = thisTrackerName + "*";
                    }

                    if (result[2] == 1) {
                        thisTrackerName = thisTrackerName + "^" ;
                    }

                    trackerList.push(thisTrackerName);
                }
            }

            allPerformance = checkScore(thisCategory, pageUrl, totalScore);
            thisPerformance = allPerformance[0];
            thisPerformance2 = allPerformance[1];

            chrome.browserAction.setBadgeText({text: parseInt(totalScore).toString()});

            if (status == "worse" || (status2 == "worse" && status == "NOSTAT")) {
                chrome.browserAction.setBadgeBackgroundColor({color: BAD_COLOR});
            } else if (status == "better" || status2 == "better") {
                chrome.browserAction.setBadgeBackgroundColor({color: GOOD_COLOR});
            } else {
                chrome.browserAction.setBadgeBackgroundColor({color: OKAY_COLOR});
            }
        } else {
            chrome.browserAction.setBadgeBackgroundColor({color: OKAY_COLOR});
            chrome.browserAction.setBadgeText({text: ""});
        }
    },
    {urls: ["<all_urls>"]},
    ["requestHeaders"]
);

function regexChecker(url, cat) {
    var bla = 0;
    var dup = 0;
    for (const [key, value] of Object.entries(allTrackers)) {
        if (url.includes(key)) {
            // Advertising
            if (value.trackerType == "ad") {
                if (!(value.trackerName in trackerDict)) {
                    trackerScore = ADVERTISING_SCORE;

                    // Blacklist check
                    if (ADVERTISING_BLACKLIST.includes(thisCategory)) {
                        bla = 1;
                        trackerScore = trackerScore * BLACKLIST_MULTIPLIER;
                        if (!(trackerTypeList.includes("advertising*"))) {
                            trackerTypeList.push("advertising*");
                        }
                    } else {
                        if (!(trackerTypeList.includes("advertising"))) {
                            trackerTypeList.push("advertising");
                        }
                    }

                    if (!(value.trackerParent in companyDict)) {
                        companyDict[value.trackerParent] = 1;
                    } else {
                        dup = 1;
                        companyDict[value.trackerParent] += 1;
                        trackerScore = trackerScore - 1;
                    }

                    totalScore += trackerScore;

                    trackerDict[value.trackerName] = 1;

                    return [value, bla, dup, trackerScore];
                }
            }

            // Analytics
            if (value.trackerType == "an") {
                if (!(value.trackerName in trackerDict)) {
                    trackerScore = ANALYTICS_SCORE;

                    // Blacklist check
                    if (ANALYTICS_BLACKLIST.includes(thisCategory)) {
                        bla = 1;
                        trackerScore = trackerScore * BLACKLIST_MULTIPLIER;
                        if (!(trackerTypeList.includes("analytics*"))) {
                            trackerTypeList.push("analytics*");
                        }
                    } else {
                        if (!(trackerTypeList.includes("analytics"))) {
                            trackerTypeList.push("analytics");
                        }
                    }

                    if (!(value.trackerParent in companyDict)) {
                        companyDict[value.trackerParent] = 1;
                    } else {
                        dup = 1;
                        companyDict[value.trackerParent] += 1;
                        trackerScore = trackerScore - 1;
                    }

                    totalScore += trackerScore;

                    trackerDict[value.trackerName] = 1;

                    return [value, bla, dup, trackerScore];
                }
            }

            // Customer Service
            if (value.trackerType == "cu") {
                if (!(value.trackerName in trackerDict)) {
                    trackerScore = CUSTOMER_SCORE;

                    // Blacklist check
                    if (CUSTOMER_BLACKLIST.includes(thisCategory)) {
                        bla = 1;
                        trackerScore = trackerScore * BLACKLIST_MULTIPLIER;
                        if (!(trackerTypeList.includes("customer service*"))) {
                            trackerTypeList.push("customer service*");
                        }
                    } else {
                        if (!(trackerTypeList.includes("customer service"))) {
                            trackerTypeList.push("customer service");
                        }
                    }

                    if (!(value.trackerParent in companyDict)) {
                        companyDict[value.trackerParent] = 1;
                    } else {
                        dup = 1;
                        companyDict[value.trackerParent] += 1;
                        trackerScore = trackerScore - 1;
                    }

                    trackerDict[value.trackerName] = 1;

                    return [value, bla, dup, trackerScore];
                }
            }

            // Adult
            if (value.trackerType == "xx") {
                if (!(value.trackerName in trackerDict)) {
                    trackerScore = ADULT_SCORE;

                    // Blacklist check
                    if (ADULT_BLACKLIST.includes(thisCategory)) {
                        bla = 1;
                        trackerScore = trackerScore * BLACKLIST_MULTIPLIER;
                        if (!(trackerTypeList.includes("adult*"))) {
                            trackerTypeList.push("adult*");
                        }
                    } else {
                        if (!(trackerTypeList.includes("adult"))) {
                            trackerTypeList.push("adult");
                        }
                    }

                    if (!(value.trackerParent in companyDict)) {
                        companyDict[value.trackerParent] = 1;
                    } else {
                        dup = 1;
                        companyDict[value.trackerParent] += 1;
                        trackerScore = trackerScore - 1;
                    }

                    totalScore += trackerScore;

                    trackerDict[value.trackerName] = 1;

                    return [value, bla, dup, trackerScore];
                }
            }

            // Essentials
            if (value.trackerType == "es") {
                if (!(value.trackerName in trackerDict)) {
                    trackerScore = ESSENTIAL_SCORE;

                    // Blacklist check
                    if (ESSENTIAL_BLACKLIST.includes(thisCategory)) {
                        bla = 1;
                        trackerScore = trackerScore * BLACKLIST_MULTIPLIER;
                        if (!(trackerTypeList.includes("essentials*"))) {
                            trackerTypeList.push("essentials*");
                        }
                    } else {
                        if (!(trackerTypeList.includes("essentials"))) {
                            trackerTypeList.push("essentials");
                        }
                    }

                    if (!(value.trackerParent in companyDict)) {
                        companyDict[value.trackerParent] = 1;
                    } else {
                        dup = 1;
                        companyDict[value.trackerParent] += 1;
                        trackerScore = trackerScore - 1;
                    }

                    totalScore += trackerScore;

                    trackerDict[value.trackerName] = 1;

                    return [value, bla, dup, trackerScore];
                }
            }

            // Social Media
            if (value.trackerType == "so") {
                if (!(value.trackerName in trackerDict)) {
                    trackerScore = SOCIAL_SCORE;

                    // Blacklist check
                    if (SOCIAL_BLACKLIST.includes(thisCategory)) {
                        bla = 1;
                        trackerScore = trackerScore * BLACKLIST_MULTIPLIER;
                        if (!(trackerTypeList.includes("social media*"))) {
                            trackerTypeList.push("social media*");
                        }
                    } else {
                        if (!(trackerTypeList.includes("social media"))) {
                            trackerTypeList.push("social media");
                        }
                    }

                    if (!(value.trackerParent in companyDict)) {
                        companyDict[value.trackerParent] = 1;
                    } else {
                        dup = 1;
                        companyDict[value.trackerParent] += 1;
                        trackerScore = trackerScore - 1;
                    }

                    totalScore += trackerScore;

                    trackerDict[value.trackerName] = 1;

                    return [value, bla, dup, trackerScore];
                }
            }

            // AVP
            if (value.trackerType == "av") {
                if (!(value.trackerName in trackerDict)) {
                    trackerScore = AV_SCORE;

                    // Blacklist check
                    if (AV_BLACKLIST.includes(thisCategory)) {
                        bla = 1;
                        trackerScore = trackerScore * BLACKLIST_MULTIPLIER;
                        if (!(trackerTypeList.includes("audio & video player*"))) {
                            trackerTypeList.push("audio & video player*");
                        }
                    } else {
                        if (!(trackerTypeList.includes("audio & video player"))) {
                            trackerTypeList.push("audio & video player");
                        }
                    }

                    if (!(value.trackerParent in companyDict)) {
                        companyDict[value.trackerParent] = 1;
                    } else {
                        dup = 1;
                        companyDict[value.trackerParent] += 1;
                        trackerScore = trackerScore - 1;
                    }

                    totalScore += trackerScore;

                    trackerDict[value.trackerName] = 1;

                    return [value, bla, dup, trackerScore];
                }
            }

            // Comments
            if (value.trackerType == "co") {
                if (!(value.trackerName in trackerDict)) {
                    trackerScore = COMMENTS_SCORE;

                    // Blacklist check
                    if (COMMENTS_BLACKLIST.includes(thisCategory)) {
                        bla = 1;
                        trackerScore = trackerScore * BLACKLIST_MULTIPLIER;
                        if (!(trackerTypeList.includes("comments*"))) {
                            trackerTypeList.push("comments*");
                        }
                    } else {
                        if (!(trackerTypeList.includes("comments"))) {
                            trackerTypeList.push("comments");
                        }
                    }

                    if (!(value.trackerParent in companyDict)) {
                        companyDict[value.trackerParent] = 1;
                    } else {
                        dup = 1;
                        companyDict[value.trackerParent] += 1;
                        trackerScore = trackerScore - 1;
                    }

                    totalScore += trackerScore;
                    if (!(trackerTypeList.includes("comments"))) {
                        trackerTypeList.push("comments");
                    }

                    trackerDict[value.trackerName] = 1;

                    return [value, bla, dup, trackerScore];
                }
            }

            // Session replay
            if (value.trackerType == "sr") {
                if (!(value.trackerName in trackerDict)) {
                    trackerScore = SESSION_REPLAY_SCORE;

                    // Blacklist check
                    if (true) {
                    // if (SESSION_REPLAY_BLACKLIST.includes(thisCategory)) {
                        bla = 1;
                        trackerScore = trackerScore * BLACKLIST_MULTIPLIER;
                        if (!(trackerTypeList.includes("session replay*"))) {
                            trackerTypeList.push("session replay*");
                        }
                    } else {
                        if (!(trackerTypeList.includes("session replay"))) {
                            trackerTypeList.push("session replay");
                        }
                    }

                    if (!(value.trackerParent in companyDict)) {
                        companyDict[value.trackerParent] = 1;
                    } else {
                        dup = 1;
                        companyDict[value.trackerParent] += 1;
                        trackerScore = trackerScore - 1;
                    }

                    trackerDict[value.trackerName] = 1;

                    return [value, bla, dup, trackerScore];
                }
            }
        }
    }

    return [null, 0, 0];
}

// Function to import tracker list
function importTrackers(url) {
    try {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, false);
        xhr.send();
        var response = xhr.responseText;
        var jsonResponse = JSON.parse(response);
        for (var i = 0; i < jsonResponse.List.length; i++) {
            allTrackers[jsonResponse.List[i].trackerPattern] = jsonResponse.List[i];
        }
        serverCheck = "on";
    } catch (e) {
        serverCheck = "off";
    }
}

// Function to import category
function importWebCategory(url) {
    try {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, false);
        xhr.send();
        var response = xhr.responseText;
        var jsonResponse = JSON.parse(response);
        for (var key in jsonResponse) {
            if (jsonResponse.hasOwnProperty(key)) {
                categories[key] = new Object();
                categories[key].category = jsonResponse[key].category;
            }
        }
        serverCheck = "on";
    } catch (e) {
        serverCheck = "off";
    }
}

// Function to import database
function importControlScores(url) {
    try {
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
        serverCheck = "on";
    } catch (e) {
        serverCheck = "off";
    }
}

// Function to check score of website in comparison
function checkScore(cat, thisUrl, score) {
    var better = 0;
    var worse = 0;
    var better2 = 0;
    var worse2 = 0;
    var totalInCategory = 0;
    var total = 0;
    var res1 = 0;
    var res2 = 0;

    if (!(thisUrl in controlScores)) {
        if (thisUrl != undefined && !(urlBlacklist.includes(thisUrl))) {
            controlScores[thisUrl] = new Object();
            controlScores[thisUrl].score = score;
            controlScores[thisUrl].category = cat;
            updateDatabase();
        }
    }

    if (controlScores[thisUrl].category != cat) {
        controlScores[thisUrl].category = cat;
        updateDatabase();
    }

    // Loop through all scores
    for (const [key, value] of Object.entries(controlScores)) {
        if (value.category == cat) {
            totalInCategory = totalInCategory + 1;
            total = total + 1;
            if (key != thisUrl) { // Do not compare with self
                if (score <= value.score) {
                    better = better + 1;
                    better2 = better2 + 1;
                } else {
                    worse = worse + 1;
                    worse2 = worse2 + 1;
                }
            }
        } else { // If other category, compare with everything else
            total = total + 1;
            if (key != thisUrl) { // Do not compare with self
                if (score <= value.score) {
                    better2 = better2 + 1;
                } else {
                    worse2 = worse2 + 1;
                }
            }
        }

        if (key == thisUrl) { // If score difference is +/- 3, update DB
            if (!((value.score - 3) <= score && score <= (value.score + 3))) {
                value.score = score;
                updateDatabase();
            }
        }
    }

    if (totalInCategory > 0) {
        totalInCategory = totalInCategory - 1;
    }

    if (total > 0) {
        total = total - 1;
    }

    if (better > worse) {
        status = "better";
        res1 = parseInt(better / totalInCategory * 100);
    } else {
        status = "worse";
        res1 = parseInt(worse / totalInCategory * -100);
    }

    if (res1 > -50 && res1 < 0) {
        status = "better";
        res1 = 100 - (res1 * -1);
    }

    if (cat == "null") {
        status = "NOSTAT";
    }

    if (better2 > worse2 * 0.8) {
        status2 = "better";
        res2 = parseInt(better2 / total * 100);
    } else {
        status2 = "worse";
        res2 = parseInt(worse2 / total * -100);
    }

    if (res2 > -50 && res2 < 0) {
        status2 = "better";
        res2 = 100 - (res2 * -1);
    }

    return [res1, res2];
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

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}