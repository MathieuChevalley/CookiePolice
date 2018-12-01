var background = chrome.extension.getBackgroundPage();

const GOOD_BOUNDARY = 15;
const BAD_BOUNDARY = 50;
const GOOD_COLOR = "limeGreen";
const OKAY_COLOR = "black";
const BAD_COLOR = "crimson";
const HEADER_COLOR = "#00A2FF";

var message = chrome.extension.connect({
    name: "Message port from background.js"
});

message.onMessage.addListener(function(msg) {
    document.getElementById("scoreBox").innerText = background.totalScore;
    document.getElementById("urlBox").innerText = background.pageUrl;

    if (background.status == "better" || background.totalScore == 0) {
        document.getElementById("scoreBox").style.color = GOOD_COLOR
    } else if (background.status == "worse") {
        document.getElementById("scoreBox").style.color = BAD_COLOR;
    } else {
        document.getElementById("scoreBox").style.color = OKAY_COLOR;
    }

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

    var category = background.thisCategory.toUpperCase();
    if (category == "NULL") {
        category = "";
    } else {
        document.getElementById("categoryHeader").innerText = "Website Category";
        document.getElementById("categoryBox").innerText = category;
        document.getElementById("performanceHeader").innerText = "Site Performance";
    }

    var performanceAnalyis = "";
    var performance = background.thisPerformance;
    if (performance < 0) {
        performanceAnalyis = "This site uses more trackers than " + (performance * -1).toString() + "% of " + category.toLowerCase() + " websites.";
    } else if (performance > 0 && performance <= 100) {
        performanceAnalyis = "This site uses less trackers than " + (performance).toString() + "% of " + category.toLowerCase() + " websites.";
    }

    document.getElementById("welcomeHeader").style.color = HEADER_COLOR;
    document.getElementById("typeHeader").style.color = HEADER_COLOR;
    document.getElementById("performanceHeader").style.color = HEADER_COLOR;
    document.getElementById("performanceBox").innerText = performanceAnalyis;
    document.getElementById("categoryHeader").style.color = HEADER_COLOR;
    document.getElementById("companiesHeader").style.color = HEADER_COLOR;
    document.getElementById("trackerHeader").style.color = HEADER_COLOR;
    document.getElementById("urlHeader").innerText = "Report for";
    document.getElementById("urlHeader").style.color = HEADER_COLOR;
    document.getElementById("scoreHeader").innerText = "CookieScore";
    document.getElementById("scoreHeader").style.color = HEADER_COLOR;
    document.getElementById("typeHeader").innerText = "Tracker Categories (" + listOfTypes.length.toString() + ")";
    document.getElementById("typeBox").innerText = types;
    document.getElementById("companiesHeader").innerText = "Companies (" + listOfCompaniesList.length.toString() + ")";
    document.getElementById("companiesBox").innerText = companies;
    document.getElementById("trackerHeader").innerText = "Trackers (" + listOfTrackers.length.toString() + ")";
    document.getElementById("trackerBox").innerText = trackers;


    if (background.totalScore == 0) {
        document.getElementById("performanceBox").innerText = "Here's to zero third-party trackers!";
        document.getElementById("typeHeader").innerText = "";
        document.getElementById("companiesHeader").innerText = "";
        document.getElementById("trackerHeader").innerText = "";
    }
});