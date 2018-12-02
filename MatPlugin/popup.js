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
    document.getElementById("scoreBox").innerText = parseInt(background.totalScore);
    document.getElementById("urlBox").innerText = background.pageUrl;

    if (background.status == "worse" || (background.status2 == "worse" && background.status == "NOSTAT")) {
        document.getElementById("scoreBox").style.color = BAD_COLOR;
    } else if (background.status == "better" || background.status2 == "better") {
        document.getElementById("scoreBox").style.color = GOOD_COLOR;
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
        listOfCompaniesList.push(value + " " + key);
    }

    listOfCompaniesList = listOfCompaniesList.sort().reverse();

    for (var i = 0; i < listOfCompaniesList.length; i++) {
        companies = companies + listOfCompaniesList[i].toUpperCase() + "\n" ;
    }

    var listOfTypes = background.trackerTypeList.sort();
    var types = "";

    for (var i = 0; i < listOfTypes.length; i++) {
        types = types + capitalizeFirstLetters(listOfTypes[i]) + "\n";
    }

    var performance = background.thisPerformance;

    var category = capitalizeFirstLetters(background.thisCategory);
    if (category == "Null") {
        category = "";
    } else {
        document.getElementById("performanceHeader").innerText = "Comparative Privacy";
        var barWidth = 0;

        if (performance > 0) {
            document.getElementById("bar").style.backgroundColor = GOOD_COLOR;
            barWidth = performance;
        } else {
            document.getElementById("bar").style.backgroundColor = BAD_COLOR;
            // barWidth = 100 - (performance * -1);
            barWidth = (performance * -1);
        }

        if (barWidth > 0 && performance != 0) {
            document.getElementById("bar").style.width = barWidth + "%";
            document.getElementById("bar").style.height = "20px";
            document.getElementById("wrapper").style.marginTop = "15px";
            document.getElementById("wrapper").style.display = "block";
            document.getElementById("wrapper").style.marginBottom = "35px";
            document.getElementById("leftLabel").innerText = "Poor";
            document.getElementById("rightLabel").innerText = "Excellent";
            document.getElementById("categoryBox").innerText = "Against other " + category.toLowerCase() + " sites";
        }

        var performanceAnalyis = "";
        if (performance < 0) {
            performanceAnalyis = "This website's CookieScore is higher than " + (performance * -1).toString() + "% of all the " + category.toLowerCase() + " websites on our database. Keep scrolling to learn more.";
        } else if (performance > 0 && performance <= 100) {
            performanceAnalyis = "This website's CookieScore is lower than " + (performance).toString() + "% of all the " + category.toLowerCase() + " websites on our database. We think that's a win for you!";
        }
        document.getElementById("performanceBox").innerText = performanceAnalyis;
    }

    if (background.totalScore != 0) {
        document.getElementById("performanceHeader").innerText = "Comparative Privacy";
        var barWidth2 = 0;

        var performance2 = background.thisPerformance2;

        if (performance2 > 0) {
            document.getElementById("bar2").style.backgroundColor = GOOD_COLOR;
            barWidth2 = performance2;
        } else {
            document.getElementById("bar2").style.backgroundColor = BAD_COLOR;
            // barWidth2 = 100 - (performance2 * -1);
            barWidth2 = (performance2 * -1);
        }

        if (barWidth2 > 0) {
            document.getElementById("bar2").style.width = barWidth2 + "%";
            document.getElementById("bar2").style.height = "20px";
            document.getElementById("wrapper2").style.marginTop = "15px";
            document.getElementById("wrapper2").style.display = "block";
            document.getElementById("wrapper2").style.marginBottom = "35px";
            document.getElementById("leftLabel2").innerText = "Poor";
            document.getElementById("rightLabel2").innerText = "Excellent";
        }

        var performanceAnalyis2 = "";
        if (performance2 < 0) {
            performanceAnalyis2 = "This website's CookieScore is higher than " + (performance2 * -1).toString() + "% of all the websites on our database. Keep scrolling to learn more.";
        } else if (performance2 > 0 && performance2 <= 100) {
            performanceAnalyis2 = "This website's CookieScore is lower than " + (performance2).toString() + "% of all the websites on our database. We think that's a win for you!";
        }

        document.getElementById("globalBox").innerText = "Against all other sites";
        document.getElementById("performanceBox2").innerText = performanceAnalyis2;
    }

    document.getElementById("urlHeader").innerText = "Report for";
    document.getElementById("scoreHeader").innerText = "CookieScore";
    document.getElementById("typeHeader").innerText = "Tracker Categories (" + listOfTypes.length.toString() + ")";
    document.getElementById("typeBox").innerText = types;
    document.getElementById("companiesHeader").innerText = "Companies (" + listOfCompaniesList.length.toString() + ")";
    document.getElementById("companiesBox").innerText = companies;
    document.getElementById("trackerHeader").innerText = "Trackers (" + listOfTrackers.length.toString() + ")";
    document.getElementById("trackerBox").innerText = trackers;
    document.getElementById("scoreExplanationBox").innerText = "From 0 to infinity, how low can they go?";

    if (background.totalScore == 0) {
        document.getElementById("scoreExplanationBox").innerText = "Truly, a site to behold!";
        document.getElementById("typeHeader").innerText = "";
        document.getElementById("companiesHeader").innerText = "";
        document.getElementById("trackerHeader").innerText = "";
    }

    if (types.includes('*')) {
        document.getElementById("typeDesc").innerText = "*This category of tracker is considered to be unsuitable for use with " + category.toLowerCase() + " websites.";
    }

    var trackerDesc = "";

    if (trackers.includes('*')) {
        trackerDesc = trackerDesc + "*This tracker is considered to be unsuitable for use with " + category.toLowerCase() + " websites. This was taken into consideration when aggregating the CookieScore.\n\n";
    }

    if (trackers.includes('^')) {
        trackerDesc = trackerDesc + "^The company operating this tracker operates more than one tracker on this website. This was taken into consideration when aggregating the CookieScore.\n\n";
    }

    document.getElementById("trackerDesc").innerText = trackerDesc;
});

function capitalizeFirstLetters(str){
    return str.toLowerCase().replace(/^\w|\s\w/g, function (letter) {
        return letter.toUpperCase();
    })
}