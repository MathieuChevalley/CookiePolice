var background = chrome.extension.getBackgroundPage();

const GOOD_BOUNDARY = 15;
const BAD_BOUNDARY = 50;
const GOOD_COLOR = "limeGreen";
const OKAY_COLOR = "coral";
const BAD_COLOR = "crimson";
const HEADER_COLOR = "peru";

var message = chrome.extension.connect({
    name: "Message port from background.js"
});

message.onMessage.addListener(function(msg) {
    if (background.totalScore <= GOOD_BOUNDARY) {
        document.getElementById("scoreBox").style.color = GOOD_COLOR
    } else if (background.totalScore > BAD_BOUNDARY) {
        document.getElementById("scoreBox").style.color = BAD_COLOR;
    } else {
        document.getElementById("scoreBox").style.color = OKAY_COLOR;
    }

    document.getElementById("scoreBox").innerText = background.totalScore;
    document.getElementById("urlBox").innerText = background.pageUrl;

    var listOfTrackers = background.trackerList.sort();
    var trackers = "";
    for (var i = 0; i < listOfTrackers.length; i++) {
        trackers = trackers + listOfTrackers[i].toUpperCase() + "\n" ;
    }

    var listOfCompanies = background.companyDict;
    var listOfCompaniesList = [];
    var companies = "";
    for (const [key, value] of Object.entries(listOfCompanies)) {
        listOfCompaniesList.push(value + " " + key.toUpperCase());
    }

    listOfCompaniesList = listOfCompaniesList.sort().reverse();

    for (var i = 0; i < listOfCompaniesList.length; i++) {
        companies = companies + listOfCompaniesList[i] + "\n" ;
    }

    var listOfTypes = background.trackerTypeList.sort();
    var types = "";

    for (var i = 0; i < listOfTypes.length; i++) {
        types = types + listOfTypes[i].toUpperCase() + "\n";
    }

    document.getElementById("welcomeHeader").style.color = HEADER_COLOR;
    document.getElementById("typeHeader").style.color = HEADER_COLOR;
    document.getElementById("companiesHeader").style.color = HEADER_COLOR;
    document.getElementById("trackerHeader").style.color = HEADER_COLOR;

    document.getElementById("typeHeader").innerText = "Types (" + listOfTypes.length.toString() + ")";
    document.getElementById("typeBox").innerText = types;
    document.getElementById("companiesHeader").innerText = "Companies (" + listOfCompaniesList.length.toString() + ")";
    document.getElementById("companiesBox").innerText = companies;
    document.getElementById("trackerHeader").innerText = "Trackers (" + listOfTrackers.length.toString() + ")";
    document.getElementById("trackerBox").innerText = trackers;
});